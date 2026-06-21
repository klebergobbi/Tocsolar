import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { LEAD_NOTIFICATIONS_QUEUE } from "./notifications.constants";
import { NotificationsProcessor } from "./notifications.processor";
import { EvolutionService } from "./evolution.service";
import { MailService } from "./mail.service";

@Module({
  imports: [
    BullModule.registerQueue({
      name: LEAD_NOTIFICATIONS_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    }),
  ],
  providers: [NotificationsProcessor, EvolutionService, MailService],
  // Reexporta BullModule (fila) + services de envio (reusados nos lembretes).
  exports: [BullModule, EvolutionService, MailService],
})
export class NotificationsModule {}
