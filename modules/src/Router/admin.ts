import { Router, json, request, response } from "express";
import { safeRequest } from "../Util/SafeRequest";
import * as V from "../Util/ZodValidation";
import adminsController from "../database/controllers/adminsController";
import { generateJwt, useJWT } from "../JWT";
import cookieParser from "cookie-parser";
import {
  FAIL_REASONS,
  isTransactionSuccessful,
  safeReturnTransaction,
  transactionError,
  type TransactionSuccess,
} from "../Util/SafeDatabaseTransaction";
import { dryRunNormalizeCities } from "../Util/sanitizeCity";
import userController from "../database/controllers/userController";
import eventsController from "../database/controllers/eventsController.";
import fs from "fs";
import module from "../Kozz-Module";
import type { GroupChat, GroupChatData } from "kozz-types";
import {
  formatPhoneNumber,
  jidToBrNational,
  phoneToJid,
  userPhoneToBrNational,
} from "../Util/phoneNumber";
import type { WithID } from "../database/schemas";
import { sendInviteToList } from "../Kozz-Module/Methods/sendInvite";
import UserRouter from "./Users";

const adminRouter = Router();

adminRouter.post(
  "/create",
  // useJWT(["create-account"]),
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

    return safeReturnTransaction(result);
  })
);

type Affiliate = {
  id: number;
  affiliatedId: string;
  name: string;
  state: string;
  city: string;
  disaffiliation: string;
  age: string;
  exemption: string;
  filiation: string;
  filiationSolicitation: string;
  status: string;
  phone: string;
};

adminRouter.post(
  "/invite_novo",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    const { ageBegin, ageEnd, city, eventId, limit, index, session } =
      V.validate(
        {
          ageBegin: V.number,
          ageEnd: V.number,
          city: V.number,
          eventId: V.string,
          limit: V.number,
          index: V.number,
          session: V.string,
        },
        req.body
      );

    const requestResult = await fetch(
      `https://gestao.novo.org.br/api/filiados/json/?ageBegin=${ageBegin}&ageEnd=${ageEnd}&city=${city}&state2=26&status=7&ordination=ASC&limit=${limit}&index=${index}`,
      {
        headers: {
          Cookie: "PHPSESSID=" + session,
        },
      }
    );

    if (!requestResult.ok) {
      return res.status(requestResult.status).send(await requestResult.json());
    }

    const data = await requestResult
      .json()
      .then((resp: any) => resp.message as Affiliate[]);

    const userList = data.map((affiliate) => {
      const ageAsNumber = Number(affiliate.age.split(" ")[0]);
      const currYear = new Date().getFullYear();
      const birthYear = currYear - ageAsNumber;
      const birthDate = new Date(birthYear, 0, 1);

      return {
        name: affiliate.name,
        phoneNumber: formatPhoneNumber(affiliate.phone),
        city: affiliate.city,
        DOB: birthDate.getTime(),
        source: "novo" as WithID<"user">["source"],
        confirmed: false,
      };
    });

    const jids = (
      await Promise.all(
        userList.map(async (user) => {
          const result = await userController.createUserAvoidingDuplicates(
            user
          );
          if (isTransactionSuccessful(result)) {
            return phoneToJid(user.phoneNumber);
          }
        })
      )
    ).filter(Boolean) as string[];

    sendInviteToList(jids, eventId);

    return {
      userList,
      jids,
    };
  })
);

adminRouter.get(
  "/ok",
  useJWT(["admin"]),
  safeRequest(async (req, res) => {
    return { message: "ok" };
  })
);

adminRouter.post(
  "/login",
  json(),
  cookieParser(),
  safeRequest(async (req, res) => {
    const { username, password } = V.validate(
      {
        username: V.string,
        password: V.string,
      },
      req.body
    );

    const loginTransaction = await adminsController.login(username, password);

    if (!isTransactionSuccessful(loginTransaction)) {
      return safeReturnTransaction(loginTransaction);
    }

    const result = loginTransaction.data;

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

adminRouter.post("/sanitize-city", async (req, res) => {
  const suggestions = await dryRunNormalizeCities();

  const result = await Promise.all(
    suggestions.map((suggestion) => {
      userController.updateUser(suggestion.id, {
        city: suggestion.after,
      });
    })
  );

  res.send(result);
});

adminRouter.post(
  "/patch_event",
  useJWT(["admin"]),
  json(),
  safeRequest(async (req) => {
    const { eventId } = V.validate({ eventId: V.string }, req.body);
    const allUsers = await userController.getAllUsers();

    await eventsController.updateEvent(eventId, {
      invited: allUsers.map((u) => u.id),
    });

    return {
      success: true,
    };
  })
);

adminRouter.post(
  "/add_from_group",
  useJWT(["admin"]),
  json(),
  safeRequest(async (req, res) => {
    const { groupName } = V.validate(
      {
        groupName: V.string,
      },
      req.body
    );

    const group: GroupChat | undefined = (
      await module.ask.boundary("iae-baileys", "all_groups")
    ).response.find((group: GroupChatData) => group.name === groupName);

    if (!group) {
      return transactionError(FAIL_REASONS.NOT_FOUND);
    }

    const participantsPhones = group.participants.map((p) =>
      formatPhoneNumber(p.id)
    );

    const createdUsersID = await Promise.all(
      participantsPhones.map(async (phone) => {
        const user = await userController.getUserByPhoneNumber(phone);
        if (!user) {
          // return phone;

          return await userController.createUser({
            phoneNumber: phone,
            city: "no_city",
            confirmed: false,
            DOB: null,
            name: "no_name",
            source: `whatsapp-${groupName}`,
          });
        }
      })
    );

    return { createdUsersID };
  })
);

adminRouter.delete(
  "/from_group",
  useJWT(["admin"]),
  safeRequest(async (req) => {
    const { groupName, eventId } = V.validate(
      {
        groupName: V.string,
        eventId: V.string,
      },
      req.body
    );

    const origin = `${groupName}`;

    const { invited } = await eventsController.getEventById(eventId);

    const allUsers = await userController.getUsersByOrigin(origin);

    const userIdsToRemove = allUsers.map((user) => user.id);

    const updatedInvitedList = invited.filter(
      (id) => !userIdsToRemove.includes(id)
    );

    await eventsController.updateEvent(eventId, {
      invited: updatedInvitedList,
    });

    const result = await Promise.all(
      allUsers.map((user) => {
        return userController.hardDeleteUser(user.id);
      })
    );

    return {
      userIdsToRemove,
      updatedInvitedList,
    };
  })
);

adminRouter.post(
  "/send_to_group",
  useJWT(["admin"]),
  json(),
  safeRequest(async (req, res) => {
    const { groupName, eventId } = V.validate(
      {
        groupName: V.string,
        eventId: V.string,
      },
      req.body
    );

    const group: GroupChat | undefined = JSON.parse(
      fs.readFileSync("src/temp.json", { encoding: "utf-8" })
    );

    if (!group) {
      return transactionError(FAIL_REASONS.NOT_FOUND);
    }

    const event = await eventsController.getEventById(eventId);

    if (!event) {
      return transactionError(FAIL_REASONS.NOT_FOUND);
    }

    const allUsers = await userController.getUsersByOrigin(
      `whatsapp-${groupName}`
    );

    const phoneToUser = new Map<string, WithID<"user">>();
    for (const u of allUsers) {
      const nat = userPhoneToBrNational(u.phoneNumber);
      if (nat.length === 10 || nat.length === 11) {
        if (!phoneToUser.has(nat)) phoneToUser.set(nat, u);
      }
    }

    const invitedSet = new Set(event.invited ?? []);
    const toInvite: WithID<"user">[] = [];
    const seenUserIds = new Set<string>();

    for (const p of group.participants) {
      const nat = jidToBrNational(p.id);
      if (!nat) continue; // ignora JIDs fora do padrão BR
      const user = phoneToUser.get(nat);
      if (!user) continue; // participante não cadastrado no banco
      if (invitedSet.has(user.id)) continue; // já convidado
      if (seenUserIds.has(user.id)) continue; // evita duplicata no mesmo run

      toInvite.push(user);
      seenUserIds.add(user.id);
    }

    await eventsController.updateEvent(event.id, {
      invited: [...event.invited, ...toInvite.map((u) => u.id)],
    });

    const jidList = toInvite.map((u) => phoneToJid(u.phoneNumber));

    sendInviteToList(jidList, event.id, group.name);

    return {
      success: true,
      data: jidList,
    };
  })
);

adminRouter.get(
  "/group_list",
  useJWT(["admin"]),
  json(),
  safeRequest(async (req, res) => {
    const group: GroupChat[] = (
      await module.ask.boundary("iae-baileys", "all_groups")
    ).response;

    return group;
  })
);

export default adminRouter;
