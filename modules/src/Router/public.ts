import { Router } from "express";
import { safeRequest } from "../Util/SafeRequest";
import { downloadFile } from "../CDN/bucketStorage";
import mime from "mime-types";

const publicRouter = Router();

publicRouter.get(
  "/:src/:event/:file",
  safeRequest(async (req, res) => {
    const fileId = `${req.params.src}/${req.params.event}/${req.params.file}`;
    const file = await downloadFile(fileId);

    return (
      res
        .setHeader(
          "Content-Type",
          mime.lookup(req.params.file) || "application/octet-steam"
        )
        // avoids cacheing the result on cloudflare reverse proxy
        .setHeader("X-Content-Type-Options", "nosniff")
        .send(file)
    );
  })
);

export default publicRouter;
