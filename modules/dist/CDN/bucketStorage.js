"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadToBucket = exports.listFilesInBucketFolder = exports.getFileUrl = exports.downloadFile = exports.bucket = void 0;
var _storage = require("firebase-admin/storage");
var _Firebase = _interopRequireDefault(require("../Firebase"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const bucket = exports.bucket = (0, _storage.getStorage)(_Firebase.default).bucket(process.env.FIREBASE_BUCKET);
const normalizeBucketFolder = folderPath => folderPath.replace(/^\/+|\/+$/g, "");
const uploadToBucket = async (fileName, fileAsBuffer) => {
  await bucket.file(fileName).save(fileAsBuffer);
  return getFileUrl(fileName);
};
exports.uploadToBucket = uploadToBucket;
const getFileUrl = async fileName => {
  const fileRef = await bucket.file(fileName);
  return (0, _storage.getDownloadURL)(fileRef);
};
exports.getFileUrl = getFileUrl;
const downloadFile = async fileName => {
  const fileRef = await bucket.file(fileName);
  return new Promise((resolve, reject) => {
    fileRef.download({}, (err, content) => {
      if (err) {
        reject(err);
      }
      resolve(content);
    });
  });
};
exports.downloadFile = downloadFile;
const listFilesInBucketFolder = async folderPath => {
  const normalizedFolder = normalizeBucketFolder(folderPath);
  const prefix = `${normalizedFolder}/`;
  const [files] = await bucket.getFiles({
    prefix
  });
  return files.map(file => file.name).filter(fileName => {
    if (fileName === prefix) {
      return false;
    }
    const relativePath = fileName.slice(prefix.length);
    return relativePath.length > 0 && !relativePath.includes("/");
  }).sort((left, right) => left.localeCompare(right));
};
exports.listFilesInBucketFolder = listFilesInBucketFolder;
//# sourceMappingURL=bucketStorage.js.map