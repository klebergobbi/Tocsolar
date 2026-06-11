const PASSOS = [
  {
    titulo: "Simule",
    descricao:
      "Informe o valor da sua conta e veja, na hora, uma estimativa de economia e do sistema ideal.",
  },
  {
    titulo: "Orçamento",
    descricao:
      "Nossa equipe confirma os números no local e envia uma proposta clara, sem letras miúdas.",
  },
  {
    titulo: "Instalação",
    descricao:
      "Cuidamos de tudo: projeto, equipamentos, instalação com equipe própria e homologação na Enel.",
  },
  {
    titulo: "Economia",
    descricao:
      "Você passa a gerar sua própria energia e sente a diferença já na primeira conta de luz.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-brand-black/[0.02] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Como funciona, do começo ao fim
          </h2>
          <p className="mt-3 text-brand-black/70">
            Quatro passos simples entre a sua conta de luz alta e a economia real.
          </p>
        </div>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((passo, i) => (
            <li
              key={passo.titulo}
              className="relative rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-base font-bold text-brand-black">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold">{passo.titulo}</h3>
              <p className="mt-2 text-sm text-brand-black/70">
                {passo.descricao}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
