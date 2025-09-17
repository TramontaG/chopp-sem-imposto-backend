import csv from "csv-parser";
import fs from "fs";
import userController from "../src/database/controllers/userController";

const file1Path = "./scripts/table1.csv";
const file2Path = "./scripts/table2.csv";

type Result = {
  ["Carimbo de data/hora"]?: string;
  Nome: string;
  Celular: string;
  Cidade: string;
};

const results: Result[] = [];

function formatPhoneNumber(num: string): string {
  const digits = num.replace(/\D/g, "");

  if (digits.length === 11) {
    // Celular: (11)94683-4883
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");
  }

  if (digits.length === 10) {
    // Fixo: (11)4683-4883
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1)$2-$3");
  }

  // Caso não bata com os formatos esperados
  return num;
}

function removeDuplicatedPhones(results: Result[]): Result[] {
  const seen = new Set<string>();
  const unique: Result[] = [];

  for (const r of results) {
    const cleanPhone = r.Celular.replace(/\D/g, ""); // garante apenas dígitos
    if (!seen.has(cleanPhone)) {
      seen.add(cleanPhone);
      unique.push(r);
    }
  }

  return unique;
}

const done = Promise.all(
  [file1Path, file2Path].map((path) => {
    return new Promise((resolve) => {
      fs.createReadStream(path)
        .pipe(csv())
        .on("data", (data: Result) => results.push(data))
        .on("end", resolve);
    });
  })
);

done.then(() => {
  const sanitizedResults = removeDuplicatedPhones(
    results.map((result) => {
      const phoneDigits = result.Celular.match(/\d+/g)?.join("")!;
      const sanitizedPhone = formatPhoneNumber(phoneDigits.replace(/^55/, ""));

      return {
        ...result,
        Celular: sanitizedPhone,
      } as Result;
    })
  );

  sanitizedResults.forEach((result) => {
    userController.createUser({
      name: result.Nome,
      city: result.Cidade,
      confirmed: true,
      DOB: null,
      phoneNumber: result.Celular,
      source: "website",
    });
  });
});
