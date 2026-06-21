import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

export type AuthResult = {
  token: string;
  user: { id: string; nome: string; email: string; role: string };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    // Mesma resposta p/ usuário inexistente, inativo ou senha errada (não vaza qual).
    if (!user || !user.ativo) {
      throw new UnauthorizedException("Credenciais inválidas");
    }
    const ok = await compare(dto.senha, user.senhaHash);
    if (!ok) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      token,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
    };
  }

  async me(id: string): Promise<AuthResult["user"]> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || !user.ativo) {
      throw new UnauthorizedException();
    }
    return { id: user.id, nome: user.nome, email: user.email, role: user.role };
  }
}
