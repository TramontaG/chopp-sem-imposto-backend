"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _SafeRequest = require("../Util/SafeRequest");
var V = _interopRequireWildcard(require("../Util/ZodValidation"));
var _adminsController = _interopRequireDefault(require("../database/controllers/adminsController"));
var _JWT = require("../JWT");
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _SafeDatabaseTransaction = require("../Util/SafeDatabaseTransaction");
var _sanitizeCity = require("../Util/sanitizeCity");
var _userController = _interopRequireDefault(require("../database/controllers/userController"));
var _eventsController = _interopRequireDefault(require("../database/controllers/eventsController."));
var _fs = _interopRequireDefault(require("fs"));
var _KozzModule = _interopRequireDefault(require("../Kozz-Module"));
var _phoneNumber = require("../Util/phoneNumber");
var _sendInvite = require("../Kozz-Module/Methods/sendInvite");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const adminRouter = (0, _express.Router)();
adminRouter.post("/create",
// useJWT(["create-account"]),
(0, _express.json)(), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    name,
    password,
    permissions,
    username
  } = V.validate({
    username: V.string,
    password: V.string,
    permissions: V.array(V.string),
    name: V.string
  }, req.body);
  const result = await _adminsController.default.createAdmin({
    name,
    password,
    permissions,
    username
  });
  return (0, _SafeDatabaseTransaction.safeReturnTransaction)(result);
}));
adminRouter.post("/invite_novo", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    ageBegin,
    ageEnd,
    city,
    eventId,
    limit,
    index,
    session
  } = V.validate({
    ageBegin: V.number,
    ageEnd: V.number,
    city: V.number,
    eventId: V.string,
    limit: V.number,
    index: V.number,
    session: V.string
  }, req.body);
  const requestResult = await fetch(`https://gestao.novo.org.br/api/filiados/json/?ageBegin=${ageBegin}&ageEnd=${ageEnd}&city=${city}&state2=26&status=7&ordination=ASC&limit=${limit}&index=${index}`, {
    headers: {
      Cookie: "PHPSESSID=" + session
    }
  });
  if (!requestResult.ok) {
    return res.status(requestResult.status).send(await requestResult.json());
  }
  const data = await requestResult.json().then(resp => resp.message);
  const userList = data.map(affiliate => {
    const ageAsNumber = Number(affiliate.age.split(" ")[0]);
    const currYear = new Date().getFullYear();
    const birthYear = currYear - ageAsNumber;
    const birthDate = new Date(birthYear, 0, 1);
    return {
      name: affiliate.name,
      phoneNumber: (0, _phoneNumber.formatPhoneNumber)(affiliate.phone),
      city: affiliate.city,
      DOB: birthDate.getTime(),
      source: "novo",
      confirmed: false
    };
  });
  const jids = (await Promise.all(userList.map(async user => {
    const result = await _userController.default.createUserAvoidingDuplicates(user);
    if ((0, _SafeDatabaseTransaction.isTransactionSuccessful)(result)) {
      return (0, _phoneNumber.phoneToJid)(user.phoneNumber);
    }
  }))).filter(Boolean);
  (0, _sendInvite.sendInviteToList)(jids, eventId);
  return {
    userList,
    jids
  };
}));
adminRouter.get("/ok", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async (req, res) => {
  return {
    message: "ok"
  };
}));
adminRouter.post("/login", (0, _express.json)(), (0, _cookieParser.default)(), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    username,
    password
  } = V.validate({
    username: V.string,
    password: V.string
  }, req.body);
  const loginTransaction = await _adminsController.default.login(username, password);
  if (!(0, _SafeDatabaseTransaction.isTransactionSuccessful)(loginTransaction)) {
    return (0, _SafeDatabaseTransaction.safeReturnTransaction)(loginTransaction);
  }
  const result = loginTransaction.data;
  const jwt = (0, _JWT.generateJwt)({
    userId: result.id,
    username: result.name
  });
  res.cookie("jwt", jwt, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    sameSite: "none",
    secure: true
  });
  return {
    jwt
  };
}));
adminRouter.post("/sanitize-city", async (req, res) => {
  const suggestions = await (0, _sanitizeCity.dryRunNormalizeCities)();
  const result = await Promise.all(suggestions.map(suggestion => {
    _userController.default.updateUser(suggestion.id, {
      city: suggestion.after
    });
  }));
  res.send(result);
});
adminRouter.post("/patch_event", (0, _JWT.useJWT)(["admin"]), (0, _express.json)(), (0, _SafeRequest.safeRequest)(async req => {
  const {
    eventId
  } = V.validate({
    eventId: V.string
  }, req.body);
  const allUsers = await _userController.default.getAllUsers();
  await _eventsController.default.updateEvent(eventId, {
    invited: allUsers.map(u => u.id)
  });
  return {
    success: true
  };
}));
adminRouter.post("/add_from_group", (0, _JWT.useJWT)(["admin"]), (0, _express.json)(), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    groupName
  } = V.validate({
    groupName: V.string
  }, req.body);
  const group = (await _KozzModule.default.ask.boundary("iae-baileys", "all_groups")).response.find(group => group.name === groupName);
  if (!group) {
    return (0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.NOT_FOUND);
  }
  const participantsPhones = group.participants.map(p => (0, _phoneNumber.formatPhoneNumber)(p.id));
  const createdUsersID = await Promise.all(participantsPhones.map(async phone => {
    const user = await _userController.default.getUserByPhoneNumber(phone);
    if (!user) {
      // return phone;

      return await _userController.default.createUser({
        phoneNumber: phone,
        city: "no_city",
        confirmed: false,
        DOB: null,
        name: "no_name",
        source: `whatsapp-${groupName}`
      });
    }
  }));
  return {
    createdUsersID
  };
}));
adminRouter.delete("/from_group", (0, _JWT.useJWT)(["admin"]), (0, _SafeRequest.safeRequest)(async req => {
  const {
    groupName,
    eventId
  } = V.validate({
    groupName: V.string,
    eventId: V.string
  }, req.body);
  const origin = `${groupName}`;
  const {
    invited
  } = await _eventsController.default.getEventById(eventId);
  const allUsers = await _userController.default.getUsersByOrigin(origin);
  const userIdsToRemove = allUsers.map(user => user.id);
  const updatedInvitedList = invited.filter(id => !userIdsToRemove.includes(id));
  await _eventsController.default.updateEvent(eventId, {
    invited: updatedInvitedList
  });
  const result = await Promise.all(allUsers.map(user => {
    return _userController.default.hardDeleteUser(user.id);
  }));
  return {
    userIdsToRemove,
    updatedInvitedList
  };
}));
adminRouter.post("/send_to_group", (0, _JWT.useJWT)(["admin"]), (0, _express.json)(), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const {
    groupName,
    eventId
  } = V.validate({
    groupName: V.string,
    eventId: V.string
  }, req.body);
  const group = JSON.parse(_fs.default.readFileSync("src/temp.json", {
    encoding: "utf-8"
  }));
  if (!group) {
    return (0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.NOT_FOUND);
  }
  const event = await _eventsController.default.getEventById(eventId);
  if (!event) {
    return (0, _SafeDatabaseTransaction.transactionError)(_SafeDatabaseTransaction.FAIL_REASONS.NOT_FOUND);
  }
  const allUsers = await _userController.default.getUsersByOrigin(`whatsapp-${groupName}`);
  const phoneToUser = new Map();
  for (const u of allUsers) {
    const nat = (0, _phoneNumber.userPhoneToBrNational)(u.phoneNumber);
    if (nat.length === 10 || nat.length === 11) {
      if (!phoneToUser.has(nat)) phoneToUser.set(nat, u);
    }
  }
  const invitedSet = new Set(event.invited ?? []);
  const toInvite = [];
  const seenUserIds = new Set();
  for (const p of group.participants) {
    const nat = (0, _phoneNumber.jidToBrNational)(p.id);
    if (!nat) continue; // ignora JIDs fora do padrão BR
    const user = phoneToUser.get(nat);
    if (!user) continue; // participante não cadastrado no banco
    if (invitedSet.has(user.id)) continue; // já convidado
    if (seenUserIds.has(user.id)) continue; // evita duplicata no mesmo run

    toInvite.push(user);
    seenUserIds.add(user.id);
  }
  await _eventsController.default.updateEvent(event.id, {
    invited: [...event.invited, ...toInvite.map(u => u.id)]
  });
  const jidList = toInvite.map(u => (0, _phoneNumber.phoneToJid)(u.phoneNumber));
  (0, _sendInvite.sendInviteToList)(jidList, event.id, group.name);
  return {
    success: true,
    data: jidList
  };
}));
adminRouter.get("/group_list", (0, _JWT.useJWT)(["admin"]), (0, _express.json)(), (0, _SafeRequest.safeRequest)(async (req, res) => {
  const group = (await _KozzModule.default.ask.boundary("iae-baileys", "all_groups")).response;
  return group;
}));
var _default = exports.default = adminRouter;
//# sourceMappingURL=admin.js.map