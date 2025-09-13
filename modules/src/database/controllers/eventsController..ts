import { createMemoService } from "yasms";
import DbManager from "..";
import type { AllEntitiesModel, DatabaseFriendlyEntityModel } from "../schemas";

const MINUTE_IN_MS = 1000 * 60;
const eventsMemo = createMemoService(undefined, MINUTE_IN_MS);
const eventsDb = DbManager("event");

const eventsController = () => {
  const createEvent = ({
    name,
    description,
    location,
    organizer,
    date,
  }: {
    name: string;
    description: string;
    location: string;
    organizer: string | null;
    date: number;
  }) => {
    const id = `${name}/${crypto.randomUUID()}`;
    const eventData: AllEntitiesModel["event"] = {
      bannerUrl: null,
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

    return eventsDb.upsertEntity(id, eventData);
  };

  const updateEvent = (
    id: string,
    data: Partial<DatabaseFriendlyEntityModel<"event">>
  ) => {
    return eventsDb.upsertEntity(id, data);
  };

  const getEventById = (id: string): Promise<AllEntitiesModel["event"]> =>
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
