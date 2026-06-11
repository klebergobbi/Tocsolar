import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class AppController {
  @Get()
  check(): { status: string; service: string } {
    return { status: "ok", service: "tocsolar-api" };
  }
}
