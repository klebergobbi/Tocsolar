import { FAQ_ITEMS, getFaqPageSchema } from "@/lib/schema";

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <script
        type="application/ld+json"
        // JSON-LD FAQPage — usa a mesma fonte (FAQ_ITEMS) do conteúdo visível.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqPageSchema()) }}
      />

      <h2 className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Perguntas frequentes
      </h2>

      <div className="divide-y divide-brand-black/10 border-y border-brand-black/10">
        {FAQ_ITEMS.map((item) => (
          <details key={item.pergunta} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {item.pergunta}
              <span
                className="text-brand-orange transition-transform group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-brand-black/70">{item.resposta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
