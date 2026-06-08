import express from "express";
import { apiRouter } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";
import { applySecurity } from "./middleware/security.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  applySecurity(app);


    // app.set("trust proxy", 1); ke neeche ya applySecurity(app); ke neeche ye paste karein:
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    // OPTIONS request (Preflight) ko foran response dene ke liye:
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });


  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ success: true, status: "ok" });
  });

  app.use("/api/v1", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
