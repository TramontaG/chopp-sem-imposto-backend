"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.db = exports.DbManager = void 0;
var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));
var _firestore = require("firebase-admin/firestore");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const firebase = _firebaseAdmin.default.initializeApp({
  credential: _firebaseAdmin.default.credential.applicationDefault()
});
const db = exports.db = (0, _firestore.getFirestore)(firebase);
const DbManager = collection => {
  const dbCollection = db.collection(collection);
  const upsertEntity = (id, data) => {
    return dbCollection.doc(id).set(data, {
      merge: true
    });
  };
  const readEntity = id => {
    return dbCollection.doc(id).get().then(doc => doc.data());
  };
  const deleteEntity = id => {
    return dbCollection.doc(id).delete();
  };
  const entityExists = id => {
    return dbCollection.doc(id).get().then(doc => doc.exists);
  };
  const createQuery = cb => {
    return cb(dbCollection);
  };
  const runQuery = query => {
    return query.get().then(result => result.docs.map(doc => doc.data()));
  };
  return {
    upsertEntity,
    readEntity,
    deleteEntity,
    entityExists,
    createQuery,
    runQuery
  };
};
exports.DbManager = DbManager;
var _default = exports.default = DbManager;
//# sourceMappingURL=index.js.map