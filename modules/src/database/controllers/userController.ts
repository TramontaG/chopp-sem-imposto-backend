import { FieldValue } from "firebase-admin/firestore";
import DbManager from "..";
import type {
  AllEntitiesModel,
  DatabaseFriendlyEntityModel,
  WithID,
} from "../schemas";
import eventsController from "./eventsController.";
import { createMemoService } from "yasms";

const MINUTE_IN_MS = 1000 * 60;
const userMemo = createMemoService(undefined, MINUTE_IN_MS);
const userDB = DbManager("user");

const queries = {
  filterByPhoneNumber: (phoneNumber: string) => {
    return userDB.createQuery((q) =>
      q.where("phoneNumber", "==", phoneNumber).where("deletedAt", "==", null)
    );
  },

  filterByIds: (ids: string[]) => {
    return userDB.createQuery((q) => q.where("id", "in", ids));
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
    DOB: number | null;
    source: AllEntitiesModel["user"]["source"] | null;
  }) => {
    const id = `${name}-${crypto.randomUUID()}`;

    const userData: AllEntitiesModel["user"] = {
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

    return userDB.upsertEntity(id, userData);
  };

  const updateUser = (
    id: string,
    data: Partial<DatabaseFriendlyEntityModel<"user">>
  ) => {
    userMemo.deleteData(id);

    return userDB.upsertEntity(id, {
      ...data,
      updatedAt: Date.now(),
    });
  };

  const getUserById = (id: string): Promise<WithID<"user">> => {
    return userMemo
      .getData(id, () => userDB.readEntity(id))
      .then((val) => val.data);
  };

  const deleteUser = (id: string) => {
    userMemo.deleteData(id);
    return userDB.upsertEntity(id, { deletedAt: Date.now() });
  };

  const assertUserExists = async (id: string): Promise<boolean> => {
    const exists = await userMemo
      .getData(`exists/${id}`, () => userDB.entityExists(id))
      .then((val) => val.data);

    return exists;
  };

  const assertPhoneNotInUse = async (phoneNumber: string): Promise<boolean> => {
    const results: WithID<"user">[] = await userMemo
      .getData(`queryphone-${phoneNumber}`, () =>
        userDB.runQuery(queries.filterByPhoneNumber(phoneNumber))
      )
      .then((val) => val.data);

    return results.length === 0;
  };

  const userAttendToEvent = async (userId: string, eventId: string) => {
    const userExists = await assertUserExists(userId);
    if (!userExists) throw new Error("User does not exist");

    const eventExists = await eventsController.assertEventExists(eventId);
    if (!eventExists) throw new Error("Event does not exist");

    updateUser(userId, {
      eventsAttended: FieldValue.arrayUnion(eventId),
    });

    eventsController.updateEvent(eventId, {
      attendees: FieldValue.arrayUnion(userId),
    });

    return eventId;
  };

  const userInterestedInEvent = async (userId: string, eventId: string) => {
    const userExists = await assertUserExists(userId);
    if (!userExists) throw new Error("User does not exist");

    const eventExists = await eventsController.assertEventExists(eventId);
    if (!eventExists) throw new Error("Event does not exist");

    eventsController.updateEvent(eventId, {
      interested: FieldValue.arrayUnion(userId),
    });

    return eventId;
  };

  const getUsersByIds = async (ids: string[]) => {
    const users = await userDB.runQuery(queries.filterByIds(ids));
    return users;
  };

  return {
    createUser,
    updateUser,
    getUserById,
    deleteUser,
    assertUserExists,
    getUsersByIds,
    assertPhoneNotInUse,
    userAttendToEvent,
    userInterestedInEvent,
  };
};

export default userManager();
