import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import type { Job } from "bullmq";
import {
  LEAD_NOTIFICATIONS_QUEUE,
  LeadNotificationJob,
  type LeadNotificationData,
} from "./notifications.constants";
import { EvolutionService } from "./evolution.service";
import { MailService } from "./mail.service";

@Processor(LEAD_NOTIFICATIONS_QUEUE)
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly evolution: EvolutionService,
    private readonly mail: MailService,
  ) {
    super();
  }

  async process(job: Job<LeadNotificationData>): Promise<void> {
    switch (job.name) {
      case LeadNotificationJob.WhatsApp:
        await this.evolution.notifyLead(job.data);
        break;
      case LeadNotificationJob.Email:
        await this.mail.notifyLead(job.data);
        break;
      default:
        this.logger.warn(`Job desconhecido na fila: ${job.name}`);
    }
  }
}
