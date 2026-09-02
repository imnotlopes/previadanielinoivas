import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { Plugin } from 'vite'

// A extensão .js nos caminhos é exigência do moduleResolution node16 deste
// tsconfig; o arquivo em disco é .ts, e tanto o TypeScript quanto o Vite
// fazem essa correspondência sozinhos.
import { googleNegocio } from '../src/data/google.js'
import { pecas, pecasPorCategoria, publicadas } from '../src/data/pecas.js'
import { SITE_URL, brand, linkInstagram } from '../src/lib/brand.js'

/**
 * Gera sitemap.xml, robots.txt e o JSON-LD do negócio durante o build.
 *
 * É gerado, e não escrito à mão em public/, porque catálogo à mão desatualiza:
 * bastaria adicionar uma peça e esquecer do sitemap para o endereço novo nunca
 * ser descoberto. Aqui a lista sai do mesmo array que monta o site.
 *
 * Só roda no build (`apply: 'build'`). Em desenvolvimento os arquivos não
 * existem, e tudo bem: quem os lê é robô de busca, que só vê produção.
 */

/** `&`, `<` e `>` quebram o XML se entrarem crus numa URL. */
function escaparXml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function montarSitemap(): string {
  /*
    As três peças de cliente, e as fichas dentro de cada catálogo.
    O painel fica de fora — ele está no `Disallow` do robots e manda `noindex`.

    Só vestido PUBLICADO entra: o que a Danielli ocultou no painel não deve ser
    oferecido ao buscador, senão o Google indexa um endereço que responde
    "saiu do acervo".
  */
  const noCatalogo = publicadas(pecas)

  const caminhos = [
    '/',
    '/catalogo',
    ...pecasPorCategoria(noCatalogo, 'noiva').map((peca) => `/catalogo/${peca.slug}`),
    '/festa',
    ...pecasPorCategoria(noCatalogo, 'festa').map((peca) => `/festa/${peca.slug}`),
  ]

  /*
   * Sem <lastmod>, <changefreq> e <priority> de propósito.
   *
   * O Google ignora changefreq e priority faz anos. E lastmod só é usado
   * quando é confiável: preencher com a data do build faria todas as páginas
   * parecerem alteradas a cada deploy, inclusive as que não mudaram, o que
   * ensina o robô a desconfiar do campo. Melhor não afirmar nada.
   */
  const urls = caminhos
    .map((caminho) => `  <url>\n    <loc>${escaparXml(SITE_URL + caminho)}</loc>\n  </url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function montarRobots(): string {
  return [
    'User-agent: *',
    'Allow: /',
    // O painel é tela de operação, não conteúdo: fora do índice. A rota /admin
    // também manda `noindex` por conta própria, o que cobre os robôs que
    // ignoram este arquivo.
    'Disallow: /admin',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n')
}

/**
 * Dados da loja em JSON-LD, injetados no index.html.
 *
 * Vai no HTML, e não num componente React, por dois motivos: é informação do
 * negócio, igual em todas as páginas, e assim não depende de o robô executar
 * JavaScript. Os valores saem de brand.ts e google.ts, então continua havendo
 * uma fonte de verdade só.
 *
 * Cada bloco abaixo só entra quando o dado que o alimenta existe. Dado em
 * branco em JSON-LD é pior do que campo ausente: o Google trata endereço
 * vazio e telefone vazio como informação errada sobre o negócio, e uma nota
 * declarada sem perfil público para conferir é o tipo de coisa que rende
 * penalidade manual.
 */
function montarNegocio() {
  const endereco = [
    googleNegocio.endereco,
    googleNegocio.cidade,
    googleNegocio.estado,
    googleNegocio.cep,
  ].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${SITE_URL}/#loja`,
    name: googleNegocio.nome,
    description: `Aluguel de vestidos de noiva, de festa e de 15 anos${
      brand.cidade ? ` em ${brand.cidade}` : ''
    }. Prova com hora marcada, ajuste incluso e reserva para a data do evento.`,
    url: SITE_URL,
    image: `${SITE_URL}/og-noiva.jpg`,
    priceRange: '$$',

    ...(brand.whatsapp ? { telephone: `+${brand.whatsapp}` } : {}),

    ...(endereco.length > 0 ? {
      address: {
        '@type': 'PostalAddress',
        streetAddress: googleNegocio.endereco,
        addressLocality: googleNegocio.cidade,
        addressRegion: googleNegocio.estado,
        postalCode: googleNegocio.cep,
        addressCountry: 'BR',
      },
    } : {}),

    // O horário sai do perfil no Google, e não de um par de constantes aqui:
    // horário publicado errado faz cliente bater na porta fechada.
    ...(googleNegocio.horarios.length > 0 ? {
      openingHoursSpecification: googleNegocio.horarios.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        description: `${h.dias}: ${h.horas}`,
      })),
    } : {}),

    // Só declara nota quando existe perfil público apontado em `url`, que é
    // onde o robô (e a cliente) confere se o número é verdadeiro.
    ...(googleNegocio.url && googleNegocio.totalAvaliacoes > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: googleNegocio.nota,
            reviewCount: googleNegocio.totalAvaliacoes,
          },
        }
      : {}),

    sameAs: [linkInstagram, googleNegocio.url].filter(Boolean),
  }
}

export function pluginSeo(): Plugin {
  return {
    name: 'seo-atelier',
    apply: 'build',

    /*
      O JSON-LD do negócio vai nas peças de cliente, e NÃO no painel: descrever
      a loja em dados estruturados dentro de uma tela de operação convida o
      buscador a indexar justamente o endereço que o robots manda ignorar.
    */
    transformIndexHtml(_html, ctx) {
      if (ctx.path.includes('admin')) return []
      return [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(montarNegocio()),
          injectTo: 'head',
        },
      ]
    },

    async closeBundle() {
      const destino = 'dist'
      await writeFile(join(destino, 'sitemap.xml'), montarSitemap(), 'utf8')
      await writeFile(join(destino, 'robots.txt'), montarRobots(), 'utf8')
    },
  }
}
