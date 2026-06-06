import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProjectBySlug,
  listProjects,
  listProjectsForAdmin,
  updateProject
} from "../controllers/projects.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { projectCreateSchema, projectUpdateSchema } from "../validations/schemas.js";

export const projectsRouter = Router();

projectsRouter.get("/", listProjects);
projectsRouter.get("/admin/all", requireAuth, listProjectsForAdmin);
projectsRouter.get("/:slug", getProjectBySlug);
projectsRouter.post("/", requireAuth, validateBody(projectCreateSchema), createProject);
projectsRouter.patch("/:id", requireAuth, validateBody(projectUpdateSchema), updateProject);
projectsRouter.delete("/:id", requireAuth, deleteProject);
