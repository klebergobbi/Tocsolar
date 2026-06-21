"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatBRL,
  QUOTE_STATUS,
  quotesApi,
  type QuoteListItem,
  type QuoteStatus,
} from "@/lib/admin-api";

const STATUS_COLOR: Record<QuoteStatus, string> = {
  rascunho: "bg-brand-black/5 text-brand-black/60",
  enviado: "bg-amber-50 text-amber-700",
  aprovado: "bg-green-50 text-green-700",
  recusado: "bg-red-50 text-red-700",
};

const STATUS_LABEL: Record<QuoteStatus, string> = Object.fromEntries(
  QUOTE_STATUS.map((s) => [s.value, s.label]),
) as Record<QuoteStatus, string>;

export default function OrcamentosPage() {
  const [quotes, setQuotes] = useState<QuoteListItem[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    quotesApi
      .list()
      .then(setQuotes)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-sm text-brand-black/60">
            {quotes === null ? "Carregando…" : `${quotes.length} orçamento(s)`}
          </p>
        </div>
        <Link
          href="/admin/orcamentos/novo"
          className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
        >
          Novo orçamento
        </Link>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-brand-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-black/10 text-left text-brand-black/50">
              <th className="px-4 py-3 font-medium">Nº</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Itens</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {quotes?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-brand-black/40">
                  Nenhum orçamento ainda.
                </td>
              </tr>
            )}
            {quotes?.map((q) => (
              <tr
                key={q.id}
                className="border-b border-brand-black/5 last:border-0 hover:bg-brand-black/[0.02]"
              >
                <td className="px-4 py-3 font-mono font-medium">
                  <Link href={`/admin/orcamentos/${q.id}`} className="hover:text-brand-orange">
                    #{String(q.numero).padStart(4, "0")}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orcamentos/${q.id}`} className="font-medium hover:text-brand-orange">
                    {q.client.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-brand-black/60">{q._count.items}</td>
                <td className="px-4 py-3 font-medium">{formatBRL(q.total)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLOR[q.status]}`}
                  >
                    {STATUS_LABEL[q.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-black/60">
                  {new Date(q.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
