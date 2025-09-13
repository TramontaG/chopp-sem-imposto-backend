"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRequestContext = void 0;
/**
 * Adds a context object to the request, so that middlewares can add data to the
 * context. This data can be retrieved later until the last request handler of the
 * express queue.
 * @param initialData
 * @returns
 */
const useRequestContext = initialData => {
  let context = {};
  const set = requestId => (key, value) => {
    context[requestId][key] = value;
  };
  const get = requestId => key => context[requestId][key];
  const middleware = (req, res, next) => {
    const requestId = crypto.randomUUID();
    context[requestId] = initialData;
    req.context = {
      _value: context[requestId],
      get: get(requestId),
      // Why is this type cast necessary? I have no idea
      set: set(requestId),
      clear: () => delete context[requestId]
    };
    next();
  };
  return middleware;
};
exports.useRequestContext = useRequestContext;
//# sourceMappingURL=requestContext.js.map