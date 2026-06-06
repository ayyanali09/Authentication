import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type JwtRole = "admin" | "editor";

export type JwtUserPayload = {
  sub: string;
  email: string;
  role: JwtRole;
};

export function signToken(payload: JwtUserPayload) {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
}
