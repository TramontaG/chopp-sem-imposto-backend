import { Router } from "express";
import { downloadFile } from "../CDN/bucketStorage";
import mime from "mime-types";

const publicRouter = Router();

publicRouter.get("/:src/:event/:file", async (req, res) => {
  const fileId = `${req.params.src}/${req.params.event}/${req.params.file}`;
  const file = await downloadFile(fileId);

  res
    .setHeader(
      "Content-Type",
      mime.lookup(req.params.file) || "application/octet-steam"
    )
    .send(file);

  return undefined;
});

export default publicRouter;
