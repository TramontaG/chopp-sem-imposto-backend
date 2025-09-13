import DbManager from "..";
import type { AllEntitiesModel, DatabaseFriendlyEntityModel } from "../schemas";
import crypto from "crypto";

const adminDb = DbManager("admin");

const queries = {
  getAdminByUsername: (username: string) =>
    adminDb.createQuery((q) => q.where("username", "==", username)),
};

const hashPassword = (password: string, salt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 128, (err, derivedKey) => {
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
    permissions,
  }: {
    username: string;
    name: string;
    permissions: string[];
    password: string;
  }) => {
    const adminExists = (
      await adminDb.runQuery(queries.getAdminByUsername(username))
    )[0];

    if (!!adminExists) {
      throw new Error("Admin already exists");
    }

    const id = `admin_${name}_${crypto.randomUUID()}`;
    const salt = crypto.randomBytes(32).toString("hex");

    const admin: AllEntitiesModel["admin"] = {
      username,
      name,
      salt,
      permissions,
      passwordHash: await hashPassword(password, salt),

      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null,
    };

    return await adminDb.upsertEntity(id, admin);
  };

  const getAdmin = async (id: string) => {
    return await adminDb.readEntity(id);
  };

  const updateAdmin = async (
    id: string,
    updateData: Partial<DatabaseFriendlyEntityModel<"admin">>
  ) => {
    return await adminDb.upsertEntity(id, updateData);
  };

  const deleteAdmin = async (id: string) => {
    return await adminDb.deleteEntity(id);
  };

  const login = async (username: string, password: string) => {
    const admin = (
      await adminDb.runQuery(queries.getAdminByUsername(username))
    )[0];
    if (!admin) throw new Error("Admin not found");

    const hashedPassword = await hashPassword(password, admin.salt);
    if (hashedPassword !== admin.passwordHash)
      throw new Error("Invalid password");

    return admin;
  };

  return {
    createAdmin,
    getAdmin,
    updateAdmin,
    deleteAdmin,
    login,
  };
};

export default adminController();
