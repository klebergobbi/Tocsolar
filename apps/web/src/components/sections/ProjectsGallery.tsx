import Image from "next/image";
import Link from "next/link";

/**
 * Galeria de projetos (prova social / portfólio).
 *
 * IMAGENS ILUSTRATIVAS (SVG gerado em apps/web/public/projetos/).
 * <<SUBSTITUIR antes de produção>> por FOTOS REAIS dos projetos + dados
 * autorizados (LGPD). Para trocar: substitua o arquivo em /public/projetos/
 * (mantendo o nome) ou atualize o campo `imagem` abaixo.
 */

type Categoria = "Residencial" | "Comercial" | "Rural";

type Projeto = {
  id: string;
  categoria: Categoria;
  titulo: string;
  local: string;
  // Potência ilustrativa (faixa típica da categoria). <<CONFIRMAR com projetos reais>>
  potencia: string;
  // Imagem em /public/projetos (atualmente SVG ilustrativo).
  imagem: string;
};

const PROJETOS: Projeto[] = [
  {
    id: "res-01",
    categoria: "Residencial",
    titulo: "Telhado residencial",
    local: "Fortaleza/CE",
    potencia: "~4 kWp",
    imagem: "/projetos/res-01.svg",
  },
  {
    id: "com-01",
    categoria: "Comercial",
    titulo: "Cobertura comercial",
    local: "Região Metropolitana",
    potencia: "~15 kWp",
    imagem: "/projetos/com-01.svg",
  },
  {
    id: "res-02",
    categoria: "Residencial",
    titulo: "Casa térrea",
    local: "Fortaleza/CE",
    potencia: "~6 kWp",
    imagem: "/projetos/res-02.svg",
  },
  {
    id: "rur-01",
    categoria: "Rural",
    titulo: "Propriedade rural",
    local: "Interior do Ceará",
    potencia: "~20 kWp",
    imagem: "/projetos/rur-01.svg",
  },
  {
    id: "com-02",
    categoria: "Comercial",
    titulo: "Galpão / indústria",
    local: "Região Metropolitana",
    potencia: "~30 kWp",
    imagem: "/projetos/com-02.svg",
  },
  {
    id: "res-03",
    categoria: "Residencial",
    titulo: "Sobrado",
    local: "Fortaleza/CE",
    potencia: "~8 kWp",
    imagem: "/projetos/res-03.svg",
  },
];

export function ProjectsGallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Projetos pelo Ceará
        </h2>
        <p className="mt-3 text-brand-black/70">
          Residências, comércios e propriedades rurais gerando a própria
          energia. Equipe própria do projeto à homologação.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJETOS.map((projeto, index) => (
          <article
            key={projeto.id}
            className="group overflow-hidden rounded-2xl border border-brand-black/10 bg-white shadow-sm"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-brand-black/5">
              <Image
                src={projeto.imagem}
                alt={`Projeto de energia solar ${projeto.categoria.toLowerCase()} — ${projeto.local}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                // 3 primeiras imagens são as mais prováveis no viewport inicial.
                loading={index < 3 ? "eager" : "lazy"}
              />
              <span className="absolute left-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-brand-black">
                {projeto.categoria}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-3 p-5">
              <div>
                <h3 className="font-bold">{projeto.titulo}</h3>
                <p className="mt-1 text-sm text-brand-black/60">
                  {projeto.local}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-brand-orange">
                {projeto.potencia}
              </span>
            </div>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-brand-black/50">
        Imagens ilustrativas. Potências são exemplos típicos por categoria — o
        projeto real é dimensionado conforme o seu consumo.
      </p>

      <div className="mt-10 text-center">
        <Link
          href="/simulador"
          className="inline-flex rounded-lg bg-brand-orange px-6 py-3 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90"
        >
          Simular um projeto para mim
        </Link>
      </div>
    </section>
  );
}
