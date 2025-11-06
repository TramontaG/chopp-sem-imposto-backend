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
var _default = exports.default = UserRouter;
//# sourceMappingURL=Users.js.map