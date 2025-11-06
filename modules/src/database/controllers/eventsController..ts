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
import { Filter } from "firebase-admin/firestore";
import { query } from "express";

const MINUTE_IN_MS = 1000 * 60;
const eventsMemo = createMemoService(undefined, MINUTE_IN_MS);
const eventsDb = DbManager("event");

const queries = {
  upcomingEvents: () =>
    eventsDb.createQuery((q) => q.where("date", ">", Date.now())),
  pastEvents: () =>
    eventsDb.createQuery((q) => q.where("date", "<", Date.now())),
  allEvents: () =>
    eventsDb.createQuery((q) => q.where("deletedAt", "==", null)),
  todayEvents: () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return eventsDb.createQuery((q) =>
      q.where(
        Filter.and(
          Filter.where("date", ">=", startOfDay.getTime()),
          Filter.where("date", "<=", endOfDay.getTime())
        )
      )
    );
  },
};

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
      invited: [],
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

  const getUpcomingEvents = async () => {
    const upcomingEvents = await eventsDb.runQuery(queries.upcomingEvents());
    return upcomingEvents;
  };

  const getPastEvents = async () => {
    const pastEvents = await eventsDb.runQuery(queries.pastEvents());
    return pastEvents;
  };

  const getEventsForToday = async () => {
    const todayEvents = await eventsDb.runQuery(queries.todayEvents());
    return todayEvents;
  };

  return {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    assertEventExists,
    getUpcomingEvents,
    getPastEvents,
    getEventsForToday,
  };
};

export default eventsController();
