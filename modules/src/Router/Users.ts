import { Router } from "express";
import { useHMAC } from "../JWT/verifyHMAC";
import { safeRequest } from "../Util/SafeRequest";
import userController from "../database/controllers/userController";
import {
  FAIL_REASONS,
  safeReturnTransaction,
  transactionError,
} from "../Util/SafeDatabaseTransaction";
import * as V from "../Util/ZodValidation";
import { useJWT } from "../JWT";
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

UserRouter.get(
  "/all_confirmed",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const contentType = req.headers["content-type"];
    const allConfirmedUsers = await userController.getAllUsers(true);

    if (contentType === "text/csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=confirmed_users.csv"
      );

      const csvRows = [];
      csvRows.push(
        [
          "ID",
          "Name",
          "Phone Number",
          "City",
          "DOB",
          "Sex",
          "Neighborhood",
          "Profession",
          "Source",
          "Confirmed",
        ].join(",")
      );

      allConfirmedUsers.forEach((user) => {
        const row = [
          user.id,
          `"${user.name}"`,
          user.phoneNumber,
          `"${user.city}"`,
          user.DOB ? new Date(user.DOB).toLocaleDateString("pt-BR") : "",
          user.sex || "",
          user.neighborhood ? `"${user.neighborhood}"` : "",
          user.profession ? `"${user.profession}"` : "",
          user.source || "",
          user.confirmed ? "Yes" : "No",
        ];
        csvRows.push(row.join(","));
      });

      return csvRows.join("\n");
    }

    return allConfirmedUsers;
  })
);

export default UserRouter;
