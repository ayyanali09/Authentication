import { PROJECT_CATEGORIES, SERVICES } from "@vantanova/shared";
import { z } from "zod";

const metricSchema = z.object({
  label: z.string().min(1).max(80),
  value: z.string().min(1).max(40)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const projectCreateSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).optional(),
  category: z.enum(PROJECT_CATEGORIES),
  summary: z.string().min(20).max(500),
  client: z.string().min(2).max(120),
  year: z.string().min(4).max(12),
  coverImage: z.string().min(1).default("/images/project-neon-retail.png"),
  heroImage: z.string().optional(),
  tags: z.array(z.string().min(1).max(40)).default([]),
  services: z.array(z.enum(SERVICES)).default([]),
  metrics: z.array(metricSchema).default([]),
  challenge: z.string().min(20),
  solution: z.string().min(20),
  results: z.array(z.string().min(2)).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true)
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const blogCreateSchema = z.object({
  title: z.string().min(2).max(140),
  slug: z.string().min(2).max(160).optional(),
  excerpt: z.string().min(20).max(500),
  content: z.string().min(40),
  coverImage: z.string().min(1).default("/images/blog-growth-systems.png"),
  author: z.string().min(2).max(80),
  category: z.string().min(2).max(80),
  tags: z.array(z.string().min(1).max(40)).default([]),
  readTime: z.string().min(3).max(30).default("5 min read"),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.coerce.date().optional()
});

export const blogUpdateSchema = blogCreateSchema.partial();

export const testimonialCreateSchema = z.object({
  clientName: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  quote: z.string().min(20).max(700),
  rating: z.number().min(1).max(5).default(5),
  avatarImage: z.string().optional(),
  featured: z.boolean().default(true)
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();

export const contactCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  service: z.enum(SERVICES),
  budget: z.string().trim().min(1).max(80).optional(),
  message: z.string().min(20).max(2000)
});

export const contactStatusSchema = z.object({
  status: z.enum(["new", "read", "archived"])
});

export const financeCreateSchema = z.object({
  date: z.coerce.date(),
  type: z.enum(["income", "expense"]),
  category: z.string().trim().min(1).max(80),
  description: z.string().trim().min(2).max(180),
  client: z.string().trim().max(120).optional(),
  amount: z.coerce.number().positive().max(100000000),
  paymentMethod: z.string().trim().max(80).optional(),
  status: z.enum(["paid", "pending", "overdue"]).default("pending"),
  notes: z.string().trim().max(1000).optional()
});

export const financeUpdateSchema = financeCreateSchema.partial();
