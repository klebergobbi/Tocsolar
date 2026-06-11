/**
 * Depoimentos (prova social).
 *
 * DADOS FICTÍCIOS — <<SUBSTITUIR antes de produção>> por depoimentos REAIS com
 * autorização de uso de imagem/nome (LGPD). Avatares são iniciais (sem foto).
 *
 * NOTA SEO: NÃO injetamos JSON-LD Review/AggregateRating aqui de propósito —
 * marcar avaliações fictícias como dados estruturados é violação das diretrizes
 * do Google e pode gerar penalização. Adicionar o schema só com reviews reais.
 */

type Depoimento = {
  nome: string;
  local: string;
  texto: string;
  // Tipo de cliente, exibido como tag.
  perfil: "Residencial" | "Comercial" | "Rural";
};

const DEPOIMENTOS: Depoimento[] = [
  {
    nome: "Marcos Andrade",
    local: "Fortaleza/CE",
    perfil: "Residencial",
    texto:
      "A conta de luz despencou já no primeiro mês. A equipe explicou tudo sem enrolação e a instalação foi limpa e rápida.",
  },
  {
    nome: "Juliana Freitas",
    local: "Caucaia/CE",
    perfil: "Residencial",
    texto:
      "Tinha medo de promessa furada, mas o orçamento foi honesto e bateu com o que veio na prática. Recomendo demais.",
  },
  {
    nome: "Roberto Lima",
    local: "Maracanaú/CE",
    perfil: "Comercial",
    texto:
      "Para o meu comércio, a energia era um custo fixo pesado. Hoje pago quase só a taxa mínima. Melhor investimento que fiz.",
  },
];

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section className="bg-brand-black/[0.03]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quem já economiza com a TOCSOLAR
          </h2>
          <p className="mt-3 text-brand-black/70">
            Clientes residenciais e comerciais no Ceará gerando a própria
            energia.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {DEPOIMENTOS.map((d) => (
            <figure
              key={d.nome}
              className="flex flex-col rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 text-brand-orange" aria-hidden>
                ★★★★★
              </div>
              <blockquote className="flex-1 text-brand-black/80">
                “{d.texto}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/15 text-sm font-bold text-brand-orange"
                  aria-hidden
                >
                  {iniciais(d.nome)}
                </span>
                <span>
                  <span className="block font-semibold">{d.nome}</span>
                  <span className="block text-sm text-brand-black/60">
                    {d.local} · {d.perfil}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
