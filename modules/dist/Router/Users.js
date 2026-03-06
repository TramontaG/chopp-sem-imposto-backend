"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _verifyHMAC = require("../JWT/verifyHMAC");
var _SafeRequest = require("../Util/SafeRequest");
var _userController = _interopRequireDefault(require("../database/controllers/userController"));
var _SafeDatabaseTransaction = require("../Util/SafeDatabaseTransaction");
var V = _interopRequireWildcard(require("../Util/ZodValidation"));
var _JWT = require("../JWT");
var _Date = require("../Util/Date");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const UserRouter = (0, _express.Router)();
UserRouter.get("/total", _verifyHMAC.useHMAC, (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    confirmed
  } = V.validate({
    confirmed: V.booleanAsString.optional()
  }, req.query);
  console.log("Getting total users, confirmed = " + confirmed);
  const totalUsersTransaction = await _userController.default.getTotalUsers(Boolean(confirmed));

  // avoid cacheing the result
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  return (0, _SafeDatabaseTransaction.safeReturnTransaction)(totalUsersTransaction);
}));
UserRouter.post("/delete_user", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    userId
  } = V.validate({
    userId: V.string
  }, req.body);
  await _userController.default.deleteUser(userId);
  return {
    success: true
  };
}));
UserRouter.get("/info", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    phone_number
  } = V.validate({
    phone_number: V.phone
  }, req.query);
  const user = await _userController.default.getUserByPhoneNumber(phone_number);
  if (user) {
    return {
      success: true,
      data: user
    };
  } else {
    (0, _SafeDatabaseTransaction.safeReturnTransaction)((0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.NOT_FOUND));
  }
}));
UserRouter.post("/upsert", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    id,
    name,
    phoneNumber,
    city,
    DOB,
    sex,
    neighborhood,
    profession,
    source,
    confirmed
  } = V.validate({
    id: V.string.optional(),
    name: V.string,
    phoneNumber: V.phone,
    city: V.string,
    DOB: V.string.optional().nullable(),
    sex: V.enums(["m", "f"]).optional().nullable(),
    neighborhood: V.string.optional().nullable(),
    profession: V.string.optional().nullable(),
    source: V.string.optional().nullable(),
    confirmed: V.boolean.optional().nullable()
  }, req.body);
  const userUpsertTransaction = await _userController.default.upsertUser({
    id,
    name,
    phoneNumber,
    city,
    confirmed: !!confirmed ? confirmed : false,
    DOB: DOB ? (0, _Date.parseDateBR)(DOB).getTime() : null,
    sex: sex ? sex : null,
    neighborhood: !!neighborhood ? neighborhood : null,
    profession: !!profession ? profession : null,
    source: !!source ? source : "referral"
  });
  return (0, _SafeDatabaseTransaction.safeReturnTransaction)(userUpsertTransaction);
}));
UserRouter.post("/check_in", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    userId,
    eventId
  } = V.validate({
    userId: V.string,
    eventId: V.string
  }, req.body);
  const checkInTransaction = await _userController.default.userAttendToEvent(userId, eventId);
  return (0, _SafeDatabaseTransaction.safeReturnTransaction)(checkInTransaction);
}));
UserRouter.get("/all_confirmed", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const contentType = req.headers["content-type"];
  const allConfirmedUsers = await _userController.default.getAllUsers(true);
  if (contentType === "text/csv") {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=confirmed_users.csv");
    const csvRows = [];
    csvRows.push(["ID", "Name", "Phone Number", "City", "DOB", "Sex", "Neighborhood", "Profession", "Source", "Confirmed"].join(","));
    allConfirmedUsers.forEach(user => {
      const row = [user.id, `"${user.name}"`, user.phoneNumber, `"${user.city}"`, user.DOB ? new Date(user.DOB).toLocaleDateString("pt-BR") : "", user.sex || "", user.neighborhood ? `"${user.neighborhood}"` : "", user.profession ? `"${user.profession}"` : "", user.source || "", user.confirmed ? "Yes" : "No"];
      csvRows.push(row.join(","));
    });
    return csvRows.join("\n");
  }
  return allConfirmedUsers;
}));
UserRouter.get("/attendee_frequency", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  const allConfirmedUsers = await _userController.default.getAllUsers(true);
  const usersByAttendance = [...allConfirmedUsers].sort((a, b) => {
    return (b.eventsAttended?.length || 0) - (a.eventsAttended?.length || 0);
  });
  if (contentType === "text/csv") {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users_by_attendee_frequency.csv");
    const csvRows = [];
    csvRows.push(["ID", "Name", "Phone Number", "City", "DOB", "Sex", "Neighborhood", "Profession", "Source", "Confirmed", "Attendance Count"].join(","));
    usersByAttendance.forEach(user => {
      const row = [user.id, `"${user.name}"`, user.phoneNumber, `"${user.city}"`, user.DOB ? new Date(user.DOB).toLocaleDateString("pt-BR") : "", user.sex || "", user.neighborhood ? `"${user.neighborhood}"` : "", user.profession ? `"${user.profession}"` : "", user.source || "", user.confirmed ? "Yes" : "No", String(user.eventsAttended?.length || 0)];
      csvRows.push(row.join(","));
    });
    return csvRows.join("\n");
  }
  return usersByAttendance.map(user => _objectSpread(_objectSpread({}, user), {}, {
    attendanceCount: user.eventsAttended?.length || 0
  }));
}));
var _default = exports.default = UserRouter;
//# sourceMappingURL=Users.js.map