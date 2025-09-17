"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const firebase = _firebaseAdmin.default.initializeApp({
  credential: _firebaseAdmin.default.credential.applicationDefault()
});
var _default = exports.default = firebase;
//# sourceMappingURL=index.js.map