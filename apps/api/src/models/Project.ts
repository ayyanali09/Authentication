import { Schema, model } from "mongoose";
import { PROJECT_CATEGORIES, SERVICES } from "@vantanova/shared";

export type ProjectDocument = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  client: string;
  year: string;
  coverImage: string;
  heroImage?: string;
  tags: string[];
  services: string[];
  metrics: Array<{ label: string; value: string }>;
  challenge: string;
  solution: string;
  results: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const metricSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const projectSchema = new Schema<ProjectDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    category: { type: String, enum: PROJECT_CATEGORIES, required: true },
    summary: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true },
    heroImage: { type: String },
    tags: [{ type: String, trim: true }],
    services: [{ type: String, enum: SERVICES }],
    metrics: [metricSchema],
    challenge: { type: String, required: true },
    solution: { type: String, required: true },
    results: [{ type: String }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

projectSchema.index({ title: "text", summary: "text", tags: "text" });

export const ProjectModel = model<ProjectDocument>("Project", projectSchema);
