import type { NextRequest } from "next/server";
import { createSupportRequest, listSupportRequests } from "@/lib/data/repository";
import { supportRequestSchema } from "@/lib/validations/schemas";
import { handle, isResponse, ok, requireAdmin } from "@/lib/api/respond";
import type { SupportStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handle(async () => {
    const auth = await requireAdmin();
    if (isResponse(auth)) return auth.response;

    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") as SupportStatus | "all") ?? "all";
    return ok({ requests: await listSupportRequests(status) });
  });
}

/** Public contact form endpoint. */
export async function POST(request: NextRequest) {
  return handle(async () => {
    const body = await request.json();
    const input = supportRequestSchema.parse(body);

    const created = await createSupportRequest({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      tracking_number: input.tracking_number ?? null,
      subject: input.subject,
      message: input.message,
    });

    return ok({ request: { id: created.id, status: created.status } }, 201);
  });
}
