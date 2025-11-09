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
import { sendMessageToContactList } from "../Kozz-Module/Methods/confirmationMessage";
import mime from "mime-types";
import {
  eventConfirmation1,
  eventConfirmation2,
  eventConfirmation3,
  eventConfirmation4,
  inviteFriendMessage1,
  inviteFriendMessage2,
  inviteFriendMessage3,
} from "../Kozz-Module/Messages";
import formData from "express-form-data";
import { uploadToBucket } from "../CDN/bucketStorage";
import fs from "fs/promises";

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
        data: V.any,
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

EventsRouter.get(
  "/upcoming",
  useHMAC,
  safeRequest(async (req, res) => {
    const events = await eventsController.getUpcomingEvents();
    return {
      data: events,
    };
  })
);

EventsRouter.get(
  "/today",
  useHMAC,
  safeRequest(async (req, res) => {
    const events = await eventsController.getEventsForToday();
    return {
      data: events,
    };
  })
);

EventsRouter.get(
  "/past",
  useHMAC,
  safeRequest(async (req, res) => {
    const events = await eventsController.getPastEvents();

    return {
      data: events,
    };
  })
);

type UploadedFile = {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: Record<string, string>;
  size: number;
  name: string;
  type: string;
};

EventsRouter.post(
  "/upload_media",
  useJWT(["admin"]),
  formData.parse({}),
  safeRequest(async (req, res) => {
    const files = (req as any).files.medias as UploadedFile[] | undefined;
    if (!files || files.length === 0) {
      return safeReturnTransaction(transactionError(FAIL_REASONS.BAD_REQUEST));
    }

    const uploadPromises = files.map(async (file) => {
      const fileName = `${file.originalFilename}`;
      const filePath = `events/${req.body.folder}/${fileName}`;

      await uploadToBucket(filePath, await fs.readFile(file.path));

      return filePath;
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    console.log(uploadedFiles);

    const updateTransaction = await eventsController.updateEvent(
      req.body.eventId,
      {
        medias: uploadedFiles,
      }
    );

    return safeReturnTransaction(updateTransaction);

    return {
      success: true,
    };
  })
);

EventsRouter.post(
  "/random_atendee",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { eventId } = V.validate(
      {
        eventId: V.string,
      },
      req.body
    );

    const { attendees } = await eventsController.getEventById(eventId);

    const radom_atendee =
      attendees[Math.round(Math.random() * attendees.length)];

    const atendeeData = await userController.getUserById(radom_atendee);

    return atendeeData;
  })
);

EventsRouter.post(
  "/confirm_atendees",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { eventId } = V.validate(
      {
        eventId: V.string,
      },
      req.body
    );

    const { attendees } = await eventsController.getEventById(eventId);

    const result = await Promise.all(
      attendees.map((id) => {
        userController.updateUser(id, {
          confirmed: true,
        });
      })
    );

    return {
      success: true,
      attendees: attendees.length,
    };
  })
);

EventsRouter.get(
  "/atendees",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { eventId } = V.validate(
      {
        eventId: V.string,
      },
      req.query as Record<string, string>
    );

    const { attendees } = await eventsController.getEventById(eventId);

    const result = await Promise.all(attendees.map(userController.getUserById));

    return {
      success: true,
      attendees: result.map((user) => ({
        name: user.name,
        phone: user.phoneNumber,
      })),
    };
  })
);

EventsRouter.get(
  "/details",
  // useHMAC,
  safeRequest(async (req, res) => {
    const { id } = V.validate(
      {
        id: V.string,
      },
      req.query as Record<string, string>
    );

    const event = await eventsController.getEventById(id);

    return {
      name: event.name,
      description: event.description,
      date: event.date,
      attendees: event.attendees.length,
      location: event.location,

      bannerUrl: event.bannerUrl,
      medias: event.medias.map((name) => ({
        url: name,
        type: Boolean(mime.lookup(name))
          ? (mime.lookup(name) as string).includes("image")
            ? "image"
            : "video"
          : "unknown",
      })),
    };
  })
);

EventsRouter.post(
  "/invite_confirmed",
  useJWT(["admin"]),
  json(),
  safeRequest(async (req, res) => {
    const allConfirmedUsers = await userController.getAllUsers(true);

    const allConfirmedContacts = allConfirmedUsers.map((user) => {
      const sanitizedPhone = `55${user.phoneNumber.replace(/[\D]/g, "")}`;
      const contactId = `${sanitizedPhone}@s.whatsapp.net`;
      return [user.name, contactId] as const;
    });

    const messages = [
      eventConfirmation1,
      eventConfirmation2,
      eventConfirmation3,
      eventConfirmation4,
    ];

    const postMessages = [
      inviteFriendMessage1,
      inviteFriendMessage2,
      inviteFriendMessage3,
    ];

    sendMessageToContactList({
      contacts: allConfirmedContacts,
      messages: messages,
      post_messages: postMessages,
    });
  })
);

export default EventsRouter;
