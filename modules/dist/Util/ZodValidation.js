"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validate = exports.url = exports.typeNull = exports.stringArray = exports.string = exports.phoneRegex = exports.phone = exports.or = exports.optional = exports.object = exports.number = exports.jsonSchema = exports.isDefaultError = exports.getPropertyListFromObject = exports.enums = exports.emoji = exports.email = exports.document = exports.createTransactionError = exports.createCustomError = exports.cpfRegex = exports.cpf = exports.cnpjRegex = exports.cnpj = exports.cepRegex = exports.cep = exports.brazilianIdRegex = exports.brazilianId = exports.booleanAsString = exports.boolean = exports.array = exports.anyObject = exports.any = void 0;
var Zod = _interopRequireWildcard(require("zod"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const createCustomError = (code, variant, message) => ({
  code,
  error: {
    errorType: "Custom",
    variant,
    message
  }
});
exports.createCustomError = createCustomError;
const createTransactionError = (code, reason, data) => ({
  code,
  error: {
    errorType: "Transaction",
    message: reason,
    data
  }
});
exports.createTransactionError = createTransactionError;
const isDefaultError = e => {
  return !!e && !!e.code;
};
exports.isDefaultError = isDefaultError;
const getPropertyListFromObject = obj => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[0].push(key);
    acc[1].push(value);
    return acc;
  }, [[], []]);
};
exports.getPropertyListFromObject = getPropertyListFromObject;
const validate = (zod, obj) => {
  const object = Zod.object(zod);
  const query = object.safeParse(obj);
  if (!query.success) {
    throw {
      code: 400,
      error: {
        errorType: "Validation",
        fields: query.error.issues
      }
    };
  } else {
    return query.data;
  }
};

// code copied from https://zod.dev/?id=json-type
exports.validate = validate;
const literalSchema = Zod.union([Zod.string(), Zod.number(), Zod.boolean(), Zod.null()]);
const jsonSchema = exports.jsonSchema = Zod.lazy(() => Zod.union([literalSchema, Zod.array(jsonSchema), Zod.record(jsonSchema)]));
const string = exports.string = Zod.string();
const number = exports.number = Zod.number();
const stringArray = exports.stringArray = Zod.array(string);
const optional = shape => shape.optional();
exports.optional = optional;
const boolean = exports.boolean = Zod.boolean();
const any = exports.any = Zod.any();
const array = shape => Zod.array(shape);
exports.array = array;
const or = (shape1, shape2, message) => {
  return shape1.or(shape2).refine(() => {
    return true;
  }, {
    message
  });
};
exports.or = or;
const object = obj => Zod.object(obj);
exports.object = object;
const anyObject = exports.anyObject = jsonSchema;
const enums = values => Zod.enum(values);
exports.enums = enums;
const typeNull = exports.typeNull = Zod.null();
const phoneRegex = exports.phoneRegex = /^\(([0-9]){2}\)([0-9]){4,5}-([0-9]){4}$/;
const cpfRegex = exports.cpfRegex = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
const cnpjRegex = exports.cnpjRegex = /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/;
const brazilianIdRegex = exports.brazilianIdRegex = /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9]$/;
const cepRegex = exports.cepRegex = /^[0-9]{5}-[0-9]{3}$/;
const phone = exports.phone = string.regex(phoneRegex, "Deve ser um telefone válido, formato (99)99999-9999 or (99)9999-9999");
const cpf = exports.cpf = string.regex(cpfRegex, "Deve ser um CPF válido, formato 999.999.999-99");
const cnpj = exports.cnpj = string.regex(cnpjRegex, "Deve ser um CNPJ Válido, formato 99.999.999/9999-99");
const brazilianId = exports.brazilianId = string.regex(brazilianIdRegex, "Deve ser um RG válido, formato 99.999.999-*");
const cep = exports.cep = string.regex(cepRegex, "Deve ser um CEP válido, formato 99999-999");
const emoji = exports.emoji = string.emoji("Deve ser um Emoji");
const url = exports.url = string.url("URL inválida");
const email = exports.email = string.email("Email inválido");
const document = exports.document = string.regex(cpfRegex, "Deve ser um CPF ou um CNPJ válido").or(string.regex(cnpjRegex));

/**
 * Accepts strings that when lowercase results to "true" or "false", outputs the proper boolean value
 */
const booleanAsString = exports.booleanAsString = string.toLowerCase().startsWith("true").endsWith("true").length(4).transform(() => true).or(string.toLowerCase().startsWith("false").endsWith("false").length(5).transform(() => false));
//# sourceMappingURL=ZodValidation.js.map