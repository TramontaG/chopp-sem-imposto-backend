"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _admin = _interopRequireDefault(require("./admin"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const AppRouter = (0, _express.Router)();
AppRouter.use("/admin", _admin.default);
var _default = exports.default = AppRouter;
//# sourceMappingURL=index.js.map