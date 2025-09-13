"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _yasms = require("yasms");
var _ = _interopRequireDefault(require(".."));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const MINUTE_IN_MS = 1000 * 60;
const eventsMemo = (0, _yasms.createMemoService)(undefined, MINUTE_IN_MS);
const eventsDb = (0, _.default)("event");
const eventsController = () => {
  const createEvent = ({
    name,
    description,
    location,
    organizer,
    date
  }) => {
    const id = `${name}/${crypto.randomUUID()}`;
    const eventData = {
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
      deletedAt: null
    };
    return eventsDb.upsertEntity(id, eventData);
  };
  const updateEvent = (id, data) => {
    return eventsDb.upsertEntity(id, data);
  };
  const getEventById = id => eventsMemo.getData(id, () => eventsDb.readEntity(id)).then(val => val.data);
  const deleteEvent = id => {
    eventsMemo.deleteData(id);
    eventsDb.deleteEntity(id);
  };
  const assertEventExists = id => eventsMemo.getData(`exists/${id}`, () => eventsDb.entityExists(id)).then(val => val.data);
  return {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    assertEventExists
  };
};
var _default = exports.default = eventsController();
//# sourceMappingURL=eventsController..js.map