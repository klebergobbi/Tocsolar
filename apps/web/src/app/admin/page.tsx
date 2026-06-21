"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CLIENT_STATUS, clientsApi, type Client } from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    clientsApi
      .list()
      .then(setClients)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }, []);

  const total = clients?.length ?? 0;
  const porStatus = (status: Client["status"]) =>
    clients?.filter((c) => c.status === status).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Painel</h1>
        <p className="text-sm text-brand-black/60">Visão geral da carteira de clientes.</p>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-brand-black/10 bg-white p-5">
          <p className="text-sm text-brand-black/60">Total de clientes</p>
          <p className="mt-1 text-3xl font-bold">
            {clients === null ? "—" : total}
          </p>
        </div>
        {CLIENT_STATUS.map((s) => (
          <div
            key={s.value}
            className="rounded-2xl border border-brand-black/10 bg-white p-5"
          >
            <p className="text-sm text-brand-black/60">{s.label}</p>
            <p className="mt-1 text-3xl font-bold">
              {clients === null ? "—" : porStatus(s.value)}
            </p>
          </div>
        ))}
      </div>

      <Link
        href="/admin/clientes"
        className="inline-block rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
      >
        Ver clientes
      </Link>
    </div>
  );
}
