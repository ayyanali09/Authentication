import { NextRequest } from "next/server";
import { FinanceEntryModel, json, normalizeDocumentId, requireUser, unavailable } from "@/lib/server/api";
import { parseFinancePayload } from "../route";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
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
    const entry = await FinanceEntryModel.findByIdAndUpdate(
      await getId(context),
      parsed.payload,
      { new: true, runValidators: true }
    ).lean();

    if (!entry) {
      return json({ success: false, message: "Finance row not found.", data: null }, 404);
    }

    return json({ success: true, message: "Finance row saved.", data: normalizeDocumentId(entry) });
  } catch {
    return unavailable();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireUser(request);

  if ("response" in auth) {
    return auth.response;
  }

  try {
    const id = await getId(context);
    const entry = await FinanceEntryModel.findByIdAndDelete(id).lean();

    if (!entry) {
      return json({ success: false, message: "Finance row not found.", data: null }, 404);
    }

    return json({ success: true, message: "Finance row deleted.", data: { id } });
  } catch {
    return unavailable();
  }
}
