import { Mail, PhoneCall, Users } from "lucide-react";
import { Badge, Card } from "@/components/ui/primitives";
import { listCustomers, listShipments } from "@/lib/data/repository";
import { formatDate } from "@/lib/utils/format";

export const metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const [users, { rows: shipments }] = await Promise.all([
    listCustomers(),
    listShipments({ limit: 1000 }),
  ]);

  const shipmentCount = (email: string) =>
    shipments.filter(
      (s) =>
        s.sender_email?.toLowerCase() === email.toLowerCase() ||
        s.receiver_email?.toLowerCase() === email.toLowerCase(),
    ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">Customers</h1>
        <p className="mt-1.5 text-sm text-ink-600">
          {users.length} {users.length === 1 ? "account" : "accounts"} registered with FreightCargoXpress.
        </p>
      </div>

      {users.length === 0 ? (
        <Card className="py-16 text-center">
          <Users aria-hidden className="mx-auto size-10 text-ink-300" />
          <h2 className="mt-4 text-lg font-bold text-ink-900">No customers yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
            Accounts appear here as soon as someone registers on the public site.
          </p>
        </Card>
      ) : (
        <>
          <Card padded={false} className="hidden overflow-hidden lg:block">
            <div className="scroll-x">
              <table className="w-full min-w-[48rem] border-collapse text-left">
                <caption className="sr-only">Registered customers and their shipment counts</caption>
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50">
                    {["Name", "Email", "Phone", "Role", "Shipments", "Joined"].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-ink-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200">
                  {users.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-ink-50">
                      <td className="px-5 py-4 text-sm font-semibold text-ink-900">{user.name}</td>
                      <td className="px-5 py-4">
                        <a
                          href={`mailto:${user.email}`}
                          className="text-sm text-brand-700 hover:underline"
                        >
                          {user.email}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-sm text-ink-700">{user.phone ?? "—"}</td>
                      <td className="px-5 py-4">
                        <Badge tone={user.role === "admin" ? "brand" : "neutral"}>
                          {user.role === "admin" ? "Administrator" : "Customer"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-ink-900">
                        {shipmentCount(user.email)}
                      </td>
                      <td className="px-5 py-4 text-sm text-ink-700">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <ul className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {users.map((user) => (
              <li key={user.id}>
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-bold text-ink-900">{user.name}</h2>
                    <Badge tone={user.role === "admin" ? "brand" : "neutral"}>
                      {user.role === "admin" ? "Admin" : "Customer"}
                    </Badge>
                  </div>

                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Mail aria-hidden className="mt-0.5 size-3.5 shrink-0 text-ink-400" />
                      <a
                        href={`mailto:${user.email}`}
                        className="break-all text-brand-700 hover:underline"
                      >
                        {user.email}
                      </a>
                    </li>
                    {user.phone ? (
                      <li className="flex items-start gap-2">
                        <PhoneCall aria-hidden className="mt-0.5 size-3.5 shrink-0 text-ink-400" />
                        <span className="text-ink-700">{user.phone}</span>
                      </li>
                    ) : null}
                  </ul>

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-200 pt-3 text-xs">
                    <div>
                      <dt className="font-semibold text-ink-500">Shipments</dt>
                      <dd className="mt-0.5 font-bold text-ink-900">{shipmentCount(user.email)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink-500">Joined</dt>
                      <dd className="mt-0.5 font-bold text-ink-900">
                        {formatDate(user.created_at)}
                      </dd>
                    </div>
                  </dl>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
