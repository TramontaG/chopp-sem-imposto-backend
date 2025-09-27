"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendInviteToList = exports.sendInviteMessage = void 0;
var _eventsController = _interopRequireDefault(require("../../database/controllers/eventsController."));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _ = _interopRequireDefault(require(".."));
var _Messages = require("../Messages");
var _yaseq = require("yaseq");
var _sleep = require("../../Util/sleep");
var _zeroWidth = require("../../Util/zero-width");
var _jsxRuntime = require("kozz-module-maker/dist/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const sendMessageQueue = (0, _yaseq.createTaskQueue)();
const sendInviteMessage = async (contact, eventId, groupName) => {
  const {
    bannerUrl
  } = await _eventsController.default.getEventById(eventId);
  const media = bannerUrl ? {
    data: bannerUrl,
    transportType: "url",
    duration: null,
    fileName: bannerUrl.split("/").at(-1),
    mimeType: _mimeTypes.default.lookup(bannerUrl.split("/").at(-1)) || "image/jpeg",
    sizeInBytes: 0,
    stickerTags: []
  } : undefined;
  media ? _.default.sendMessage.withMedia(contact, "iae-baileys", (0, _jsxRuntime.jsx)(_Messages.InviteMessage, {
    groupName: groupName
  }) + (0, _zeroWidth.randomZeroWidth)({
    min: 0,
    max: 15
  }), media) : _.default.sendMessage(contact, "iae-baileys", (0, _jsxRuntime.jsx)(_Messages.InviteMessage, {
    groupName: groupName
  }) + (0, _zeroWidth.randomZeroWidth)({
    min: 0,
    max: 15
  }));
};
exports.sendInviteMessage = sendInviteMessage;
const sendInviteToList = async (contactList, eventId, groupName) => {
  return Promise.all(contactList.map(async (contactId, index) => {
    return sendMessageQueue.awaitExecution(async () => {
      console.log(`Sending message to ${contactId} (${index + 1}/${contactList.length})`);
      await sendInviteMessage(contactId, eventId, groupName);
      return await (0, _sleep.sleep)(Math.random() * 15 * 1000 + 10000); // between 10 and 25 seconds
    });
  }));
};
exports.sendInviteToList = sendInviteToList;
//# sourceMappingURL=sendInvite.js.map