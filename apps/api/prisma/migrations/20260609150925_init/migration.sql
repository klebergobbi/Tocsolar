-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "cidade" TEXT,
    "tipo" TEXT NOT NULL,
    "valorConta" DOUBLE PRECISION,
    "economiaEstimada" DOUBLE PRECISION,
    "systemKwp" DOUBLE PRECISION,
    "origem" TEXT,
    "campanha" TEXT,
    "mensagem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
