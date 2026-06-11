import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function CTASection() {
  return (
    <section className="bg-brand-orange">
      <div className="mx-auto max-w-4xl px-6 py-16 text-center text-brand-black">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Comece a economizar na conta de luz
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-brand-black/80">
          Simule sua economia em segundos ou fale agora com a nossa equipe.
          Orçamento gratuito e sem compromisso.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/simulador"
            className="w-full rounded-lg bg-brand-black px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            Simular minha economia
          </Link>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-lg border border-brand-black/30 px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black/5 sm:w-auto"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
