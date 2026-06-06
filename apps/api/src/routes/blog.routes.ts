import { Router } from "express";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostBySlug,
  listBlogPosts,
  listBlogPostsForAdmin,
  updateBlogPost
} from "../controllers/blog.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { blogCreateSchema, blogUpdateSchema } from "../validations/schemas.js";

export const blogRouter = Router();

blogRouter.get("/", listBlogPosts);
blogRouter.get("/admin/all", requireAuth, listBlogPostsForAdmin);
blogRouter.get("/:slug", getBlogPostBySlug);
blogRouter.post("/", requireAuth, validateBody(blogCreateSchema), createBlogPost);
blogRouter.patch("/:id", requireAuth, validateBody(blogUpdateSchema), updateBlogPost);
blogRouter.delete("/:id", requireAuth, deleteBlogPost);
