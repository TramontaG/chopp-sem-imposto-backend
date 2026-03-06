import { getDownloadURL, getStorage } from "firebase-admin/storage";
import firebase from "../Firebase";

export const bucket = getStorage(firebase).bucket(process.env.FIREBASE_BUCKET);

const normalizeBucketFolder = (folderPath: string) =>
  folderPath.replace(/^\/+|\/+$/g, "");

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

export const listFilesInBucketFolder = async (folderPath: string) => {
  const normalizedFolder = normalizeBucketFolder(folderPath);
  const prefix = `${normalizedFolder}/`;
  const [files] = await bucket.getFiles({
    prefix,
  });

  return files
    .map((file) => file.name)
    .filter((fileName) => {
      if (fileName === prefix) {
        return false;
      }

      const relativePath = fileName.slice(prefix.length);
      return relativePath.length > 0 && !relativePath.includes("/");
    })
    .sort((left, right) => left.localeCompare(right));
};
