import type { RequestHandler } from "express";
import type { z } from "zod";
import { HttpError } from "../utils/http.js";

export function validateBody<T extends z.ZodType>(schema: T): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new HttpError(
          400,
          "Validation failed",
          result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message
          }))
        )
      );
    }

    req.body = result.data;
    return next();
  };
}
