import { Router } from "express";
import { login, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema } from "../validations/schemas.js";

export const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/me", requireAuth, me);
