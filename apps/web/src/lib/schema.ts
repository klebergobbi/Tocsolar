/**
 * JSON-LD (schema.org) para SEO local. Renderizado como <script type="application/ld+json">.
 * Vários campos dependem de dados oficiais da marca — marcados <<CONFIRMAR>>.
 */

// URL canônica do site (sem barra final). <<CONFIRMAR domínio final>>
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tocsolar.com.br"
).replace(/\/$/, "");

export const WHATSAPP_E164 = "+5585991618044";

/**
 * Perguntas frequentes — fonte única usada tanto pelo componente FAQ
 * quanto pelo JSON-LD FAQPage (mantém visual e schema em sincronia).
 */
export const FAQ_ITEMS: { pergunta: string; resposta: string }[] = [
  {
    pergunta: "Quanto custa instalar energia solar?",
    resposta:
      "O investimento depende do seu consumo (quanto maior a conta, maior o sistema), do tipo de telhado e do padrão de ligação. Por isso não trabalhamos com preço de tabela: use o simulador para uma estimativa na hora e peça um orçamento gratuito — confirmamos tudo no local, sem compromisso.",
  },
  {
    pergunta: "Em quanto tempo o investimento se paga?",
    resposta:
      "Um sistema bem dimensionado costuma se pagar em poucos anos e tem vida útil acima de 25 anos — ou seja, segue gerando economia muito depois de se pagar. O retorno (payback) varia conforme consumo e tarifa, e no orçamento usamos estimativas conservadoras de propósito, para você não contar com um retorno que não se confirma.",
  },
  {
    pergunta: "Quanto a conta de luz pode cair?",
    resposta:
      "Com o sistema dimensionado para o seu consumo, a redução costuma alcançar a maior parte da conta — em muitos projetos, acima de 80%. Sempre permanece a taxa mínima de disponibilidade cobrada pela distribuidora. No orçamento mostramos a estimativa para o seu caso, sem prometer demais.",
  },
  {
    pergunta: "Vocês cuidam da homologação na Enel?",
    resposta:
      "Sim. Nossa equipe própria cuida de tudo: projeto, equipamentos, instalação e a homologação junto à distribuidora.",
  },
  {
    pergunta: "Qual o prazo de instalação?",
    resposta:
      "A instalação em si costuma levar de 1 a 3 dias, conforme o tamanho do sistema. O prazo total até o sistema gerar inclui o projeto e a homologação na distribuidora — definimos um cronograma claro no orçamento.",
  },
  {
    pergunta: "Funciona em dias nublados ou à noite?",
    resposta:
      "Em dias nublados o sistema gera menos, mas continua gerando — o dimensionamento já considera a média anual. À noite, o sistema conectado à rede usa o crédito de energia gerado durante o dia.",
  },
  {
    pergunta: "Energia solar exige muita manutenção?",
    resposta:
      "Não. A manutenção é baixa, basicamente a limpeza periódica dos painéis. Os equipamentos têm longa vida útil e garantia de fábrica.",
  },
  {
    pergunta: "Quais regiões vocês atendem?",
    resposta:
      "Fortaleza/CE e Região Metropolitana. Consulte-nos sobre o interior do estado.",
  },
];

export function getFaqPageSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.resposta,
      },
    })),
  };
}

export function getLocalBusinessSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: "TOCSOLAR Energia Solar",
    description:
      "Energia solar para residências e empresas em Fortaleza/CE. Do orçamento à instalação, com economia real na conta de luz.",
    url: SITE_URL,
    telephone: WHATSAPP_E164,
    image: `${SITE_URL}/opengraph-image`, // gerada por app/opengraph-image.tsx
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      // <<CONFIRMAR endereço completo>>
      addressLocality: "Fortaleza",
      addressRegion: "CE",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Aproximado (centro de Fortaleza). <<CONFIRMAR coordenadas da sede>>
      latitude: -3.71722,
      longitude: -38.54306,
    },
    areaServed: [
      { "@type": "City", name: "Fortaleza" },
      { "@type": "AdministrativeArea", name: "Região Metropolitana de Fortaleza" },
    ],
    sameAs: ["https://instagram.com/tocsolar"],
  };
}
