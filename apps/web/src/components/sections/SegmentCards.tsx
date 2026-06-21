import Link from "next/link";

const SEGMENTOS = [
  {
    href: "/energia-solar-residencial",
    titulo: "Energia solar residencial",
    descricao:
      "Para sua casa. Gere a própria energia, reduza boa parte da conta de luz e blinde seu orçamento dos reajustes anuais da Enel.",
    bullets: [
      "Economia na conta já no primeiro mês",
      "Valorização do imóvel",
      "Instalação limpa, sem quebra-quebra",
    ],
    cta: "Ver solução residencial",
  },
  {
    href: "/energia-solar-empresarial",
    titulo: "Energia solar empresarial",
    descricao:
      "Para comércios e indústrias. Corte um dos maiores custos fixos do negócio e transforme energia em previsibilidade financeira.",
    bullets: [
      "Redução do custo operacional",
      "Retorno previsível do investimento",
      "Marca mais sustentável aos olhos do cliente",
    ],
    cta: "Ver solução empresarial",
  },
  {
    href: "/contato",
    titulo: "Energia solar rural e agro",
    descricao:
      "Para sítios, fazendas e o agronegócio. Reduza o custo de irrigação, resfriamento e produção mesmo em áreas afastadas da rede.",
    bullets: [
      "Menos custo na operação no campo",
      "Sistema dimensionado para alto consumo",
      "Projeto e homologação por conta da TOCSOLAR",
    ],
    cta: "Falar sobre projeto rural",
  },
];

export function SegmentCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Solução sob medida para o seu perfil
        </h2>
        <p className="mt-3 text-brand-black/70">
          Cada projeto é dimensionado para o seu consumo. Escolha por onde começar:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SEGMENTOS.map((seg) => (
          <Link
            key={seg.href}
            href={seg.href}
            className="group flex flex-col rounded-2xl border border-brand-black/10 bg-white p-8 shadow-sm transition-colors hover:border-brand-orange/50"
          >
            <h3 className="text-xl font-bold">{seg.titulo}</h3>
            <p className="mt-2 text-brand-black/70">{seg.descricao}</p>

            <ul className="mt-5 space-y-2">
              {seg.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2 text-sm text-brand-black/80"
                >
                  <span className="text-brand-orange" aria-hidden>
                    ✓
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange">
              {seg.cta}
              <span
                className="transition-transform group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
