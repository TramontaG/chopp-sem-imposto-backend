import jwt, { type Algorithm } from "jsonwebtoken";
import fs from "fs";
import adminsController from "../database/controllers/adminsController";
import { json, type RequestHandler } from "express";
import cookieParser from "cookie-parser";
import {
  isTransactionSuccessful,
  safeReturnTransaction,
} from "../Util/SafeDatabaseTransaction";

const privateKEY =
  process.env.PRIVATE_KEY ?? fs.readFileSync("./keys/privatekey.pem", "utf8");
const publicKEY =
  process.env.PUBLIC_KEY ?? fs.readFileSync("./keys/publickey.pem", "utf8");

if (!privateKEY || !publicKEY) {
  throw 'You need the necessary keys to run this API. Please run the script located at "./scrips/generate_key_pair.sh".';
}

const algorithm: Algorithm = "RS512";

const signOptions = {
  algorithm,
};

const verifyOptions = {
  algorithms: [algorithm],
};

type JWTCredentials = {
  userId: string;
  username: string;
};

export const generateJwt = (credentials: JWTCredentials) => {
  return jwt.sign(
    {
      ...credentials,
      seed: Math.random().toString(),
    },
    privateKEY,
    signOptions
  );
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, publicKEY, verifyOptions) as JWTCredentials;
};

export const checkJWT = async (jwt: string, permissions: string[]) => {
  try {
    const { userId, username } = verifyJwt(jwt);

    const adminDataTransaction = await adminsController.getAdmin(userId);
    if (!isTransactionSuccessful(adminDataTransaction)) {
      return false;
    }

    const adminData = adminDataTransaction.data;

    const hasAllPerms =
      arraysContainAllElements(adminData.permissions, permissions) ||
      adminData.permissions.includes("*");

    if (hasAllPerms) {
      return {
        userId,
        username,
      };
    } else {
      return false;
    }
  } catch (e) {
    console.warn(e);
    return false;
  }
};

export const arraysContainAllElements = <T>(A: T[], B: T[]): boolean => {
  return B.every((element) => A.includes(element));
};

export const useJWT = (permissions: string[] = []): RequestHandler[] => {
  const jwtMiddleware: RequestHandler = async (req, res, next) => {
    const jwt: string =
      req.headers.authorization ||
      req.body.jwt ||
      req.params.jwt ||
      req.cookies.jwt;
    if (!jwt) {
      return res.status(401).send({
        errorType: "Transaction",
        message: "Please login to continue",
      });
    }

    const jwtResult = await checkJWT(jwt, permissions);

    if (jwtResult) {
      req.context.set("userId", jwtResult.userId);

      const newJwt = generateJwt(jwtResult);

      res.cookie("jwt", newJwt, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "none",
        secure: true,
      });

      return next();
    } else {
      res.status(403).send({
        errorType: "Transaction",
        message: "Not authorized",
      });
    }
  };

  return [cookieParser(), json(), jwtMiddleware];
};
