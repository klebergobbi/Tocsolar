import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CashflowService } from "./cashflow.service";

@Controller("cashflow")
@UseGuards(JwtAuthGuard)
export class CashflowController {
  constructor(private readonly cashflow: CashflowService) {}

  @Get()
  summary() {
    return this.cashflow.summary();
  }
}
