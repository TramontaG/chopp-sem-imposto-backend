import type { Media } from "kozz-types";
import eventsController from "../../database/controllers/eventsController.";
import mime from "mime-types";
import module from "..";
import { InviteMessage } from "../Messages";
import { createTaskQueue } from "yaseq";
import { sleep } from "../../Util/sleep";
import { randomZeroWidth } from "../../Util/zero-width";

const sendMessageQueue = createTaskQueue();

export const sendInviteMessage = async (
  contact: string,
  eventId: string,
  groupName?: string
) => {
  const { bannerUrl } = await eventsController.getEventById(eventId);

  const media: Media | undefined = bannerUrl
    ? {
        data: bannerUrl,
        transportType: "url",
        duration: null,
        fileName: bannerUrl.split("/").at(-1)!,
        mimeType: mime.lookup(bannerUrl.split("/").at(-1)!) || "image/jpeg",
        sizeInBytes: 0,
        stickerTags: [],
      }
    : undefined;

  media
    ? module.sendMessage.withMedia(
        contact,
        "iae-baileys",
        <InviteMessage groupName={groupName} /> +
          randomZeroWidth({ min: 0, max: 15 }),
        media
      )
    : module.sendMessage(
        contact,
        "iae-baileys",
        <InviteMessage groupName={groupName} /> +
          randomZeroWidth({ min: 0, max: 15 })
      );
};

export const sendInviteToList = async (
  contactList: string[],
  eventId: string,
  groupName?: string
) => {
  return Promise.all(
    contactList.map(async (contactId, index) => {
      return sendMessageQueue.awaitExecution(async () => {
        console.log(
          `Sending message to ${contactId} (${index + 1}/${contactList.length})`
        );

        await sendInviteMessage(contactId, eventId, groupName);
        return await sleep(Math.random() * 15 * 1000 + 10000); // between 10 and 25 seconds
      });
    })
  );
};
