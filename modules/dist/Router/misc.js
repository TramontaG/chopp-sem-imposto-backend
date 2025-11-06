"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireWildcard(require("express"));
var _verifyHMAC = require("../JWT/verifyHMAC");
var _SafeRequest = require("../Util/SafeRequest");
var V = _interopRequireWildcard(require("../Util/ZodValidation"));
var _suggestionsController = _interopRequireDefault(require("../database/controllers/suggestionsController"));
var _SafeDatabaseTransaction = require("../Util/SafeDatabaseTransaction");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const MiscRouter = (0, _express.default)();
MiscRouter.post("/suggestion", _verifyHMAC.useHMAC, (0, _express.json)(), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    name,
    suggestion
  } = V.validate({
    name: V.string,
    suggestion: V.string
  }, req.body);
  const createSuggestionTransaction = await _suggestionsController.default.createSuggestion(name, suggestion);
  return (0, _SafeDatabaseTransaction.safeReturnTransaction)(createSuggestionTransaction);
}));
var _default = exports.default = MiscRouter;
//# sourceMappingURL=misc.js.map