import { SERVICES, type ContactPayload } from "@vantanova/shared";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanOptional,
  connectMongo,
  ContactMessageModel,
  json,
  normalizeDocumentId,
  requireUser,
  setupErrorMessage,
  unavailable
} from "@/lib/server/api";

export const runtime = "nodejs";

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

function getForwardApiBase(request: NextRequest) {
  const value = process.env.CONTACT_FORWARD_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!value) {
    // In development, default to the local Express API so the frontend can forward
    if (process.env.NODE_ENV !== "production") {
      return "http://localhost:4000/api/v1";
    }

    return null;
  }

  const trimmedValue = value.trim().replace(/\/$/, "");

  if (
    trimmedValue.startsWith("/") ||
    /localhost|127\.0\.0\.1/i.test(trimmedValue) ||
    trimmedValue.includes("your-backend-domain")
  ) {
    return null;
  }

  try {
    const parsed = new URL(trimmedValue);
    const currentProto = request.headers.get("x-forwarded-proto") ?? "https";
    const currentHost = request.headers.get("host");

    if (currentHost && `${parsed.protocol}//${parsed.host}` === `${currentProto}://${currentHost}`) {
      return null;
    }

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

async function forwardToBackend(payload: ContactPayload, request: NextRequest) {
  const base = getForwardApiBase(request);

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

    return await response.json();
  } catch {
    return null;
  }
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

  const forwarded = await forwardToBackend(parsed.payload, request);

  if (forwarded?.success) {
    return json(forwarded, 201);
  }

  if (!process.env.MONGO_URI) {
    return unavailable("MONGO_URI is not configured on the backend.");
  }

  try {
    await connectMongo();

    const message = await ContactMessageModel.create({
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
  } catch (error) {
    console.error("Contact route error:", error);
    
    // Attempt to save directly without the inbox configuration check
    try {
      const message = await ContactMessageModel.create({
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
    } catch (fallbackError) {
      console.error("DATABASE_SAVE_ERROR:", {
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        stack: fallbackError instanceof Error ? fallbackError.stack : undefined,
        payload: parsed.payload
      });
      return unavailable("Failed to save contact message. Please try again later.");
    }
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);

  if ("response" in auth) {
    return auth.response;
  }

  try {
    const messages = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
    return json({ success: true, message: "OK", data: messages.map(normalizeDocumentId) });
  } catch {
    return unavailable();
  }
}
