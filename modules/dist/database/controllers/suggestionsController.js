"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ = _interopRequireDefault(require(".."));
var _SafeDatabaseTransaction = require("../../Util/SafeDatabaseTransaction");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const suggestionDb = (0, _.default)("suggestion");
const suggestionController = () => {
  const createSuggestion = async (name, body) => {
    const id = crypto.randomUUID();
    await suggestionDb.upsertEntity(id, {
      id,
      author: name,
      body: body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null
    });
    return (0, _SafeDatabaseTransaction.transactionSuccess)({
      id,
      body
    });
  };
  const getSuggestion = id => {
    return suggestionDb.readEntity(id);
  };
  const updateSuggestion = (id, name, body) => {
    suggestionDb.upsertEntity(id, {
      id,
      author: name,
      body: body,
      updatedAt: Date.now()
    });
  };
  const deleteSuggestion = id => {
    suggestionDb.upsertEntity(id, {
      id,
      deletedAt: Date.now()
    });
  };
  return {
    createSuggestion,
    getSuggestion,
    updateSuggestion,
    deleteSuggestion
  };
};
var _default = exports.default = suggestionController();
//# sourceMappingURL=suggestionsController.js.map