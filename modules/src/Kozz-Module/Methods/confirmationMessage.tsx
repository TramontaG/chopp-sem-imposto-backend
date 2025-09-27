import Module from "..";
import eventsController from "../../database/controllers/eventsController.";
import userController from "../../database/controllers/userController";
import { eventCofirmationCryptoService } from "../../Util/crypto-service";
import {
  eventConfirmation1,
  eventConfirmation2,
  eventConfirmation3,
  inviteFriendMessage1,
  inviteFriendMessage2,
  inviteFriendMessage3,
} from "../Messages";
import mime from "mime-types";
import { createTaskQueue } from "yaseq";
import { sleep } from "../../Util/sleep";

const sendMessageQueue = createTaskQueue();

export const sendConfirmationMessage = async (
  userId: string,
  eventId: string
) => {
  const { phoneNumber, name } = await userController.getUserById(userId);
  const { bannerUrl } = await eventsController.getEventById(eventId);

  const sanitizedPhone = `55${phoneNumber.replace(/[\D]/g, "")}`;
  const contactId = `${sanitizedPhone}@s.whatsapp.net`;

  const RandomMessage = [
    eventConfirmation1,
    eventConfirmation2,
    eventConfirmation3,
  ][Math.floor(Math.random() * 3)];

  const link =
    "https://iluminandoaescuridao.com.br/confirm?payload=" +
    eventCofirmationCryptoService.encrypt({
      userId,
      action: "confirm",
      eventId,
    });

  if (bannerUrl) {
    const fileName = bannerUrl?.split("/").at(-1);
    const mimeType = mime.lookup(fileName || "");

    Module.sendMessage.withMedia(
      contactId,
      "iae-baileys",
      <RandomMessage link={link} name={name} />,
      {
        data: bannerUrl,
        transportType: "url",
        duration: null,
        fileName: bannerUrl.split("/").at(-1)!,
        mimeType: mimeType || "image/jpeg",
        sizeInBytes: 0,
        stickerTags: [],
      }
    );
  } else {
    Module.sendMessage(
      contactId,
      "iae-baileys",
      <RandomMessage link={link} name={name} />
    );
  }

  await sleep(2000 + Math.random() * 300); // between 2 and 5 seconds

  const RandomInviteMessage = [
    inviteFriendMessage1,
    inviteFriendMessage2,
    inviteFriendMessage3,
  ][Math.floor(Math.random() * 3)];

  Module.sendMessage(contactId, "iae-baileys", <RandomInviteMessage />);
};

export const sendConfirmationMessageToEveryone = async (eventId: string) => {
  const allUsers = await userController.getAllUsers();
  const event = await eventsController.getEventById(eventId);

  return Promise.all(
    allUsers.map(async (user) => {
      return sendMessageQueue.awaitExecution(async () => {
        // unoptimezed, event and user are get multiple times
        // but the memoization takes care ov avoiding multiple
        // database transactions
        await sendConfirmationMessage(user.id, event.id);

        return await sleep(Math.random() * 15 * 1000 + 15000); // between 15 amd 30 seconds
      });
    })
  );
};
