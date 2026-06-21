// Seed do usuário admin do painel. JS puro (sem ts-node) p/ rodar igual em dev
// e no container de produção: `node prisma/seed.cjs`.
// Credenciais via env (ADMIN_EMAIL/ADMIN_PASSWORD) ou defaults de bootstrap.
// TROCAR a senha após o primeiro acesso em produção.
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@tocsolar.com.br").toLowerCase();
  const senha = process.env.ADMIN_PASSWORD || "tocsolar123";
  const senhaHash = await hash(senha, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { nome: "Administrador", email, senhaHash, role: "admin" },
  });
  console.log("Admin pronto:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
