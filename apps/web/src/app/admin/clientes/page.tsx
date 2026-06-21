"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CLIENT_STATUS,
  clientsApi,
  type Client,
} from "@/lib/admin-api";

const TIPOS = ["residencial", "empresarial", "rural"] as const;

const STATUS_LABEL: Record<Client["status"], string> = Object.fromEntries(
  CLIENT_STATUS.map((s) => [s.value, s.label]),
) as Record<Client["status"], string>;

const STATUS_COLOR: Record<Client["status"], string> = {
  novo: "bg-blue-50 text-blue-700",
  em_contato: "bg-amber-50 text-amber-700",
  proposta: "bg-purple-50 text-purple-700",
  fechado: "bg-green-50 text-green-700",
  perdido: "bg-brand-black/5 text-brand-black/50",
};

type NewClient = {
  nome: string;
  whatsapp: string;
  email: string;
  cidade: string;
  tipo: (typeof TIPOS)[number];
  valorConta: string;
};

const EMPTY_NEW: NewClient = {
  nome: "",
  whatsapp: "",
  email: "",
  cidade: "",
  tipo: "residencial",
  valorConta: "",
};

export default function AdminClientesPage() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [novo, setNovo] = useState<NewClient>(EMPTY_NEW);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setErro(null);
    clientsApi
      .list({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      })
      .then(setClients)
      .catch((e) =>
        setErro(e instanceof Error ? e.message : "Erro ao carregar"),
      );
  }, [search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function criar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSaving(true);
    setErro(null);
    try {
      await clientsApi.create({
        nome: novo.nome.trim(),
        whatsapp: novo.whatsapp.trim(),
        email: novo.email.trim() || undefined,
        cidade: novo.cidade.trim() || undefined,
        tipo: novo.tipo,
        valorConta: novo.valorConta ? Number(novo.valorConta) : undefined,
      });
      setNovo(EMPTY_NEW);
      setShowForm(false);
      load();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function mudarStatus(
    id: string,
    status: Client["status"],
  ): Promise<void> {
    setClients(
      (prev) =>
        prev?.map((c) => (c.id === id ? { ...c, status } : c)) ?? prev,
    );
    try {
      await clientsApi.update(id, { status });
    } catch {
      load(); // reverte para o estado real em caso de erro
    }
  }

  async function excluir(id: string): Promise<void> {
    if (!window.confirm("Excluir este cliente?")) return;
    try {
      await clientsApi.remove(id);
      setClients((prev) => prev?.filter((c) => c.id !== id) ?? prev);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-brand-black/60">
            {clients === null ? "Carregando…" : `${clients.length} cliente(s)`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
        >
          {showForm ? "Cancelar" : "Novo cliente"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={criar}
          className="grid gap-3 rounded-2xl border border-brand-black/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input
            required
            placeholder="Nome *"
            value={novo.nome}
            onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
            className="rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          />
          <input
            required
            placeholder="WhatsApp * (DDD + número)"
            value={novo.whatsapp}
            onChange={(e) => setNovo({ ...novo, whatsapp: e.target.value })}
            className="rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={novo.email}
            onChange={(e) => setNovo({ ...novo, email: e.target.value })}
            className="rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          />
          <input
            placeholder="Cidade"
            value={novo.cidade}
            onChange={(e) => setNovo({ ...novo, cidade: e.target.value })}
            className="rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          />
          <select
            value={novo.tipo}
            onChange={(e) =>
              setNovo({ ...novo, tipo: e.target.value as NewClient["tipo"] })
            }
            className="rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            placeholder="Valor da conta (R$/mês)"
            value={novo.valorConta}
            onChange={(e) => setNovo({ ...novo, valorConta: e.target.value })}
            className="rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-black px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Salvando…" : "Salvar cliente"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Buscar por nome, WhatsApp ou e-mail…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[220px] flex-1 rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
        >
          <option value="">Todos os status</option>
          {CLIENT_STATUS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-brand-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-black/10 text-left text-brand-black/50">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Contato</th>
              <th className="px-4 py-3 font-medium">Cidade</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Conta</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {clients?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-brand-black/40">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {clients?.map((c) => (
              <tr key={c.id} className="border-b border-brand-black/5 last:border-0">
                <td className="px-4 py-3 font-medium">{c.nome}</td>
                <td className="px-4 py-3 text-brand-black/70">
                  <div>{c.whatsapp}</div>
                  {c.email && <div className="text-xs text-brand-black/40">{c.email}</div>}
                </td>
                <td className="px-4 py-3 text-brand-black/70">{c.cidade ?? "—"}</td>
                <td className="px-4 py-3 text-brand-black/70">{c.tipo}</td>
                <td className="px-4 py-3 text-brand-black/70">
                  {c.valorConta != null
                    ? `R$ ${c.valorConta.toLocaleString("pt-BR")}`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={c.status}
                    onChange={(e) =>
                      mudarStatus(c.id, e.target.value as Client["status"])
                    }
                    className={`rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${STATUS_COLOR[c.status]}`}
                  >
                    {CLIENT_STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {STATUS_LABEL[s.value]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => excluir(c.id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
