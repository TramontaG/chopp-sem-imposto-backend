"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHMAC = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
if (!WEBHOOK_SECRET) {
  throw new Error("You need a WEBHOOK_SECRET env var");
}
const MAX_SKEW_SECONDS = 300; // 5 min de tolerância

const verify = (rawBody, ts, header) => {
  const [alg, sigHex] = (header || "").split("=", 2);
  if (alg !== "sha256" || !sigHex) return false;

  // cheque skew do timestamp (ex.: 300s)
  const now = Math.floor(Date.now() / 1000);
  const tsi = parseInt(ts, 10);
  if (!Number.isFinite(tsi) || Math.abs(now - tsi) > MAX_SKEW_SECONDS) return false;
  const expected = _crypto.default.createHmac("sha256", WEBHOOK_SECRET).update(`${ts}.${rawBody}`).digest("hex");

  // comparação em tempo constante
  return _crypto.default.timingSafeEqual(Buffer.from(sigHex, "hex"), Buffer.from(expected, "hex"));
};
const useHMAC = (req, res, next) => {
  const chunks = [];
  req.on("data", c => chunks.push(c));
  req.on("end", () => {
    req.rawBody = Buffer.concat(chunks);
    try {
      req.body = JSON.parse(req.rawBody.toString("utf8") || "{}");
    } catch {
      req.body = null;
    }
    const sig = req.header("X-Signature") || "";
    const ts = req.header("X-Timestamp") || "";
    const raw = req.rawBody?.toString("utf8") || "no-body";
    if (!verify(raw, ts, sig)) {
      return res.status(401).json({
        error: "Invalid signature or timestamp"
      });
    }
    next();
  });
};
exports.useHMAC = useHMAC;
//# sourceMappingURL=verifyHMAC.js.map