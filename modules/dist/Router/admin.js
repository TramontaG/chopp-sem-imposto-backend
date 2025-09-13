"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _SafeRequest = require("../Util/SafeRequest");
var V = _interopRequireWildcard(require("../Util/ZodValidation"));
var _adminsController = _interopRequireDefault(require("../database/controllers/adminsController"));
var _JWT = require("../JWT");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const adminRouter = (0, _express.Router)();
adminRouter.post("/create", (0, _express.json)(), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    name,
    password,
    permissions,
    username
  } = V.validate({
    username: V.string,
    password: V.string,
    permissions: V.array(V.string),
    name: V.string
  }, req.body);
  const result = await _adminsController.default.createAdmin({
    name,
    password,
    permissions,
    username
  });
  return result;
}));
adminRouter.post("/login", (0, _express.json)(), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    username,
    password
  } = V.validate({
    username: V.string,
    password: V.string
  }, req.body);
  const result = await _adminsController.default.login(username, password);
  const jwt = (0, _JWT.generateJwt)({
    userId: result.id,
    username: result.name
  });
  res.cookie("jwt", jwt, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    sameSite: "none",
    secure: true
  });
  return {
    jwt
  };
}));
var _default = exports.default = adminRouter;
//# sourceMappingURL=admin.js.map