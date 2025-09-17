import type { RequestHandler } from "express";

export {};

type RequestContext = {
  userId: string;
};

declare global {
  namespace Express {
    export interface Request {
      context: {
        _value: Record<string, any>;
        set: <Key extends keyof RequestContext>(
          key: Key,
          value: RequestContext[Key]
        ) => void;
        get: <Key extends keyof RequestContext>(
          key: Key
        ) => RequestContext[Key];
        clear: () => void;
      };
    }
  }
}
/**
 * Adds a context object to the request, so that middlewares can add data to the
 * context. This data can be retrieved later until the last request handler of the
 * express queue.
 * @param initialData
 * @returns
 */
export const useRequestContext = <Context extends Record<string, any>>(
  initialData: Context
) => {
  let context: Record<string, Context> = {};

  const set =
    (requestId: string) =>
    <Key extends keyof Context>(key: Key, value: Context[Key]) => {
      context[requestId][key] = value;
    };

  const get = (requestId: string) => (key: keyof Context) =>
    context[requestId][key];

  const middleware: RequestHandler = (req, res, next) => {
    const requestId = crypto.randomUUID();
    context[requestId] = initialData;
    req.context = {
      _value: context[requestId],
      get: get(requestId),
      // Why is this type cast necessary? I have no idea
      set: set(requestId) as Context["set"],
      clear: () => delete context[requestId],
    };

    next();
  };

  return middleware;
};
