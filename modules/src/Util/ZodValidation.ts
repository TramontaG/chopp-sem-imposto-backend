import * as Zod from "zod";

type DefaultError = {
  code: number;
  error: ValidationError | TransactionError | CustomError;
};

export type ValidationError = {
  errorType: "Validation";
  fields: {
    path: string[];
    message: string;
  }[];
};

export const createCustomError = (
  code: number,
  variant: string,
  message: string
) => ({
  code,
  error: {
    errorType: "Custom",
    variant,
    message,
  },
});

export type CustomError = {
  errorType: "Custom";
  variant: string;
  message: string;
};

export type TransactionError = {
  errorType: "Transaction";
  message: string;
  data: any;
};

export const createTransactionError = (
  code: number,
  reason: string,
  data: any
): DefaultError => ({
  code,
  error: {
    errorType: "Transaction",
    message: reason,
    data,
  },
});

export const isDefaultError = (e: any): e is DefaultError => {
  return !!e && !!e.code;
};

export const getPropertyListFromObject = <T extends Object>(obj: T) => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[0].push(key);
      acc[1].push(value);
      return acc;
    },
    [[] as string[], [] as T[keyof T][]] as const
  );
};

export const validate = <Z extends Zod.ZodRawShape>(zod: Z, obj: Json) => {
  const object = Zod.object(zod);
  const query = object.safeParse(obj);
  if (!query.success) {
    throw {
      code: 400,
      error: {
        errorType: "Validation",
        fields: query.error.issues,
      },
    };
  } else {
    return query.data;
  }
};

// code copied from https://zod.dev/?id=json-type
const literalSchema = Zod.union([
  Zod.string(),
  Zod.number(),
  Zod.boolean(),
  Zod.null(),
]);
type Literal = Zod.infer<typeof literalSchema>;
export type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: Zod.ZodType<Json> = Zod.lazy(() =>
  Zod.union([literalSchema, Zod.array(jsonSchema), Zod.record(jsonSchema)])
);

export const string = Zod.string();
export const number = Zod.number();
export const stringArray = Zod.array(string);
export const optional = <Shape extends Zod.ZodType>(shape: Shape) =>
  shape.optional();
export const boolean = Zod.boolean();
export const any = Zod.any();
export const array = <Shape extends Zod.ZodType>(shape: Shape) =>
  Zod.array(shape);
export const or = <Shape1 extends Zod.ZodType, Shape2 extends Zod.ZodType>(
  shape1: Shape1,
  shape2: Shape2,
  message?: string
) => {
  return shape1.or(shape2).refine(
    () => {
      return true;
    },
    {
      message,
    }
  );
};
export const object = <Shape extends Zod.ZodRawShape>(obj: Shape) =>
  Zod.object(obj);
export const anyObject = jsonSchema;

export const enums = <const Values extends readonly [string, ...string[]]>(
  values: Values
) => Zod.enum(values);

export const typeNull = Zod.null();
export const phoneRegex = /^\(([0-9]){2}\)([0-9]){4,5}-([0-9]){4}$/;
export const cpfRegex = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
export const cnpjRegex = /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/;
export const brazilianIdRegex = /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9]$/;
export const cepRegex = /^[0-9]{5}-[0-9]{3}$/;

export const phone = string.regex(
  phoneRegex,
  "Deve ser um telefone válido, formato (99)99999-9999 or (99)9999-9999"
);
export const cpf = string.regex(
  cpfRegex,
  "Deve ser um CPF válido, formato 999.999.999-99"
);
export const cnpj = string.regex(
  cnpjRegex,
  "Deve ser um CNPJ Válido, formato 99.999.999/9999-99"
);
export const brazilianId = string.regex(
  brazilianIdRegex,
  "Deve ser um RG válido, formato 99.999.999-*"
);
export const cep = string.regex(
  cepRegex,
  "Deve ser um CEP válido, formato 99999-999"
);
export const emoji = string.emoji("Deve ser um Emoji");
export const url = string.url("URL inválida");
export const email = string.email("Email inválido");
export const document = string
  .regex(cpfRegex, "Deve ser um CPF ou um CNPJ válido")
  .or(string.regex(cnpjRegex));

/**
 * Accepts strings that when lowercase results to "true" or "false", outputs the proper boolean value
 */
export const booleanAsString = string
  .toLowerCase()
  .startsWith("true")
  .endsWith("true")
  .length(4)
  .transform(() => true)
  .or(
    string
      .toLowerCase()
      .startsWith("false")
      .endsWith("false")
      .length(5)
      .transform(() => false)
  );
