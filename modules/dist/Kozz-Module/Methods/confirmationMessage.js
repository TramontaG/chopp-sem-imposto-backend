"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendConfirmationMessageToEveryone = exports.sendConfirmationMessage = void 0;
var _ = _interopRequireDefault(require(".."));
var _eventsController = _interopRequireDefault(require("../../database/controllers/eventsController."));
var _userController = _interopRequireDefault(require("../../database/controllers/userController"));
var _cryptoService = require("../../Util/crypto-service");
var _Messages = require("../Messages");
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _yaseq = require("yaseq");
var _sleep = require("../../Util/sleep");
var _jsxRuntime = require("kozz-module-maker/dist/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const sendMessageQueue = (0, _yaseq.createTaskQueue)();
const sendConfirmationMessage = async (userId, eventId) => {
  const {
    phoneNumber,
    name
  } = await _userController.default.getUserById(userId);
  const {
    bannerUrl
  } = await _eventsController.default.getEventById(eventId);
  const sanitizedPhone = `55${phoneNumber.replace(/[\D]/g, "")}`;
  const contactId = `${sanitizedPhone}@s.whatsapp.net`;
  const RandomMessage = [_Messages.eventConfirmation1, _Messages.eventConfirmation2, _Messages.eventConfirmation3][Math.floor(Math.random() * 3)];
  const link = "https://iluminandoaescuridao.com.br/confirm?payload=" + _cryptoService.eventCofirmationCryptoService.encrypt({
    userId,
    action: "confirm",
    eventId
  });
  if (bannerUrl) {
    const fileName = bannerUrl?.split("/").at(-1);
    const mimeType = _mimeTypes.default.lookup(fileName || "");
    _.default.sendMessage.withMedia(contactId, "iae-baileys", (0, _jsxRuntime.jsx)(RandomMessage, {
      link: link,
      name: name
    }), {
      data: bannerUrl,
      transportType: "url",
      duration: null,
      fileName: bannerUrl.split("/").at(-1),
      mimeType: mimeType || "image/jpeg",
      sizeInBytes: 0,
      stickerTags: []
    });
  } else {
    _.default.sendMessage(contactId, "iae-baileys", (0, _jsxRuntime.jsx)(RandomMessage, {
      link: link,
      name: name
    }));
  }
  await (0, _sleep.sleep)(2000 + Math.random() * 300); // between 2 and 5 seconds

  const RandomInviteMessage = [_Messages.inviteFriendMessage1, _Messages.inviteFriendMessage2, _Messages.inviteFriendMessage3][Math.floor(Math.random() * 3)];
  _.default.sendMessage(contactId, "iae-baileys", (0, _jsxRuntime.jsx)(RandomInviteMessage, {}));
};
exports.sendConfirmationMessage = sendConfirmationMessage;
const sendConfirmationMessageToEveryone = async eventId => {
  const allUsers = await _userController.default.getAllUsers();
  const event = await _eventsController.default.getEventById(eventId);
  return Promise.all(allUsers.map(async user => {
    return sendMessageQueue.awaitExecution(async () => {
      // unoptimezed, event and user are get multiple times
      // but the memoization takes care ov avoiding multiple
      // database transactions
      await sendConfirmationMessage(user.id, event.id);
      return await (0, _sleep.sleep)(Math.random() * 15 * 1000 + 15000); // between 15 amd 30 seconds
    });
  }));
};
exports.sendConfirmationMessageToEveryone = sendConfirmationMessageToEveryone;
//# sourceMappingURL=confirmationMessage.js.map