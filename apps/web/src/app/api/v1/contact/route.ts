import { SERVICES, type ContactPayload } from "@vantanova/shared";
import mongoose, { Schema } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactStatus = "new" | "read" | "archived";

type ContactMessageDocument = {
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

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ path: string; message: string }>;
};

let mongoConnection: Promise<typeof mongoose> | null = null;

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

const ContactMessage =
  (mongoose.models.ContactMessage as mongoose.Model<ContactMessageDocument> | undefined) ??
  mongoose.model<ContactMessageDocument>("ContactMessage", contactMessageSchema);

function json<T>(payload: ApiResponse<T>, status = 200) {
  return NextResponse.json(payload, { status });
}

function cleanOptional(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseContactPayload(body: unknown) {
  const errors: Array<{ path: string; message: string }> = [];
  const input = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const service = typeof input.service === "string" ? input.service.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const company = cleanOptional(input.company);
  const budget = cleanOptional(input.budget);

  if (name.length < 2) {
    errors.push({ path: "name", message: "Name must be at least 2 characters." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ path: "email", message: "Enter a valid email address." });
  }

  if (!SERVICES.includes(service as ContactPayload["service"])) {
    errors.push({ path: "service", message: "Select a valid service." });
  }

  if (message.length < 20) {
    errors.push({ path: "message", message: "Message must be at least 20 characters." });
  }

  if (budget && budget.length > 80) {
    errors.push({ path: "budget", message: "Budget must be 80 characters or fewer." });
  }

  if (errors.length) {
    return { errors };
  }

  return {
    payload: {
      name,
      email,
      company,
      service: service as ContactPayload["service"],
      budget,
      message
    } satisfies ContactPayload
  };
}

function getForwardApiBase() {
  const value = process.env.CONTACT_FORWARD_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!value) {
    return null;
  }

  const base = value.replace(/\/$/, "");

  if (
    base.startsWith("/") ||
    /localhost|127\.0\.0\.1/i.test(base) ||
    base.includes("your-backend-domain")
  ) {
    return null;
  }

  return base;
}

async function forwardToBackend(payload: ContactPayload) {
  const base = getForwardApiBase();

  if (!base) {
    return null;
  }

  try {
    const response = await fetch(`${base}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ApiResponse<{ id: string; status: string }>;
  } catch {
    return null;
  }
}

async function connectMongo() {
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

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: "Invalid JSON body.", data: null }, 400);
  }

  const parsed = parseContactPayload(body);

  if ("errors" in parsed) {
    return json(
      {
        success: false,
        message: "Validation failed.",
        data: null,
        errors: parsed.errors
      },
      400
    );
  }

  const forwarded = await forwardToBackend(parsed.payload);

  if (forwarded?.success) {
    return json(forwarded, 201);
  }

  try {
    await connectMongo();

    const message = await ContactMessage.create({
      ...parsed.payload,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
      userAgent: request.headers.get("user-agent") ?? undefined
    });

    return json(
      {
        success: true,
        message: "Message received",
        data: {
          id: message.id,
          status: message.status
        }
      },
      201
    );
  } catch {
    return json(
      {
        success: false,
        message: "Inquiry inbox is not configured yet. Please try again shortly.",
        data: null
      },
      503
    );
  }
}
