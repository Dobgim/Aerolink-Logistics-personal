import { Navbar } from "@/components/layout/navbar";
import { getSessionUser } from "@/lib/auth/session";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar user={session ? { name: session.name, role: session.role } : null} />
      <main id="main" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
