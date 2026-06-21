"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await login(email.trim(), senha);
      router.replace("/admin");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
      <div className="mb-6 flex items-center gap-2 text-lg font-bold">
        <span className="inline-block h-3 w-3 rounded-full bg-brand-orange" aria-hidden />
        TOCSOLAR · Admin
      </div>
      <h1 className="mb-1 text-xl font-bold">Entrar no painel</h1>
      <p className="mb-6 text-sm text-brand-black/60">
        Acesso restrito à equipe.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          />
        </div>
        <div>
          <label htmlFor="senha" className="mb-1 block text-sm font-medium">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          />
        </div>

        {erro && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
