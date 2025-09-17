import { Router, json } from "express";
import { safeRequest } from "../Util/SafeRequest";
import * as V from "../Util/ZodValidation";
import adminsController from "../database/controllers/adminsController";
import { generateJwt, useJWT } from "../JWT";
import { useRequestContext } from "../Util/requestContext";
import cookieParser from "cookie-parser";
import {
  isTransactionSuccessful,
  safeReturnTransaction,
} from "../Util/SafeDatabaseTransaction";
import { dryRunNormalizeCities } from "../Util/sanitizeCity";
import userController from "../database/controllers/userController";

const adminRouter = Router();

adminRouter.post(
  "/create",
  useRequestContext({}),
  useJWT(["create-account"]),
  safeRequest(async (req, res) => {
    const { name, password, permissions, username } = V.validate(
      {
        username: V.string,
        password: V.string,
        permissions: V.array(V.string),
        name: V.string,
      },
      req.body
    );

    const result = await adminsController.createAdmin({
      name,
      password,
      permissions,
      username,
    });

    return safeReturnTransaction(result);
  })
);

adminRouter.post(
  "/login",
  json(),
  cookieParser(),
  safeRequest(async (req, res) => {
    const { username, password } = V.validate(
      {
        username: V.string,
        password: V.string,
      },
      req.body
    );

    const loginTransaction = await adminsController.login(username, password);

    if (!isTransactionSuccessful(loginTransaction)) {
      return safeReturnTransaction(loginTransaction);
    }

    const result = loginTransaction.data;

    const jwt = generateJwt({
      userId: result.id,
      username: result.name,
    });

    res.cookie("jwt", jwt, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sameSite: "none",
      secure: true,
    });

    return { jwt };
  })
);

adminRouter.post("/sanitize-city", async (req, res) => {
  const suggestions = await dryRunNormalizeCities();

  const result = await Promise.all(
    suggestions.map((suggestion) => {
      userController.updateUser(suggestion.id, {
        city: suggestion.after,
      });
    })
  );

  res.send(result);
});

export default adminRouter;
