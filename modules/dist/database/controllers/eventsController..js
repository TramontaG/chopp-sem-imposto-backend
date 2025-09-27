"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _yasms = require("yasms");
var _ = _interopRequireDefault(require(".."));
var _SafeDatabaseTransaction = require("../../Util/SafeDatabaseTransaction");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const MINUTE_IN_MS = 1000 * 60;
const eventsMemo = (0, _yasms.createMemoService)(undefined, MINUTE_IN_MS);
const eventsDb = (0, _.default)("event");
const queries = {
  upcomingEvents: () => eventsDb.createQuery(q => q.where("date", ">", Date.now())),
  allEvents: () => eventsDb.createQuery(q => q.where("deletedAt", "==", null))
};
const eventsController = () => {
  const createEvent = async ({
    name,
    description,
    location,
    organizer,
    date,
    bannerUrl
  }) => {
    const id = `${name}-${crypto.randomUUID()}`;
    const eventData = {
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
      deletedAt: null
    };
    return (0, _SafeDatabaseTransaction.transactionSuccess)(await eventsDb.upsertEntity(id, eventData));
  };
  const updateEvent = async (id, data) => {
    const eventExists = await assertEventExists(id);
    if (!eventExists) {
      return (0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.UPDATE_NON_EXISTENT_ENTITY);
    }
    return (0, _SafeDatabaseTransaction.transactionSuccess)(await eventsDb.upsertEntity(id, data));
  };
  const getEventById = id => eventsMemo.getData(id, () => eventsDb.readEntity(id)).then(val => val.data);
  const deleteEvent = id => {
    eventsMemo.deleteData(id);
    eventsDb.deleteEntity(id);
  };
  const assertEventExists = id => eventsMemo.getData(`exists/${id}`, () => eventsDb.entityExists(id)).then(val => val.data);
  const getUpcomingEvents = async () => {
    const upcomingEvents = await eventsDb.runQuery(queries.allEvents());
    return upcomingEvents;
  };
  return {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    assertEventExists,
    getUpcomingEvents
  };
};
var _default = exports.default = eventsController();
//# sourceMappingURL=eventsController..js.map