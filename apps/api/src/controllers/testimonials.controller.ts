import { TestimonialModel } from "../models/Testimonial.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError, sendSuccess } from "../utils/http.js";

export const listTestimonials = asyncHandler(async (_req, res) => {
  const testimonials = await TestimonialModel.find({ featured: true })
    .sort({ createdAt: -1 })
    .lean();

  return sendSuccess(res, testimonials);
});

export const listTestimonialsForAdmin = asyncHandler(async (_req, res) => {
  const testimonials = await TestimonialModel.find().sort({ createdAt: -1 }).lean();
  return sendSuccess(res, testimonials);
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await TestimonialModel.create(req.body);
  return sendSuccess(res, testimonial, 201, "Testimonial created");
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await TestimonialModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!testimonial) {
    throw new HttpError(404, "Testimonial not found");
  }

  return sendSuccess(res, testimonial, 200, "Testimonial updated");
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await TestimonialModel.findByIdAndDelete(req.params.id);

  if (!testimonial) {
    throw new HttpError(404, "Testimonial not found");
  }

  return sendSuccess(res, { id: req.params.id }, 200, "Testimonial deleted");
});
