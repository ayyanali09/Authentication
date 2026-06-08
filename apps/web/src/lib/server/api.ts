import dns from "node:dns/promises";
import { SERVICES } from "@vantanova/shared";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import mongoose, { Schema, type Model } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export type ContactStatus = "new" | "read" | "archived";
export type UserRole = "admin" | "editor";
export type FinanceEntryType = "income" | "expense";
export type FinanceEntryStatus = "paid" | "pending" | "overdue";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ path: string; message: string }>;
};

export type UserDocument = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactMessageDocument = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  message: string;
  status: ContactStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FinanceEntryDocument = {
  _id: mongoose.Types.ObjectId;
  date: Date;
  type: FinanceEntryType;
  category: string;
  description: string;
  client?: string;
  amount: number;
  paymentMethod?: string;
  status: FinanceEntryStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

let mongoConnection: Promise<typeof mongoose> | null = null;

const userSchema =
  mongoose.models.User?.schema ??
  new Schema<UserDocument>(
    {
      name: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
      },
      passwordHash: { type: String, required: true, select: false },
      role: {
        type: String,
        enum: ["admin", "editor"],
        default: "admin"
      }
    },
    { timestamps: true }
  );

const contactMessageSchema =
  mongoose.models.ContactMessage?.schema ??
  new Schema<ContactMessageDocument>(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true, index: true },
      company: { type: String, trim: true },
      service: { type: String, enum: SERVICES, required: true },
      budget: { type: String, trim: true, maxlength: 80 },
      message: { type: String, required: true, trim: true },
      status: {
        type: String,
        enum: ["new", "read", "archived"],
        default: "new",
        index: true
      },
      ipAddress: { type: String },
      userAgent: { type: String }
    },
    { timestamps: true }
  );

const financeEntrySchema =
  mongoose.models.FinanceEntry?.schema ??
  new Schema<FinanceEntryDocument>(
    {
      date: { type: Date, required: true, index: true },
      type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
        index: true
      },
      category: { type: String, required: true, trim: true, maxlength: 80 },
      description: { type: String, required: true, trim: true, maxlength: 180 },
      client: { type: String, trim: true, maxlength: 120 },
      amount: { type: Number, required: true, min: 0.01 },
      paymentMethod: { type: String, trim: true, maxlength: 80 },
      status: {
        type: String,
        enum: ["paid", "pending", "overdue"],
        default: "pending",
        index: true
      },
      notes: { type: String, trim: true, maxlength: 1000 }
    },
    { timestamps: true }
  );

financeEntrySchema.index({ description: "text", category: "text", client: "text" });

export const UserModel =
  (mongoose.models.User as Model<UserDocument> | undefined) ??
  mongoose.model<UserDocument>("User", userSchema);

export const ContactMessageModel =
  (mongoose.models.ContactMessage as Model<ContactMessageDocument> | undefined) ??
  mongoose.model<ContactMessageDocument>("ContactMessage", contactMessageSchema);

export const FinanceEntryModel =
  (mongoose.models.FinanceEntry as Model<FinanceEntryDocument> | undefined) ??
  mongoose.model<FinanceEntryDocument>("FinanceEntry", financeEntrySchema);

export function json<T>(payload: ApiResponse<T>, status = 200) {
  return NextResponse.json(payload, { status });
}

export function unavailable(message = "Production database is not configured yet.") {
  return json({ success: false, message, data: null }, 503);
}

export function setupErrorMessage(error: unknown, fallback = "Production database is not configured yet.") {
  if (error instanceof Error) {
    if (error.message.includes("MONGO_URI")) {
      return "Configuration missing: MONGO_URI.";
    }

    if (error.message.includes("JWT_SECRET")) {
      return "Configuration missing: JWT_SECRET.";
    }

    return `${fallback} (${error.name})`;
  }

  return fallback;
}

export async function connectMongo() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not configured.");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  mongoConnection ??= mongoose.connect(uri, {
    bufferCommands: false
  });

  await mongoConnection;
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32 || /replace-with|your-|change-this/i.test(secret)) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

export function signAdminToken(user: Pick<UserDocument, "_id" | "email" | "role">) {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"]
  };

  return jwt.sign(
    {
      email: user.email,
      role: user.role
    },
    getJwtSecret(),
    {
      ...options,
      subject: String(user._id)
    }
  );
}

export function userPayload(user: Pick<UserDocument, "_id" | "name" | "email" | "role">) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function getAuthenticatedUser(request: NextRequest) {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

    if (!payload.sub) {
      return null;
    }

    await connectMongo();
    return await UserModel.findById(payload.sub).lean();
  } catch {
    return null;
  }
}

export async function requireUser(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return {
      response: json({ success: false, message: "Invalid or expired authentication token.", data: null }, 401)
    };
  }

  return { user };
}

export async function ensureInitialAdmin() {
  if (process.env.BOOTSTRAP_ADMIN_ON_START === "false") {
    return;
  }

  const existingUsers = await UserModel.estimatedDocumentCount();

  if (existingUsers > 0) {
    return;
  }

  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "DURON Admin";

  if (!email || !password || password.length < 12) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await UserModel.create({
    name,
    email,
    passwordHash,
    role: "admin"
  });
}

export function normalizeDocumentId<T extends { _id?: unknown; id?: unknown }>(document: T) {
  return {
    ...document,
    id: String(document._id ?? document.id ?? "")
  };
}

export function cleanOptional(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}
