import { Router } from "express";
import { getAnalyticsOverview } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const analyticsRouter = Router();

analyticsRouter.get("/overview", requireAuth, getAnalyticsOverview);
