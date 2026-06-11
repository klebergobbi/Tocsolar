import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const NAV_LINKS = [
  { href: "/energia-solar-residencial", label: "Residencial" },
  { href: "/energia-solar-empresarial", label: "Empresarial" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/projetos", label: "Projetos" },
  { href: "/simulador", label: "Simulador" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
          aria-label="TOCSOLAR — página inicial"
        >
          <span className="inline-block h-3 w-3 rounded-full bg-brand-orange" aria-hidden />
          TOCSOLAR
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-brand-black/70 transition-colors hover:text-brand-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
        >
          Pedir orçamento
        </a>
      </div>
    </header>
  );
}
