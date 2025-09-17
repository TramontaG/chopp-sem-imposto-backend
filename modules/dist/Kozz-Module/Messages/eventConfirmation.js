"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventConfirmation3 = exports.eventConfirmation2 = exports.eventConfirmation1 = void 0;
var _kozzModuleMaker = require("kozz-module-maker");
var _jsxRuntime = require("kozz-module-maker/dist/jsx-runtime");
const websiteUrl = "https://iluminandoaescuridao.com.br/event_confirm";
const createConfirmationLink = (userId, eventId) => {
  return `${websiteUrl}?userId=${userId}&eventId=${eventId}`;
};
const eventConfirmation1 = ({
  name,
  userId,
  eventId
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Oi, ", name, ", Mateus aqui!"]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Estou enviando essa mensagem para te fazer um convite! Dia 25/09 teremos mais uma edi\xE7\xE3o do Chopp Sem Imposto, na Van Been Tap House - Vila Mariana \xE0s 19hrs."
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "N\xE3o bebe? Ainda assim vale participar e levar amigos! Nos vemos l\xE1? \uD83C\uDF7B"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Confirme a presen\xE7a e garanta seu desconto no site:", " ", createConfirmationLink(userId, eventId)]
    })]
  });
};
exports.eventConfirmation1 = eventConfirmation1;
const eventConfirmation2 = ({
  name,
  userId,
  eventId
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Oi ", name, ", aqui \xE9 o Mateus!"]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Quero te convidar para mais um evento! No dia 25/09, \xE0s 19h, vai rolar mais uma edi\xE7\xE3o do Chopp Sem Imposto na Van Been Tap House - Vila Mariana."
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Mesmo quem n\xE3o bebe pode participar e chamar amigos. Vai ser demais, espero voc\xEA l\xE1! \uD83C\uDF7B"
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["J\xE1 garantiu sua inscri\xE7\xE3o? \xC9 s\xF3 acessar:", " ", createConfirmationLink(userId, eventId)]
    })]
  });
};
exports.eventConfirmation2 = eventConfirmation2;
const eventConfirmation3 = ({
  name,
  userId,
  eventId
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Ol\xE1 ", name, ", Mateus passando pra te lembrar de mais um evento!"]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Na quinta, 25/09, \xE0s 19h, teremos o Chopp Sem Imposto na Van Been Tap House - Vila Mariana."
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Mesmo sem beber, vale ir, curtir o ambiente, chamar amigos e trocar ideias. Bora?"
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Confirme sua participa\xE7\xE3o no site para garantir seu desconto:", " ", createConfirmationLink(userId, eventId)]
    })]
  });
};
exports.eventConfirmation3 = eventConfirmation3;
//# sourceMappingURL=eventConfirmation.js.map