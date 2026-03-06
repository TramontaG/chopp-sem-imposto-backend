import type { RequestHandler } from "express";

export const noCache: RequestHandler = (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};
