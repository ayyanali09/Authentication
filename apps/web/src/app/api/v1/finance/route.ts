import { NextRequest } from "next/server";
import {
  cleanOptional,
  FinanceEntryModel,
  type FinanceEntryStatus,
  type FinanceEntryType,
  json,
  normalizeDocumentId,
  requireUser,
  unavailable
} from "@/lib/server/api";

export const runtime = "nodejs";

function parseFinancePayload(body: unknown) {
  const errors: Array<{ path: string; message: string }> = [];
  const input = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const date = typeof input.date === "string" ? input.date : "";
  const type = typeof input.type === "string" ? input.type : "";
  const category = typeof input.category === "string" ? input.category.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const amount = Number(input.amount);
  const status = typeof input.status === "string" ? input.status : "pending";

  if (!date || Number.isNaN(Date.parse(date))) {
    errors.push({ path: "date", message: "Enter a valid date." });
  }

  if (!["income", "expense"].includes(type)) {
    errors.push({ path: "type", message: "Select a valid type." });
  }

  if (!category) {
    errors.push({ path: "category", message: "Category is required." });
  }

  if (!description) {
    errors.push({ path: "description", message: "Description is required." });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push({ path: "amount", message: "Amount must be greater than 0." });
  }

  if (!["paid", "pending", "overdue"].includes(status)) {
    errors.push({ path: "status", message: "Select a valid status." });
  }

  if (errors.length) {
    return { errors };
  }

  return {
    payload: {
      date: new Date(date),
      type: type as FinanceEntryType,
      category,
      description,
      client: cleanOptional(input.client),
      amount,
      paymentMethod: cleanOptional(input.paymentMethod),
      status: status as FinanceEntryStatus,
      notes: cleanOptional(input.notes)
    }
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);

  if ("response" in auth) {
    return auth.response;
  }

  try {
    const entries = await FinanceEntryModel.find().sort({ date: -1, createdAt: -1 }).lean();
    return json({ success: true, message: "OK", data: entries.map(normalizeDocumentId) });
  } catch {
    return unavailable();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireUser(request);

  if ("response" in auth) {
    return auth.response;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: "Invalid JSON body.", data: null }, 400);
  }

  const parsed = parseFinancePayload(body);

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

  try {
    const entry = await FinanceEntryModel.create(parsed.payload);
    return json({ success: true, message: "Finance row saved.", data: normalizeDocumentId(entry.toObject()) }, 201);
  } catch {
    return unavailable();
  }
}

export { parseFinancePayload };
