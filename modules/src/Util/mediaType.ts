import mime from "mime-types";

const IMAGE_FILE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
  "bmp",
  "svg",
  "heic",
  "heif",
]);

const VIDEO_FILE_EXTENSIONS = new Set([
  "mp4",
  "m4v",
  "mov",
  "webm",
  "avi",
  "mkv",
  "mpeg",
  "mpg",
  "ogv",
  "3gp",
]);

const getFileExtension = (filePath: string) => {
  const sanitizedPath = filePath.split("?")[0].split("#")[0];
  const extension = sanitizedPath.split(".").pop();

  return extension ? extension.toLowerCase() : "";
};

export const getEventMediaType = (
  filePath: string
): "image" | "video" | "unknown" => {
  const fileMimeType = mime.lookup(filePath);

  if (typeof fileMimeType === "string") {
    if (fileMimeType.startsWith("image/")) {
      return "image";
    }

    if (fileMimeType.startsWith("video/")) {
      return "video";
    }
  }

  const extension = getFileExtension(filePath);

  if (IMAGE_FILE_EXTENSIONS.has(extension)) {
    return "image";
  }

  if (VIDEO_FILE_EXTENSIONS.has(extension)) {
    return "video";
  }

  return "unknown";
};

export const isEventMediaFile = (filePath: string) =>
  getEventMediaType(filePath) !== "unknown";
