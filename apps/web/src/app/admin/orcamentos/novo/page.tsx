"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuoteForm } from "@/components/admin/QuoteForm";
import { clientsApi, quotesApi, type Client, type QuoteInput } from "@/lib/admin-api";

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    clientsApi
      .list()
      .then(setClients)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar clientes"));
  }, []);

  async function criar(input: QuoteInput): Promise<void> {
    setSaving(true);
    setErro(null);
    try {
      const quote = await quotesApi.create(input);
      router.push(`/admin/orcamentos/${quote.id}`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orcamentos" className="text-sm text-brand-black/50 hover:text-brand-orange">
          ← Orçamentos
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Novo orçamento</h1>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      {clients === null ? (
        <p className="text-brand-black/50">Carregando clientes…</p>
      ) : clients.length === 0 ? (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Cadastre um cliente antes de criar um orçamento.{" "}
          <Link href="/admin/clientes" className="font-semibold underline">
            Ir para clientes
          </Link>
        </p>
      ) : (
        <QuoteForm
          clients={clients}
          submitting={saving}
          submitLabel="Criar orçamento"
          onSubmit={criar}
        />
      )}
    </div>
  );
}
