import type { NextRequest } from "next/server";
import { updateSupportStatus } from "@/lib/data/repository";
import { supportStatusSchema } from "@/lib/validations/schemas";
import { handle, isResponse, notFound, ok, requireAdmin } from "@/lib/api/respond";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return handle(async () => {
    const auth = await requireAdmin();
    if (isResponse(auth)) return auth.response;

    const { id } = await params;
    const body = await request.json();
    const status = supportStatusSchema.parse(body.status);

    const updated = await updateSupportStatus(id, status);
    if (!updated) return notFound("Support request not found");

    return ok({ request: updated });
  });
}
