"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inviteFriendMessage3 = exports.inviteFriendMessage2 = exports.inviteFriendMessage1 = exports.eventConfirmation3 = exports.eventConfirmation2 = exports.eventConfirmation1 = void 0;
var _kozzModuleMaker = require("kozz-module-maker");
var _jsxRuntime = require("kozz-module-maker/dist/jsx-runtime");
/**
 * Gets only the first name and proper capitalizes it
 * @param name
 * @returns
 */const formatName = name => {
  const firstName = name.split(" ")[0];
  return firstName.charAt(0).toUpperCase() +
  //first letter to upercase
  firstName.slice(1).toLowerCase() // rest of the first name in lower case
  ;
};
const eventConfirmation1 = ({
  name,
  link
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Oi ", formatName(name), ", Mateus aqui!"]
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Estou enviando essa mensagem para te fazer um convite! Dia", " ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "25/09"
      }), " teremos mais uma edi\xE7\xE3o do Chopp Sem Imposto, na Van Been Tap House - Vila Mariana \xE0s 19hrs."]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "Confirme a presen\xE7a no link e garanta seu desconto"
      })
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "N\xE3o bebe? Ainda assim vale participar e levar amigos! Nos vemos l\xE1? \uD83C\uDF7B"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: link
    })]
  });
};
exports.eventConfirmation1 = eventConfirmation1;
const eventConfirmation2 = ({
  name,
  link
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Oi ", formatName(name), ", aqui \xE9 o Mateus"]
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Quero te convidar para mais um evento! No dia ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "25/09"
      }), ", \xE0s 19h, vai rolar mais uma edi\xE7\xE3o do Chopp Sem Imposto na Van Been Tap House - Vila Mariana."]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "J\xE1 garantiu sua inscri\xE7\xE3o? \xC9 s\xF3 clickar no link!"
      })
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Mesmo quem n\xE3o bebe pode participar e chamar amigos. Vai ser demais, espero voc\xEA l\xE1! \uD83C\uDF7B"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: link
    })]
  });
};
exports.eventConfirmation2 = eventConfirmation2;
const eventConfirmation3 = ({
  name,
  link
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Ol\xE1 ", formatName(name), ", Mateus passando pra te lembrar de mais um evento!"]
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Na quinta, ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "25/09"
      }), ", \xE0s 19h, teremos o Chopp Sem Imposto na Van Been Tap House - Vila Mariana."]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "Confirme sua participa\xE7\xE3o no site para garantir seu desconto"
      })
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Mesmo sem beber, vale ir, curtir o ambiente, chamar amigos e trocar ideias. Bora?"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Confirme sua participa\xE7\xE3o no link: ", link]
    })]
  });
};
exports.eventConfirmation3 = eventConfirmation3;
const inviteFriendMessage1 = () => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Ahh e se quiser chamar algu\xE9m, \xE9 s\xF3 mandar esse link pra ela tamb\xE9m aproveitar o desconto!"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "https://iluminandoaescuridao.com.br"
    })]
  });
};
exports.inviteFriendMessage1 = inviteFriendMessage1;
const inviteFriendMessage2 = () => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Ah, e se lembrar de algu\xE9m que possa curtir tamb\xE9m, compartilha o link com essa pessoa pra ela garantir o desconto!"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "https://iluminandoaescuridao.com.br"
    })]
  });
};
exports.inviteFriendMessage2 = inviteFriendMessage2;
const inviteFriendMessage3 = () => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Ah, e se quiser convidar algu\xE9m pra vir junto, pode passar esse link, \xE9 s\xF3 cadastrar para garantir o desconto!"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "https://iluminandoaescuridao.com.br"
    })]
  });
};
exports.inviteFriendMessage3 = inviteFriendMessage3;
//# sourceMappingURL=eventConfirmation.js.map