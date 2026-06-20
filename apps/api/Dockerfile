# Build a partir da RAIZ do monorepo:  docker build -f apps/api/Dockerfile .
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# --- builder: instala, gera Prisma Client, compila o Nest e cria dir self-contained ---
FROM base AS builder
# Manifests primeiro (cache da instalação enquanto o código muda).
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api build
# pnpm deploy cria /prod/api com node_modules de produção sem symlinks (ideal p/ Docker).
RUN pnpm --filter api deploy --prod /prod/api

# --- runner ---
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001
WORKDIR /app
# Prisma no Alpine precisa de libssl (openssl) p/ os engines (migrate + queries em runtime).
RUN apk add --no-cache openssl
COPY --from=builder /prod/api ./
# Garante schema + migrations no runner (prisma migrate/generate em runtime — ver compose).
COPY --from=builder /app/apps/api/prisma ./prisma
EXPOSE 3001
# Migrations são aplicadas no runtime (prisma migrate deploy) antes de subir — ver infrastructure/docker-compose.prod.yml.
CMD ["node", "dist/main.js"]
