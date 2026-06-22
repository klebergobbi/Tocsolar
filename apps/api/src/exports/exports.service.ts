import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CashflowService } from "../cashflow/cashflow.service";

type Cell = string | number | null | undefined;

function csvEscape(v: Cell): string {
  const s = v == null ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Separador ";" e BOM UTF-8 → abre certinho no Excel pt-BR (acentos + colunas).
function toCsv(headers: string[], rows: Cell[][]): string {
  const lines = [
    headers.join(";"),
    ...rows.map((r) => r.map(csvEscape).join(";")),
  ];
  return "﻿" + lines.join("\r\n");
}

function dateBR(d: Date | string | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

// Número com vírgula decimal (pareia com o separador ";").
function numBR(n: number | null | undefined): string {
  return n == null ? "" : n.toFixed(2).replace(".", ",");
}

@Injectable()
export class ExportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cashflow: CashflowService,
  ) {}

  async clientes(): Promise<string> {
    const clients = await this.prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });
    return toCsv(
      [
        "Nome",
        "WhatsApp",
        "E-mail",
        "Documento",
        "Cidade",
        "Tipo",
        "Status",
        "Conta (R$/mês)",
        "Cadastro",
      ],
      clients.map((c) => [
        c.nome,
        c.whatsapp,
        c.email,
        c.documento,
        c.cidade,
        c.tipo,
        c.status,
        numBR(c.valorConta),
        dateBR(c.createdAt),
      ]),
    );
  }

  async recebiveis(): Promise<string> {
    const itens = await this.prisma.receivable.findMany({
      orderBy: { vencimento: "asc" },
      include: { client: { select: { nome: true } } },
    });
    return toCsv(
      [
        "Vencimento",
        "Cliente",
        "Descrição",
        "Valor",
        "Status",
        "Pago em",
        "Forma de pagamento",
      ],
      itens.map((r) => [
        dateBR(r.vencimento),
        r.client.nome,
        r.descricao,
        numBR(r.valor),
        r.status,
        dateBR(r.pagoEm),
        r.formaPagamento,
      ]),
    );
  }

  async despesas(): Promise<string> {
    const itens = await this.prisma.expense.findMany({
      orderBy: { data: "desc" },
    });
    return toCsv(
      ["Data", "Descrição", "Categoria", "Fornecedor", "Valor", "Status"],
      itens.map((e) => [
        dateBR(e.data),
        e.descricao,
        e.categoria,
        e.fornecedor,
        numBR(e.valor),
        e.status,
      ]),
    );
  }

  async fluxo(): Promise<string> {
    const cf = await this.cashflow.summary();
    return toCsv(
      [
        "Mês",
        "Entradas realizadas",
        "Saídas realizadas",
        "Saldo realizado",
        "Entradas previstas",
        "Saídas previstas",
        "Saldo acumulado",
      ],
      cf.meses.map((m) => [
        m.mes,
        numBR(m.entradasRealizadas),
        numBR(m.saidasRealizadas),
        numBR(m.saldoRealizado),
        numBR(m.entradasPrevistas),
        numBR(m.saidasPrevistas),
        numBR(m.saldoAcumulado),
      ]),
    );
  }
}
