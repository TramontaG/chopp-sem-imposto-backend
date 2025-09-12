import { FieldValue } from "firebase-admin/firestore";
import DbManager from "..";
import type { AllEntitiesModel, DatabaseFriendlyEntityModel } from "../schemas";

const userDB = DbManager("user");

const queries = {
  filterByPhoneNumber: (phoneNumber: string) => {
    return userDB.createQuery((q) =>
      q.where("phoneNumber", "==", phoneNumber).where("deletedAt", "==", null)
    );
  },
};

const userManager = () => {
  const createUser = ({
    name,
    phoneNumber,
    city,
    DOB,
    source,
  }: {
    name: string;
    phoneNumber: string;
    city: string;
    DOB: string | null;
    source: AllEntitiesModel["user"]["source"] | null;
  }) => {
    const userData: AllEntitiesModel["user"] = {
      id: `${name}-${crypto.randomUUID()}`,
      name,
      phoneNumber,
      city,
      DOB,
      confirmed: false,
      eventsAttended: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null,
      neighborhood: null,
      profession: null,
      sex: null,
      source: source || "novo",
    };

    return userDB.upsertEntity(userData.id, userData);
  };

  const updateUser = (
    id: string,
    data: Partial<DatabaseFriendlyEntityModel<"user">>
  ) => {
    return userDB.upsertEntity(id, {
      ...data,
      updatedAt: Date.now(),
    });
  };

  const getUserById = (id: string) => {
    return userDB.readEntity(id);
  };

  const deleteUser = (id: string) => {
    return userDB.upsertEntity(id, { deletedAt: Date.now() });
  };

  const assertUserExists = async (id: string) => {
    const exists = await userDB.entityExists(id);
    return exists;
  };

  const assertPhoneNotInUse = async (phoneNumber: string) => {
    const results = await userDB.runQuery(
      queries.filterByPhoneNumber(phoneNumber)
    );

    return results.length === 0;
  };

  const userAttendToEvent = async (userId: string, eventId: string) => {
    const userExists = await assertUserExists(userId);
    if (!userExists) throw new Error("User does not exist");

    updateUser(userId, {
      eventsAttended: FieldValue.arrayUnion(eventId),
    });
  };

  return {
    createUser,
    updateUser,
    getUserById,
    deleteUser,
    assertUserExists,
    assertPhoneNotInUse,
    userAttendToEvent,
  };
};

export default userManager();
