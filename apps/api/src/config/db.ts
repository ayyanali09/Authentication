import mongoose from "mongoose";
import { env } from "./env.js";

let databaseMode: "mongo" | "local" = "mongo";

export function isLocalDatabase() {
  return databaseMode === "local";
}

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  try {
    console.log("Attempting to connect to MongoDB...");
    console.log(`MONGO_URI present: ${!!env.MONGO_URI}`);
    console.log(`Node environment: ${env.NODE_ENV}`);

    await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: env.NODE_ENV === "production" ? 30000 : 2000
    });

    console.log("✓ MongoDB connected successfully");
    databaseMode = "mongo";
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("✗ MongoDB connection failed:", {
      error: errorMessage,
      mongoUri: env.MONGO_URI ? "configured" : "MISSING",
      nodeEnv: env.NODE_ENV,
      stack: error instanceof Error ? error.stack : undefined
    });

    if (env.NODE_ENV === "production") {
      console.error("FATAL: Cannot start in production without MongoDB connection");
      throw error;
    }

    databaseMode = "local";
    console.warn("⚠ MongoDB unavailable. Using local JSON storage for development.");
  }
}

export async function disconnectDatabase() {
  if (databaseMode === "mongo") {
    await mongoose.disconnect();
  }
}
