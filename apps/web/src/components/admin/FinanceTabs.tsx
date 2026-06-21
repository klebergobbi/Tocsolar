"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/financeiro/recebiveis", label: "Contas a receber" },
  { href: "/admin/financeiro/despesas", label: "Despesas" },
  // { href: "/admin/financeiro/fluxo", label: "Fluxo de caixa" }, // Fase 3c
];

export function FinanceTabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 border-b border-brand-black/10">
      {TABS.map((t) => {
        const active = pathname?.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-brand-black/60 hover:text-brand-black"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
