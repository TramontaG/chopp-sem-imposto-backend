"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _firestore = require("firebase-admin/firestore");
var _ = _interopRequireDefault(require(".."));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const userDB = (0, _.default)("user");
const queries = {
  filterByPhoneNumber: phoneNumber => {
    return userDB.createQuery(q => q.where("phoneNumber", "==", phoneNumber).where("deletedAt", "==", null));
  }
};
const userManager = () => {
  const createUser = ({
    name,
    phoneNumber,
    city,
    DOB,
    source
  }) => {
    const userData = {
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
      source: source || "novo"
    };
    return userDB.upsertEntity(userData.id, userData);
  };
  const updateUser = (id, data) => {
    return userDB.upsertEntity(id, _objectSpread(_objectSpread({}, data), {}, {
      updatedAt: Date.now()
    }));
  };
  const getUserById = id => {
    return userDB.readEntity(id);
  };
  const deleteUser = id => {
    return userDB.upsertEntity(id, {
      deletedAt: Date.now()
    });
  };
  const assertUserExists = async id => {
    const exists = await userDB.entityExists(id);
    return exists;
  };
  const assertPhoneNotInUse = async phoneNumber => {
    const results = await userDB.runQuery(queries.filterByPhoneNumber(phoneNumber));
    return results.length === 0;
  };
  const userAttendToEvent = async (userId, eventId) => {
    const userExists = await assertUserExists(userId);
    if (!userExists) throw new Error("User does not exist");
    updateUser(userId, {
      eventsAttended: _firestore.FieldValue.arrayUnion(eventId)
    });
  };
  return {
    createUser,
    updateUser,
    getUserById,
    deleteUser,
    assertUserExists,
    assertPhoneNotInUse,
    userAttendToEvent
  };
};
var _default = exports.default = userManager();
//# sourceMappingURL=userController.js.map