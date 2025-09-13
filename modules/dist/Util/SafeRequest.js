"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safeRequest = void 0;
var _ZodValidation = require("./ZodValidation");
var _axios = require("axios");
/**
 * This function will make it so whenever something throws inside a request handler
 * the API will function accordingly
 * @param cb
 * @param showError
 * @returns
 */
const safeRequest = (cb, showError = false) => async (req, res, next) => {
  try {
    const response = await cb(req, res, next);
    if (res.writable) {
      res.send(response);
    }
  } catch (e) {
    console.warn(e);
    if (showError) {
      if ((0, _axios.isAxiosError)(e)) {
        console.dir(e.response?.data, {
          depth: Infinity
        });
      }
      console.dir(`[${req.method.toUpperCase()}] ${req.originalUrl} ${(0, _ZodValidation.isDefaultError)(e) ? e.code : "500"} - ${(0, _ZodValidation.isDefaultError)(e) ? `Reason: ${e.error?.errorType}, ${JSON.stringify(e, undefined, "")}` : `Unexpected reason - ${JSON.stringify(e, undefined, "  ")}`}`, {
        depth: Infinity
      });
    }
    if ((0, _ZodValidation.isDefaultError)(e)) {
      if (e.error.errorType !== "Validation") {
        if (!res.closed) {
          res.status(e.code).send(e.error);
        }
      } else {
        const formattedError = e.error.fields.reduce((acc, curr) => [...acc, {
          path: typeof curr.path === "string" ? curr.path : curr.path.join("/"),
          message: curr.message
        }], []);
        if (res.writable) {
          res.status(e.code).send({
            errorType: "Validation",
            fields: formattedError
          });
        }
      }
    } else {
      if (res.writable) {
        res.status(500).send("Unexpected error" + e);
      }
    }
    req.context?.clear();
  }
};
exports.safeRequest = safeRequest;
//# sourceMappingURL=SafeRequest.js.map