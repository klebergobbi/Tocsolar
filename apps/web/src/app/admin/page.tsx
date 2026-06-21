"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  dashboardApi,
  formatBRL,
  formatDate,
  formatMonth,
  type Dashboard,
} from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }, []);

  if (erro) {
    return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>;
  }
  if (!data) {
    return <p className="text-brand-black/50">Carregando painel…</p>;
  }

  const { funil, financeiro, receitaMensal, proximosVencimentos } = data;
  const maxBar = Math.max(
    1,
    ...receitaMensal.map((m) => Math.max(m.entradas, m.saidas)),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Painel</h1>
        <p className="text-sm text-brand-black/60">Visão executiva do escritório.</p>
      </div>

      {/* Funil */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-black/50">
          Funil
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <FunnelCard
            label="Leads"
            value={funil.leads}
            href="/admin/clientes"
          />
          <FunnelCard
            label="Clientes"
            value={funil.clientes}
            sub={`${funil.convLeadCliente}% dos leads`}
            href="/admin/clientes"
          />
          <FunnelCard
            label="Orçamentos"
            value={funil.orcamentos}
            href="/admin/orcamentos"
          />
          <FunnelCard
            label="Aprovados"
            value={funil.orcamentosAprovados}
            sub={`${funil.convOrcamentoAprovado}% dos orçamentos`}
            href="/admin/orcamentos"
            highlight
          />
        </div>
      </section>

      {/* Financeiro */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-black/50">
          Financeiro
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <KpiCard label="Recebido" value={financeiro.recebido} tone="text-green-600" />
          <KpiCard label="Pago" value={financeiro.pago} tone="text-red-600" />
          <KpiCard
            label="Saldo realizado"
            value={financeiro.saldoRealizado}
            tone={financeiro.saldoRealizado >= 0 ? "text-brand-black" : "text-red-600"}
          />
          <KpiCard label="A receber" value={financeiro.aReceber} tone="text-green-600/80" />
          <KpiCard label="A pagar" value={financeiro.aPagar} tone="text-amber-600" />
          <KpiCard
            label="Saldo previsto"
            value={financeiro.saldoPrevisto}
            tone={financeiro.saldoPrevisto >= 0 ? "text-brand-black" : "text-red-600"}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Receita mensal (gráfico CSS) */}
        <section className="rounded-2xl border border-brand-black/10 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-black/50">
              Entradas × saídas (mês)
            </h2>
            <Link
              href="/admin/financeiro/fluxo"
              className="text-xs font-medium text-brand-orange hover:underline"
            >
              Ver fluxo
            </Link>
          </div>
          {receitaMensal.length === 0 ? (
            <p className="py-8 text-center text-sm text-brand-black/40">
              Sem movimentações ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {receitaMensal.map((m) => (
                <div key={m.mes} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-xs text-brand-black/50">
                    {formatMonth(m.mes)}
                  </span>
                  <div className="flex-1 space-y-1">
                    <Bar value={m.entradas} max={maxBar} color="bg-green-500" />
                    <Bar value={m.saidas} max={maxBar} color="bg-red-400" />
                  </div>
                </div>
              ))}
              <div className="flex gap-4 pt-2 text-xs text-brand-black/50">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> Entradas
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-400" /> Saídas
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Próximos vencimentos */}
        <section className="rounded-2xl border border-brand-black/10 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-black/50">
              Próximos vencimentos
            </h2>
            <Link
              href="/admin/financeiro/recebiveis"
              className="text-xs font-medium text-brand-orange hover:underline"
            >
              Ver todos
            </Link>
          </div>
          {proximosVencimentos.length === 0 ? (
            <p className="py-8 text-center text-sm text-brand-black/40">
              Nenhuma conta a receber pendente.
            </p>
          ) : (
            <ul className="divide-y divide-brand-black/5">
              {proximosVencimentos.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{p.cliente}</p>
                    <p className="text-xs text-brand-black/50">
                      {p.descricao} · vence {formatDate(p.vencimento)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{formatBRL(p.valor)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function FunnelCard({
  label,
  value,
  sub,
  href,
  highlight,
}: {
  label: string;
  value: number;
  sub?: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border p-5 transition-colors ${
        highlight
          ? "border-brand-orange/40 bg-brand-orange/[0.06]"
          : "border-brand-black/10 bg-white hover:border-brand-orange/40"
      }`}
    >
      <p className="text-sm text-brand-black/60">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-brand-black/50">{sub}</p>}
    </Link>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-black/10 bg-white p-5">
      <p className="text-sm text-brand-black/60">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone}`}>{formatBRL(value)}</p>
    </div>
  );
}

function Bar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const width = max > 0 ? Math.max(value > 0 ? 4 : 0, (value / max) * 100) : 0;
  return (
    <div className="h-3 w-full overflow-hidden rounded bg-brand-black/5">
      <div
        className={`h-full rounded ${color}`}
        style={{ width: `${width}%` }}
        title={formatBRL(value)}
      />
    </div>
  );
}
