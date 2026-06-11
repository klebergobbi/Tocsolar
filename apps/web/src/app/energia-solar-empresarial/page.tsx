import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/lead/LeadForm";
import { HowItWorks } from "@/components/sections/HowItWorks";

export const metadata: Metadata = {
  title: "Energia Solar para Empresas em Fortaleza — Reduza custos de energia",
  description:
    "Energia solar empresarial em Fortaleza/CE: corte um dos maiores custos fixos do seu negócio com retorno previsível. Projeto e instalação com equipe própria. Peça um orçamento.",
  alternates: { canonical: "/energia-solar-empresarial" },
};

const BENEFICIOS = [
  {
    titulo: "Reduz custo operacional",
    descricao:
      "A energia é um dos maiores custos fixos. Gerar a própria libera caixa todo mês.",
  },
  {
    titulo: "Retorno previsível",
    descricao:
      "Investimento com payback estimável e vida útil longa — previsibilidade financeira.",
  },
  {
    titulo: "Imagem sustentável",
    descricao:
      "Energia limpa fortalece a marca junto a clientes, parceiros e critérios ESG.",
  },
];

export default function EnergiaSolarEmpresarialPage() {
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
              Energia solar para empresas
            </span>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Corte o custo de energia do seu negócio e{" "}
              <span className="text-brand-orange">ganhe previsibilidade</span>.
            </h1>
            <p className="max-w-xl text-lg text-white/70">
              Para empresas em Fortaleza e região: dimensionamos seu sistema
              solar conforme o consumo, com projeto, instalação e homologação por
              equipe própria.
            </p>
            <Link
              href="#orcamento"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
            >
              Pedir orçamento empresarial
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

      <section id="orcamento" className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Solicite um orçamento para sua empresa
            </h2>
            <p className="text-brand-black/70">
              Conte sobre o consumo do seu negócio e nossa equipe prepara uma
              proposta com a estimativa de economia e retorno.
            </p>
            <p className="text-brand-black/70">
              Prefere falar agora? Chame no{" "}
              <a
                href="https://wa.me/5585991618044"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-black underline"
              >
                WhatsApp (85) 99161-8044
              </a>
              .
            </p>
          </div>
          <LeadForm defaultTipo="empresarial" />
        </div>
      </section>

      <HowItWorks />
    </main>
  );
}
