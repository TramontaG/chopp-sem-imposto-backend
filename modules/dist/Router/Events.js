"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _SafeRequest = require("../Util/SafeRequest");
var _JWT = require("../JWT");
var V = _interopRequireWildcard(require("../Util/ZodValidation"));
var _eventsController = _interopRequireDefault(require("../database/controllers/eventsController."));
var _SafeDatabaseTransaction = require("../Util/SafeDatabaseTransaction");
var _cryptoService = require("../Util/crypto-service");
var _userController = _interopRequireDefault(require("../database/controllers/userController"));
var _verifyHMAC = require("../JWT/verifyHMAC");
var _confirmationMessage = require("../Kozz-Module/Methods/confirmationMessage");
var _mimeTypes = _interopRequireDefault(require("mime-types"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const EventsRouter = (0, _express.Router)();
EventsRouter.post("/create_event", (0, _JWT.useJWT)(["events_create"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    name,
    description,
    location,
    organizer,
    date,
    bannerUrl
  } = V.validate({
    name: V.string,
    description: V.string,
    location: V.string,
    organizer: V.string.nullable(),
    date: V.string,
    bannerUrl: V.string.nullable()
  }, req.body);
  const createEventTransaction = await _eventsController.default.createEvent({
    name,
    description,
    date: new Date(date).getTime(),
    location,
    organizer,
    bannerUrl
  });
  return (0, _SafeDatabaseTransaction.safeReturnTransaction)(createEventTransaction);
}));
EventsRouter.post("/update_event", (0, _JWT.useJWT)(["events_create"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    id,
    data
  } = V.validate({
    id: V.string,
    data: V.any
  }, req.body);
  const updateTransaction = await _eventsController.default.updateEvent(id, data);
  return (0, _SafeDatabaseTransaction.safeReturnTransaction)(updateTransaction);
}));
EventsRouter.post("/confirm", _verifyHMAC.useHMAC, (0, _express.json)(), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    payload
  } = V.validate({
    payload: V.string
  }, req.body);
  const {
    action,
    eventId,
    userId
  } = _cryptoService.eventCofirmationCryptoService.decrypt(payload);
  console.log({
    action,
    eventId,
    userId
  });
  if (action === "confirm") {
    const interestedTransaction = await _userController.default.userInterestedInEvent(userId, eventId);
    return (0, _SafeDatabaseTransaction.safeReturnTransaction)(interestedTransaction);
  } else {
    return (0, _SafeDatabaseTransaction.safeReturnTransaction)((0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.OPERATION_FORBIDDEN));
  }
}));
EventsRouter.get("/confirmation_payload", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    userId,
    eventId
  } = V.validate({
    userId: V.string,
    eventId: V.string
  }, req.query);
  const payload = _cryptoService.eventCofirmationCryptoService.encrypt({
    action: "confirm",
    eventId,
    userId
  });
  res.send({
    payload
  });
}));
EventsRouter.post("/check_payload", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    payload
  } = V.validate({
    payload: V.string
  }, req.body);
  try {
    const decrypted = _cryptoService.eventCofirmationCryptoService.decrypt(payload);
    res.send({
      valid: true,
      data: decrypted
    });
  } catch (error) {
    res.send({
      valid: false,
      error: "Invalid payload"
    });
  }
}));
EventsRouter.post("/send_confirmation_message", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    userId,
    eventId
  } = V.validate({
    userId: V.string,
    eventId: V.string
  }, req.body);
  const result = await (0, _confirmationMessage.sendConfirmationMessage)(userId, eventId);
  res.send({
    success: "maybe?"
  });
}));
EventsRouter.get("/upcoming", _verifyHMAC.useHMAC, (0, _SafeRequest.safeRequest)(async (req, res) => {
  const events = await _eventsController.default.getUpcomingEvents();
  return {
    data: events
  };
}));
EventsRouter.get("/past", _verifyHMAC.useHMAC, (0, _SafeRequest.safeRequest)(async (req, res) => {
  const events = await _eventsController.default.getPastEvents();
  return {
    data: events
  };
}));
EventsRouter.post("/random_atendee", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    eventId
  } = V.validate({
    eventId: V.string
  }, req.body);
  const {
    attendees
  } = await _eventsController.default.getEventById(eventId);
  const radom_atendee = attendees[Math.round(Math.random() * attendees.length)];
  const atendeeData = await _userController.default.getUserById(radom_atendee);
  return atendeeData;
}));
EventsRouter.post("/confirm_atendees", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    eventId
  } = V.validate({
    eventId: V.string
  }, req.body);
  const {
    attendees
  } = await _eventsController.default.getEventById(eventId);
  const result = await Promise.all(attendees.map(id => {
    _userController.default.updateUser(id, {
      confirmed: true
    });
  }));
  return {
    success: true,
    attendees: attendees.length
  };
}));
EventsRouter.get("/atendees", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    eventId
  } = V.validate({
    eventId: V.string
  }, req.query);
  const {
    attendees
  } = await _eventsController.default.getEventById(eventId);
  const result = await Promise.all(attendees.map(_userController.default.getUserById));
  return {
    success: true,
    attendees: result.map(user => ({
      name: user.name,
      phone: user.phoneNumber
    }))
  };
}));
EventsRouter.get("/details",
// useHMAC,
(0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    id
  } = V.validate({
    id: V.string
  }, req.query);
  const event = await _eventsController.default.getEventById(id);
  return {
    name: event.name,
    description: event.description,
    date: event.date,
    attendees: event.attendees.length,
    location: event.location,
    bannerUrl: event.bannerUrl,
    medias: event.medias.map(name => ({
      url: name,
      type: Boolean(_mimeTypes.default.lookup(name)) ? _mimeTypes.default.lookup(name).includes("image") ? "image" : "video" : "unknown"
    }))
  };
}));
var _default = exports.default = EventsRouter;
//# sourceMappingURL=Events.js.map