"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _bucketStorage = require("../CDN/bucketStorage");
var _mimeTypes = _interopRequireDefault(require("mime-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const publicRouter = (0, _express.Router)();
publicRouter.get("/:src/:event/:file", async (req, res) => {
  const fileId = `${req.params.src}/${req.params.event}/${req.params.file}`;
  const file = await (0, _bucketStorage.downloadFile)(fileId);
  res.setHeader("Content-Type", _mimeTypes.default.lookup(req.params.file) || "application/octet-steam").send(file);
  return undefined;
});
var _default = exports.default = publicRouter;
//# sourceMappingURL=public.js.map