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
      Dois painéis, e os dois de detalhe.

      O segundo era a Sofia de costas subindo a escada da igreja, com o
      vestido inteiro, escolhido justamente para "caber o vestido inteiro".
      Era o contrário do que a Danielli pediu: numa cidade pequena, a noiva
      que vê o vestido inteiro no cartão já decidiu que viu. Agora são o close
      da Aurora e o bordado da Mariana, e o cartão faz o que a página faz:
      mostra o bastante para dar vontade de ver o resto.
    */
    mosaico: [
      'pecas/aurora-renda-gola-alta.webp',
      'recortes/mariana-bordado.webp',
    ],
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

await mkdir(PUBLICO, { recursive: true })

for (const peca of PECAS) {
  const buffer = peca.mosaico
    ? await mosaico(peca.mosaico)
    : await simples(peca.fonte, peca.foco)

  await sharp(buffer).toFile(path.join(PUBLICO, peca.arquivo))
  console.log(`  ${peca.arquivo}`)
}

console.log(`\n${PECAS.length} imagens de preview geradas em public/`)
