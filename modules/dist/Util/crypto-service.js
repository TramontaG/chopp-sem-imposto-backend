"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventCofirmationCryptoService = exports.createCryptoService = void 0;
var crypto = _interopRequireWildcard(require("crypto"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// crypto-service.ts

const b64uEncode = buf => buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const b64uDecode = b64u => {
  const pad = b64u.length % 4 === 0 ? "" : "=".repeat(4 - b64u.length % 4);
  const b64 = b64u.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
};
function getKeyFromEnv() {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("WEBHOOK_SECRET is not set in process.env");
  }
  // Deriva chave de 32 bytes via SHA-256 do secret
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

/**
 * Cria um serviço de criptografia autenticada (AES-256-GCM) para um payload genérico Shape.
 * - encrypt(data) => string base64url para uso em query param
 * - decrypt(token) => Shape (lança erro se falha autenticação/parse)
 */
const createCryptoService = () => {
  const key = getKeyFromEnv();
  const encrypt = data => {
    // Recomendado serializar apenas JSON "limpo"
    const plaintext = Buffer.from(JSON.stringify(data), "utf8");

    // 12 bytes é o tamanho recomendado de IV/nonce para GCM
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag(); // 16 bytes

    // Formato do token: IV (12) || TAG (16) || CIPHERTEXT (N)
    const tokenBuf = Buffer.concat([iv, authTag, ciphertext]);
    return b64uEncode(tokenBuf);
  };
  const decrypt = token => {
    const tokenBuf = b64uDecode(token);

    // Tamanho mínimo = 12 (IV) + 16 (TAG)
    if (tokenBuf.length < 28) {
      throw new Error("Invalid token: too short");
    }
    const iv = tokenBuf.subarray(0, 12);
    const authTag = tokenBuf.subarray(12, 28);
    const ciphertext = tokenBuf.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return JSON.parse(plaintext.toString("utf8"));
  };
  return {
    encrypt,
    decrypt
  };
};
exports.createCryptoService = createCryptoService;
const eventCofirmationCryptoService = exports.eventCofirmationCryptoService = createCryptoService();
//# sourceMappingURL=crypto-service.js.map