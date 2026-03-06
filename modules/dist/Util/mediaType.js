"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEventMediaFile = exports.getEventMediaType = void 0;
var _mimeTypes = _interopRequireDefault(require("mime-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const IMAGE_FILE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "avif", "bmp", "svg", "heic", "heif"]);
const VIDEO_FILE_EXTENSIONS = new Set(["mp4", "m4v", "mov", "webm", "avi", "mkv", "mpeg", "mpg", "ogv", "3gp"]);
const getFileExtension = filePath => {
  const sanitizedPath = filePath.split("?")[0].split("#")[0];
  const extension = sanitizedPath.split(".").pop();
  return extension ? extension.toLowerCase() : "";
};
const getEventMediaType = filePath => {
  const fileMimeType = _mimeTypes.default.lookup(filePath);
  if (typeof fileMimeType === "string") {
    if (fileMimeType.startsWith("image/")) {
      return "image";
    }
    if (fileMimeType.startsWith("video/")) {
      return "video";
    }
  }
  const extension = getFileExtension(filePath);
  if (IMAGE_FILE_EXTENSIONS.has(extension)) {
    return "image";
  }
  if (VIDEO_FILE_EXTENSIONS.has(extension)) {
    return "video";
  }
  return "unknown";
};
exports.getEventMediaType = getEventMediaType;
const isEventMediaFile = filePath => getEventMediaType(filePath) !== "unknown";
exports.isEventMediaFile = isEventMediaFile;
//# sourceMappingURL=mediaType.js.map