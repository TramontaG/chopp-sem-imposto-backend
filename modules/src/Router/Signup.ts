import Router, { json } from "express";
import { safeRequest } from "../Util/SafeRequest";
import * as V from "../Util/ZodValidation";
import userController from "../database/controllers/userController";
import type { AllEntitiesModel } from "../database/schemas";
import {
  FAIL_REASONS,
  isTransactionSuccessful,
  safeReturnTransaction,
  transactionSuccess,
} from "../Util/SafeDatabaseTransaction";
import { useHMAC } from "../JWT/verifyHMAC";
import { findBestCityMatch } from "../Util/sanitizeCity";
import { sendConfirmationMessage } from "../Kozz-Module/Methods/confirmationMessage";

const signupRouter = Router();

signupRouter.post(
  "/me",
  useHMAC,
  json(),
  safeRequest(async (req) => {
    console.log({ body: req.body });

    const { name, phoneNumber, city, DOB, source, confirmed } = V.validate(
      {
        name: V.string,
        phoneNumber: V.phone,
        city: V.string,
        DOB: V.number.nullable(),
        confirmed: V.boolean.nullable(),
        source: V.or(
          V.enums(["novo", "website", "instagram", "referral"]),
          V.string.startsWith("whatsapp-")
        ),
      },
      req.body
    );

    const sanitizedCity = await findBestCityMatch(city);

    const createUserTransaction = await userController.createUser({
      name,
      phoneNumber,
      city: sanitizedCity.best || city,
      DOB,
      source: source as AllEntitiesModel["user"]["source"],
      confirmed,
    });

    if (!isTransactionSuccessful(createUserTransaction)) {
      if (createUserTransaction.reason === FAIL_REASONS.ALREADY_EXISTS) {
        return transactionSuccess({ message: "resignup" });
      }
    }

    if (createUserTransaction.success) {
      // TODO: Have to fetch next event and send message accordingly
      // this hardcoded event ID should be removed
      userController.userInterestedInEvent(
        createUserTransaction.data.id,
        "Chopp sem imposto-062d8617-70c8-4f45-aa5e-e1acaae93f56"
      );
    }

    return safeReturnTransaction(createUserTransaction);
  })
);

export default signupRouter;
