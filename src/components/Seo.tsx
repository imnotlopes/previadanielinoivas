import { useLocation } from 'react-router-dom'

import { SITE_URL, TITULO_BASE } from '../lib/brand'

interface SeoProps {
  /** Omita na home para usar o título base puro. */
  titulo?: string
  descricao: string
  /** Caminho absoluto a partir da raiz, ex.: "/pecas/kelly-romantico-minimalista-e-contemporaneo.webp". */
  imagem?: string
  /**
   * Sobrescreve o caminho da URL canônica.
   *
   * Por padrão a canônica é o pathname, o que joga fora a query string, e é
   * o certo para o catálogo, onde cor, numeração e busca são recortes da
   * mesma página. Se cada combinação de filtro virasse endereço próprio, o
   * buscador acharia dezenas de páginas quase idênticas disputando entre si.
   */
  caminho?: string
  /** Tira a página do índice. Use em erro e em qualquer rota sem conteúdo próprio. */
  naoIndexar?: boolean
  /** Dados estruturados da página, serializados em JSON-LD. */
  dadosEstruturados?: Record<string, unknown>
}

/**
 * Metadados por rota.
 *
 * O React 19 eleva `<title>` e `<meta>` para o <head> sozinho, por isso não há
 * react-helmet aqui. Vale saber do limite: isso roda no cliente, então serve ao
 * Google (que executa JS), mas NÃO aos robôs de preview do WhatsApp e do
 * Facebook, que não executam JS. O cartão que eles montam vem das tags
 * estáticas escritas à mão no HTML de cada peça, index.html, catalogo.html e
 * festa.html, e é por isso que as peças são quatro arquivos separados.
 */
export default function Seo({
  titulo,
  descricao,
  imagem = '/og-noiva.jpg',
  caminho,
  naoIndexar,
  dadosEstruturados,
}: SeoProps) {
  const { pathname } = useLocation()

  const tituloFinal = titulo ? `${titulo} | ${TITULO_BASE}` : TITULO_BASE
  const urlCanonica = `${SITE_URL}${caminho ?? pathname}`
  const urlImagem = `${SITE_URL}${imagem}`

  return (
    <>
      <title>{tituloFinal}</title>
      <meta name="description" content={descricao} />
      <link rel="canonical" href={urlCanonica} />
      {/*
        `nofollow` junto, e não só `noindex`.

        As apresentações são material de conversa comercial: chegam prontas
        pela Danielli, e o link personalizado com `?nome=` menos ainda deve
        ser rastreado. `follow` fazia sentido num catálogo que queria passar
        autoridade adiante; aqui não há adiante.
      */}
      {naoIndexar && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={TITULO_BASE} />
      <meta property="og:title" content={tituloFinal} />
      <meta property="og:description" content={descricao} />
      <meta property="og:url" content={urlCanonica} />
      <meta property="og:image" content={urlImagem} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tituloFinal} />
      <meta name="twitter:description" content={descricao} />
      <meta name="twitter:image" content={urlImagem} />

      {dadosEstruturados && (
        <script
          type="application/ld+json"
          // O conteúdo é montado aqui a partir dos dados do site, nunca de
          // entrada externa, e JSON.stringify escapa o que vier dos textos.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
      )}
    </>
  )
}
