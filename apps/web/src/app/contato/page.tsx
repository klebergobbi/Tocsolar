import type { Metadata } from "next";
import { LeadForm } from "@/components/lead/LeadForm";

export const metadata: Metadata = {
  title: "Contato — Peça seu orçamento de energia solar",
  description:
    "Fale com a TOCSOLAR. Preencha o formulário ou chame no WhatsApp e receba um orçamento de energia solar sem compromisso.",
};

export default function ContatoPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Peça seu orçamento
          </h1>
          <p className="text-brand-black/70">
            Conte um pouco sobre seu consumo e nossa equipe prepara uma proposta
            de energia solar com economia real. Atendemos Fortaleza/CE e Região
            Metropolitana.
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
          {/* Mapa do Google (GBP) entra em sessão de SEO/tracking. */}
        </div>

        <LeadForm />
      </div>
    </main>
  );
}
