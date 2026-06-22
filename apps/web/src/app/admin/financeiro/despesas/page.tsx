"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FinanceTabs } from "@/components/admin/FinanceTabs";
import {
  downloadCsv,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABEL,
  expensesApi,
  formatBRL,
  formatDate,
  type Expense,
  type ExpenseCategoria,
} from "@/lib/admin-api";

type NewExpense = {
  descricao: string;
  categoria: ExpenseCategoria;
  valor: string;
  data: string;
  status: "pago" | "pendente";
  fornecedor: string;
};

const EMPTY: NewExpense = {
  descricao: "",
  categoria: "equipamento",
  valor: "",
  data: "",
  status: "pago",
  fornecedor: "",
};

const inputCls =
  "rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange";

export default function DespesasPage() {
  const [items, setItems] = useState<Expense[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [novo, setNovo] = useState<NewExpense>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setErro(null);
    expensesApi
      .list({ categoria: catFilter || undefined, status: statusFilter || undefined })
      .then(setItems)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }, [catFilter, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const resumo = useMemo(() => {
    const base = items ?? [];
    const pago = base
      .filter((e) => e.status === "pago")
      .reduce((s, e) => s + e.valor, 0);
    const pendente = base
      .filter((e) => e.status === "pendente")
      .reduce((s, e) => s + e.valor, 0);
    return { pago, pendente };
  }, [items]);

  async function criar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSaving(true);
    setErro(null);
    try {
      await expensesApi.create({
        descricao: novo.descricao.trim(),
        categoria: novo.categoria,
        valor: Number(novo.valor) || 0,
        data: novo.data,
        status: novo.status,
        fornecedor: novo.fornecedor.trim() || undefined,
      });
      setNovo(EMPTY);
      setShowForm(false);
      load();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function marcarPago(id: string): Promise<void> {
    setItems((prev) =>
      prev?.map((e) => (e.id === id ? { ...e, status: "pago" } : e)) ?? prev,
    );
    try {
      await expensesApi.update(id, { status: "pago" });
      load();
    } catch {
      load();
    }
  }

  async function excluir(id: string): Promise<void> {
    if (!window.confirm("Excluir esta despesa?")) return;
    try {
      await expensesApi.remove(id);
      setItems((prev) => prev?.filter((e) => e.id !== id) ?? prev);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              downloadCsv("/exports/despesas.csv", "despesas.csv").catch((e) =>
                setErro(e instanceof Error ? e.message : "Erro ao exportar"),
              )
            }
            className="rounded-lg border border-brand-black/15 px-4 py-2 text-sm font-medium hover:bg-brand-black/5"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
          >
            {showForm ? "Cancelar" : "Nova despesa"}
          </button>
        </div>
      </div>

      <FinanceTabs />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card label="Despesas pagas" value={resumo.pago} tone="text-red-600" />
        <Card label="A pagar (pendente)" value={resumo.pendente} tone="text-amber-600" />
      </div>

      {showForm && (
        <form
          onSubmit={criar}
          className="grid gap-3 rounded-2xl border border-brand-black/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input
            required
            placeholder="Descrição *"
            value={novo.descricao}
            onChange={(e) => setNovo({ ...novo, descricao: e.target.value })}
            className={inputCls}
          />
          <select
            value={novo.categoria}
            onChange={(e) =>
              setNovo({ ...novo, categoria: e.target.value as ExpenseCategoria })
            }
            className={inputCls}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="Valor (R$) *"
            value={novo.valor}
            onChange={(e) => setNovo({ ...novo, valor: e.target.value })}
            className={inputCls}
          />
          <input
            required
            type="date"
            value={novo.data}
            onChange={(e) => setNovo({ ...novo, data: e.target.value })}
            className={inputCls}
          />
          <select
            value={novo.status}
            onChange={(e) =>
              setNovo({ ...novo, status: e.target.value as "pago" | "pendente" })
            }
            className={inputCls}
          >
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
          </select>
          <input
            placeholder="Fornecedor"
            value={novo.fornecedor}
            onChange={(e) => setNovo({ ...novo, fornecedor: e.target.value })}
            className={inputCls}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-black px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Salvando…" : "Salvar despesa"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className={inputCls}
        >
          <option value="">Todas as categorias</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputCls}
        >
          <option value="">Todos os status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
        </select>
        <span className="self-center text-sm text-brand-black/50">
          {items === null ? "Carregando…" : `${items.length} despesa(s)`}
        </span>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-brand-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-black/10 text-left text-brand-black/50">
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Descrição</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Fornecedor</th>
              <th className="px-4 py-3 text-right font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-brand-black/40">
                  Nenhuma despesa lançada.
                </td>
              </tr>
            )}
            {items?.map((e) => (
              <tr key={e.id} className="border-b border-brand-black/5 last:border-0">
                <td className="px-4 py-3">{formatDate(e.data)}</td>
                <td className="px-4 py-3 font-medium">{e.descricao}</td>
                <td className="px-4 py-3 text-brand-black/70">
                  {EXPENSE_CATEGORY_LABEL[e.categoria]}
                </td>
                <td className="px-4 py-3 text-brand-black/60">{e.fornecedor ?? "—"}</td>
                <td className="px-4 py-3 text-right font-medium">{formatBRL(e.valor)}</td>
                <td className="px-4 py-3">
                  {e.status === "pago" ? (
                    <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      Pago
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                      Pendente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    {e.status === "pendente" && (
                      <button
                        type="button"
                        onClick={() => marcarPago(e.id)}
                        className="text-xs font-medium text-green-600 hover:underline"
                      >
                        Dar baixa
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => excluir(e.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
