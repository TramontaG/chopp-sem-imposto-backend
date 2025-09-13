import { Router, json } from "express";
import { safeRequest } from "../Util/SafeRequest";
import * as V from "../Util/ZodValidation";
import adminsController from "../database/controllers/adminsController";
import { generateJwt } from "../JWT";

const adminRouter = Router();

adminRouter.post(
  "/create",
  json(),
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

    return result;
  })
);

adminRouter.post(
  "/login",
  json(),
  safeRequest(async (req, res) => {
    const { username, password } = V.validate(
      {
        username: V.string,
        password: V.string,
      },
      req.body
    );

    const result = await adminsController.login(username, password);

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

export default adminRouter;
