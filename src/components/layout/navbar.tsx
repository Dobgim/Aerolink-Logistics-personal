"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutDashboard, LogIn, LogOut, Menu, Package, PhoneCall, Search, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { NAV_LINKS, SITE } from "@/lib/constants/site";
import { Logo } from "./logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { EASE } from "@/components/ui/motion";

export interface NavbarUser {
  name: string;
  role: "admin" | "customer";
}

export function Navbar({ user }: { user: NavbarUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes. Storing the previous path in
  // state and adjusting during render is React's documented alternative to an
  // effect here — an effect would paint once with the menu still open.
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow duration-300",
          scrolled ? "border-ink-200 shadow-[0_4px_20px_-12px_rgb(11_14_20/0.35)]" : "border-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-[85rem] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-4"
        >
          <Logo className="mr-auto lg:mr-6" />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-10 items-center rounded-lg px-3.5 text-[0.9375rem] font-semibold transition-colors",
                    isActive(link.href)
                      ? "text-brand-800"
                      : "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
                  )}
                >
                  {link.label}
                  {isActive(link.href) ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand-700"
                      transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto hidden items-center gap-2.5 lg:flex">
            {user ? (
              <>
                <span className="hidden max-w-40 items-center gap-2 truncate rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink-700 xl:inline-flex">
                  <UserRound aria-hidden className="size-4 shrink-0 text-ink-400" />
                  <span className="truncate">{user.name}</span>
                </span>
                {user.role === "admin" ? (
                  <ButtonLink
                    href="/admin"
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    icon={<LayoutDashboard className="size-4" />}
                  >
                    Dashboard
                  </ButtonLink>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  loading={signingOut}
                  className="whitespace-nowrap"
                  icon={<LogOut className="size-4" />}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <ButtonLink
                href="/login"
                variant="ghost"
                size="sm"
                className="whitespace-nowrap"
                icon={<LogIn className="size-4" />}
              >
                Login
              </ButtonLink>
            )}
            <ButtonLink
              href="/shipping"
              variant="primary"
              size="sm"
              className="whitespace-nowrap"
              icon={<Package className="size-4" />}
            >
              Ship Now
            </ButtonLink>
          </div>

          <Link
            href="/tracking"
            className="inline-flex size-10 items-center justify-center rounded-lg text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
            aria-label="Track a shipment"
          >
            <Search aria-hidden className="size-5" />
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="size-10 p-0 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </Button>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              id="mobile-menu"
              key="mobile-menu"
              initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="overflow-hidden border-t border-ink-200 bg-white lg:hidden"
            >
              <div className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto px-4 pb-6 pt-3 sm:px-6">
                <ul className="flex flex-col">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={reduce ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduce ? 0 : 0.05 + i * 0.04, duration: 0.3, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        aria-current={isActive(link.href) ? "page" : undefined}
                        className={cn(
                          "flex min-h-13 items-center justify-between rounded-xl px-3 text-base font-semibold transition-colors",
                          isActive(link.href)
                            ? "bg-brand-50 text-brand-800"
                            : "text-ink-800 active:bg-ink-100",
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-col gap-2.5 border-t border-ink-200 pt-4">
                  <ButtonLink href="/tracking" variant="primary" size="lg" className="w-full">
                    Track Your Shipment
                  </ButtonLink>
                  {user ? (
                    <>
                      <p className="px-1 text-sm font-semibold text-ink-600">
                        Signed in as {user.name}
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {user.role === "admin" ? (
                          <ButtonLink href="/admin" variant="outline" size="md">
                            Dashboard
                          </ButtonLink>
                        ) : (
                          <ButtonLink href="/shipping" variant="outline" size="md">
                            Ship Now
                          </ButtonLink>
                        )}
                        <Button
                          variant="outline"
                          size="md"
                          onClick={signOut}
                          loading={signingOut}
                        >
                          Sign out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      <ButtonLink href="/login" variant="outline" size="md">
                        Login
                      </ButtonLink>
                      <ButtonLink href="/shipping" variant="outline" size="md">
                        Ship Now
                      </ButtonLink>
                    </div>
                  )}
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="mt-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-semibold text-ink-600"
                  >
                    <PhoneCall aria-hidden className="size-4" />
                    {SITE.phone}
                  </a>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
