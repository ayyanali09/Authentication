import { NextRequest } from "next/server";
import { ContactMessageModel, json, normalizeDocumentId, requireUser, unavailable } from "@/lib/server/api";

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

  const status = (body && typeof body === "object" ? (body as { status?: unknown }).status : undefined);

  if (!["new", "read", "archived"].includes(String(status))) {
    return json(
      {
        success: false,
        message: "Validation failed.",
        data: null,
        errors: [{ path: "status", message: "Select a valid status." }]
      },
      400
    );
  }

  try {
    const message = await ContactMessageModel.findByIdAndUpdate(
      await getId(context),
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!message) {
      return json({ success: false, message: "Contact message not found.", data: null }, 404);
    }

    return json({
      success: true,
      message: "Contact message updated.",
      data: normalizeDocumentId(message)
    });
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
    const message = await ContactMessageModel.findByIdAndDelete(id).lean();

    if (!message) {
      return json({ success: false, message: "Contact message not found.", data: null }, 404);
    }

    return json({ success: true, message: "Contact message deleted.", data: { id } });
  } catch {
    return unavailable();
  }
}
