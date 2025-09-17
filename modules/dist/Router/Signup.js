"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireWildcard(require("express"));
var _SafeRequest = require("../Util/SafeRequest");
var V = _interopRequireWildcard(require("../Util/ZodValidation"));
var _userController = _interopRequireDefault(require("../database/controllers/userController"));
var _SafeDatabaseTransaction = require("../Util/SafeDatabaseTransaction");
var _verifyHMAC = require("../JWT/verifyHMAC");
var _sanitizeCity = require("../Util/sanitizeCity");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const signupRouter = (0, _express.default)();
signupRouter.post("/me", _verifyHMAC.useHMAC, (0, _express.json)(), (0, _SafeRequest.safeRequest)(async req => {
  console.log({
    body: req.body
  });
  const {
    name,
    phoneNumber,
    city,
    DOB,
    source,
    confirmed
  } = V.validate({
    name: V.string,
    phoneNumber: V.phone,
    city: V.string,
    DOB: V.number.nullable(),
    confirmed: V.boolean.nullable(),
    source: V.or(V.enums(["novo", "website", "instagram", "referral"]), V.string.startsWith("whatsapp-"))
  }, req.body);
  const sanitizedCity = await (0, _sanitizeCity.findBestCityMatch)(city);
  const createUserTransaction = await _userController.default.createUser({
    name,
    phoneNumber,
    city: sanitizedCity.best || city,
    DOB,
    source: source,
    confirmed
  });
  if (!(0, _SafeDatabaseTransaction.isTransactionSuccessful)(createUserTransaction)) {
    if (createUserTransaction.reason === _SafeDatabaseTransaction.FAIL_REASONS.ALREADY_EXISTS) {
      return (0, _SafeDatabaseTransaction.transactionSuccess)({
        message: "resignup"
      });
    }
  }
  return (0, _SafeDatabaseTransaction.safeReturnTransaction)(createUserTransaction);
}));
var _default = exports.default = signupRouter;
//# sourceMappingURL=Signup.js.map