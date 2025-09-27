"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomZeroWidth = randomZeroWidth;
// Zero-width alphabet (comuns e seguros para uso em strings)
const ZERO_WIDTHS = ["\u200B",
// Zero Width Space
"\u200C",
// Zero Width Non-Joiner
"\u200D",
// Zero Width Joiner
"\u2060",
// Word Joiner
"\uFEFF" // Zero Width No-Break Space
];

/**
 * Gera uma string composta apenas por caracteres zero-width,
 * com comprimento aleatório entre min e max (inclusive).
 */
function randomZeroWidth({
  min = 1,
  max = 8,
  alphabet = ZERO_WIDTHS
} = {}) {
  if (min < 0 || max < 0 || max < min) {
    throw new Error("Parâmetros inválidos: garanta 0 <= min <= max.");
  }

  // Comprimento aleatório [min, max]
  const len = min === max ? min : randomIntInclusive(min, max);

  // Constrói a string com caracteres zero-width aleatórios
  let out = "";
  for (let i = 0; i < len; i++) {
    const idx = randomIntInclusive(0, alphabet.length - 1);
    out += alphabet[idx];
  }
  return out;
}

/** Retorna inteiro aleatório no intervalo [min, max] usando crypto */
function randomIntInclusive(min, max) {
  const range = max - min + 1;
  // Gera um uint32 e reduz uniformemente ao intervalo
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return min + buf[0] % range;
}
//# sourceMappingURL=zero-width.js.map