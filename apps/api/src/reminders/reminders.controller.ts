import { Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { RemindersService } from "./reminders.service";

@Controller("reminders")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
export class RemindersController {
  constructor(private readonly reminders: RemindersService) {}

  // O que seria notificado agora (sem enviar) — útil para conferência.
  @Get("preview")
  preview() {
    return this.reminders.preview();
  }

  // Dispara o lembrete manualmente (além do cron diário).
  @Post("run")
  @HttpCode(200)
  run() {
    return this.reminders.run();
  }
}
