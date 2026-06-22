import { Module } from "@nestjs/common";
import { CashflowModule } from "../cashflow/cashflow.module";
import { ExportsController } from "./exports.controller";
import { ExportsService } from "./exports.service";

@Module({
  imports: [CashflowModule],
  controllers: [ExportsController],
  providers: [ExportsService],
})
export class ExportsModule {}
