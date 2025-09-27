"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InviteMessage = void 0;
var _kozzModuleMaker = require("kozz-module-maker");
var _jsxRuntime = require("kozz-module-maker/dist/jsx-runtime");
const InviteMessage = ({
  groupName
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsx)(_kozzModuleMaker.Render, {
      when: !groupName,
      children: (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
        children: "Oi, tudo bom? Meu nome \xE9 Mateus!"
      })
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Render, {
      when: !!groupName,
      children: (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
        children: ["Oi, tudo bom? Meu nome \xE9 Mateus e eu tamb\xE9m fa\xE7o parte do grupo", " ", groupName]
      })
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "N\xE3o sei se voc\xEA ta sabendo, mas vai rolar o chopp sem imposto na quinta feira, dia 25/09, e seria muito legal se voc\xEA participasse com a gente"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Voc\xEA tem interesse? Se sim, me avisa que eu te mando o link para se inscrever!"
    })]
  });
};
exports.InviteMessage = InviteMessage;
//# sourceMappingURL=invite.js.map