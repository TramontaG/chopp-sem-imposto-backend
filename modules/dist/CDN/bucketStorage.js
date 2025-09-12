"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadToBucket = exports.getFileUrl = exports.downloadFile = exports.bucket = void 0;
var _storage = require("firebase-admin/storage");
var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const firebase = _firebaseAdmin.default.initializeApp({
  credential: _firebaseAdmin.default.credential.applicationDefault()
});
const bucket = exports.bucket = (0, _storage.getStorage)(firebase).bucket(process.env.FIREBASE_BUCKET);
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
//# sourceMappingURL=bucketStorage.js.map