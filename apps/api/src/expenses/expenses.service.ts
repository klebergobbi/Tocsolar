import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";

function parseDate(input: string): Date {
  return new Date(input.includes("T") ? input : `${input}T12:00:00.000Z`);
}

const INCLUDE = {
  quote: { select: { id: true, numero: true } },
} satisfies Prisma.ExpenseInclude;

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: {
    categoria?: string;
    status?: string;
    from?: string;
    to?: string;
  }) {
    const where: Prisma.ExpenseWhereInput = {};
    if (params.categoria) where.categoria = params.categoria;
    if (params.status) where.status = params.status;
    if (params.from || params.to) {
      const data: Prisma.DateTimeFilter = {};
      if (params.from) data.gte = parseDate(params.from);
      if (params.to) data.lte = parseDate(params.to);
      where.data = data;
    }
    return this.prisma.expense.findMany({
      where,
      orderBy: { data: "desc" },
      include: INCLUDE,
    });
  }

  async get(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: INCLUDE,
    });
    if (!expense) {
      throw new NotFoundException("Despesa não encontrada");
    }
    return expense;
  }

  create(dto: CreateExpenseDto) {
    const status = dto.status ?? "pago";
    const data = parseDate(dto.data);
    return this.prisma.expense.create({
      data: {
        descricao: dto.descricao,
        categoria: dto.categoria,
        valor: dto.valor,
        data,
        status,
        pagoEm: status === "pago" ? data : null,
        fornecedor: dto.fornecedor,
        formaPagamento: dto.formaPagamento,
        quoteId: dto.quoteId,
        observacoes: dto.observacoes,
      },
      include: INCLUDE,
    });
  }

  async update(id: string, dto: UpdateExpenseDto) {
    await this.get(id);
    const data: Prisma.ExpenseUpdateInput = {};
    if (dto.descricao !== undefined) data.descricao = dto.descricao;
    if (dto.categoria !== undefined) data.categoria = dto.categoria;
    if (dto.valor !== undefined) data.valor = dto.valor;
    if (dto.data !== undefined) data.data = parseDate(dto.data);
    if (dto.fornecedor !== undefined) data.fornecedor = dto.fornecedor;
    if (dto.formaPagamento !== undefined) data.formaPagamento = dto.formaPagamento;
    if (dto.observacoes !== undefined) data.observacoes = dto.observacoes;
    if (dto.status !== undefined) {
      data.status = dto.status;
      if (dto.status === "pago") {
        data.pagoEm = dto.pagoEm ? parseDate(dto.pagoEm) : new Date();
      } else {
        data.pagoEm = null;
      }
    }
    return this.prisma.expense.update({
      where: { id },
      data,
      include: INCLUDE,
    });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.expense.delete({ where: { id } });
    return { ok: true };
  }
}
