"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Contadores de prova social com animação count-up ao entrar na viewport.
 *
 * DADOS FICTÍCIOS — <<SUBSTITUIR antes de produção>> pelos números oficiais
 * da TOCSOLAR (projetos entregues, kWp instalado, anos de mercado, cidades).
 */
type Stat = {
  // Valor final do contador.
  valor: number;
  // Sufixo exibido (ex.: "+", "k", "kWp").
  sufixo?: string;
  prefixo?: string;
  label: string;
};

const STATS: Stat[] = [
  { valor: 1200, sufixo: "+", label: "Projetos entregues no Ceará" },
  { valor: 8, sufixo: " MWp", label: "Potência total instalada" },
  { valor: 10, sufixo: " anos", label: "De mercado em energia solar" },
  { valor: 30, sufixo: "+", label: "Cidades atendidas" },
];

const DURACAO_MS = 1400;

function useContadorAoVer(alvo: number) {
  const [valor, setValor] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const jaAnimou = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduzir = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduzir) {
      setValor(alvo);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const visivel = entries[0]?.isIntersecting;
        if (!visivel || jaAnimou.current) return;
        jaAnimou.current = true;

        const inicio = performance.now();
        const passo = (agora: number) => {
          const t = Math.min((agora - inicio) / DURACAO_MS, 1);
          // ease-out para desacelerar no fim.
          const eased = 1 - Math.pow(1 - t, 3);
          setValor(Math.round(alvo * eased));
          if (t < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [alvo]);

  return { valor, ref };
}

function StatItem({ stat }: { stat: Stat }) {
  const { valor, ref } = useContadorAoVer(stat.valor);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold tracking-tight text-brand-orange sm:text-5xl">
        {stat.prefixo}
        {valor.toLocaleString("pt-BR")}
        {stat.sufixo}
      </div>
      <p className="mt-2 text-sm text-white/70">{stat.label}</p>
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className="bg-brand-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatItem key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
