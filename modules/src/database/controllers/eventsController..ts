import { createMemoService } from "yasms";
import DbManager from "..";
import type {
  AllEntitiesModel,
  DatabaseFriendlyEntityModel,
  WithID,
} from "../schemas";
import {
  FAIL_REASONS,
  transactionError,
  transactionSuccess,
} from "../../Util/SafeDatabaseTransaction";

const MINUTE_IN_MS = 1000 * 60;
const eventsMemo = createMemoService(undefined, MINUTE_IN_MS);
const eventsDb = DbManager("event");

const eventsController = () => {
  const createEvent = async ({
    name,
    description,
    location,
    organizer,
    date,
    bannerUrl,
  }: {
    name: string;
    description: string;
    location: string;
    organizer: string | null;
    date: number;
    bannerUrl: string | null;
  }) => {
    const id = `${name}-${crypto.randomUUID()}`;
    const eventData: AllEntitiesModel["event"] = {
      bannerUrl,
      attendees: [],
      comments: [],
      date,
      description,
      hostContatInfo: null,
      interested: [],
      location,
      medias: [],
      name,
      organizer,
      type: "other",

      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null,
    };

    return transactionSuccess(await eventsDb.upsertEntity(id, eventData));
  };

  const updateEvent = async (
    id: string,
    data: Partial<DatabaseFriendlyEntityModel<"event">>
  ) => {
    const eventExists = await assertEventExists(id);
    if (!eventExists) {
      return transactionError(FAIL_REASONS.UPDATE_NON_EXISTENT_ENTITY);
    }

    return transactionSuccess(await eventsDb.upsertEntity(id, data));
  };

  const getEventById = (id: string): Promise<WithID<"event">> =>
    eventsMemo
      .getData(id, () => eventsDb.readEntity(id))
      .then((val) => val.data);

  const deleteEvent = (id: string) => {
    eventsMemo.deleteData(id);
    eventsDb.deleteEntity(id);
  };

  const assertEventExists = (id: string): Promise<boolean> =>
    eventsMemo
      .getData(`exists/${id}`, () => eventsDb.entityExists(id))
      .then((val) => val.data);

  return {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    assertEventExists,
  };
};

export default eventsController();
