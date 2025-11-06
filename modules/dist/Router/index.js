"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _admin = _interopRequireDefault(require("./admin"));
var _Signup = _interopRequireDefault(require("./Signup"));
var _Users = _interopRequireDefault(require("./Users"));
var _public = _interopRequireDefault(require("./public"));
var _Events = _interopRequireDefault(require("./Events"));
var _misc = _interopRequireDefault(require("./misc"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const AppRouter = (0, _express.Router)();
AppRouter.use("/admin", _admin.default);
AppRouter.use("/signup", _Signup.default);
AppRouter.use("/users", _Users.default);
AppRouter.use("/public", _public.default);
AppRouter.use("/events", _Events.default);
AppRouter.use("/misc", _misc.default);
var _default = exports.default = AppRouter;
//# sourceMappingURL=index.js.map