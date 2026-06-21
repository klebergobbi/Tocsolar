"use client";

import { useMemo, useState } from "react";
import {
  formatBRL,
  type Quote,
  type QuoteInput,
  type QuoteItemInput,
} from "@/lib/admin-api";

type ClientOption = { id: string; nome: string };

type Props = {
  clients: ClientOption[];
  initial?: Quote;
  lockClient?: boolean;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (input: QuoteInput) => void;
};

const EMPTY_ITEM: QuoteItemInput = { descricao: "", quantidade: 1, valorUnit: 0 };

const inputCls =
  "rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange";

export function QuoteForm({
  clients,
  initial,
  lockClient = false,
  submitting = false,
  submitLabel = "Salvar",
  onSubmit,
}: Props) {
  const [clientId, setClientId] = useState(initial?.clientId ?? "");
  const [systemKwp, setSystemKwp] = useState(
    initial?.systemKwp != null ? String(initial.systemKwp) : "",
  );
  const [validadeDias, setValidadeDias] = useState(
    String(initial?.validadeDias ?? 15),
  );
  const [desconto, setDesconto] = useState(String(initial?.desconto ?? 0));
  const [observacoes, setObservacoes] = useState(initial?.observacoes ?? "");
  const [items, setItems] = useState<QuoteItemInput[]>(
    initial?.items.map((i) => ({
      descricao: i.descricao,
      quantidade: i.quantidade,
      valorUnit: i.valorUnit,
    })) ?? [{ ...EMPTY_ITEM }],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (s, i) => s + (Number(i.quantidade) || 0) * (Number(i.valorUnit) || 0),
        0,
      ),
    [items],
  );
  const total = Math.max(0, subtotal - (Number(desconto) || 0));

  function setItem(idx: number, patch: Partial<QuoteItemInput>): void {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function addItem(): void {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }
  function removeItem(idx: number): void {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));
  }

  function submit(e: React.FormEvent): void {
    e.preventDefault();
    onSubmit({
      clientId,
      systemKwp: systemKwp ? Number(systemKwp) : undefined,
      validadeDias: Number(validadeDias) || 15,
      desconto: Number(desconto) || 0,
      observacoes: observacoes.trim() || undefined,
      items: items
        .filter((i) => i.descricao.trim())
        .map((i) => ({
          descricao: i.descricao.trim(),
          quantidade: Number(i.quantidade) || 0,
          valorUnit: Number(i.valorUnit) || 0,
        })),
    });
  }

  const podeSalvar = clientId && items.some((i) => i.descricao.trim());

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-brand-black/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Cliente *</label>
          <select
            required
            disabled={lockClient}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className={`${inputCls} w-full disabled:bg-brand-black/5`}
          >
            <option value="">Selecione…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Potência (kWp)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={systemKwp}
            onChange={(e) => setSystemKwp(e.target.value)}
            className={`${inputCls} w-full`}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Validade (dias)</label>
          <input
            type="number"
            min="0"
            value={validadeDias}
            onChange={(e) => setValidadeDias(e.target.value)}
            className={`${inputCls} w-full`}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-brand-black/10 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Itens</h3>
          <button
            type="button"
            onClick={addItem}
            className="rounded-lg border border-brand-black/15 px-3 py-1.5 text-sm font-medium hover:bg-brand-black/5"
          >
            + Adicionar item
          </button>
        </div>

        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2">
              <input
                placeholder="Descrição (ex.: Painel 550W, inversor, instalação…)"
                value={it.descricao}
                onChange={(e) => setItem(idx, { descricao: e.target.value })}
                className={`${inputCls} col-span-12 sm:col-span-6`}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Qtd"
                value={it.quantidade}
                onChange={(e) =>
                  setItem(idx, { quantidade: Number(e.target.value) })
                }
                className={`${inputCls} col-span-3 sm:col-span-2`}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Valor unit."
                value={it.valorUnit}
                onChange={(e) =>
                  setItem(idx, { valorUnit: Number(e.target.value) })
                }
                className={`${inputCls} col-span-5 sm:col-span-2`}
              />
              <div className="col-span-3 flex items-center justify-end gap-2 sm:col-span-2">
                <span className="text-sm text-brand-black/60">
                  {formatBRL(
                    (Number(it.quantidade) || 0) * (Number(it.valorUnit) || 0),
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-brand-black/30 hover:text-red-600"
                  aria-label="Remover item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col items-end gap-1 border-t border-brand-black/10 pt-4 text-sm">
          <div className="flex w-56 justify-between">
            <span className="text-brand-black/60">Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
          </div>
          <div className="flex w-56 items-center justify-between">
            <span className="text-brand-black/60">Desconto (R$)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
              className={`${inputCls} w-24 text-right`}
            />
          </div>
          <div className="flex w-56 justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-brand-orange">{formatBRL(total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-black/10 bg-white p-5">
        <label className="mb-1 block text-sm font-medium">Observações</label>
        <textarea
          rows={3}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Condições, prazo de instalação, garantia, forma de pagamento…"
          className={`${inputCls} w-full`}
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !podeSalvar}
        className="rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Salvando…" : submitLabel}
      </button>
    </form>
  );
}
