import Link from "next/link";

const DORES = [
  "Conta de luz cada vez mais alta, com reajustes da Enel todo ano.",
  "Sensação de dinheiro jogado fora todo mês, sem retorno nenhum.",
  "Medo de propostas que prometem economia que não se confirma.",
];

const PROMESSAS = [
  "Você gera a própria energia e reduz boa parte da conta.",
  "Sistema dimensionado para o seu consumo — estimativa transparente, sem promessa furada.",
  "Equipe própria do projeto à homologação: um único responsável.",
];

export function PainPromise() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          A conta de luz não precisa ser um peso todo mês
        </h2>
        <p className="mt-3 text-brand-black/70">
          A energia solar transforma um gasto fixo em um investimento que se
          paga. Veja a diferença:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-brand-black/10 bg-brand-black/[0.02] p-6">
          <h3 className="mb-4 text-lg font-bold text-brand-black/80">
            Como é hoje
          </h3>
          <ul className="space-y-3">
            {DORES.map((dor) => (
              <li key={dor} className="flex items-start gap-3 text-brand-black/70">
                <span className="mt-1 text-brand-black/30" aria-hidden>
                  ✕
                </span>
                {dor}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/[0.06] p-6">
          <h3 className="mb-4 text-lg font-bold">Com a TOCSOLAR</h3>
          <ul className="space-y-3">
            {PROMESSAS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-brand-black/80">
                <span className="mt-1 text-brand-orange" aria-hidden>
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/simulador"
          className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
        >
          Ver quanto eu economizo
        </Link>
      </div>
    </section>
  );
}
