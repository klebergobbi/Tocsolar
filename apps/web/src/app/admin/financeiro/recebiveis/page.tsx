"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FinanceTabs } from "@/components/admin/FinanceTabs";
import {
  formatBRL,
  formatDate,
  isOverdue,
  RECEIVABLE_STATUS,
  receivablesApi,
  remindersApi,
  type Receivable,
  type ReceivableStatus,
} from "@/lib/admin-api";

export default function RecebiveisPage() {
  const [items, setItems] = useState<Receivable[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [notificando, setNotificando] = useState(false);
  const [notifMsg, setNotifMsg] = useState<string | null>(null);

  const load = useCallback(() => {
    setErro(null);
    receivablesApi
      .list({ status: statusFilter || undefined })
      .then(setItems)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  // Resumo calculado sobre a lista atual (sem filtro → visão geral).
  const resumo = useMemo(() => {
    const base = items ?? [];
    const aReceber = base
      .filter((r) => r.status === "pendente")
      .reduce((s, r) => s + r.valor, 0);
    const vencido = base
      .filter(isOverdue)
      .reduce((s, r) => s + r.valor, 0);
    const recebido = base
      .filter((r) => r.status === "pago")
      .reduce((s, r) => s + r.valor, 0);
    return { aReceber, vencido, recebido };
  }, [items]);

  async function marcar(id: string, status: ReceivableStatus): Promise<void> {
    setItems(
      (prev) => prev?.map((r) => (r.id === id ? { ...r, status } : r)) ?? prev,
    );
    try {
      await receivablesApi.update(id, { status });
      load();
    } catch {
      load();
    }
  }

  async function excluir(id: string): Promise<void> {
    if (!window.confirm("Excluir esta conta a receber?")) return;
    try {
      await receivablesApi.remove(id);
      setItems((prev) => prev?.filter((r) => r.id !== id) ?? prev);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir");
    }
  }

  async function notificar(): Promise<void> {
    setNotificando(true);
    setNotifMsg(null);
    try {
      const r = await remindersApi.run();
      if (!r.enviado) {
        setNotifMsg(r.motivo ?? "Nada a notificar no momento.");
      } else {
        const canais = [r.whatsapp && "WhatsApp", r.email && "e-mail"]
          .filter(Boolean)
          .join(" + ");
        setNotifMsg(
          `Resumo enviado${canais ? ` por ${canais}` : " (canais não configurados)"}: ` +
            `${r.vencidas} vencida(s), ${r.aVencer} a vencer.`,
        );
      }
    } catch (e) {
      setNotifMsg(e instanceof Error ? e.message : "Erro ao notificar");
    } finally {
      setNotificando(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-sm text-brand-black/60">
            Parcelas geradas dos orçamentos e lançamentos manuais.
          </p>
        </div>
        <button
          type="button"
          onClick={notificar}
          disabled={notificando}
          className="rounded-lg border border-brand-black/15 px-4 py-2 text-sm font-medium hover:bg-brand-black/5 disabled:opacity-60"
          title="Envia ao escritório um resumo de parcelas vencidas e a vencer (3 dias)"
        >
          {notificando ? "Enviando…" : "Notificar vencimentos"}
        </button>
      </div>

      {notifMsg && (
        <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
          {notifMsg}
        </p>
      )}

      <FinanceTabs />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="A receber (pendente)" value={resumo.aReceber} tone="text-brand-black" />
        <Card label="Vencido" value={resumo.vencido} tone="text-red-600" />
        <Card label="Recebido" value={resumo.recebido} tone="text-green-600" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
        >
          <option value="">Todos os status</option>
          {RECEIVABLE_STATUS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-brand-black/50">
          {items === null ? "Carregando…" : `${items.length} parcela(s)`}
        </span>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-brand-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-black/10 text-left text-brand-black/50">
              <th className="px-4 py-3 font-medium">Vencimento</th>
              <th className="px-4 py-3 font-medium">Descrição</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Orçamento</th>
              <th className="px-4 py-3 text-right font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-brand-black/40">
                  Nenhuma conta a receber. Gere parcelas a partir de um orçamento.
                </td>
              </tr>
            )}
            {items?.map((r) => {
              const vencido = isOverdue(r);
              return (
                <tr key={r.id} className="border-b border-brand-black/5 last:border-0">
                  <td className={`px-4 py-3 ${vencido ? "font-medium text-red-600" : ""}`}>
                    {formatDate(r.vencimento)}
                  </td>
                  <td className="px-4 py-3">{r.descricao}</td>
                  <td className="px-4 py-3 text-brand-black/70">{r.client.nome}</td>
                  <td className="px-4 py-3 text-brand-black/60">
                    {r.quote ? (
                      <Link
                        href={`/admin/orcamentos/${r.quote.id}`}
                        className="font-mono hover:text-brand-orange"
                      >
                        #{String(r.quote.numero).padStart(4, "0")}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatBRL(r.valor)}</td>
                  <td className="px-4 py-3">
                    {r.status === "pago" ? (
                      <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Pago
                      </span>
                    ) : r.status === "cancelado" ? (
                      <span className="rounded-full bg-brand-black/5 px-2 py-1 text-xs font-medium text-brand-black/50">
                        Cancelado
                      </span>
                    ) : vencido ? (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        Vencido
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        Pendente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      {r.status === "pago" ? (
                        <button
                          type="button"
                          onClick={() => marcar(r.id, "pendente")}
                          className="text-xs font-medium text-brand-black/60 hover:underline"
                        >
                          Reabrir
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => marcar(r.id, "pago")}
                          className="text-xs font-medium text-green-600 hover:underline"
                        >
                          Dar baixa
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => excluir(r.id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({
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
