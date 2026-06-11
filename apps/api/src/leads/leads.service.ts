import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import type { Queue } from "bullmq";
import { PrismaService } from "../prisma/prisma.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import {
  LEAD_NOTIFICATIONS_QUEUE,
  LeadNotificationJob,
  type LeadNotificationData,
} from "../notifications/notifications.constants";

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(LEAD_NOTIFICATIONS_QUEUE)
    private readonly notifications: Queue<LeadNotificationData>,
  ) {}

  async create(dto: CreateLeadDto): Promise<{ id: string }> {
    const lead = await this.prisma.lead.create({
      data: {
        nome: dto.nome,
        whatsapp: dto.whatsapp,
        email: dto.email,
        cidade: dto.cidade,
        tipo: dto.tipo,
        valorConta: dto.valorConta,
        economiaEstimada: dto.economiaEstimada,
        systemKwp: dto.systemKwp,
        origem: dto.origem,
        campanha: dto.campanha,
        mensagem: dto.mensagem,
      },
    });

    this.logger.log(`Lead criado: ${lead.id} (${dto.tipo}, origem=${dto.origem ?? "—"})`);

    // Notificações são best-effort: o lead já está salvo, então falha de fila
    // não deve derrubar a resposta 201.
    const data: LeadNotificationData = {
      id: lead.id,
      nome: lead.nome,
      whatsapp: lead.whatsapp,
      tipo: lead.tipo,
      cidade: lead.cidade,
      email: lead.email,
      valorConta: lead.valorConta,
      origem: lead.origem,
      campanha: lead.campanha,
      mensagem: lead.mensagem,
    };
    try {
      await Promise.all([
        this.notifications.add(LeadNotificationJob.WhatsApp, data),
        this.notifications.add(LeadNotificationJob.Email, data),
      ]);
    } catch (err) {
      this.logger.error("Falha ao enfileirar notificações do lead", err as Error);
    }

    return { id: lead.id };
  }
}
