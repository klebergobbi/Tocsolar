import type { Metadata } from "next";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Sobre a TOCSOLAR — Energia solar em Fortaleza/CE",
  description:
    "Conheça a TOCSOLAR Energia Solar: equipe própria, milhares de projetos no Ceará e atendimento turnkey, do orçamento à homologação em Fortaleza e região.",
  alternates: { canonical: "/sobre" },
};

const DIFERENCIAIS = [
  {
    titulo: "Equipe própria",
    descricao:
      "Do projeto à instalação e homologação, com uma equipe que responde por todo o processo — sem terceirizar a qualidade.",
  },
  {
    titulo: "Experiência no Ceará",
    descricao:
      "Milhares de projetos entregues na região, com soluções dimensionadas para o clima e a tarifa locais.",
  },
  {
    titulo: "Transparência",
    descricao:
      "Estimativas conservadoras e orçamento claro: preferimos prometer menos e entregar o que combinamos.",
  },
];

export default function SobrePage() {
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
              Energia solar de quem{" "}
              <span className="text-brand-orange">entende do Ceará</span>
            </h1>
            <p className="max-w-xl text-lg text-white/70">
              A TOCSOLAR é uma instaladora turnkey de energia solar em
              Fortaleza/CE. Cuidamos de tudo: orçamento, projeto, equipamentos,
              instalação e homologação.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="space-y-5 text-brand-black/70">
          <h2 className="text-3xl font-bold tracking-tight text-brand-black sm:text-4xl">
            Quem somos
          </h2>
          <p>
            {/* <<CONFIRMAR história, ano de fundação e números reais>> */}
            Nascemos para tornar a energia solar acessível e descomplicada para
            famílias e empresas do Ceará. Acreditamos que economizar na conta de
            luz não deveria ser um bicho de sete cabeças — por isso assumimos
            cada etapa, da primeira simulação à conexão na rede.
          </p>
          <p>
            Nosso compromisso é com a economia real: dimensionamos cada sistema
            com cuidado e trabalhamos com estimativas honestas, para que o
            retorno prometido seja o retorno entregue.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {DIFERENCIAIS.map((d) => (
            <div
              key={d.titulo}
              className="rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold">{d.titulo}</h3>
              <p className="mt-2 text-sm text-brand-black/70">{d.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </main>
  );
}
