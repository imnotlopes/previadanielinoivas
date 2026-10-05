/**
 * Gera as imagens de preview de link, uma por peça.
 *
 *   node scripts/og.mjs
 *
 * POR QUE TRÊS, E NÃO UMA
 * =======================
 * Quando a Danielli cola um link no WhatsApp, o robô monta um cartão com a
 * imagem que o HTML daquela peça declara. Se as três peças apontassem para a
 * mesma imagem, a noiva e a formanda receberiam cartões idênticos, e o motivo
 * de existirem três links separados se perderia logo na primeira impressão.
 *
 * O cartão é a primeira impressão, antes de qualquer clique. Cada uma destas
 * imagens é o que a pessoa vê antes de decidir se abre.
 *
 * JPEG e 1200x630: é o formato que todo robô de preview entende. WebP falha em
 * parte deles, e proporção diferente vira corte imprevisível.
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const PUBLICO = path.join(RAIZ, 'public')

const LARGURA = 1200
const ALTURA = 630

/**
 * As três peças.
 *
 * `foco` empurra o corte para onde está o rosto: numa foto vertical de noiva,
 * cortar 1200x630 pelo centro pega a barriga do vestido e corta a cabeça.
 */
const PECAS = [
  {
    arquivo: 'og-noiva.jpg',
    /*
      A LOGO NOVA E UMA DUPLA DE FOTOS, EM PAPEL.

      Eram dois painéis de foto lado a lado, o close da Aurora e o bordado da
      Mariana. Com a logo nova (setembro de 2026) o cartão passou a ser uma
      página das referências que a Danielli mandou: a logo inteira à esquerda
      e, à direita, a foto grande com a pequena de moldura branca por cima da
      borda. Ver components/Dupla.

      Continua sem vestido inteiro: a grande é a foto da capa, a filha da
      Danielli de olhos baixos, e a pequena é o véu dela sobre o bordado do
      ombro, de perto. Numa cidade pequena, a noiva que vê o vestido inteiro no cartão
      já decidiu que viu.
    */
    editorial: {
      logo: 'logo/danielli-noivas.webp',
      grande: 'capa/filha.webp',
      pequena: 'recortes/filha-veu-perto.webp',
    },
  },
  {
    arquivo: 'og-catalogo.jpg',
    /* Três vestidos lado a lado: o cartão precisa dizer "acervo", não "um
       vestido". Uma foto só faria a noiva achar que o link é de uma peça. */
    mosaico: [
      'pecas/isadora-decote-v-com-veu.webp',
      'pecas/valentina-decote-v-manga-fluida.webp',
      'pecas/celeste-renda-e-perolas.webp',
    ],
  },
  {
    arquivo: 'og-festa.jpg',
    mosaico: [
      'pecas/manuela-tule-com-rosas.webp',
      'pecas/esmeralda-paete-verde.webp',
      'pecas/nicole-paete-marinho.webp',
    ],
  },
]

async function simples(fonte, foco) {
  return sharp(path.join(PUBLICO, fonte))
    .resize(LARGURA, ALTURA, { fit: 'cover', position: foco })
    .jpeg({ quality: 84 })
    .toBuffer()
}

async function mosaico(fontes) {
  /* Um filete de 4px entre as fotos: sem ele as três viram uma mancha só na
     miniatura do WhatsApp, que é pequena. */
  const FILETE = 4
  const largura = Math.floor((LARGURA - FILETE * (fontes.length - 1)) / fontes.length)

  const partes = []
  for (let i = 0; i < fontes.length; i++) {
    const buf = await sharp(path.join(PUBLICO, fontes[i]))
      .resize(largura, ALTURA, { fit: 'cover', position: 'top' })
      .toBuffer()
    partes.push({ input: buf, left: i * (largura + FILETE), top: 0 })
  }

  return sharp({
    create: {
      width: LARGURA,
      height: ALTURA,
      channels: 3,
      /* O filete sai na cor de fundo do site, não em branco puro. */
      background: '#FAF9F6',
    },
  })
    .composite(partes)
    .jpeg({ quality: 84 })
    .toBuffer()
}

/** O papel da apresentação, `--off-white` em src/index.css. */
const PAPEL = { r: 247, g: 242, b: 238 }

/**
 * A página das referências em 1200x630.
 *
 * As medidas são de olho, e a razão de cada uma: a logo ocupa a metade
 * esquerda com ar em volta, porque é ela que diz de quem é o link; a grande
 * encosta no alto da metade direita; a pequena cai sobre a borda de baixo e à
 * esquerda da grande, com 10px de moldura branca, como nas páginas dos PDFs.
 */
async function editorial({ logo, grande, pequena }) {
  const marca = await sharp(path.join(PUBLICO, logo)).resize({ height: 400 }).toBuffer()
  const { width: larguraMarca } = await sharp(marca).metadata()

  const fotoGrande = await sharp(path.join(PUBLICO, grande))
    .resize(330, 440, { fit: 'cover', position: 'top' })
    .toBuffer()

  const MOLDURA = 10
  const fotoPequena = await sharp(path.join(PUBLICO, pequena))
    .resize(200, 250, { fit: 'cover' })
    .extend({ top: MOLDURA, bottom: MOLDURA, left: MOLDURA, right: MOLDURA, background: '#ffffff' })
    .toBuffer()

  return sharp({ create: { width: LARGURA, height: ALTURA, channels: 3, background: PAPEL } })
    .composite([
      { input: marca, left: Math.round((560 - larguraMarca) / 2) + 20, top: 115 },
      { input: fotoGrande, left: 790, top: 45 },
      { input: fotoPequena, left: 660, top: 325 },
    ])
    .jpeg({ quality: 86 })
    .toBuffer()
}

await mkdir(PUBLICO, { recursive: true })

for (const peca of PECAS) {
  const buffer = peca.editorial
    ? await editorial(peca.editorial)
    : peca.mosaico
      ? await mosaico(peca.mosaico)
      : await simples(peca.fonte, peca.foco)

  await sharp(buffer).toFile(path.join(PUBLICO, peca.arquivo))
  console.log(`  ${peca.arquivo}`)
}

console.log(`\n${PECAS.length} imagens de preview geradas em public/`)
