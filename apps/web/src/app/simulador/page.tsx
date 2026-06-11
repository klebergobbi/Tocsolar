import type { Metadata } from "next";
import { SolarSimulator } from "@/components/lead/SolarSimulator";

export const metadata: Metadata = {
  title: "Simulador de economia — Energia solar em Fortaleza",
  description:
    "Descubra quanto você pode economizar com energia solar. Simule sua economia mensal, o tamanho do sistema e o tempo de retorno — estimativa gratuita e sem compromisso.",
};

export default function SimuladorPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 max-w-2xl space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Quanto você economiza com energia solar?
        </h1>
        <p className="text-brand-black/70">
          Ajuste o valor da sua conta de luz e veja uma estimativa de economia,
          do tamanho do sistema e do tempo de retorno. Depois, peça o orçamento
          detalhado — nossa equipe confirma os números no local.
        </p>
      </div>

      <SolarSimulator />
    </main>
  );
}
