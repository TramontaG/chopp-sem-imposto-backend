"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validationError = exports.transactionSuccess = exports.transactionError = exports.safeReturnTransaction = exports.isTransactionSuccessful = exports.customError = exports.FAIL_REASONS = void 0;
let FAIL_REASONS = exports.FAIL_REASONS = /*#__PURE__*/function (FAIL_REASONS) {
  FAIL_REASONS["ALREADY_EXISTS"] = "Entity already exists";
  FAIL_REASONS["NOT_FOUND"] = "Entity not found";
  FAIL_REASONS["UPDATE_NON_EXISTENT_ENTITY"] = "Tried to update a entity that doesn't exist";
  FAIL_REASONS["UNDETERMINED"] = "Undetermined fail reason";
  FAIL_REASONS["TYPE_MISMATCH"] = "Tried to work on entities of the wrong type";
  FAIL_REASONS["FORBIDDEN"] = "You don't have permission to access this resource";
  FAIL_REASONS["UNAUTHORIZED"] = "Please login again";
  FAIL_REASONS["INVALID_ADDRESS"] = "This address is not valid";
  FAIL_REASONS["INVALID_USER"] = "This user is invalid. Please login again";
  FAIL_REASONS["OPERATION_FORBIDDEN"] = "This request is not possible to be fullfiled";
  FAIL_REASONS["FAIL_LOGIN"] = "Invalid username or password";
  return FAIL_REASONS;
}({});
const errorsMap = {
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
  [FAIL_REASONS.FAIL_LOGIN]: 400
};
const transactionError = reason => ({
  success: false,
  reason: reason
});
exports.transactionError = transactionError;
const transactionSuccess = data => ({
  success: true,
  data
});
exports.transactionSuccess = transactionSuccess;
const validationError = fields => {
  throw {
    code: 400,
    error: {
      errorType: "Validation",
      fields
    }
  };
};
exports.validationError = validationError;
const customError = (code, variant, message) => {
  return {
    code,
    error: {
      errorType: "Custom",
      variant,
      message
    }
  };
};
exports.customError = customError;
const isTransactionSuccessful = transactionResult => {
  return transactionResult.success;
};
exports.isTransactionSuccessful = isTransactionSuccessful;
const safeReturnTransaction = (transaction, transformer) => {
  if (!isTransactionSuccessful(transaction)) {
    throw {
      code: errorsMap[transaction.reason],
      error: {
        errorType: "Transaction",
        message: transaction.reason
      }
    };
  } else {
    return transformer ? transformer(transaction.data) : transaction.data;
  }
};
exports.safeReturnTransaction = safeReturnTransaction;
//# sourceMappingURL=SafeDatabaseTransaction.js.map