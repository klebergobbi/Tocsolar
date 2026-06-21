import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: { status?: string; search?: string }) {
    const where: Prisma.ClientWhereInput = {};
    if (params.status) {
      where.status = params.status;
    }
    if (params.search) {
      where.OR = [
        { nome: { contains: params.search, mode: "insensitive" } },
        { whatsapp: { contains: params.search } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }
    return this.prisma.client.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async get(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException("Cliente não encontrado");
    }
    return client;
  }

  create(dto: CreateClientDto) {
    return this.prisma.client.create({ data: dto });
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.get(id);
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.client.delete({ where: { id } });
    return { ok: true };
  }

  // Converte um Lead em Client. Idempotente: leadId é único, então reusa se já existe.
  async fromLead(leadId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundException("Lead não encontrado");
    }
    const existing = await this.prisma.client.findUnique({ where: { leadId } });
    if (existing) {
      return existing;
    }
    return this.prisma.client.create({
      data: {
        nome: lead.nome,
        whatsapp: lead.whatsapp,
        email: lead.email ?? undefined,
        cidade: lead.cidade ?? undefined,
        tipo: lead.tipo,
        valorConta: lead.valorConta ?? undefined,
        leadId: lead.id,
      },
    });
  }
}
