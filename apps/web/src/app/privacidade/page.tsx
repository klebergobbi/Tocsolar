import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a TOCSOLAR Energia Solar coleta, usa e protege seus dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).",
  robots: { index: true, follow: true },
};

// Data da última atualização — estática para evitar mismatch SSR/CSR. <<CONFIRMAR>>
const ATUALIZADO_EM = "9 de junho de 2026";

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Política de Privacidade
          </h1>
          <p className="text-sm text-brand-black/60">
            Última atualização: {ATUALIZADO_EM}
          </p>
          <p className="text-brand-black/70">
            Esta política explica como a TOCSOLAR Energia Solar trata os dados
            pessoais coletados em nosso site, em conformidade com a Lei Geral de
            Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">1. Quem é o controlador</h2>
          <p className="text-brand-black/70">
            O controlador dos seus dados é a TOCSOLAR Energia Solar
            {" "}
            {/* <<CONFIRMAR razão social, CNPJ e endereço completo>> */}
            (razão social, CNPJ e endereço a confirmar), com sede em
            Fortaleza/CE.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. Dados que coletamos</h2>
          <p className="text-brand-black/70">
            Coletamos apenas os dados que você nos fornece ao preencher nossos
            formulários ou simulador:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-brand-black/70">
            <li>Nome</li>
            <li>Número de WhatsApp</li>
            <li>E-mail (quando informado)</li>
            <li>Cidade (quando informada)</li>
            <li>
              Valor da conta de luz e dados de consumo informados no simulador
            </li>
            <li>
              Dados de origem da visita (campanha/UTM), para entendermos como
              você nos encontrou
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. Finalidade do tratamento</h2>
          <p className="text-brand-black/70">
            Usamos seus dados exclusivamente para:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-brand-black/70">
            <li>
              Elaborar e enviar seu orçamento de energia solar e entrar em
              contato sobre ele;
            </li>
            <li>Calcular sua estimativa de economia no simulador;</li>
            <li>
              Melhorar nossas campanhas e atendimento (análise de origem do
              contato).
            </li>
          </ul>
          <p className="text-brand-black/70">
            Não vendemos seus dados nem os utilizamos para finalidades diferentes
            das informadas aqui.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. Base legal</h2>
          <p className="text-brand-black/70">
            O tratamento dos seus dados ocorre com base no{" "}
            <strong>consentimento</strong> que você fornece ao marcar a caixa de
            aceite e enviar o formulário (art. 7º, I, da LGPD), e nos
            procedimentos preliminares relacionados ao seu pedido de orçamento
            (art. 7º, V).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Compartilhamento</h2>
          <p className="text-brand-black/70">
            Seus dados podem ser tratados por prestadores que nos apoiam
            (hospedagem, mensageria via WhatsApp e e-mail, ferramentas de
            análise como Google Analytics), sempre limitados às finalidades
            acima e sob obrigações de confidencialidade.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Retenção dos dados</h2>
          <p className="text-brand-black/70">
            Mantemos seus dados pelo tempo necessário para o atendimento
            comercial e cumprimento de obrigações legais. Após esse período, ou
            mediante sua solicitação de exclusão, os dados são eliminados ou
            anonimizados. {/* <<CONFIRMAR prazo de retenção exato>> */}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Seus direitos</h2>
          <p className="text-brand-black/70">
            Você pode, a qualquer momento, solicitar: confirmação e acesso aos
            seus dados; correção de dados incompletos ou desatualizados;
            anonimização ou eliminação; portabilidade; informação sobre
            compartilhamento; e revogação do consentimento.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">8. Contato do encarregado</h2>
          <p className="text-brand-black/70">
            Para exercer seus direitos ou tirar dúvidas sobre esta política,
            entre em contato pelo e-mail{" "}
            {/* <<CONFIRMAR e-mail do encarregado/DPO>> */}
            <span className="font-medium">privacidade@tocsolar.com.br</span> ou
            pelo WhatsApp{" "}
            <a
              href="https://wa.me/5585991618044"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              (85) 99161-8044
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">9. Alterações nesta política</h2>
          <p className="text-brand-black/70">
            Podemos atualizar esta política periodicamente. A data da última
            atualização sempre constará no topo desta página.
          </p>
        </section>
      </article>
    </main>
  );
}
