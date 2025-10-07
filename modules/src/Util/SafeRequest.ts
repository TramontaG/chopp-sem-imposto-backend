import { type RequestHandler } from "express";
import { isDefaultError } from "./ZodValidation";
import { isAxiosError } from "axios";
/**
 * This function will make it so whenever something throws inside a request handler
 * the API will function accordingly
 * @param cb
 * @param showError
 * @returns
 */
export const safeRequest =
  (cb: RequestHandler, showError = false): RequestHandler =>
  async (req, res, next) => {
    try {
      const response = await cb(req, res, next);
      if (!res.closed || !res.writable) {
        res.send(response);
      }
    } catch (e: any) {
      console.warn(e);

      if (showError) {
        if (isAxiosError(e)) {
          console.dir(e.response?.data, { depth: Infinity });
        }

        console.dir(
          `[${req.method.toUpperCase()}] ${req.originalUrl} ${
            isDefaultError(e) ? e.code : "500"
          } - ${
            isDefaultError(e)
              ? `Reason: ${e.error?.errorType}, ${JSON.stringify(
                  e,
                  undefined,
                  ""
                )}`
              : `Unexpected reason - ${JSON.stringify(e, undefined, "  ")}`
          }`,
          { depth: Infinity }
        );
      }

      if (isDefaultError(e)) {
        if (e.error.errorType !== "Validation") {
          if (!res.closed) {
            res.status(e.code).send(e.error);
          }
        } else {
          const formattedError = e.error.fields.reduce(
            (acc, curr) => [
              ...acc,
              {
                path:
                  typeof curr.path === "string"
                    ? curr.path
                    : curr.path.join("/"),
                message: curr.message,
              },
            ],
            [] as { path: string; message: string }[]
          );

          if (res.writable) {
            res
              .status(e.code)
              .send({ errorType: "Validation", fields: formattedError });
          }
        }
      }
      req.context?.clear();
    }
  };
