import { ProjectModel } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError, sendSuccess } from "../utils/http.js";
import { slugify } from "../utils/slugify.js";

async function createUniqueProjectSlug(source: string) {
  const baseSlug = slugify(source);
  const exists = await ProjectModel.exists({ slug: baseSlug });
  return exists ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;
}

export const listProjects = asyncHandler(async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const filter = {
    published: true,
    ...(category && category !== "All" ? { category } : {})
  };

  const projects = await ProjectModel.find(filter)
    .sort({ featured: -1, createdAt: -1 })
    .lean();

  return sendSuccess(res, projects);
});

export const listProjectsForAdmin = asyncHandler(async (_req, res) => {
  const projects = await ProjectModel.find().sort({ createdAt: -1 }).lean();
  return sendSuccess(res, projects);
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findOne({
    slug: req.params.slug,
    published: true
  }).lean();

  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  return sendSuccess(res, project);
});

export const createProject = asyncHandler(async (req, res) => {
  const body = req.body;
  const project = await ProjectModel.create({
    ...body,
    slug: await createUniqueProjectSlug(body.slug ?? body.title)
  });

  return sendSuccess(res, project, 201, "Project created");
});

export const updateProject = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  if (body.slug || body.title) {
    body.slug = await createUniqueProjectSlug(body.slug ?? body.title);
  }

  const project = await ProjectModel.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true
  });

  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  return sendSuccess(res, project, 200, "Project updated");
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findByIdAndDelete(req.params.id);

  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  return sendSuccess(res, { id: req.params.id }, 200, "Project deleted");
});
