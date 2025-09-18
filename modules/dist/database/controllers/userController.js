"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _firestore = require("firebase-admin/firestore");
var _ = _interopRequireDefault(require(".."));
var _eventsController = _interopRequireDefault(require("./eventsController."));
var _yasms = require("yasms");
var _SafeDatabaseTransaction = require("../../Util/SafeDatabaseTransaction");
var _cryptoService = require("../../Util/crypto-service");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const MINUTE_IN_MS = 1000 * 60;
const userMemo = (0, _yasms.createMemoService)(undefined, MINUTE_IN_MS);
const userDB = (0, _.default)("user");
const queries = {
  filterByPhoneNumber: phoneNumber => {
    return userDB.createQuery(q => q.where("phoneNumber", "==", phoneNumber).where("deletedAt", "==", null));
  },
  filterByIds: ids => {
    return userDB.createQuery(q => q.where("id", "in", ids));
  },
  getAll: () => {
    return userDB.createQuery(q => q.where("deletedAt", "==", null));
  },
  getAllConfirmed: () => {
    return userDB.createQuery(q => q.where("confirmed", "==", true).where("deletedAt", "==", null));
  }
};
const userManager = () => {
  const createUser = async ({
    name,
    phoneNumber,
    city,
    DOB,
    source,
    confirmed
  }) => {
    userMemo.deleteData(`queryphone-${phoneNumber}`); //should be removed

    const phoneNotInUse = await assertPhoneNotInUse(phoneNumber);
    if (!phoneNotInUse) {
      return (0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.ALREADY_EXISTS);
    }
    const id = `${name}-${crypto.randomUUID()}`;
    const userData = {
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
      source: source || "novo"
    };
    await userDB.upsertEntity(id, userData);
    return (0, _SafeDatabaseTransaction.transactionSuccess)({
      id
    });
  };
  const getAllUsers = async () => {
    const data = await userDB.runQuery(queries.getAll());
    return data;
  };
  const updateUser = (id, data) => {
    userMemo.deleteData(id);
    return userDB.upsertEntity(id, _objectSpread(_objectSpread({}, data), {}, {
      updatedAt: Date.now()
    }));
  };
  const getUserById = id => {
    return userMemo.getData(id, () => userDB.readEntity(id)).then(val => val.data);
  };
  const deleteUser = id => {
    userMemo.deleteData(id);
    return userDB.upsertEntity(id, {
      deletedAt: Date.now()
    });
  };
  const assertUserExists = async id => {
    const exists = await userMemo.getData(`exists/${id}`, () => userDB.entityExists(id)).then(val => val.data);
    return exists;
  };
  const assertPhoneNotInUse = async phoneNumber => {
    const results = await userMemo.getData(`queryphone-${phoneNumber}`, () => userDB.runQuery(queries.filterByPhoneNumber(phoneNumber))).then(val => val.data);
    return results.length === 0;
  };
  const userAttendToEvent = async (userId, eventId) => {
    const userExists = await assertUserExists(userId);
    if (!userExists) throw new Error("User does not exist");
    const eventExists = await _eventsController.default.assertEventExists(eventId);
    if (!eventExists) throw new Error("Event does not exist");
    updateUser(userId, {
      eventsAttended: _firestore.FieldValue.arrayUnion(eventId)
    });
    _eventsController.default.updateEvent(eventId, {
      attendees: _firestore.FieldValue.arrayUnion(userId)
    });
    return eventId;
  };
  const userInterestedInEvent = async (userId, eventId) => {
    const userExists = await assertUserExists(userId);
    if (!userExists) return (0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.NOT_FOUND);
    const eventExists = await _eventsController.default.assertEventExists(eventId);
    if (!eventExists) return (0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.NOT_FOUND);
    _eventsController.default.updateEvent(eventId, {
      interested: _firestore.FieldValue.arrayUnion(userId)
    });
    return (0, _SafeDatabaseTransaction.transactionSuccess)({
      success: true
    });
  };
  const getUsersByIds = async ids => {
    const users = await userDB.runQuery(queries.filterByIds(ids));
    return users;
  };
  const getTotalUsers = async confirmed => {
    const usersAmount = await userDB.countByQuery(confirmed ? queries.getAllConfirmed() : queries.getAll());
    return (0, _SafeDatabaseTransaction.transactionSuccess)({
      amount: usersAmount
    });
  };
  const getConfirmationPayload = async (userId, eventId) => {
    const userExists = await assertUserExists(userId);
    if (!userExists) return (0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.NOT_FOUND);
    const eventExists = await _eventsController.default.assertEventExists(eventId);
    if (!eventExists) return (0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.NOT_FOUND);
    return (0, _SafeDatabaseTransaction.transactionSuccess)(_cryptoService.eventCofirmationCryptoService.encrypt({
      action: "confirm",
      eventId,
      userId
    }));
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
    getConfirmationPayload
  };
};
var _default = exports.default = userManager();
//# sourceMappingURL=userController.js.map