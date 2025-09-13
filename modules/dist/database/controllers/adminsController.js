"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ = _interopRequireDefault(require(".."));
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const adminDb = (0, _.default)("admin");
const queries = {
  getAdminByUsername: username => adminDb.createQuery(q => q.where("username", "==", username))
};
const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    _crypto.default.scrypt(password, salt, 128, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
};
const adminController = () => {
  const createAdmin = async ({
    username,
    password,
    name,
    permissions
  }) => {
    const adminExists = (await adminDb.runQuery(queries.getAdminByUsername(username)))[0];
    if (!!adminExists) {
      throw new Error("Admin already exists");
    }
    const id = `admin_${name}_${_crypto.default.randomUUID()}`;
    const salt = _crypto.default.randomBytes(32).toString("hex");
    const admin = {
      username,
      name,
      salt,
      permissions,
      passwordHash: await hashPassword(password, salt),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null
    };
    return await adminDb.upsertEntity(id, admin);
  };
  const getAdmin = async id => {
    return await adminDb.readEntity(id);
  };
  const updateAdmin = async (id, updateData) => {
    return await adminDb.upsertEntity(id, updateData);
  };
  const deleteAdmin = async id => {
    return await adminDb.deleteEntity(id);
  };
  const login = async (username, password) => {
    const admin = (await adminDb.runQuery(queries.getAdminByUsername(username)))[0];
    if (!admin) throw new Error("Admin not found");
    const hashedPassword = await hashPassword(password, admin.salt);
    if (hashedPassword !== admin.passwordHash) throw new Error("Invalid password");
    return admin;
  };
  return {
    createAdmin,
    getAdmin,
    updateAdmin,
    deleteAdmin,
    login
  };
};
var _default = exports.default = adminController();
//# sourceMappingURL=adminsController.js.map