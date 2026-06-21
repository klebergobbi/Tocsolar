import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";
import { QuoteItemDto } from "./dto/quote-item.dto";
import { UpdateQuoteDto } from "./dto/update-quote.dto";

function subtotalOf(items: { quantidade: number; valorUnit: number }[]): number {
  return items.reduce((acc, i) => acc + i.quantidade * i.valorUnit, 0);
}

function totalOf(
  items: { quantidade: number; valorUnit: number }[],
  desconto: number,
): number {
  return Math.max(0, subtotalOf(items) - desconto);
}

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  list(clientId?: string) {
    return this.prisma.quote.findMany({
      where: clientId ? { clientId } : undefined,
      orderBy: { numero: "desc" },
      include: {
        client: { select: { id: true, nome: true } },
        _count: { select: { items: true } },
      },
    });
  }

  async get(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: { client: true, items: { orderBy: { ordem: "asc" } } },
    });
    if (!quote) {
      throw new NotFoundException("Orçamento não encontrado");
    }
    return quote;
  }

  async create(dto: CreateQuoteDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });
    if (!client) {
      throw new NotFoundException("Cliente não encontrado");
    }
    const desconto = dto.desconto ?? 0;
    const total = totalOf(dto.items, desconto);

    // Número sequencial dentro de uma transação (escopo pequeno; evita corrida comum).
    return this.prisma.$transaction(async (tx) => {
      const last = await tx.quote.findFirst({
        orderBy: { numero: "desc" },
        select: { numero: true },
      });
      const numero = (last?.numero ?? 0) + 1;
      return tx.quote.create({
        data: {
          numero,
          clientId: dto.clientId,
          systemKwp: dto.systemKwp,
          validadeDias: dto.validadeDias ?? 15,
          desconto,
          total,
          observacoes: dto.observacoes,
          items: {
            create: dto.items.map((it: QuoteItemDto, i: number) => ({
              descricao: it.descricao,
              quantidade: it.quantidade,
              valorUnit: it.valorUnit,
              ordem: i,
            })),
          },
        },
        include: { client: true, items: { orderBy: { ordem: "asc" } } },
      });
    });
  }

  async update(id: string, dto: UpdateQuoteDto) {
    const existing = await this.get(id);
    const desconto = dto.desconto ?? existing.desconto;

    const data: Prisma.QuoteUpdateInput = {};
    if (dto.systemKwp !== undefined) data.systemKwp = dto.systemKwp;
    if (dto.validadeDias !== undefined) data.validadeDias = dto.validadeDias;
    if (dto.desconto !== undefined) data.desconto = dto.desconto;
    if (dto.observacoes !== undefined) data.observacoes = dto.observacoes;
    if (dto.status !== undefined) data.status = dto.status;

    if (dto.items) {
      // Substitui os itens e recalcula o total.
      data.total = totalOf(dto.items, desconto);
      data.items = {
        deleteMany: {},
        create: dto.items.map((it: QuoteItemDto, i: number) => ({
          descricao: it.descricao,
          quantidade: it.quantidade,
          valorUnit: it.valorUnit,
          ordem: i,
        })),
      };
    } else if (dto.desconto !== undefined) {
      // Itens iguais, mas o desconto mudou → recalcula sobre os itens atuais.
      data.total = Math.max(0, subtotalOf(existing.items) - desconto);
    }

    return this.prisma.quote.update({
      where: { id },
      data,
      include: { client: true, items: { orderBy: { ordem: "asc" } } },
    });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.quote.delete({ where: { id } });
    return { ok: true };
  }
}
