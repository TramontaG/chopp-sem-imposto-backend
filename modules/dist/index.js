"use strict";

var _express = _interopRequireDefault(require("express"));
var _Router = _interopRequireDefault(require("./Router"));
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const App = (0, _express.default)();
App.use((0, _cors.default)());
App.use("/", _Router.default);
App.listen(1549, () => {
  console.log("started API server on port 1549");
});
//# sourceMappingURL=index.js.map