import Router, { json } from "express";
import { useHMAC } from "../JWT/verifyHMAC";
import { safeRequest } from "../Util/SafeRequest";
import * as V from "../Util/ZodValidation";
import suggestionController from "../database/controllers/suggestionsController";
import { safeReturnTransaction } from "../Util/SafeDatabaseTransaction";

const MiscRouter = Router();

MiscRouter.post(
  "/suggestion",
  useHMAC,
  json(),
  safeRequest(async (req, res) => {
    const { name, suggestion } = V.validate(
      {
        name: V.string,
        suggestion: V.string,
      },
      req.body
    );

    const createSuggestionTransaction =
      await suggestionController.createSuggestion(name, suggestion);

    return safeReturnTransaction(createSuggestionTransaction);
  })
);

export default MiscRouter;
