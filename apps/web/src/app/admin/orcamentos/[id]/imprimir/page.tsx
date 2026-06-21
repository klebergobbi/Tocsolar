"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatBRL, quotesApi, type Quote } from "@/lib/admin-api";

const WHATSAPP = "5585991618044";

export default function ImprimirOrcamentoPage() {
  const params = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    quotesApi
      .get(params.id)
      .then(setQuote)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }, [params.id]);

  if (erro) {
    return <p className="p-8 text-sm text-red-700">{erro}</p>;
  }
  if (!quote) {
    return <p className="p-8 text-brand-black/50">Carregando…</p>;
  }

  const subtotal = quote.items.reduce(
    (s, i) => s + i.quantidade * i.valorUnit,
    0,
  );
  const emissao = new Date(quote.createdAt).toLocaleDateString("pt-BR");

  return (
    <div className="mx-auto max-w-3xl p-8 text-brand-black">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <a href={`/admin/orcamentos/${quote.id}`} className="text-sm text-brand-black/50 hover:text-brand-orange">
          ← Voltar
        </a>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-brand-orange px-5 py-2 text-sm font-semibold text-brand-black"
        >
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Cabeçalho */}
      <header className="flex items-start justify-between border-b-2 border-brand-orange pb-4">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="inline-block h-3 w-3 rounded-full bg-brand-orange" />
            TOCSOLAR Energia Solar
          </div>
          <p className="mt-1 text-sm text-brand-black/60">
            Fortaleza/CE · WhatsApp {WHATSAPP}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-lg font-bold">
            Orçamento #{String(quote.numero).padStart(4, "0")}
          </p>
          <p className="text-brand-black/60">Emissão: {emissao}</p>
          <p className="text-brand-black/60">Validade: {quote.validadeDias} dias</p>
        </div>
      </header>

      {/* Cliente */}
      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-black/50">
          Cliente
        </h2>
        <p className="font-medium">{quote.client.nome}</p>
        <p className="text-sm text-brand-black/70">
          {quote.client.whatsapp}
          {quote.client.cidade ? ` · ${quote.client.cidade}` : ""}
        </p>
        {quote.systemKwp != null && (
          <p className="mt-1 text-sm text-brand-black/70">
            Sistema estimado: <strong>{quote.systemKwp} kWp</strong>
          </p>
        )}
      </section>

      {/* Itens */}
      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-brand-black/20 text-left">
            <th className="py-2 font-semibold">Descrição</th>
            <th className="py-2 text-right font-semibold">Qtd</th>
            <th className="py-2 text-right font-semibold">Valor unit.</th>
            <th className="py-2 text-right font-semibold">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {quote.items.map((it) => (
            <tr key={it.id} className="border-b border-brand-black/10">
              <td className="py-2">{it.descricao}</td>
              <td className="py-2 text-right">{it.quantidade}</td>
              <td className="py-2 text-right">{formatBRL(it.valorUnit)}</td>
              <td className="py-2 text-right">
                {formatBRL(it.quantidade * it.valorUnit)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totais */}
      <div className="mt-4 flex flex-col items-end gap-1 text-sm">
        <div className="flex w-64 justify-between">
          <span className="text-brand-black/60">Subtotal</span>
          <span>{formatBRL(subtotal)}</span>
        </div>
        {quote.desconto > 0 && (
          <div className="flex w-64 justify-between">
            <span className="text-brand-black/60">Desconto</span>
            <span>− {formatBRL(quote.desconto)}</span>
          </div>
        )}
        <div className="flex w-64 justify-between border-t border-brand-black/20 pt-1 text-lg font-bold">
          <span>Total</span>
          <span className="text-brand-orange">{formatBRL(quote.total)}</span>
        </div>
      </div>

      {quote.observacoes && (
        <section className="mt-6">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-black/50">
            Observações
          </h2>
          <p className="whitespace-pre-wrap text-sm text-brand-black/80">
            {quote.observacoes}
          </p>
        </section>
      )}

      <footer className="mt-10 border-t border-brand-black/10 pt-4 text-xs text-brand-black/50">
        Valores são uma estimativa; o orçamento final é confirmado em visita
        técnica. TOCSOLAR Energia Solar — Fortaleza/CE.
      </footer>
    </div>
  );
}
