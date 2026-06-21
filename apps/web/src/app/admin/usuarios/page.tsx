"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ROLE_LABEL,
  usersApi,
  type ManagedUser,
  type Role,
} from "@/lib/admin-api";

type NewUser = { nome: string; email: string; senha: string; role: Role };
const EMPTY: NewUser = { nome: "", email: "", senha: "", role: "comercial" };

const inputCls =
  "rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange";

export default function UsuariosPage() {
  const [users, setUsers] = useState<ManagedUser[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [novo, setNovo] = useState<NewUser>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setErro(null);
    usersApi
      .list()
      .then(setUsers)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function criar(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setSaving(true);
    setErro(null);
    try {
      await usersApi.create({
        nome: novo.nome.trim(),
        email: novo.email.trim(),
        senha: novo.senha,
        role: novo.role,
      });
      setNovo(EMPTY);
      load();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao criar usuário");
    } finally {
      setSaving(false);
    }
  }

  async function patch(
    id: string,
    data: Partial<{ role: Role; ativo: boolean }>,
  ): Promise<void> {
    try {
      await usersApi.update(id, data);
      load();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao atualizar");
    }
  }

  async function resetSenha(u: ManagedUser): Promise<void> {
    const senha = window.prompt(`Nova senha para ${u.nome} (mín. 6 caracteres):`);
    if (!senha) return;
    try {
      await usersApi.update(u.id, { senha });
      window.alert("Senha atualizada.");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao redefinir senha");
    }
  }

  async function excluir(u: ManagedUser): Promise<void> {
    if (!window.confirm(`Excluir o usuário ${u.nome}?`)) return;
    try {
      await usersApi.remove(u.id);
      setUsers((prev) => prev?.filter((x) => x.id !== u.id) ?? prev);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao excluir");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-sm text-brand-black/60">
          Acesso ao painel. Comercial não vê o Financeiro.
        </p>
      </div>

      <form
        onSubmit={criar}
        className="grid gap-3 rounded-2xl border border-brand-black/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-5"
      >
        <input
          required
          placeholder="Nome *"
          value={novo.nome}
          onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
          className={inputCls}
        />
        <input
          required
          type="email"
          placeholder="E-mail *"
          value={novo.email}
          onChange={(e) => setNovo({ ...novo, email: e.target.value })}
          className={inputCls}
        />
        <input
          required
          type="password"
          placeholder="Senha *"
          value={novo.senha}
          onChange={(e) => setNovo({ ...novo, senha: e.target.value })}
          className={inputCls}
        />
        <select
          value={novo.role}
          onChange={(e) => setNovo({ ...novo, role: e.target.value as Role })}
          className={inputCls}
        >
          <option value="comercial">Comercial</option>
          <option value="admin">Administrador</option>
        </select>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Adicionar"}
        </button>
      </form>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-brand-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-black/10 text-left text-brand-black/50">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Perfil</th>
              <th className="px-4 py-3 font-medium">Ativo</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-brand-black/5 last:border-0">
                <td className="px-4 py-3 font-medium">{u.nome}</td>
                <td className="px-4 py-3 text-brand-black/70">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => patch(u.id, { role: e.target.value as Role })}
                    className="rounded-lg border border-brand-black/15 px-2 py-1 text-xs outline-none focus:border-brand-orange"
                  >
                    <option value="comercial">{ROLE_LABEL.comercial}</option>
                    <option value="admin">{ROLE_LABEL.admin}</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => patch(u.id, { ativo: !u.ativo })}
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      u.ativo
                        ? "bg-green-50 text-green-700"
                        : "bg-brand-black/5 text-brand-black/50"
                    }`}
                  >
                    {u.ativo ? "Ativo" : "Inativo"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => resetSenha(u)}
                      className="text-xs font-medium text-brand-black/60 hover:underline"
                    >
                      Redefinir senha
                    </button>
                    <button
                      type="button"
                      onClick={() => excluir(u)}
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
