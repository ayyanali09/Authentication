import bcrypt from "bcryptjs";
import { isLocalDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import { UserModel } from "../models/User.js";
import { ensureLocalAdmin } from "./localStore.js";

export async function ensureInitialAdmin() {
  if (!env.BOOTSTRAP_ADMIN_ON_START) {
    return;
  }

  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12);

  if (isLocalDatabase()) {
    const user = await ensureLocalAdmin({
      name: env.SEED_ADMIN_NAME,
      email: env.SEED_ADMIN_EMAIL,
      passwordHash
    });

    console.log(`Initial admin ready: ${user.email}`);
    return;
  }

  const existingUsers = await UserModel.estimatedDocumentCount();

  if (existingUsers > 0) {
    return;
  }

  await UserModel.create({
    name: env.SEED_ADMIN_NAME,
    email: env.SEED_ADMIN_EMAIL,
    passwordHash,
    role: "admin"
  });

  console.log(`Initial admin created: ${env.SEED_ADMIN_EMAIL}`);
}
