import { Router } from "express";
import { useHMAC } from "../JWT/verifyHMAC";
import { safeRequest } from "../Util/SafeRequest";
import userController from "../database/controllers/userController";
import {
  FAIL_REASONS,
  isTransactionSuccessful,
  safeReturnTransaction,
  transactionError,
} from "../Util/SafeDatabaseTransaction";
import * as V from "../Util/ZodValidation";
import { useJWT } from "../JWT";
import { json, success } from "zod";
import type { WithID } from "../database/schemas";
import { parseDateBR } from "../Util/Date";

const UserRouter = Router();

UserRouter.get(
  "/total",
  useHMAC,
  safeRequest(async (req, res) => {
    
    const { confirmed } = V.validate(
      { confirmed: V.booleanAsString.optional() },
      req.query as Record<string, string>
    );

    console.log("Getting total users, confirmed = " + confirmed);

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

UserRouter.post(
  "/delete_user",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { userId } = V.validate({ userId: V.string }, req.body);

    await userController.deleteUser(userId);

    return {
      success: true,
    };
  })
);

UserRouter.get(
  "/info",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { phone_number } = V.validate(
      {
        phone_number: V.phone,
      },
      req.query as Record<string, string>
    );

    const user = await userController.getUserByPhoneNumber(phone_number);

    if (user) {
      return {
        success: true,
        data: user,
      };
    } else {
      safeReturnTransaction(transactionError(FAIL_REASONS.NOT_FOUND));
    }
  })
);

UserRouter.post(
  "/upsert",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const {
      id,
      name,
      phoneNumber,
      city,
      DOB,
      sex,
      neighborhood,
      profession,
      source,
      confirmed,
    } = V.validate(
      {
        id: V.string.optional(),
        name: V.string,
        phoneNumber: V.phone,
        city: V.string,
        DOB: V.string.optional().nullable(),
        sex: V.enums(["m", "f"]).optional().nullable(),
        neighborhood: V.string.optional().nullable(),
        profession: V.string.optional().nullable(),
        source: V.string.optional().nullable(),
        confirmed: V.boolean.optional().nullable(),
      },
      req.body
    );

    const userUpsertTransaction = await userController.upsertUser({
      id,
      name,
      phoneNumber,
      city,
      confirmed: !!confirmed ? confirmed : false,
      DOB: DOB ? parseDateBR(DOB).getTime() : null,
      sex: sex ? sex : null,
      neighborhood: !!neighborhood ? neighborhood : null,
      profession: !!profession ? profession : null,
      source: !!source ? (source as WithID<"user">["source"]) : "referral",
    });

    return safeReturnTransaction(userUpsertTransaction);
  })
);

UserRouter.post(
  "/check_in",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { userId, eventId } = V.validate(
      {
        userId: V.string,
        eventId: V.string,
      },
      req.body
    );

    const checkInTransaction = await userController.userAttendToEvent(
      userId,
      eventId
    );

    return safeReturnTransaction(checkInTransaction);
  })
);

export default UserRouter;
