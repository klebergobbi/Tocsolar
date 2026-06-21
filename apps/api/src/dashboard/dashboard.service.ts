import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CashflowService } from "../cashflow/cashflow.service";

const pct = (part: number, whole: number): number =>
  whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0;

function toRecord(
  rows: { status: string; _count: number }[],
): Record<string, number> {
  return Object.fromEntries(rows.map((r) => [r.status, r._count]));
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cashflow: CashflowService,
  ) {}

  async summary() {
    const [
      leads,
      clientes,
      clientesGroup,
      orcamentos,
      orcamentosGroup,
      cf,
      proximos,
    ] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.client.count(),
      this.prisma.client.groupBy({ by: ["status"], _count: true }),
      this.prisma.quote.count(),
      this.prisma.quote.groupBy({ by: ["status"], _count: true }),
      this.cashflow.summary(),
      this.prisma.receivable.findMany({
        where: { status: "pendente" },
        orderBy: { vencimento: "asc" },
        take: 5,
        include: { client: { select: { nome: true } } },
      }),
    ]);

    const clientesPorStatus = toRecord(
      clientesGroup as { status: string; _count: number }[],
    );
    const orcamentosPorStatus = toRecord(
      orcamentosGroup as { status: string; _count: number }[],
    );
    const aprovados = orcamentosPorStatus["aprovado"] ?? 0;
    const fechados = clientesPorStatus["fechado"] ?? 0;

    return {
      funil: {
        leads,
        clientes,
        orcamentos,
        orcamentosAprovados: aprovados,
        clientesFechados: fechados,
        convLeadCliente: pct(clientes, leads),
        convOrcamentoAprovado: pct(aprovados, orcamentos),
      },
      clientesPorStatus,
      orcamentosPorStatus,
      financeiro: cf.totais,
      // Últimos 6 meses com movimento (realizado).
      receitaMensal: cf.meses.slice(-6).map((m) => ({
        mes: m.mes,
        entradas: m.entradasRealizadas,
        saidas: m.saidasRealizadas,
      })),
      proximosVencimentos: proximos.map((r) => ({
        id: r.id,
        descricao: r.descricao,
        cliente: r.client.nome,
        valor: r.valor,
        vencimento: r.vencimento,
      })),
    };
  }
}
