# Build a partir da RAIZ do monorepo:  docker build -f apps/web/Dockerfile .
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# --- builder: instala e compila o Next em modo standalone ---
FROM base AS builder
# Manifests primeiro (cache da instalação enquanto o código muda).
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc package.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
RUN pnpm install --frozen-lockfile
COPY . .
# Variáveis NEXT_PUBLIC_* são embutidas no bundle em build time — passar via build args.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
RUN pnpm --filter web build

# --- runner: imagem final slim ---
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
# Saída standalone (server.js + node_modules mínimo, a partir da raiz do monorepo).
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
