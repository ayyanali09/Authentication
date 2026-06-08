import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { Express } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "../config/env.js";

export function applySecurity(app: Express) {
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  
  const allowedOrigins = ["duron.media", "vercel.app"];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.some((allowed) => origin.includes(allowed))) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );
  
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: "draft-8",
      legacyHeaders: false
    })
  );
}
