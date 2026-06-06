import { Router } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  listTestimonialsForAdmin,
  updateTestimonial
} from "../controllers/testimonials.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  testimonialCreateSchema,
  testimonialUpdateSchema
} from "../validations/schemas.js";

export const testimonialsRouter = Router();

testimonialsRouter.get("/", listTestimonials);
testimonialsRouter.get("/admin/all", requireAuth, listTestimonialsForAdmin);
testimonialsRouter.post(
  "/",
  requireAuth,
  validateBody(testimonialCreateSchema),
  createTestimonial
);
testimonialsRouter.patch(
  "/:id",
  requireAuth,
  validateBody(testimonialUpdateSchema),
  updateTestimonial
);
testimonialsRouter.delete("/:id", requireAuth, deleteTestimonial);
