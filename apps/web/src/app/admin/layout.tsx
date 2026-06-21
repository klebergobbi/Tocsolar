"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearSession,
  getStoredUser,
  getToken,
  type AdminUser,
} from "@/lib/admin-api";

const NAV = [
  { href: "/admin", label: "Painel", exact: true },
  { href: "/admin/clientes", label: "Clientes", exact: false },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    setUser(getStoredUser());
    setReady(true);
  }, [isLogin, pathname, router]);

  // Tela de login: sem shell.
  if (isLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-black px-6">
        {children}
      </main>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-brand-black/50">
        Carregando…
      </div>
    );
  }

  function logout(): void {
    clearSession();
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-brand-black/[0.03]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-brand-black/10 bg-white md:flex">
        <div className="flex items-center gap-2 px-6 py-5 text-lg font-bold">
          <span className="inline-block h-3 w-3 rounded-full bg-brand-orange" aria-hidden />
          TOCSOLAR
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "text-brand-black/70 hover:bg-brand-black/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-brand-black/10 px-3 py-3 text-xs text-brand-black/50">
          Painel administrativo
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-brand-black/10 bg-white px-6 py-3">
          <span className="text-sm font-semibold md:hidden">TOCSOLAR Admin</span>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-brand-black/60">
              {user?.nome ?? user?.email}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-brand-black/15 px-3 py-1.5 text-sm font-medium text-brand-black/70 transition-colors hover:bg-brand-black/5"
            >
              Sair
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
