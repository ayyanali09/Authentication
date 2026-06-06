import { Schema, model } from "mongoose";

export type BlogStatus = "draft" | "published";

export type BlogPostDocument = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  status: BlogStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const blogPostSchema = new Schema<BlogPostDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    readTime: { type: String, required: true, default: "5 min read" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

blogPostSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });

export const BlogPostModel = model<BlogPostDocument>("BlogPost", blogPostSchema);
