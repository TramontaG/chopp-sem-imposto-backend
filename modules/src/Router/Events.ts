import { json, Router } from "express";
import { safeRequest } from "../Util/SafeRequest";
import { useJWT } from "../JWT";
import * as V from "../Util/ZodValidation";
import eventsController from "../database/controllers/eventsController.";
import {
  FAIL_REASONS,
  safeReturnTransaction,
  transactionError,
} from "../Util/SafeDatabaseTransaction";
import type { DatabaseFriendlyEntityModel } from "../database/schemas";
import { eventCofirmationCryptoService } from "../Util/crypto-service";
import userController from "../database/controllers/userController";
import { useHMAC } from "../JWT/verifyHMAC";
import { sendConfirmationMessage } from "../Kozz-Module/Methods/confirmationMessage";

const EventsRouter = Router();

EventsRouter.post(
  "/create_event",
  useJWT(["events_create"]),
  safeRequest(async (req, res) => {
    const { name, description, location, organizer, date, bannerUrl } =
      V.validate(
        {
          name: V.string,
          description: V.string,
          location: V.string,
          organizer: V.string.nullable(),
          date: V.string,
          bannerUrl: V.string.nullable(),
        },
        req.body
      );

    const createEventTransaction = await eventsController.createEvent({
      name,
      description,
      date: new Date(date).getTime(),
      location,
      organizer,
      bannerUrl,
    });

    return safeReturnTransaction(createEventTransaction);
  })
);

EventsRouter.post(
  "/update_event",
  useJWT(["events_create"]),
  safeRequest(async (req, res) => {
    const { id, data } = V.validate(
      {
        id: V.string,
        // This should be improved
        data: V.anyObject,
      },
      req.body
    );

    const updateTransaction = await eventsController.updateEvent(
      id,
      data as Partial<DatabaseFriendlyEntityModel<"event">>
    );

    return safeReturnTransaction(updateTransaction);
  })
);

EventsRouter.post(
  "/confirm",
  useHMAC,
  json(),
  safeRequest(async (req, res) => {
    const { payload } = V.validate(
      {
        payload: V.string,
      },
      req.body
    );

    const { action, eventId, userId } =
      eventCofirmationCryptoService.decrypt(payload);

    console.log({ action, eventId, userId });

    if (action === "confirm") {
      const interestedTransaction = await userController.userInterestedInEvent(
        userId,
        eventId
      );
      return safeReturnTransaction(interestedTransaction);
    } else {
      return safeReturnTransaction(
        transactionError(FAIL_REASONS.OPERATION_FORBIDDEN)
      );
    }
  })
);

EventsRouter.get(
  "/confirmation_payload",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { userId, eventId } = V.validate(
      {
        userId: V.string,
        eventId: V.string,
      },
      req.query as Record<string, string>
    );

    const payload = eventCofirmationCryptoService.encrypt({
      action: "confirm",
      eventId,
      userId,
    });

    res.send({
      payload,
    });
  })
);

EventsRouter.post(
  "/check_payload",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { payload } = V.validate(
      {
        payload: V.string,
      },
      req.body
    );

    try {
      const decrypted = eventCofirmationCryptoService.decrypt(payload);
      res.send({
        valid: true,
        data: decrypted,
      });
    } catch (error) {
      res.send({
        valid: false,
        error: "Invalid payload",
      });
    }
  })
);

EventsRouter.post(
  "/send_confirmation_message",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { userId, eventId } = V.validate(
      {
        userId: V.string,
        eventId: V.string,
      },
      req.body
    );

    const result = await sendConfirmationMessage(userId, eventId);

    res.send({ success: "maybe?" });
  })
);

export default EventsRouter;
