/**
 * Diferenciais da TOCSOLAR (quebra de objeção).
 * Conteúdo institucional (não depende de dados de cliente). Ajuste o copy
 * conforme a marca; ícones são SVG inline (leves, sem dependência externa).
 */

type Diferencial = {
  titulo: string;
  descricao: string;
  // path "d" de um ícone 24x24 (stroke).
  icone: string;
};

const DIFERENCIAIS: Diferencial[] = [
  {
    titulo: "Equipe própria",
    descricao:
      "Do projeto à instalação, sem terceirizar. Quem orça é quem entrega.",
    icone: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21a8 8 0 0 1 16 0",
  },
  {
    titulo: "Homologação inclusa",
    descricao:
      "Cuidamos de toda a burocracia junto à Enel. Você não se preocupa com nada.",
    icone: "M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z",
  },
  {
    titulo: "Estimativa conservadora",
    descricao:
      "Preferimos prometer menos e entregar mais. Orçamento honesto, sem retorno furado.",
    icone: "M3 3v18h18M7 14l4-4 4 4 5-6",
  },
  {
    titulo: "Foco no Ceará",
    descricao:
      "Conhecemos a irradiação e a tarifa local. Projeto dimensionado para a sua realidade.",
    icone: "M12 21s-7-5-7-11a7 7 0 0 1 14 0c0 6-7 11-7 11ZM12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  },
  {
    titulo: "Equipamentos com garantia",
    descricao:
      "Painéis e inversores de fabricantes consagrados, com garantia de fábrica.",
    icone: "M20 7L9 18l-5-5",
  },
  {
    titulo: "Acompanhamento real",
    descricao:
      "Suporte direto pelo WhatsApp, do orçamento à energia caindo na conta.",
    icone: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z",
  },
];

export function Differentials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Por que escolher a TOCSOLAR
        </h2>
        <p className="mt-3 text-brand-black/70">
          Energia solar que realmente economiza — do orçamento à instalação.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DIFERENCIAIS.map((d) => (
          <div
            key={d.titulo}
            className="rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d={d.icone} />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-bold">{d.titulo}</h3>
            <p className="mt-2 text-sm text-brand-black/70">{d.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
