"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _verifyHMAC = require("../JWT/verifyHMAC");
var _SafeRequest = require("../Util/SafeRequest");
var _userController = _interopRequireDefault(require("../database/controllers/userController"));
var _SafeDatabaseTransaction = require("../Util/SafeDatabaseTransaction");
var V = _interopRequireWildcard(require("../Util/ZodValidation"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const UserRouter = (0, _express.Router)();
UserRouter.get("/total", _verifyHMAC.useHMAC, (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    confirmed
  } = V.validate({
    confirmed: V.booleanAsString.optional()
  }, req.params);
  const totalUsersTransaction = await _userController.default.getTotalUsers(Boolean(confirmed));

  // avoid cacheing the result
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  return (0, _SafeDatabaseTransaction.safeReturnTransaction)(totalUsersTransaction);
}));
var _default = exports.default = UserRouter;
//# sourceMappingURL=Users.js.map