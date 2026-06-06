import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";

dotenv.config();

const durationPattern =
  /^\d+(?:\s?(?:milliseconds?|msecs?|msec|ms|seconds?|secs?|sec|s|minutes?|mins?|min|m|hours?|hrs?|hr|h|days?|day|d|weeks?|week|w|years?|yrs?|yr|y))?$/i;

const jwtExpiresInSchema = z
  .string()
  .trim()
  .regex(durationPattern, "JWT_EXPIRES_IN must be a valid duration such as 7d, 12h, or 3600")
  .default("7d") as z.ZodType<NonNullable<SignOptions["expiresIn"]>>;

const booleanStringSchema = z
  .enum(["true", "false"])
  .default("true")
  .transform((value) => value === "true");

const defaultJwtSecret = "replace-with-a-strong-64-character-secret-for-production";
const defaultClientUrl = "http://localhost:3000";
const defaultAdminPassword = "DuronAdmin!2026#Secure";

function isPlaceholder(value: string) {
  return /replace-with|change-this|your-|<|>/i.test(value);
}

function isLocalMongoUri(value: string) {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("localhost") ||
    normalized.includes("127.0.0.1") ||
    normalized.includes("mongo:27017")
  );
}

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: jwtExpiresInSchema,
    CLIENT_URL: z.string().url().default(defaultClientUrl),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
    BOOTSTRAP_ADMIN_ON_START: booleanStringSchema,
    SEED_ADMIN_NAME: z.string().default("DURON Admin"),
    SEED_ADMIN_EMAIL: z.string().email().default("admin@duron.media"),
    SEED_ADMIN_PASSWORD: z.string().min(12).default(defaultAdminPassword)
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV !== "production") {
      return;
    }

    if (
      !/^mongodb(?:\+srv)?:\/\//i.test(value.MONGO_URI) ||
      isPlaceholder(value.MONGO_URI) ||
      isLocalMongoUri(value.MONGO_URI)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["MONGO_URI"],
        message: "MONGO_URI must be a real deployed MongoDB or MongoDB Atlas connection string"
      });
    }

    if (
      value.JWT_SECRET === defaultJwtSecret ||
      isPlaceholder(value.JWT_SECRET) ||
      value.JWT_SECRET.length < 64
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["JWT_SECRET"],
        message: "JWT_SECRET must be a unique production secret with at least 64 characters"
      });
    }

    if (
      value.CLIENT_URL === defaultClientUrl ||
      value.CLIENT_URL.includes("localhost") ||
      isPlaceholder(value.CLIENT_URL)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["CLIENT_URL"],
        message: "CLIENT_URL must be your deployed frontend URL in production"
      });
    }

    if (
      value.BOOTSTRAP_ADMIN_ON_START &&
      (value.SEED_ADMIN_PASSWORD === defaultAdminPassword ||
        isPlaceholder(value.SEED_ADMIN_PASSWORD))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["SEED_ADMIN_PASSWORD"],
        message: "SEED_ADMIN_PASSWORD must be changed before production bootstrap"
      });
    }
  });

export const env = envSchema.parse(process.env);
