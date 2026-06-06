import type { JwtRole } from "../utils/token.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: JwtRole;
      };
    }
  }
}

export {};
