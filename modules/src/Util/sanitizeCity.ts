import userController from "../database/controllers/userController";
import { createMemoService } from "yasms";

const cityMemo = createMemoService<Array<{ nome: string }>>();

// cities-normalizer.ts
type CanonicalCity = {
  name: string; // Nome com acento correto (IBGE)
  normalized: string; // Nome sem acento/espacos extras/sem UF
};

const DIACRITICS_RE = /\p{Diacritic}/gu;

function stripDiacritics(s: string) {
  return s.normalize("NFD").replace(DIACRITICS_RE, "");
}

function stripUfSuffix(s: string) {
  // remove padrões comuns: " - SP", "/SP", ", SP", " SP" no fim
  return s.replace(/[\s,/-]+[A-Za-z]{2}\s*$/i, "");
}

function normalizeCityForCompare(s: string) {
  return stripDiacritics(
    stripUfSuffix(s).trim().toLowerCase().replace(/\s+/g, " ")
  );
}

function toTitleCaseBR(s: string) {
  // Title Case simples (mantém preposições minúsculas comuns)
  const lower = s.toLowerCase();
  const keepLower = new Set(["da", "de", "do", "das", "dos", "e"]);
  return lower
    .split(/\s+/)
    .map((w, i) => {
      if (i > 0 && keepLower.has(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

// Levenshtein otimizado
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const v0 = new Array(b.length + 1);
  const v1 = new Array(b.length + 1);

  for (let i = 0; i <= b.length; i++) v0[i] = i;

  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(
        v1[j] + 1, // inserção
        v0[j + 1] + 1, // deleção
        v0[j] + cost // substituição
      );
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

// Similaridade baseada em Levenshtein (1 = igual, 0 = totalmente diferente)
function similarity(a: string, b: string): number {
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length) || 1;
  return 1 - dist / maxLen;
}

export type MatchResult = {
  best: string | null;
  score: number;
  candidate: string | null;
};

export async function getBrazilianCities(): Promise<CanonicalCity[]> {
  const res = await cityMemo.getData("city-list", async () => {
    const res = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
    );
    if (!res.ok)
      throw new Error(`Falha ao buscar municípios do IBGE: ${res.status}`);
    const data = (await res.json()) as Array<{ nome: string }>;
    return data;
  });

  const unique = new Set<string>();
  const cities: CanonicalCity[] = [];
  for (const { nome } of res.data) {
    if (!unique.has(nome)) {
      unique.add(nome);
      cities.push({ name: nome, normalized: normalizeCityForCompare(nome) });
    }
  }
  return cities;
}

export async function findBestCityMatch(
  input: string,
  minScore = 0.78
): Promise<MatchResult> {
  const cityList = await getBrazilianCities();
  const cleanedInputTitle = toTitleCaseBR(stripUfSuffix(input).trim());
  const q = normalizeCityForCompare(cleanedInputTitle);

  if (!q) return { best: null, score: 0, candidate: null };

  let best: CanonicalCity | null = null;
  let bestScore = -1;

  for (const c of cityList) {
    const s = similarity(q, c.normalized);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }

  if (best && bestScore >= minScore) {
    return { best: best.name, score: bestScore, candidate: cleanedInputTitle };
  }
  // fallback: se já está “ok” (acentos fora / capitalização), apenas padroniza o título
  if (bestScore < minScore) {
    const noDia = stripDiacritics(cleanedInputTitle);
    for (const c of cityList) {
      if (stripDiacritics(c.name).toLowerCase() === noDia.toLowerCase()) {
        return { best: c.name, score: 1, candidate: cleanedInputTitle };
      }
    }
  }

  return { best: null, score: bestScore, candidate: cleanedInputTitle };
}

function toSimple(s: string) {
  return s.trim().toLowerCase();
}

export async function dryRunNormalizeCities() {
  // 1) Carrega todos os usuários
  console.log("Carregando usuários...");
  const allUsers = await userController.getAllUsers();

  // 2) Lista oficial de cidades
  console.log("Carregando lista de cidades...");
  const cities = await getBrazilianCities();

  // 3) Varre e sugere correções
  const suggestions: Array<{
    id: string;
    before: string;
    after: string;
    score: number;
  }> = [];

  for (const u of allUsers) {
    const before = (u.city ?? "").toString();
    if (!before.trim()) continue;

    const match = await findBestCityMatch(before);
    if (match.best && toSimple(before) !== toSimple(match.best)) {
      console.log(
        `${before} -> ${match.best} (score ${match.score.toFixed(2)})`
      );
      suggestions.push({
        id: u.id,
        before,
        after: match.best,
        score: match.score,
      });
    }
  }
  return suggestions;
}
