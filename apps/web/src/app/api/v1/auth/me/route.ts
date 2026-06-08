import { NextRequest } from "next/server";
import { json, requireUser, userPayload } from "@/lib/server/api";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await requireUser(request);

  if ("response" in auth) {
    return auth.response;
  }

  return json({
    success: true,
    message: "OK",
    data: userPayload(auth.user)
  });
}
