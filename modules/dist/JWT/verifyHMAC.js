"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHMAC = exports.HMACMiddleware = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
var _ = require(".");
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
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
const HMACMiddleware = (req, res, next) => {
  const jwt = req.headers?.authorization || req.params?.jwt || req.cookies?.jwt;
  if (jwt) {
    const verified = (0, _.verifyJwt)(jwt);
    if (verified) {
      return next();
    }
  }
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
    const hmacValid = verify(raw, ts, sig);
    console.log({
      hmacValid,
      raw,
      ts,
      sig
    }); // debug only, remove in production

    if (!hmacValid) {
      return res.status(401).json({
        error: "Invalid signature or timestamp"
      });
    }
    next();
  });
};
exports.HMACMiddleware = HMACMiddleware;
const useHMAC = exports.useHMAC = [(0, _cookieParser.default)(), HMACMiddleware];
//# sourceMappingURL=verifyHMAC.js.map