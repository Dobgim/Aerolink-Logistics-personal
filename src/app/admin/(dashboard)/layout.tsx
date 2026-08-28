import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { backendName, listSupportRequests } from "@/lib/data/repository";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: { default: "Admin", template: "%s | Royal Prime Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side gate. Every admin page renders only after this passes, and each
  // admin API route repeats the check independently.
  const user = await requireRole("admin");
  if (!user) redirect("/admin/login");

  const support = await listSupportRequests();
  const openSupportCount = support.filter(
    (r) => r.status === "open" || r.status === "in_progress",
  ).length;

  return (
    <AdminShell
      user={{ name: user.name, email: user.email }}
      backend={backendName()}
      openSupportCount={openSupportCount}
    >
      {children}
    </AdminShell>
  );
}
