import { Router } from "express";
import { useHMAC } from "../JWT/verifyHMAC";
import { safeRequest } from "../Util/SafeRequest";
import userController from "../database/controllers/userController";
import { safeReturnTransaction } from "../Util/SafeDatabaseTransaction";
import * as V from "../Util/ZodValidation";

const UserRouter = Router();

UserRouter.get(
  "/total",
  useHMAC,
  safeRequest(async (req, res) => {
    const { confirmed } = V.validate(
      { confirmed: V.booleanAsString.optional() },
      req.params
    );

    const totalUsersTransaction = await userController.getTotalUsers(
      Boolean(confirmed)
    );

    // avoid cacheing the result
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return safeReturnTransaction(totalUsersTransaction);
  })
);

export default UserRouter;
