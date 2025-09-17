import { getDownloadURL, getStorage } from "firebase-admin/storage";
import firebase from "../Firebase";

export const bucket = getStorage(firebase).bucket(process.env.FIREBASE_BUCKET);

export const uploadToBucket = async (
  fileName: string,
  fileAsBuffer: Buffer
) => {
  await bucket.file(fileName).save(fileAsBuffer);
  return getFileUrl(fileName);
};

export const getFileUrl = async (fileName: string) => {
  const fileRef = await bucket.file(fileName);
  return getDownloadURL(fileRef);
};

export const downloadFile = async (fileName: string): Promise<Buffer> => {
  const fileRef = await bucket.file(fileName);
  return new Promise((resolve, reject) => {
    fileRef.download({}, (err, content) => {
      if (err) {
        reject(err);
      }
      resolve(content);
    });
  });
};
