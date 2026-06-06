import { Router } from "express";
import {
  createFinanceEntry,
  deleteFinanceEntry,
  listFinanceEntries,
  updateFinanceEntry
} from "../controllers/finance.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { financeCreateSchema, financeUpdateSchema } from "../validations/schemas.js";

export const financeRouter = Router();

financeRouter.use(requireAuth);
financeRouter.get("/", listFinanceEntries);
financeRouter.post("/", validateBody(financeCreateSchema), createFinanceEntry);
financeRouter.patch("/:id", validateBody(financeUpdateSchema), updateFinanceEntry);
financeRouter.delete("/:id", deleteFinanceEntry);
