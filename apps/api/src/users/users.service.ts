import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { hash } from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

// Nunca expõe senhaHash.
const SELECT = {
  id: true,
  nome: true,
  email: true,
  role: true,
  ativo: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: SELECT,
    });
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("E-mail já cadastrado");
    }
    const senhaHash = await hash(dto.senha, 10);
    return this.prisma.user.create({
      data: { nome: dto.nome, email, senhaHash, role: dto.role },
      select: SELECT,
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.ensureExists(id);
    const data: Prisma.UserUpdateInput = {};
    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.ativo !== undefined) data.ativo = dto.ativo;
    if (dto.senha) data.senhaHash = await hash(dto.senha, 10);
    return this.prisma.user.update({ where: { id }, data, select: SELECT });
  }

  async remove(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw new BadRequestException("Você não pode excluir o próprio usuário");
    }
    await this.ensureExists(id);
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }

  private async ensureExists(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }
    return user;
  }
}
