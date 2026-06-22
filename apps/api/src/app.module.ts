import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bullmq";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { LeadsModule } from "./leads/leads.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ClientsModule } from "./clients/clients.module";
import { QuotesModule } from "./quotes/quotes.module";
import { ReceivablesModule } from "./receivables/receivables.module";
import { ExpensesModule } from "./expenses/expenses.module";
import { CashflowModule } from "./cashflow/cashflow.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { RemindersModule } from "./reminders/reminders.module";
import { ExportsModule } from "./exports/exports.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>("REDIS_HOST", "localhost"),
          port: Number(config.get<string>("REDIS_PORT", "6379")),
          password: config.get<string>("REDIS_PASSWORD") || undefined,
        },
      }),
    }),
    PrismaModule,
    LeadsModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    QuotesModule,
    ReceivablesModule,
    ExpensesModule,
    CashflowModule,
    DashboardModule,
    RemindersModule,
    ExportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
