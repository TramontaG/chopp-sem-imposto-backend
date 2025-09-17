"use strict";

var _express = _interopRequireDefault(require("express"));
var _Router = _interopRequireDefault(require("./Router"));
var _KozzModule = _interopRequireDefault(require("./Kozz-Module"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const App = (0, _express.default)();
App.use("/", _Router.default);
App.listen(1549, () => {
  console.log("started API server on port 1549");
});
console.log({
  module: _KozzModule.default
});
//# sourceMappingURL=index.js.map