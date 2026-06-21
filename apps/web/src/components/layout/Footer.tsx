import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/energia-solar-residencial", label: "Energia Solar Residencial" },
  { href: "/energia-solar-empresarial", label: "Energia Solar Empresarial" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/projetos", label: "Projetos" },
  { href: "/simulador", label: "Simulador de economia" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-brand-black/10 bg-brand-black text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="inline-block h-3 w-3 rounded-full bg-brand-orange" aria-hidden />
            TOCSOLAR Energia Solar
          </div>
          <p className="text-sm">
            Energia solar que realmente economiza. Do orçamento à instalação,
            em Fortaleza/CE e Região Metropolitana.
          </p>
          <p className="text-sm">
            {/* <<CONFIRMAR endereço exato>> */}
            Fortaleza/CE
          </p>
        </div>

        <nav className="space-y-2 text-sm" aria-label="Rodapé">
          <h3 className="font-semibold text-white">Navegação</h3>
          <ul className="space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold text-white">Contato</h3>
          <p>
            WhatsApp:{" "}
            <a
              href="https://wa.me/5585991618044"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              (85) 99161-8044
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a
              href="https://instagram.com/tocsolar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              @tocsolar
            </a>
          </p>
          <p>
            <Link href="/privacidade" className="hover:text-white">
              Política de Privacidade (LGPD)
            </Link>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/50">
        Desenvolvido por{" "}
        <a
          href="https://www.lumentechsolutions.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white/70 hover:text-white"
        >
          Lumentech Solutions
        </a>
      </div>
    </footer>
  );
}
