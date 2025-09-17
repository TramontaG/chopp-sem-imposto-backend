"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _eventConfirmation = require("./eventConfirmation");
Object.keys(_eventConfirmation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _eventConfirmation[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _eventConfirmation[key];
    }
  });
});
//# sourceMappingURL=index.js.map