import Module from "..";
import mime from "mime-types";
import { createTaskQueue } from "yaseq";
import { sleep } from "../../Util/sleep";
import { randomZeroWidth } from "../../Util/zero-width";

const sendMessageQueue = createTaskQueue();

export const sendMessage = async (
  userId: string,
  message: string,
  imageUrl?: string
) => {
  if (imageUrl) {
    const fileName = imageUrl?.split("/").at(-1);
    const mimeType = mime.lookup(fileName || "");

    Module.sendMessage.withMedia(userId, "iae-baileys", message, {
      data: imageUrl,
      transportType: "url",
      duration: null,
      fileName: imageUrl.split("/").at(-1)!,
      mimeType: mimeType || "image/jpeg",
      sizeInBytes: 0,
      stickerTags: [],
    });
  } else {
    Module.sendMessage(userId, "iae-baileys", message);
  }
};

export const sendMessageToContactList = async ({
  contacts,
  messages,
  post_messages,
}: {
  contacts: (readonly [string, string])[]; //tuple [jid, name]
  messages: (({ name }: { name: string }) => string)[];
  post_messages: (() => string)[];
  imageURL?: string;
}) => {
  return Promise.all(
    contacts.map(async (contact, index) => {
      const [name, jid] = contact;

      return sendMessageQueue.awaitExecution(async () => {
        console.log(
          "Sending message to",
          `contact ${index + 1} of ${contacts.length} contacts\n`,
          `JID: ${jid} Name: ${name}`
        );
        const Message = messages[Math.floor(Math.random() * messages.length)];
        const PostMesasge =
          post_messages[Math.floor(Math.random() * post_messages.length)];
        const randomZeroWidthMessage = randomZeroWidth({ min: 5, max: 20 });

        await sendMessage(
          jid,
          <Message name={name} /> + randomZeroWidthMessage
        );

        await sleep(Math.random() * 15 * 1000 + 1500);

        await sendMessage(jid, <PostMesasge /> + randomZeroWidthMessage);

        await sleep(Math.random() * 20 * 1000 + 1500);
        return true;
      });
    })
  );
};
