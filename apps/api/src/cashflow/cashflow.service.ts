import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const round2 = (n: number): number => Math.round(n * 100) / 100;

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

type MonthBucket = {
  mes: string;
  entradasRealizadas: number;
  saidasRealizadas: number;
  entradasPrevistas: number;
  saidasPrevistas: number;
  saldoRealizado: number;
  saldoMes: number;
  saldoAcumulado: number;
};

@Injectable()
export class CashflowService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [receivables, expenses] = await Promise.all([
      this.prisma.receivable.findMany({
        where: { status: { not: "cancelado" } },
        select: { valor: true, status: true, vencimento: true, pagoEm: true },
      }),
      this.prisma.expense.findMany({
        select: { valor: true, status: true, data: true, pagoEm: true },
      }),
    ]);

    const buckets = new Map<string, MonthBucket>();
    const bucket = (mes: string): MonthBucket => {
      let b = buckets.get(mes);
      if (!b) {
        b = {
          mes,
          entradasRealizadas: 0,
          saidasRealizadas: 0,
          entradasPrevistas: 0,
          saidasPrevistas: 0,
          saldoRealizado: 0,
          saldoMes: 0,
          saldoAcumulado: 0,
        };
        buckets.set(mes, b);
      }
      return b;
    };

    for (const r of receivables) {
      if (r.status === "pago") {
        bucket(monthKey(r.pagoEm ?? r.vencimento)).entradasRealizadas += r.valor;
      } else {
        bucket(monthKey(r.vencimento)).entradasPrevistas += r.valor;
      }
    }
    for (const e of expenses) {
      if (e.status === "pago") {
        bucket(monthKey(e.pagoEm ?? e.data)).saidasRealizadas += e.valor;
      } else {
        bucket(monthKey(e.data)).saidasPrevistas += e.valor;
      }
    }

    const meses = [...buckets.values()].sort((a, b) =>
      a.mes.localeCompare(b.mes),
    );

    let acumulado = 0;
    for (const m of meses) {
      m.entradasRealizadas = round2(m.entradasRealizadas);
      m.saidasRealizadas = round2(m.saidasRealizadas);
      m.entradasPrevistas = round2(m.entradasPrevistas);
      m.saidasPrevistas = round2(m.saidasPrevistas);
      m.saldoRealizado = round2(m.entradasRealizadas - m.saidasRealizadas);
      m.saldoMes = round2(
        m.entradasRealizadas +
          m.entradasPrevistas -
          (m.saidasRealizadas + m.saidasPrevistas),
      );
      acumulado = round2(acumulado + m.saldoMes);
      m.saldoAcumulado = acumulado;
    }

    const sum = (sel: (m: MonthBucket) => number): number =>
      round2(meses.reduce((acc, m) => acc + sel(m), 0));

    const recebido = sum((m) => m.entradasRealizadas);
    const pago = sum((m) => m.saidasRealizadas);
    const aReceber = sum((m) => m.entradasPrevistas);
    const aPagar = sum((m) => m.saidasPrevistas);

    return {
      meses,
      totais: {
        recebido,
        pago,
        saldoRealizado: round2(recebido - pago),
        aReceber,
        aPagar,
        saldoPrevisto: round2(recebido + aReceber - (pago + aPagar)),
      },
    };
  }
}
