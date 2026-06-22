"use client";

import { useEffect, useState } from "react";
import { FinanceTabs } from "@/components/admin/FinanceTabs";
import {
  cashflowApi,
  downloadCsv,
  formatBRL,
  formatMonth,
  type Cashflow,
} from "@/lib/admin-api";

export default function FluxoCaixaPage() {
  const [data, setData] = useState<Cashflow | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    cashflowApi
      .get()
      .then(setData)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }, []);

  const t = data?.totais;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-sm text-brand-black/60">
            Entradas (recebíveis) e saídas (despesas) por mês — realizado e previsto.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            downloadCsv("/exports/fluxo.csv", "fluxo-caixa.csv").catch((e) =>
              setErro(e instanceof Error ? e.message : "Erro ao exportar"),
            )
          }
          className="rounded-lg border border-brand-black/15 px-4 py-2 text-sm font-medium hover:bg-brand-black/5"
        >
          Exportar CSV
        </button>
      </div>

      <FinanceTabs />

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="Recebido" value={t?.recebido} tone="text-green-600" />
        <Card label="Pago" value={t?.pago} tone="text-red-600" />
        <Card
          label="Saldo realizado"
          value={t?.saldoRealizado}
          tone={
            (t?.saldoRealizado ?? 0) >= 0 ? "text-brand-black" : "text-red-600"
          }
        />
        <Card label="A receber" value={t?.aReceber} tone="text-green-600/80" />
        <Card label="A pagar" value={t?.aPagar} tone="text-amber-600" />
        <Card
          label="Saldo previsto"
          value={t?.saldoPrevisto}
          tone={
            (t?.saldoPrevisto ?? 0) >= 0 ? "text-brand-black" : "text-red-600"
          }
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-brand-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-black/10 text-left text-brand-black/50">
              <th className="px-4 py-3 font-medium">Mês</th>
              <th className="px-4 py-3 text-right font-medium">Entradas</th>
              <th className="px-4 py-3 text-right font-medium">Saídas</th>
              <th className="px-4 py-3 text-right font-medium">Saldo realizado</th>
              <th className="px-4 py-3 text-right font-medium">Prev. entradas</th>
              <th className="px-4 py-3 text-right font-medium">Prev. saídas</th>
              <th className="px-4 py-3 text-right font-medium">Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {data?.meses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-brand-black/40">
                  Sem movimentações ainda. Gere parcelas e lance despesas.
                </td>
              </tr>
            )}
            {data?.meses.map((m) => (
              <tr key={m.mes} className="border-b border-brand-black/5 last:border-0">
                <td className="px-4 py-3 font-medium">{formatMonth(m.mes)}</td>
                <td className="px-4 py-3 text-right text-green-700">
                  {m.entradasRealizadas ? formatBRL(m.entradasRealizadas) : "—"}
                </td>
                <td className="px-4 py-3 text-right text-red-600">
                  {m.saidasRealizadas ? formatBRL(m.saidasRealizadas) : "—"}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    m.saldoRealizado < 0 ? "text-red-600" : "text-brand-black"
                  }`}
                >
                  {formatBRL(m.saldoRealizado)}
                </td>
                <td className="px-4 py-3 text-right text-brand-black/50">
                  {m.entradasPrevistas ? formatBRL(m.entradasPrevistas) : "—"}
                </td>
                <td className="px-4 py-3 text-right text-brand-black/50">
                  {m.saidasPrevistas ? formatBRL(m.saidasPrevistas) : "—"}
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    m.saldoAcumulado < 0 ? "text-red-600" : "text-brand-black"
                  }`}
                >
                  {formatBRL(m.saldoAcumulado)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-brand-black/40">
        Realizado = recebíveis e despesas com baixa (pagos). Previsto = pendentes,
        pela data de vencimento/competência. Acumulado considera realizado + previsto.
      </p>
    </div>
  );
}

function Card({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | undefined;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-black/10 bg-white p-5">
      <p className="text-sm text-brand-black/60">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone}`}>
        {value == null ? "—" : formatBRL(value)}
      </p>
    </div>
  );
}
