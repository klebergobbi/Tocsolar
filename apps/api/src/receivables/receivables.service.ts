import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReceivableDto } from "./dto/create-receivable.dto";
import { GenerateReceivablesDto } from "./dto/generate-receivables.dto";
import { UpdateReceivableDto } from "./dto/update-receivable.dto";

// Parse de data de input (date-only ou ISO). Ancorada em 12:00 UTC p/ evitar
// "pulo de dia" ao exibir em fusos negativos (Brasil é UTC-3).
function parseDate(input: string): Date {
  return new Date(input.includes("T") ? input : `${input}T12:00:00.000Z`);
}

function addMonths(base: Date, months: number): Date {
  const d = new Date(base);
  const day = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + months);
  // Corrige overflow (ex.: 31/jan + 1 mês → cai p/ último dia do mês).
  if (d.getUTCDate() < day) {
    d.setUTCDate(0);
  }
  return d;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

const INCLUDE = {
  client: { select: { id: true, nome: true } },
  quote: { select: { id: true, numero: true } },
} satisfies Prisma.ReceivableInclude;

@Injectable()
export class ReceivablesService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: { status?: string; clientId?: string }) {
    const where: Prisma.ReceivableWhereInput = {};
    if (params.status) where.status = params.status;
    if (params.clientId) where.clientId = params.clientId;
    return this.prisma.receivable.findMany({
      where,
      orderBy: { vencimento: "asc" },
      include: INCLUDE,
    });
  }

  async get(id: string) {
    const r = await this.prisma.receivable.findUnique({
      where: { id },
      include: INCLUDE,
    });
    if (!r) {
      throw new NotFoundException("Conta a receber não encontrada");
    }
    return r;
  }

  async create(dto: CreateReceivableDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });
    if (!client) {
      throw new NotFoundException("Cliente não encontrado");
    }
    return this.prisma.receivable.create({
      data: {
        clientId: dto.clientId,
        quoteId: dto.quoteId,
        descricao: dto.descricao,
        parcela: dto.parcela ?? 1,
        totalParcelas: dto.totalParcelas ?? 1,
        valor: dto.valor,
        vencimento: parseDate(dto.vencimento),
        formaPagamento: dto.formaPagamento,
        observacoes: dto.observacoes,
      },
      include: INCLUDE,
    });
  }

  async update(id: string, dto: UpdateReceivableDto) {
    await this.get(id);
    const data: Prisma.ReceivableUpdateInput = {};
    if (dto.descricao !== undefined) data.descricao = dto.descricao;
    if (dto.valor !== undefined) data.valor = dto.valor;
    if (dto.vencimento !== undefined) data.vencimento = parseDate(dto.vencimento);
    if (dto.formaPagamento !== undefined) data.formaPagamento = dto.formaPagamento;
    if (dto.observacoes !== undefined) data.observacoes = dto.observacoes;

    if (dto.status !== undefined) {
      data.status = dto.status;
      // Ao marcar pago, registra a data; ao reverter, limpa.
      if (dto.status === "pago") {
        data.pagoEm = dto.pagoEm ? parseDate(dto.pagoEm) : new Date();
      } else {
        data.pagoEm = null;
      }
    } else if (dto.pagoEm !== undefined) {
      data.pagoEm = dto.pagoEm ? parseDate(dto.pagoEm) : null;
    }

    return this.prisma.receivable.update({
      where: { id },
      data,
      include: INCLUDE,
    });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.receivable.delete({ where: { id } });
    return { ok: true };
  }

  // Divide o total do orçamento em N parcelas mensais (resto na última).
  async generateFromQuote(quoteId: string, dto: GenerateReceivablesDto) {
    const quote = await this.prisma.quote.findUnique({ where: { id: quoteId } });
    if (!quote) {
      throw new NotFoundException("Orçamento não encontrado");
    }
    const n = dto.parcelas;
    const base = round2(quote.total / n);
    const primeiro = parseDate(dto.primeiroVencimento);

    const data = Array.from({ length: n }, (_, i) => ({
      clientId: quote.clientId,
      quoteId: quote.id,
      descricao: `Parcela ${i + 1}/${n}`,
      parcela: i + 1,
      totalParcelas: n,
      valor: i === n - 1 ? round2(quote.total - base * (n - 1)) : base,
      vencimento: addMonths(primeiro, i),
      formaPagamento: dto.formaPagamento,
    }));

    await this.prisma.receivable.createMany({ data });
    return this.prisma.receivable.findMany({
      where: { quoteId: quote.id },
      orderBy: { parcela: "asc" },
      include: INCLUDE,
    });
  }
}
