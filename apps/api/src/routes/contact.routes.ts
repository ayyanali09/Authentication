import { Router } from "express";
import {
  createContactMessage,
  deleteContactMessage,
  listContactMessages,
  updateContactMessage
} from "../controllers/contact.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { contactCreateSchema, contactStatusSchema } from "../validations/schemas.js";

export const contactRouter = Router();

contactRouter.post("/", validateBody(contactCreateSchema), createContactMessage);
contactRouter.get("/", requireAuth, listContactMessages);
contactRouter.patch("/:id", requireAuth, validateBody(contactStatusSchema), updateContactMessage);
contactRouter.delete("/:id", requireAuth, deleteContactMessage);
