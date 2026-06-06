import { Router } from "express";
import { analyticsRouter } from "./analytics.routes.js";
import { authRouter } from "./auth.routes.js";
import { blogRouter } from "./blog.routes.js";
import { contactRouter } from "./contact.routes.js";
import { financeRouter } from "./finance.routes.js";
import { projectsRouter } from "./projects.routes.js";
import { testimonialsRouter } from "./testimonials.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/blog", blogRouter);
apiRouter.use("/testimonials", testimonialsRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/finance", financeRouter);
apiRouter.use("/analytics", analyticsRouter);
