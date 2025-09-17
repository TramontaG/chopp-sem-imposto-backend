export enum FAIL_REASONS {
  ALREADY_EXISTS = "Entity already exists",
  NOT_FOUND = "Entity not found",
  UPDATE_NON_EXISTENT_ENTITY = "Tried to update a entity that doesn't exist",
  UNDETERMINED = "Undetermined fail reason",
  TYPE_MISMATCH = "Tried to work on entities of the wrong type",
  FORBIDDEN = "You don't have permission to access this resource",
  UNAUTHORIZED = "Please login again",
  INVALID_ADDRESS = "This address is not valid",
  INVALID_USER = "This user is invalid. Please login again",
  OPERATION_FORBIDDEN = "This request is not possible to be fullfiled",
  FAIL_LOGIN = "Invalid username or password",
}

const errorsMap: {
  [key in FAIL_REASONS]: number;
} = {
  [FAIL_REASONS.UPDATE_NON_EXISTENT_ENTITY]: 400,
  [FAIL_REASONS.ALREADY_EXISTS]: 400,
  [FAIL_REASONS.NOT_FOUND]: 404,
  [FAIL_REASONS.UNDETERMINED]: 500,
  [FAIL_REASONS.TYPE_MISMATCH]: 400,
  [FAIL_REASONS.UNAUTHORIZED]: 401,
  [FAIL_REASONS.FORBIDDEN]: 403,
  [FAIL_REASONS.INVALID_ADDRESS]: 400,
  [FAIL_REASONS.INVALID_USER]: 404,
  [FAIL_REASONS.OPERATION_FORBIDDEN]: 400,
  [FAIL_REASONS.FAIL_LOGIN]: 400,
};

export type TransactionSuccess<Data> = {
  success: true;
  data: Data;
};
export type TransactionFailed = {
  success: false;
  reason: FAIL_REASONS;
};

export type TransactionResult<Data> =
  | TransactionSuccess<Data>
  | TransactionFailed;

export const transactionError = (reason: FAIL_REASONS): TransactionFailed => ({
  success: false,
  reason: reason,
});

export const transactionSuccess = <Data>(
  data: Data
): TransactionSuccess<Data> => ({
  success: true,
  data,
});

export const validationError = (
  fields: {
    path: string;
    message: string;
  }[]
) => {
  throw {
    code: 400,
    error: {
      errorType: "Validation",
      fields,
    },
  };
};

export const customError = (code: number, variant: string, message: string) => {
  return {
    code,
    error: {
      errorType: "Custom",
      variant,
      message,
    },
  };
};

export const isTransactionSuccessful = <Data>(
  transactionResult: TransactionResult<Data>
): transactionResult is TransactionSuccess<Data> => {
  return transactionResult.success;
};

export const safeReturnTransaction = <DataShape, OutputShape>(
  transaction: TransactionResult<DataShape>,
  transformer?: (data: TransactionSuccess<DataShape>["data"]) => OutputShape
) => {
  if (!isTransactionSuccessful(transaction)) {
    throw {
      code: errorsMap[transaction.reason],
      error: {
        errorType: "Transaction",
        message: transaction.reason,
      },
    };
  } else {
    return transformer ? transformer(transaction.data) : transaction.data;
  }
};
