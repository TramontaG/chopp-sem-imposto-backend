"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inviteFriendMessage3 = exports.inviteFriendMessage2 = exports.inviteFriendMessage1 = exports.eventConfirmation4 = exports.eventConfirmation3 = exports.eventConfirmation2 = exports.eventConfirmation1 = void 0;
var _kozzModuleMaker = require("kozz-module-maker");
var _jsxRuntime = require("kozz-module-maker/dist/jsx-runtime");
const formatName = name => {
  const firstName = name.split(" ")[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
};
const eventConfirmation1 = ({
  name
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Bom dia ", formatName(name), "! Mateus aqui pra te convidar pra mais um", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "Chopp sem imposto! \uD83C\uDF7B"
      })]
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Vai rolar dia ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "06/11 \xE0s 19h"
      }), ", l\xE1 na Van Been Tap House - Rua Joaquim T\xE1vora, 1039"]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Mesmo esquema de sempre: boa cerveja, boa conversa e pre\xE7o sem imposto"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Me d\xE1 um ok! e eu j\xE1 ativo o seu desconto!"
    })]
  });
};
exports.eventConfirmation1 = eventConfirmation1;
const eventConfirmation2 = ({
  name
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Fala ", formatName(name), "! Aqui \xE9 o Mateus"]
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["T\xF4 passando pra te avisar que vem a\xED mais um", " ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "Chopp sem imposto \uD83C\uDF7A"
      })]
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Dia ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "06/11 \xE0s 19h"
      }), " na Van Been Tap House, Rua Joaquim T\xE1vora, 1039"]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Se curtiu os \xFAltimos, esse vai ser melhor ainda!"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Te espero l\xE1! Responde aqui que eu j\xE1 ativo o desconto pra vc!"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {})]
  });
};
exports.eventConfirmation2 = eventConfirmation2;
const eventConfirmation3 = ({
  name
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Iae ", formatName(name), "! Mateus aqui para te avisar que t\xE1 confirmado o pr\xF3ximo ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "Chopp sem imposto!"
      })]
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Vai ser dia ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "06/11 \xE0s 19h"
      }), " na Van Been Tap House - R. Joaquim T\xE1vora, 1039"]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Aquela vibe de sempre: cerveja top, sem imposto e muita resenha"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Bora de novo? Me d\xE1 um \u201Ct\xF4 dentro\u201D aqui na mensagem que eu j\xE1 te coloco na lista e ativo seu desconto \uD83C\uDF7B"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {})]
  });
};
exports.eventConfirmation3 = eventConfirmation3;
const eventConfirmation4 = ({
  name
}) => {
  return (0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [(0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["Oii ", formatName(name), ", tudo certo? Mateus aqui"]
    }), (0, _jsxRuntime.jsxs)(_kozzModuleMaker.Line, {
      children: ["J\xE1 pode marcar na agenda: ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "Chopp sem imposto"
      }), " dia", " ", (0, _jsxRuntime.jsx)(_kozzModuleMaker.Bold, {
        children: "06/11 \xE0s 19h"
      }), " na Van Been Tap House, Rua Joaquim T\xE1vora, 1039"]
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "Os \xFAltimos foram sucesso, quer garantir o desconto?"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {}), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {
      children: "\xC9 s\xF3 responder aqui que eu j\xE1 ativo teu desconto! \uD83C\uDF7A"
    }), (0, _jsxRuntime.jsx)(_kozzModuleMaker.Line, {})]
  });
};
exports.eventConfirmation4 = eventConfirmation4;
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