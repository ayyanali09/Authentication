import { Schema, model } from "mongoose";

export type TestimonialDocument = {
  clientName: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarImage?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const testimonialSchema = new Schema<TestimonialDocument>(
  {
    clientName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    quote: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatarImage: { type: String },
    featured: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const TestimonialModel = model<TestimonialDocument>(
  "Testimonial",
  testimonialSchema
);
