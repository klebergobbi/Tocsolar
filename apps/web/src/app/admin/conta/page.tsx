"use client";

import { useState } from "react";
import { changePassword, getStoredUser } from "@/lib/admin-api";

const inputCls =
  "w-full rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange";

export default function ContaPage() {
  const user = getStoredUser();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setMsg(null);
    if (novaSenha !== confirma) {
      setMsg({ tipo: "erro", texto: "A confirmação não confere." });
      return;
    }
    setSaving(true);
    try {
      await changePassword(senhaAtual, novaSenha);
      setMsg({ tipo: "ok", texto: "Senha alterada com sucesso." });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirma("");
    } catch (err) {
      setMsg({
        tipo: "erro",
        texto: err instanceof Error ? err.message : "Erro ao trocar a senha",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Minha conta</h1>
        <p className="text-sm text-brand-black/60">
          {user?.nome} · {user?.email}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-brand-black/10 bg-white p-6"
      >
        <h2 className="font-semibold">Trocar senha</h2>
        <div>
          <label className="mb-1 block text-sm font-medium">Senha atual</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nova senha</label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Confirmar nova senha
          </label>
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            className={inputCls}
          />
        </div>

        {msg && (
          <p
            className={`rounded-lg px-3 py-2 text-sm ${
              msg.tipo === "ok"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.texto}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Trocar senha"}
        </button>
      </form>
    </div>
  );
}
