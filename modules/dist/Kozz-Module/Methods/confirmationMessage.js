"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMessageToContactList = exports.sendMessage = void 0;
var _ = _interopRequireDefault(require(".."));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _yaseq = require("yaseq");
var _sleep = require("../../Util/sleep");
var _zeroWidth = require("../../Util/zero-width");
var _jsxRuntime = require("kozz-module-maker/dist/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const sendMessageQueue = (0, _yaseq.createTaskQueue)();
const sendMessage = async (userId, message, imageUrl) => {
  if (imageUrl) {
    const fileName = imageUrl?.split("/").at(-1);
    const mimeType = _mimeTypes.default.lookup(fileName || "");
    _.default.sendMessage.withMedia(userId, "iae-baileys", message, {
      data: imageUrl,
      transportType: "url",
      duration: null,
      fileName: imageUrl.split("/").at(-1),
      mimeType: mimeType || "image/jpeg",
      sizeInBytes: 0,
      stickerTags: []
    });
  } else {
    _.default.sendMessage(userId, "iae-baileys", message);
  }
};
exports.sendMessage = sendMessage;
const sendMessageToContactList = async ({
  contacts,
  messages,
  post_messages
}) => {
  return Promise.all(contacts.map(async (contact, index) => {
    const [name, jid] = contact;
    return sendMessageQueue.awaitExecution(async () => {
      console.log("Sending message to", `contact ${index + 1} of ${contacts.length} contacts\n`, `JID: ${jid} Name: ${name}`);
      const Message = messages[Math.floor(Math.random() * messages.length)];
      const PostMesasge = post_messages[Math.floor(Math.random() * post_messages.length)];
      const randomZeroWidthMessage = (0, _zeroWidth.randomZeroWidth)({
        min: 5,
        max: 20
      });
      await sendMessage(jid, (0, _jsxRuntime.jsx)(Message, {
        name: name
      }) + randomZeroWidthMessage);
      await (0, _sleep.sleep)(Math.random() * 15 * 1000 + 1500);
      await sendMessage(jid, (0, _jsxRuntime.jsx)(PostMesasge, {}) + randomZeroWidthMessage);
      await (0, _sleep.sleep)(Math.random() * 20 * 1000 + 1500);
      return true;
    });
  }));
};
exports.sendMessageToContactList = sendMessageToContactList;
//# sourceMappingURL=confirmationMessage.js.map