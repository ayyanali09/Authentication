import type { RequestHandler } from "express";
import { HttpError } from "../utils/http.js";
import { verifyToken } from "../utils/token.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Authentication token is required"));
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = verifyToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired authentication token"));
  }
};
