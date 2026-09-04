"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Database,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MapPin,
  Menu,
  Package,
  Radio,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { EASE } from "@/components/ui/motion";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";

const NAV: { label: string; href: string; Icon: LucideIcon; exact?: boolean }[] = [
  { label: "Overview", href: "/admin", Icon: LayoutDashboard, exact: true },
  { label: "Shipments", href: "/admin/shipments", Icon: Package },
  { label: "Tracking Events", href: "/admin/events", Icon: Radio },
  { label: "Customers", href: "/admin/customers", Icon: Users },
  { label: "Locations", href: "/admin/locations", Icon: MapPin },
  { label: "Support Requests", href: "/admin/support", Icon: LifeBuoy },
  { label: "Settings", href: "/admin/settings", Icon: Settings },
];

interface Props {
  children: ReactNode;
  user: { name: string; email: string };
  backend: "supabase" | "local";
  openSupportCount: number;
}

export function AdminShell({ children, user, backend, openSupportCount }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Close the drawer on navigation without painting it open first.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Signed out");
      router.push("/admin/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const navList = (
    <ul className="space-y-1">
      {NAV.map(({ label, href, Icon, exact }) => (
        <li key={href}>
          <Link
            href={href}
            aria-current={isActive(href, exact) ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors",
              isActive(href, exact)
                ? "bg-brand-600 text-white"
                : "text-ink-300 hover:bg-white/8 hover:text-white",
            )}
          >
            <Icon aria-hidden className="size-4.5 shrink-0" />
            <span className="flex-1">{label}</span>
            {href === "/admin/support" && openSupportCount > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent-500 px-1.5 text-[0.6875rem] font-bold text-white">
                {openSupportCount}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );

  const backendNote = (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-400">
        <Database aria-hidden className="size-3" />
        Data source
      </p>
      <p className="mt-1.5 text-xs font-semibold text-white">
        {backend === "supabase" ? "Supabase (live)" : "Local store"}
      </p>
      {backend === "local" ? (
        <p className="mt-1 text-[0.6875rem] leading-relaxed text-ink-400">
          Writes persist for this server process. Add Supabase credentials to switch to the real
          database.
        </p>
      ) : null}
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/10 bg-ink-950 p-4 lg:flex">
        <Logo tone="light" href="/admin" />

        <nav aria-label="Admin" className="mt-8 flex-1">
          {navList}
        </nav>

        <div className="space-y-3">
          {backendNote}
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-xs font-semibold text-ink-400 transition-colors hover:bg-white/8 hover:text-white"
          >
            ← Back to public site
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-60 bg-ink-950/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.aside
              id="admin-menu"
              className="fixed inset-y-0 left-0 z-70 flex w-[17rem] max-w-[85vw] flex-col overflow-y-auto bg-ink-950 p-4 lg:hidden"
              initial={reduce ? { opacity: 0 } : { x: "-100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <Logo tone="light" href="/admin" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 text-ink-400 hover:bg-white/8 hover:text-white"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>

              <nav aria-label="Admin" className="mt-8 flex-1">
                {navList}
              </nav>

              <div className="mt-6 space-y-3">
                {backendNote}
                <Link
                  href="/"
                  className="block rounded-lg px-3 py-2 text-xs font-semibold text-ink-400 hover:bg-white/8 hover:text-white"
                >
                  ← Back to public site
                </Link>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Button
              variant="ghost"
              size="sm"
              className="size-10 p-0 lg:hidden"
              aria-expanded={open}
              aria-controls="admin-menu"
              aria-label="Open admin menu"
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden className="size-5" />
            </Button>

            <p className="min-w-0 flex-1 truncate text-sm font-bold text-ink-900">
              {NAV.find((n) => isActive(n.href, n.exact))?.label ?? "Admin"}
            </p>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-ink-900">{user.name}</p>
              <p className="text-xs text-ink-500">{user.email}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              loading={signingOut}
              icon={<LogOut aria-hidden className="size-4" />}
            >
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        <main id="main" className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
