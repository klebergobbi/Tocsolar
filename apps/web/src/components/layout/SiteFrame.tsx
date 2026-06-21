"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

/**
 * Envolve o conteúdo do site. Na área administrativa (/admin) NÃO renderiza o
 * chrome de marketing (Header/Footer/WhatsApp) — o /admin tem layout próprio.
 */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
