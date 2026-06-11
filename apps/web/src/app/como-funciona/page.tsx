import type { Metadata } from "next";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FAQ } from "@/components/sections/FAQ";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Como funciona a energia solar — TOCSOLAR",
  description:
    "Entenda como funciona a energia solar: do simulador ao orçamento, instalação e economia na conta de luz. Sistema conectado à rede, com compensação de energia.",
  alternates: { canonical: "/como-funciona" },
};

const PONTOS = [
  {
    titulo: "Geração durante o dia",
    descricao:
      "Os painéis convertem a luz do sol em energia elétrica que abastece o seu imóvel em tempo real.",
  },
  {
    titulo: "Crédito do excedente",
    descricao:
      "O que você gera a mais é injetado na rede e vira crédito de energia para usar depois — inclusive à noite.",
  },
  {
    titulo: "Conta menor todo mês",
    descricao:
      "Você passa a pagar essencialmente o custo mínimo da concessionária, e o sistema se paga ao longo do tempo.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-orange/30 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Como funciona a{" "}
              <span className="text-brand-orange">energia solar</span>
            </h1>
            <p className="max-w-xl text-lg text-white/70">
              Simples e transparente: você gera a própria energia, reduz a conta
              de luz e conta com a nossa equipe do início ao fim.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            O sistema conectado à rede, em 3 ideias
          </h2>
          <p className="mt-3 text-brand-black/70">
            Não precisa de bateria para economizar: a própria rede da Enel guarda
            seu crédito de energia.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PONTOS.map((p) => (
            <div
              key={p.titulo}
              className="rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold">{p.titulo}</h3>
              <p className="mt-2 text-sm text-brand-black/70">{p.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <HowItWorks />
      <FAQ />
      <CTASection />
    </main>
  );
}
