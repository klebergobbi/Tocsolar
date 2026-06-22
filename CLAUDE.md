\# CLAUDE.md — Projeto TOCSOLAR (Site de Captação + API de Leads)



> Este arquivo é a fonte de verdade do projeto. Leia inteiro antes de qualquer sessão.

> Padrão Lumentech: \*\*uma sessão = uma feature, máximo 3–5 arquivos por sessão.\*\*

> Não invente requisitos. Se faltar dado da marca, use os placeholders marcados `<<CONFIRMAR>>` e siga.



\---



\## 1. O que é o projeto



Site de \*\*geração de leads\*\* para a \*\*TOCSOLAR Energia Solar\*\* (instalador/integrador turnkey em Fortaleza/CE). \*\*Não é e-commerce.\*\* O objetivo único é transformar tráfego (Google Ads + SEO local + Instagram) em \*\*leads qualificados de orçamento\*\* que caem no WhatsApp e no CRM do comercial.



\*\*Métrica de sucesso do produto:\*\* lead qualificado por mês ao menor custo por lead, com rastreio completo (form, clique WhatsApp, simulador concluído).



\*\*O que NÃO construir:\*\* carrinho, checkout, catálogo de produtos, login de cliente, pagamento. Nada disso.



\---



\## 2. Stack (padrão Lumentech)



| Camada | Tecnologia |

|---|---|

| Monorepo | Turborepo + pnpm |

| Front | Next.js 14 (App Router) + TypeScript + TailwindCSS |

| Imagens | `next/image` (otimização obrigatória p/ LCP) |

| API de leads | NestJS + Prisma |

| Banco | PostgreSQL |

| Fila/jobs | Redis + BullMQ |

| WhatsApp | Evolution API |

| E-mail comercial | (SMTP/Resend) `<<CONFIRMAR>>` |

| Deploy | DigitalOcean (front via build estático/SSR; API em container) |

| Analytics | GTM + GA4 + Google Ads Conversions |



\### Estrutura do monorepo

```

tocsolar/

├── apps/

│   ├── web/          # Next.js 14 (site)

│   └── api/          # NestJS (leads)

├── packages/

│   ├── ui/           # componentes compartilhados (se necessário)

│   └── config/       # eslint/tsconfig/tailwind preset

├── CLAUDE.md

└── turbo.json

```



\---



\## 3. Marca TOCSOLAR



\- \*\*Nome:\*\* TOCSOLAR Energia Solar

\- \*\*Praça:\*\* Fortaleza/CE + Região Metropolitana `<<CONFIRMAR cidades exatas>>`

\- \*\*Posicionamento:\*\* "Energia solar que realmente economiza. Do orçamento à instalação."

\- \*\*Provas:\*\* milhares de projetos no Ceará, equipe própria, homologação inclusa.

\- \*\*WhatsApp oficial:\*\* `5585991618044`

\- \*\*Instagram:\*\* @tocsolar (\~10,1k seguidores) — embedar reels como prova social.

\- \*\*Cores:\*\* laranja (sol) + preto/grafite (base). Tokens em `tailwind.config`.

&#x20; - `--brand-orange: #F59E0B` `<<CONFIRMAR hex exato da marca>>`

&#x20; - `--brand-black: #1A1A1A`

&#x20; - acentos neutros para texto/fundo claro.

\- \*\*Tom de voz:\*\* direto, confiável, foco em economia concreta (R$/mês, payback). Sem jargão técnico no copy de conversão.



\---



\## 4. Arquitetura de páginas (web)



```

/                              Home — landing de conversão completa

/energia-solar-residencial     LP segmentada (Ads + SEO)

/energia-solar-empresarial     LP segmentada (Ads + SEO)

/como-funciona                 Educação + quebra de objeção

/projetos                      Portfólio/galeria (prova social)

/simulador                     Simulador de economia (lead magnet)

/sobre                         Autoridade local

/contato                       WhatsApp + form + mapa + GBP

/obrigado                      Página de conversão (Ads/pixel) — OBRIGATÓRIA

/blog/\[slug]                   SEO fundo de funil (MDX)

```



> \*\*Regra fixa:\*\* todo lead bem-sucedido redireciona para `/obrigado`, onde disparam os eventos de conversão (GA4 + Google Ads). Mesmo padrão do `/contato-enviado` do Meu Passaporte Europeu.



\### Renderização

\- Páginas de marketing: \*\*SSG/ISR\*\* (SEO + velocidade). Core Web Vitals verde é requisito, não desejo.

\- Sem `localStorage`/`sessionStorage` para estado crítico de lead — sempre POST para a API.



\---



\## 5. Componentes (web)



```

components/

&#x20; layout/   Header.tsx · Footer.tsx · WhatsAppFloat.tsx

&#x20; lead/     LeadForm.tsx · SolarSimulator.tsx

&#x20; sections/ Hero.tsx · PainPromise.tsx · HowItWorks.tsx ·

&#x20;           ProjectsGallery.tsx · Testimonials.tsx · StatsCounter.tsx ·

&#x20;           SegmentCards.tsx · Differentials.tsx · FAQ.tsx · CTASection.tsx

lib/

&#x20; solar-calc.ts   # cálculo economia/payback

&#x20; analytics.ts    # GTM/GA4 + eventos

&#x20; whatsapp.ts     # monta wa.me com UTM + mensagem pré-preenchida

&#x20; schema.ts       # JSON-LD (LocalBusiness, FAQPage, Review)

```



\### Contratos importantes

\- `LeadForm` e `SolarSimulator` enviam `POST /api/leads` e, no sucesso, `router.push('/obrigado')` + `trackConversion()`.

\- `whatsapp.ts` deve propagar UTM (`utm\_source/medium/campaign`) na mensagem para o comercial saber a origem do lead.



\---



\## 6. API de Leads (NestJS)



\### Endpoint

`POST /api/leads`



```ts

// DTO

class CreateLeadDto {

&#x20; nome: string;          // obrigatório

&#x20; whatsapp: string;      // obrigatório, validar formato BR

&#x20; email?: string;

&#x20; cidade?: string;

&#x20; tipo: 'residencial' | 'empresarial' | 'rural';

&#x20; valorConta?: number;   // R$/mês informado no simulador

&#x20; economiaEstimada?: number;

&#x20; systemKwp?: number;

&#x20; origem?: string;       // utm\_source

&#x20; campanha?: string;     // utm\_campaign

&#x20; mensagem?: string;

}

```



\### Fluxo

1\. Valida DTO (class-validator). Rejeita spam (honeypot + rate limit por IP).

2\. Persiste em `Lead` (Prisma/Postgres).

3\. Enfileira jobs (BullMQ): (a) notificar comercial via Evolution/WhatsApp; (b) e-mail interno; (c) opcional: auto-resposta ao lead.

4\. Retorna `201` rápido (jobs são assíncronos).



\### Modelo Prisma (mínimo)

```prisma

model Lead {

&#x20; id              String   @id @default(uuid())

&#x20; nome            String

&#x20; whatsapp        String

&#x20; email           String?

&#x20; cidade          String?

&#x20; tipo            String

&#x20; valorConta      Float?

&#x20; economiaEstimada Float?

&#x20; systemKwp       Float?

&#x20; origem          String?

&#x20; campanha        String?

&#x20; mensagem        String?

&#x20; createdAt       DateTime @default(now())

}

```



\---



\## 7. Cálculo do simulador (`lib/solar-calc.ts`)



Entrada: `valorConta` (R$/mês), `tipo`. Saída: `economiaMensalEstimada`, `systemKwp`, `paybackMeses`.



\- Usar \*\*tarifa média Enel CE\*\* `<<CONFIRMAR R$/kWh>>` e irradiação média de Fortaleza (\~5,4–5,7 kWh/m²/dia).

\- Modelo simplificado e \*\*conservador\*\* (subestimar economia é melhor que prometer demais — alinha com a pesquisa de satisfação do setor, onde a insatisfação vem de expectativa de retorno furada).

\- Deixar constantes no topo do arquivo, comentadas, fáceis de calibrar.

\- \*\*Não\*\* apresentar o resultado como garantia: rotular "estimativa — orçamento confirma os valores".



\---



\## 8. SEO \& Tracking (não-funcionais obrigatórios)



\- `sitemap.xml` + `robots.txt`.

\- JSON-LD: `LocalBusiness` (com geo Fortaleza, área de atendimento, telefone, WhatsApp), `FAQPage` (na FAQ), `Review`/`AggregateRating` quando houver depoimentos.

\- OpenGraph + Twitter cards em todas as páginas.

\- GTM container único; GA4 + Google Ads via GTM.

\- \*\*Eventos de conversão:\*\* `lead\_form\_submit`, `whatsapp\_click`, `simulator\_complete` — todos disparando em `/obrigado` (form/simulador) e on-click (WhatsApp).

\- Google Maps embed na `/contato` reforçando o Google Business Profile.



\---



\## 9. Segurança (Guia Lumentech V4 — OWASP Top 10:2025)



\- Validação server-side de todo input (nunca confiar no client).

\- Rate limit + honeypot no form (anti-spam/bot).

\- Sem segredos no front; chaves (Evolution, SMTP) só no `.env` da API.

\- Sanitização de campos exibidos (depoimentos/admin).

\- CORS restrito ao domínio do site.

\- Headers de segurança (CSP compatível com GTM/GA, HSTS).

\- LGPD: aviso de privacidade + consentimento no form; link para política.



\---



\## 10. Comandos



```bash

pnpm install

pnpm dev            # roda web + api (turbo)

pnpm --filter web dev

pnpm --filter api dev

pnpm --filter api prisma migrate dev

pnpm build

pnpm lint

```



\---



\## 11. Regras de trabalho com o Claude Code



1\. \*\*Uma feature por sessão, 3–5 arquivos no máximo.\*\* Se exceder, parar e dividir.

2\. Ao iniciar uma sessão, \*\*declarar\*\* quais arquivos vai tocar e por quê, antes de codar.

3\. Não criar mock de UI/tela fake nem dados inventados de cliente. Usar `<<CONFIRMAR>>` para o que falta.

4\. Copy do site sempre em \*\*PT-BR\*\*. Prompts de imagem/vídeo (se gerados) em \*\*PT-BR\*\*.

5\. Não adicionar dependências fora do stack sem justificar.

6\. Manter Core Web Vitals verde como critério de aceite das páginas de marketing.

7\. Ao terminar a sessão: resumir o que mudou e qual a próxima sessão sugerida.



\---



\## 12. Placeholders a confirmar com a TOCSOLAR (`<<CONFIRMAR>>`)



\- Hex exato das cores da marca + arquivos de logo (SVG/PNG).

\- Cidades de atuação exatas (Fortaleza + interior).

\- Tarifa média Enel CE (R$/kWh) para o simulador.

\- Ticket médio real + taxa de fechamento (calibrar ROI/copy).

\- Acervo de fotos de projetos reais + depoimentos com autorização (LGPD).

\- E-mail(s) do comercial p/ notificação de lead.

\- Provedor de e-mail transacional (Resend/SMTP).

\- Domínio final + acesso DNS.



\---



\## 13. Status do projeto (atualizado em 2026-06-20)



\### Web (`apps/web`) — Next.js 14, build/lint/typecheck verde, validado no dev

\*\*Páginas prontas:\*\* `/`, `/energia-solar-residencial`, `/energia-solar-empresarial`, `/como-funciona`, `/projetos`, `/simulador`, `/sobre`, `/contato`, `/obrigado`, `/privacidade`. Sitemap/robots/JSON-LD (LocalBusiness, FAQPage) e OG configurados.

\*\*Componentes prontos:\*\* layout (Header, Footer, WhatsAppFloat) · lead (LeadForm, SolarSimulator) · sections (Hero, PainPromise, HowItWorks, SegmentCards, ProjectsGallery, StatsCounter, Differentials, Testimonials, FAQ, CTASection).

\*\*Home\*\* monta: Hero → StatsCounter → PainPromise → HowItWorks → SegmentCards → Differentials → Testimonials → FAQ → CTASection.



\### API (`apps/api`) — NestJS

Módulo de leads (DTO + controller + service), notificações (Evolution/WhatsApp + mail + processor BullMQ), Prisma/Postgres com migrations. \*\*Rodando em produção\*\* (ver Deploy abaixo): `migrate deploy` OK, rotas `GET /api/health` e `POST /api/leads` validadas (health 200; payload inválido → 400 com mensagens PT-BR).



\### 🔐 Área administrativa (Fase 1 — EM PRODUÇÃO)

Painel interno em `/admin` (dentro do app web; `SiteFrame` esconde o chrome de marketing nessas rotas). \*\*Validado em produção end-to-end.\*\*

\- \*\*Auth (API):\*\* `AuthModule` — login e-mail/senha (`bcryptjs` + JWT, `JwtStrategy`/`JwtAuthGuard`). Rotas `POST /api/auth/login`, `GET /api/auth/me`. Exige `JWT_SECRET` no env (a API não sobe sem). Token JWT no `localStorage` (front).

\- \*\*Clientes/CRM (API):\*\* `ClientsModule` — CRUD protegido `/api/clients` (+ filtro status/busca) e `POST /api/clients/from-lead/:leadId` (converte Lead→Client). Modelos Prisma `User` e `Client` (migration `20260621135750_add_user_and_client`).

\- \*\*Admin (web):\*\* `/admin/login`, `/admin` (painel/KPIs por status), `/admin/clientes` (lista, busca, filtro, criar, mudar status, excluir). `lib/admin-api.ts` é o client.

\- \*\*Orçamentos (Fase 2 — EM PRODUÇÃO):\*\* `QuotesModule` — CRUD protegido `/api/quotes` com itens aninhados, número sequencial (max+1 em transação), total calculado no service (subtotal − desconto). Modelos `Quote` + `QuoteItem` (migration `add_quotes`). Web: `/admin/orcamentos` (lista, criar via `QuoteForm`, detalhe/editar, status, excluir) + `/admin/orcamentos/[id]/imprimir` (PDF via `window.print()`; `admin/layout` renderiza rota `/imprimir` sem sidebar). \*\*Nota:\*\* número é max+1 — pode repetir se um orçamento for excluído (ok p/ MVP).

\- \*\*Seed do admin:\*\* `prisma/seed.cjs` (JS puro, idempotente — upsert). Roda no boot do container (command do compose). Credenciais via `ADMIN_EMAIL`/`ADMIN_PASSWORD`; senha de prod está só no `.env.prod` do droplet — TROCAR após 1º acesso.

\- \*\*Financeiro · Recebíveis (Fase 3a — EM PRODUÇÃO):\*\* `ReceivablesModule` — CRUD `/api/receivables` + `POST /api/receivables/generate-from-quote/:quoteId` (divide o total do orçamento em N parcelas mensais; resto na última; datas ancoradas em 12:00 UTC p/ não pular dia). Modelo `Receivable` (migration `add_receivables`). "Vencido" é \*\*derivado\*\* (pendente && vencimento < hoje), não persistido. Web: `/admin/financeiro/recebiveis` (resumo a receber/vencido/recebido, filtro, dar baixa/reabrir, excluir) + botão "Gerar parcelas" no detalhe do orçamento.

\- \*\*Financeiro · Despesas (Fase 3b — EM PRODUÇÃO):\*\* `ExpensesModule` — CRUD `/api/expenses` (filtros categoria/status/data; categorias: equipamento, mao_de_obra, operacional, marketing, imposto, outro; status pago/pendente; `pagoEm` = data quando pago — regime de caixa; vínculo opcional a `Quote`). Modelo `Expense` (migration `add_expenses`). Web: `/admin/financeiro/despesas` (resumo pago/pendente, criar, filtros, baixa, excluir) + `FinanceTabs` (Contas a receber | Despesas).

\- \*\*Financeiro · Fluxo de caixa (Fase 3c — EM PRODUÇÃO):\*\* `CashflowModule` — `GET /api/cashflow` agrega recebíveis (entradas) e despesas (saídas) por mês, em \*\*realizado\*\* (pagos, pela data de pagamento) e \*\*previsto\*\* (pendentes, por vencimento/competência), com saldo do mês e acumulado. Sem novo modelo (só agregação). Web: `/admin/financeiro/fluxo` (cards realizado/previsto + tabela mensal com acumulado).

\- \*\*Dashboard executivo (Fase 4 — EM PRODUÇÃO):\*\* `DashboardModule` — `GET /api/dashboard` agrega funil (leads→clientes→orçamentos→aprovados) com taxas de conversão, status de clientes/orçamentos, KPIs financeiros (reusa `CashflowService`), receita mensal e próximos vencimentos. Web: `/admin` reescrito como painel (cards de funil com conversão, KPIs financeiros, gráfico CSS entradas×saídas, lista de próximos vencimentos).

\- \*\*Perfis/permissões + usuários (EM PRODUÇÃO):\*\* `RolesGuard` + `@Roles` — rotas financeiras (receivables/expenses/cashflow) e `/api/users` restritas a `admin`; dashboard omite financeiro p/ `comercial`. `UsersModule` (admin-only): CRUD `/api/users` (perfil admin/comercial, ativar/desativar, redefinir senha; não exclui o próprio). `POST /api/auth/change-password`. Web: `/admin/usuarios`, `/admin/conta`; nav e dashboard escondem financeiro p/ comercial. Token segue em localStorage (httpOnly = melhoria futura).

\- \*\*Notificação de vencimentos (EM PRODUÇÃO):\*\* `RemindersModule` — cron diário (`@nestjs/schedule`, `0 11 * * *` = 11h UTC ≈ 8h BRT) que avisa o escritório sobre recebíveis vencidos + a vencer em ≤3 dias, via WhatsApp (Evolution) + e-mail; degrada com warn se credenciais vazias (caso atual em prod). `GET /api/reminders/preview` e `POST /api/reminders/run` (admin). Botão "Notificar vencimentos" em `/admin/financeiro/recebiveis`. `EvolutionService.sendText`/`MailService.sendInternal` genéricos.

\- \*\*Export CSV (EM PRODUÇÃO):\*\* `ExportsModule` — `GET /api/exports/{clientes,recebiveis,despesas,fluxo}.csv` (text/csv; separador `;` + BOM UTF-8 + decimais com vírgula → Excel pt-BR). Financeiro admin-only; clientes p/ ambos. Botão "Exportar CSV" nas páginas; `downloadCsv` baixa via fetch autenticado + blob.

\- \*\*Status:\*\* ✅ \*\*Área administrativa completa\*\* — Fases 1–4 + perfis/usuários/troca-de-senha + notificação de vencimentos + export CSV. Tudo validado end-to-end por API em produção. Pendentes opcionais: configurar Evolution/SMTP (p/ os lembretes saírem de fato), migrar token p/ cookie httpOnly, testar UI por clique.



\### 🚀 Deploy — EM PRODUÇÃO (DigitalOcean droplet)

\- \*\*No ar:\*\* `http://104.131.161.21` (HTTP, sem domínio/TLS ainda). Site `/` 200, `/api/health` 200.

\- \*\*Stack:\*\* droplet único (`s-1vcpu-1gb`, nyc3) via Docker Compose + Caddy. 5 containers: caddy (80/443, proxy `/api/*`→api:3001, resto→web:3000), web (Next standalone), api (NestJS), postgres 16, redis 7 (os dois últimos internos).

\- \*\*Infra commitada/pushed\*\* (commit `8367931`): `infrastructure/{docker-compose.prod.yml,Caddyfile,deploy.sh,.env.prod.example}` + Dockerfiles (openssl p/ Prisma no Alpine, build args NEXT\_PUBLIC\_\* na web). GitHub: `github.com/klebergobbi/Tocsolar` (público).

\- \*\*Redeploy:\*\* `/opt/tocsolar` no droplet é checkout git → `ssh -i ~/.ssh/tocsolar_deploy root@104.131.161.21 'cd /opt/tocsolar && git pull && bash infrastructure/deploy.sh'`. O `.env.prod` (segredos) vive só no droplet, é gitignored e preservado no pull.



\### ⚠️ Conteúdo placeholder — TROCAR antes de produção (autorizado p/ MVP)

\- `apps/web/public/projetos/*.svg`: imagens \*\*ilustrativas\*\* (geradas por `apps/web/scripts/gen-projetos-svg.mjs`). Trocar por fotos reais (LGPD).

\- `StatsCounter`: números \*\*fictícios\*\* (1200+ projetos, 8 MWp, 10 anos, 30+ cidades).

\- `Testimonials`: 3 depoimentos \*\*fictícios\*\*. Só adicionar JSON-LD Review/AggregateRating com depoimentos REAIS.

\- Buscar por `DADOS FICTÍCIOS` / `SUBSTITUIR antes de produção` no código.



\### Pendências técnicas conhecidas

\- \*\*Header sem menu mobile:\*\* a nav usa `hidden md:flex` e não há hambúrguer — em telas pequenas os links do menu não aparecem (só o botão de WhatsApp). \*\*Próxima sessão sugerida.\*\*

\- Versão mobile (responsivo) ainda \*\*não validada visualmente\*\* (screenshots Playwright não executados).

\- \*\*`NEXT\_PUBLIC\_GTM\_ID` vazio em produção\*\* → GA4/Google Ads não disparam. É build arg: preencher no `.env.prod` do droplet e rebuildar a web (redeploy).

\- \*\*Sem HTTPS/domínio:\*\* trocar `:80` pelo domínio no `Caddyfile` ativa TLS automático do Caddy.

\- \*\*Notificações de lead desativadas\*\* (Evolution/SMTP vazios no `.env.prod`): o lead persiste no banco, mas ninguém é avisado por WhatsApp/e-mail.

\- \*\*Rotacionar o token DO\*\* usado no provisionamento/deploy.

\- Ambiente: arquivos de `node_modules` somem em `C:\\Projetos` (Defender/OneDrive). Fix: `pnpm install --force`. Excluir a pasta do antivírus/sync.



\### Próxima sessão sugerida

Menu mobile no Header (hambúrguer) + validação responsiva, OU `/blog/[slug]` (MDX, SEO fundo de funil).

