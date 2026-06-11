import type { Metadata } from "next";
import { ProjectsGallery } from "@/components/sections/ProjectsGallery";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Projetos de energia solar no Ceará — TOCSOLAR",
  description:
    "Conheça projetos de energia solar instalados pela TOCSOLAR em Fortaleza/CE e região: residências, comércios e propriedades rurais com equipe própria, do projeto à homologação na Enel.",
  alternates: { canonical: "/projetos" },
};

const PROVAS = [
  { numero: "Equipe própria", texto: "Do projeto à instalação e homologação." },
  { numero: "Ceará", texto: "Fortaleza e Região Metropolitana." },
  { numero: "Turnkey", texto: "Você não se preocupa com nada do processo." },
];

export default function ProjetosPage() {
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
              Projetos de{" "}
              <span className="text-brand-orange">energia solar</span> no Ceará
            </h1>
            <p className="max-w-xl text-lg text-white/70">
              Cada telhado é um projeto sob medida. Veja os tipos de instalação
              que a nossa equipe entrega — e simule o seu.
            </p>
          </div>

          <dl className="mt-12 grid gap-6 sm:grid-cols-3">
            {PROVAS.map((prova) => (
              <div
                key={prova.numero}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <dt className="text-lg font-bold text-brand-orange">
                  {prova.numero}
                </dt>
                <dd className="mt-1 text-sm text-white/70">{prova.texto}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ProjectsGallery />
      <CTASection />
    </main>
  );
}
