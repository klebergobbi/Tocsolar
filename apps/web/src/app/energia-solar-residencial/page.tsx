import type { Metadata } from "next";
import Link from "next/link";
import { SolarSimulator } from "@/components/lead/SolarSimulator";
import { HowItWorks } from "@/components/sections/HowItWorks";

export const metadata: Metadata = {
  title: "Energia Solar Residencial em Fortaleza — Economize na conta de luz",
  description:
    "Instale energia solar na sua casa em Fortaleza/CE e reduza a conta de luz. Projeto, instalação e homologação com equipe própria. Simule sua economia grátis.",
  alternates: { canonical: "/energia-solar-residencial" },
};

const BENEFICIOS = [
  {
    titulo: "Economia todo mês",
    descricao:
      "Gere sua própria energia e reduza boa parte da conta de luz da sua casa.",
  },
  {
    titulo: "Valoriza o imóvel",
    descricao:
      "Casas com energia solar são mais procuradas e ganham valor de revenda.",
  },
  {
    titulo: "Proteção contra reajustes",
    descricao:
      "Menos exposição aos aumentos anuais da tarifa da Enel no seu orçamento.",
  },
];

export default function EnergiaSolarResidencialPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-orange/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-orange" aria-hidden />
              Energia solar para sua casa
            </span>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Sua casa gerando a própria energia e{" "}
              <span className="text-brand-orange">economizando todo mês</span>.
            </h1>
            <p className="max-w-xl text-lg text-white/70">
              Em Fortaleza e Região Metropolitana, instalamos seu sistema solar
              do projeto à homologação — com equipe própria e estimativa
              transparente.
            </p>
            <Link
              href="#simular"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
            >
              Simular minha economia
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {BENEFICIOS.map((b) => (
            <div
              key={b.titulo}
              className="rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold">{b.titulo}</h2>
              <p className="mt-2 text-sm text-brand-black/70">{b.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="simular" className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 max-w-2xl space-y-3">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quanto você economiza na sua casa?
          </h2>
          <p className="text-brand-black/70">
            Simule com o valor da sua conta e peça o orçamento detalhado.
          </p>
        </div>
        <SolarSimulator />
      </section>

      <HowItWorks />
    </main>
  );
}
