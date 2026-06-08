import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import {
  connectMongo,
  ensureInitialAdmin,
  json,
  setupErrorMessage,
  signAdminToken,
  unavailable,
  UserModel,
  userPayload
} from "@/lib/server/api";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: "Invalid JSON body.", data: null }, 400);
  }

  const input = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!email || !password) {
    return json({ success: false, message: "Email and password are required.", data: null }, 400);
  }

  if (!process.env.MONGO_URI) {
    return unavailable("MONGO_URI is not configured on the backend.");
  }

  if (!process.env.JWT_SECRET) {
    return unavailable("JWT_SECRET is not configured on the backend.");
  }

  try {
    await connectMongo();
    await ensureInitialAdmin();

    const user = await UserModel.findOne({ email }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return json({ success: false, message: "Invalid email or password.", data: null }, 401);
    }

    return json({
      success: true,
      message: "Signed in.",
      data: {
        token: signAdminToken(user),
        user: userPayload(user)
      }
    });
  } catch (error) {
    console.error("Admin login setup failed:", error);
    return unavailable(setupErrorMessage(error, "Admin login is not configured yet."));
  }
}
