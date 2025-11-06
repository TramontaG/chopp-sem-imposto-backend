import DbManager from "..";
import { transactionSuccess } from "../../Util/SafeDatabaseTransaction";

const suggestionDb = DbManager("suggestion");

const suggestionController = () => {
  const createSuggestion = async (name: string, body: string) => {
    const id = crypto.randomUUID();
    await suggestionDb.upsertEntity(id, {
      id,
      author: name,
      body: body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null,
    });

    return transactionSuccess({ id, body });
  };

  const getSuggestion = (id: string) => {
    return suggestionDb.readEntity(id);
  };

  const updateSuggestion = (id: string, name: string, body: string) => {
    suggestionDb.upsertEntity(id, {
      id,
      author: name,
      body: body,
      updatedAt: Date.now(),
    });
  };

  const deleteSuggestion = (id: string) => {
    suggestionDb.upsertEntity(id, {
      id,
      deletedAt: Date.now(),
    });
  };

  return {
    createSuggestion,
    getSuggestion,
    updateSuggestion,
    deleteSuggestion,
  };
};

export default suggestionController();
