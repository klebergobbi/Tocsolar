"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuoteForm } from "@/components/admin/QuoteForm";
import {
  formatBRL,
  QUOTE_STATUS,
  quotesApi,
  type Quote,
  type QuoteInput,
  type QuoteStatus,
} from "@/lib/admin-api";

export default function OrcamentoDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editando, setEditando] = useState(false);

  function carregar(): void {
    quotesApi
      .get(id)
      .then(setQuote)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function salvar(input: QuoteInput): Promise<void> {
    setSaving(true);
    setErro(null);
    try {
      const updated = await quotesApi.update(id, {
        systemKwp: input.systemKwp,
        validadeDias: input.validadeDias,
        desconto: input.desconto,
        observacoes: input.observacoes,
        items: input.items,
      });
      setQuote(updated);
      setEditando(false);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function mudarStatus(status: QuoteStatus): Promise<void> {
    if (!quote) return;
    setQuote({ ...quote, status });
    try {
      await quotesApi.update(id, { status });
    } catch {
      carregar();
    }
  }

  async function excluir(): Promise<void> {
    if (!window.confirm("Excluir este orçamento?")) return;
    try {
      await quotesApi.remove(id);
      router.push("/admin/orcamentos");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir");
    }
  }

  if (erro && !quote) {
    return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>;
  }
  if (!quote) {
    return <p className="text-brand-black/50">Carregando…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orcamentos" className="text-sm text-brand-black/50 hover:text-brand-orange">
          ← Orçamentos
        </Link>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">
            Orçamento #{String(quote.numero).padStart(4, "0")}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={quote.status}
              onChange={(e) => mudarStatus(e.target.value as QuoteStatus)}
              className="rounded-lg border border-brand-black/15 px-3 py-1.5 text-sm outline-none focus:border-brand-orange"
            >
              {QUOTE_STATUS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <Link
              href={`/admin/orcamentos/${id}/imprimir`}
              className="rounded-lg border border-brand-black/15 px-3 py-1.5 text-sm font-medium hover:bg-brand-black/5"
            >
              Imprimir / PDF
            </Link>
            <button
              type="button"
              onClick={() => setEditando((v) => !v)}
              className="rounded-lg border border-brand-black/15 px-3 py-1.5 text-sm font-medium hover:bg-brand-black/5"
            >
              {editando ? "Cancelar edição" : "Editar"}
            </button>
            <button
              type="button"
              onClick={excluir}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      {editando ? (
        <QuoteForm
          clients={[{ id: quote.client.id, nome: quote.client.nome }]}
          initial={quote}
          lockClient
          submitting={saving}
          submitLabel="Salvar alterações"
          onSubmit={salvar}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 rounded-2xl border border-brand-black/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Cliente" value={quote.client.nome} />
            <Info label="WhatsApp" value={quote.client.whatsapp} />
            <Info
              label="Potência"
              value={quote.systemKwp != null ? `${quote.systemKwp} kWp` : "—"}
            />
            <Info label="Validade" value={`${quote.validadeDias} dias`} />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-brand-black/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-black/10 text-left text-brand-black/50">
                  <th className="px-4 py-3 font-medium">Descrição</th>
                  <th className="px-4 py-3 text-right font-medium">Qtd</th>
                  <th className="px-4 py-3 text-right font-medium">Valor unit.</th>
                  <th className="px-4 py-3 text-right font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((it) => (
                  <tr key={it.id} className="border-b border-brand-black/5 last:border-0">
                    <td className="px-4 py-3">{it.descricao}</td>
                    <td className="px-4 py-3 text-right">{it.quantidade}</td>
                    <td className="px-4 py-3 text-right">{formatBRL(it.valorUnit)}</td>
                    <td className="px-4 py-3 text-right">
                      {formatBRL(it.quantidade * it.valorUnit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end gap-1 text-sm">
            {quote.desconto > 0 && (
              <div className="flex w-56 justify-between">
                <span className="text-brand-black/60">Desconto</span>
                <span>− {formatBRL(quote.desconto)}</span>
              </div>
            )}
            <div className="flex w-56 justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-brand-orange">{formatBRL(quote.total)}</span>
            </div>
          </div>

          {quote.observacoes && (
            <div className="rounded-2xl border border-brand-black/10 bg-white p-5">
              <h3 className="mb-1 text-sm font-medium text-brand-black/60">Observações</h3>
              <p className="whitespace-pre-wrap text-sm">{quote.observacoes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-brand-black/50">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
