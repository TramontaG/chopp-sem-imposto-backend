import { FieldValue } from "firebase-admin/firestore";
import DbManager from "..";
import type {
  AllEntitiesModel,
  DatabaseFriendlyEntityModel,
  WithID,
} from "../schemas";
import eventsController from "./eventsController.";
import { createMemoService } from "yasms";
import {
  FAIL_REASONS,
  transactionError,
  transactionSuccess,
} from "../../Util/SafeDatabaseTransaction";
import { eventCofirmationCryptoService } from "../../Util/crypto-service";

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
  getAll: () => {
    return userDB.createQuery((q) => q.where("deletedAt", "==", null));
  },
  getAllConfirmed: () => {
    return userDB.createQuery((q) =>
      q.where("confirmed", "==", true).where("deletedAt", "==", null)
    );
  },
};

const userManager = () => {
  const createUser = async ({
    name,
    phoneNumber,
    city,
    DOB,
    source,
    confirmed,
  }: {
    name: string;
    phoneNumber: string;
    city: string;
    DOB: number | null;
    source: AllEntitiesModel["user"]["source"] | null;
    confirmed: boolean | null;
  }) => {
    userMemo.deleteData(`queryphone-${phoneNumber}`); //should be removed

    const phoneNotInUse = await assertPhoneNotInUse(phoneNumber);
    if (!phoneNotInUse) {
      return transactionError(FAIL_REASONS.ALREADY_EXISTS);
    }

    const id = `${name}-${crypto.randomUUID()}`;
    const userData: AllEntitiesModel["user"] = {
      name,
      phoneNumber,
      city,
      DOB,
      confirmed: Boolean(confirmed),
      eventsAttended: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null,
      neighborhood: null,
      profession: null,
      sex: null,
      source: source || "novo",
    };

    await userDB.upsertEntity(id, userData);

    return transactionSuccess({ id });
  };

  const getAllUsers = async () => {
    const data = await userDB.runQuery(queries.getAll());
    return data;
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
    if (!userExists) return transactionError(FAIL_REASONS.NOT_FOUND);

    const eventExists = await eventsController.assertEventExists(eventId);
    if (!eventExists) return transactionError(FAIL_REASONS.NOT_FOUND);

    eventsController.updateEvent(eventId, {
      interested: FieldValue.arrayUnion(userId),
    });

    return transactionSuccess({ success: true });
  };

  const getUsersByIds = async (ids: string[]) => {
    const users = await userDB.runQuery(queries.filterByIds(ids));
    return users;
  };

  const getTotalUsers = async (confirmed: boolean) => {
    const usersAmount = await userDB.countByQuery(
      confirmed ? queries.getAllConfirmed() : queries.getAll()
    );
    return transactionSuccess({ amount: usersAmount });
  };

  const getConfirmationPayload = async (userId: string, eventId: string) => {
    const userExists = await assertUserExists(userId);
    if (!userExists) return transactionError(FAIL_REASONS.NOT_FOUND);

    const eventExists = await eventsController.assertEventExists(eventId);
    if (!eventExists) return transactionError(FAIL_REASONS.NOT_FOUND);

    return transactionSuccess(
      eventCofirmationCryptoService.encrypt({
        action: "confirm",
        eventId,
        userId,
      })
    );
  };

  return {
    createUser,
    getAllUsers,
    updateUser,
    getUserById,
    deleteUser,
    assertUserExists,
    getUsersByIds,
    assertPhoneNotInUse,
    userAttendToEvent,
    userInterestedInEvent,
    getTotalUsers,
    getConfirmationPayload,
  };
};

export default userManager();
