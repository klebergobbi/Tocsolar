import Image from "next/image";
import Link from "next/link";

const PROVAS = [
  "Milhares de projetos no Ceará",
  "Equipe própria de instalação",
  "Homologação inclusa",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      {/* Imagem de fundo — arte ORIGINAL da marca (apps/web/public/hero-bg.svg).
          SUBSTITUIR por foto REAL de projeto da TOCSOLAR (ou banco licenciado) quando houver acervo. */}
      <Image
        src="/hero-bg.svg"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="pointer-events-none select-none object-cover"
      />
      {/* Overlay p/ contraste do texto (escurece esquerda → meio). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/30"
      />
      {/* Brilho do sol — token de marca, reforça o canto superior direito. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-orange/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-orange" aria-hidden />
            Energia solar em Fortaleza/CE
          </span>

          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Energia solar que{" "}
            <span className="text-brand-orange">realmente economiza</span>. Do
            orçamento à instalação.
          </h1>

          <p className="max-w-xl text-lg text-white/70">
            Reduza sua conta de luz com um sistema dimensionado para o seu
            consumo. Projeto, homologação e instalação com equipe própria — sem
            dor de cabeça.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/simulador"
              className="rounded-lg bg-brand-orange px-6 py-3 text-center text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
            >
              Simular minha economia
            </Link>
            <Link
              href="/contato"
              className="rounded-lg border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Pedir orçamento
            </Link>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm text-white/70">
            {PROVAS.map((prova) => (
              <li key={prova} className="flex items-center gap-2">
                <span className="text-brand-orange" aria-hidden>
                  ✓
                </span>
                {prova}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
