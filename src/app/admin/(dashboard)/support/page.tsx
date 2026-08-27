import { SupportQueue } from "@/components/admin/support-queue";
import { listSupportRequests } from "@/lib/data/repository";

export const metadata = { title: "Support Requests" };
export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const requests = await listSupportRequests();
  const open = requests.filter((r) => r.status === "open").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">Support requests</h1>
        <p className="mt-1.5 text-sm text-ink-600">
          {requests.length} total · {open} waiting for a first reply.
        </p>
      </div>

      <SupportQueue requests={requests} />
    </div>
  );
}
