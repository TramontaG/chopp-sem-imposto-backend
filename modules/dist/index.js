"use strict";

var _kozzModuleMaker = require("kozz-module-maker");
var _jsxRuntime = require("kozz-module-maker/dist/jsx-runtime");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const Greeting = () => (0, _jsxRuntime.jsx)(_jsxRuntime.Fragment, {
  children: (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
    children: ["Hello from ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
      children: "Kozz-Bot!"
    })]
  })
});
(0, _kozzModuleMaker.createModule)({
  name: "kozz",
  address: "ws://127.0.0.1:4521",
  commands: {
    boundariesToHandle: ["*"],
    methods: _objectSpread({}, (0, _kozzModuleMaker.createMethod)("default", requester => {
      requester.reply((0, _jsxRuntime.jsx)(Greeting, {}));
    }))
  }
});
//# sourceMappingURL=index.js.map