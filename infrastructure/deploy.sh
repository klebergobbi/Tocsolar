#!/usr/bin/env bash
# Deploy da stack TOCSOLAR no droplet. Rodar a partir da raiz do repo no droplet.
#   bash infrastructure/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."
COMPOSE="docker compose -f infrastructure/docker-compose.prod.yml --env-file infrastructure/.env.prod"

# 1. Swap — o build do Next.js precisa de mais RAM que o droplet de 1GB tem.
if ! swapon --show | grep -q '/swapfile'; then
  echo ">> Criando 2G de swap..."
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# 2. Build (sequencial p/ não estourar memória) e sobe.
echo ">> Buildando imagens (api, depois web)..."
$COMPOSE build api
$COMPOSE build web

echo ">> Subindo a stack..."
$COMPOSE up -d

echo ">> Status:"
$COMPOSE ps
