import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

// Marca rotas/controllers que exigem um dos perfis informados (ex.: @Roles("admin")).
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
