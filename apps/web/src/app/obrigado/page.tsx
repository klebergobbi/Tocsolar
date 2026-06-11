"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { trackLeadFormSubmit, trackSimulatorComplete } from "@/lib/analytics";

/**
 * Dispara o evento de conversão (GA4 + Google Ads via GTM) conforme a origem.
 * useSearchParams precisa estar dentro de <Suspense> para o prerender estático.
 */
function ConversionTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const origem = searchParams.get("origem");
    const tipo = searchParams.get("tipo") ?? undefined;
    if (origem === "simulador") {
      trackSimulatorComplete({ tipo });
    } else {
      trackLeadFormSubmit({ tipo });
    }
  }, [searchParams]);

  return null;
}

export default function ObrigadoPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-24 text-center">
      <Suspense fallback={null}>
        <ConversionTracker />
      </Suspense>

      <span className="inline-block h-3 w-3 rounded-full bg-brand-orange" aria-hidden />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Recebemos seu pedido de orçamento!
      </h1>
      <p className="max-w-md text-brand-black/70">
        Nossa equipe vai entrar em contato pelo WhatsApp em breve para confirmar
        os detalhes e preparar sua proposta de energia solar.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
      >
        Voltar para a página inicial
      </Link>
    </main>
  );
}
