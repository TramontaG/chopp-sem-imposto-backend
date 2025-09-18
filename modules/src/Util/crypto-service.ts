// crypto-service.ts
import * as crypto from "crypto";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
interface JsonArray extends Array<JsonValue> {}

const b64uEncode = (buf: Buffer): string =>
  buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const b64uDecode = (b64u: string): Buffer => {
  const pad = b64u.length % 4 === 0 ? "" : "=".repeat(4 - (b64u.length % 4));
  const b64 = b64u.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
};

function getKeyFromEnv(): Buffer {
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
export const createCryptoService = <Shape extends Record<string, any>>() => {
  const key = getKeyFromEnv();

  const encrypt = (data: Shape): string => {
    // Recomendado serializar apenas JSON "limpo"
    const plaintext = Buffer.from(JSON.stringify(data), "utf8");

    // 12 bytes é o tamanho recomendado de IV/nonce para GCM
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const ciphertext = Buffer.concat([
      cipher.update(plaintext),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag(); // 16 bytes

    // Formato do token: IV (12) || TAG (16) || CIPHERTEXT (N)
    const tokenBuf = Buffer.concat([iv, authTag, ciphertext]);
    return b64uEncode(tokenBuf);
  };

  const decrypt = (token: string): Shape => {
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

    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return JSON.parse(plaintext.toString("utf8")) as Shape;
  };

  return { encrypt, decrypt };
};

export const eventCofirmationCryptoService = createCryptoService<{
  userId: string;
  eventId: string;
  action: "confirm";
}>();
