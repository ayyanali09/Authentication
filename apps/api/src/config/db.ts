import mongoose from "mongoose";
import { env } from "./env.js";

let databaseMode: "mongo" | "local" = "mongo";

export function isLocalDatabase() {
  return databaseMode === "local";
}

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: env.NODE_ENV === "production" ? 30000 : 2000
    });
    databaseMode = "mongo";
  } catch (error) {
    if (env.NODE_ENV === "production") {
      throw error;
    }

    databaseMode = "local";
    console.warn("MongoDB is unavailable. Using local JSON storage for development.");
  }
}

export async function disconnectDatabase() {
  if (databaseMode === "mongo") {
    await mongoose.disconnect();
  }
}
