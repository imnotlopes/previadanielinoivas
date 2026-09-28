/**
 * Importa as fotos baixadas do Instagram para public/.
 *
 *   node scripts/importar-instagram.mjs
 *
 * O dump do Instagram vem com nome de arquivo ilegível
 * (`imgi_36_753237135_..._n.webp`). Este script traduz aquele número para o
 * caminho e o nome que o site usa, no padrão `nome-estilo.webp`, e já
 * redimensiona: nada em public/ precisa passar de 1600px de lado maior.
 *
 * A tabela MAPA abaixo é a fonte de verdade dessa tradução. Para trocar a foto
 * de uma peça, mude o número à esquerda e rode de novo, o resto do site
 * continua apontando para o mesmo caminho.
 *
 * A pasta instagram/ NÃO faz parte do repositório (ver .gitignore). Ela é
 * material de trabalho; o que o site publica é o resultado deste script.
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

const ORIGEM = path.resolve(import.meta.dirname, '..', 'instagram')
const DESTINO = path.resolve(import.meta.dirname, '..', 'public')

/** Lado maior de qualquer foto publicada. Acima disso é peso sem ganho. */
const LADO_MAXIMO = 1600

/**
 * número da foto no dump → caminho dentro de public/.
 *
 * Os nomes seguem o padrão `noiva-estilo`, com o nome que a peça recebeu no
 * catálogo. Ver src/data/pecas.ts.
 */
const MAPA = {
  // ---------------------------------------------------------------- noiva
  36: 'pecas/aurora-renda-gola-alta.webp',
  34: 'pecas/aurora-renda-gola-alta-2.webp',
  35: 'pecas/aurora-renda-gola-alta-3.webp',

  65: 'pecas/isadora-decote-v-com-veu.webp',
  64: 'pecas/isadora-decote-v-com-veu-2.webp',
  62: 'pecas/isadora-decote-v-com-veu-3.webp',

  69: 'pecas/lorena-manga-longa-em-renda.webp',
  70: 'pecas/lorena-manga-longa-em-renda-2.webp',

  21: 'pecas/valentina-decote-v-manga-fluida.webp',
  20: 'pecas/valentina-decote-v-manga-fluida-2.webp',

  77: 'pecas/beatriz-tule-marfim.webp',
  50: 'pecas/helena-ombros-bordados.webp',
  47: 'pecas/marina-ombro-a-ombro.webp',
  48: 'pecas/marina-ombro-a-ombro-2.webp',

  83: 'pecas/rafaela-decote-profundo-bordado.webp',
  97: 'pecas/rafaela-decote-profundo-bordado-2.webp',

  82: 'pecas/clarice-costas-em-ilusao.webp',
  58: 'pecas/clarice-costas-em-ilusao-2.webp',

  23: 'pecas/antonia-princesa-ombro-a-ombro.webp',
  76: 'pecas/eloa-renda-gola-alta.webp',
  87: 'pecas/eloa-renda-gola-alta-2.webp',

  27: 'pecas/julia-manga-longa-minimalista.webp',
  103: 'pecas/julia-manga-longa-minimalista-2.webp',

  43: 'pecas/thais-um-ombro-so-com-babado.webp',
  45: 'pecas/thais-um-ombro-so-com-babado-2.webp',

  111: 'pecas/sofia-cauda-longa.webp',
  100: 'pecas/sofia-cauda-longa-2.webp',

  104: 'pecas/luiza-princesa-com-cauda.webp',
  105: 'pecas/luiza-princesa-com-cauda-2.webp',

  17: 'pecas/celeste-renda-e-perolas.webp',
  19: 'pecas/celeste-renda-e-perolas-2.webp',

  // ---------------------------------------------------------------- festa
  26: 'pecas/manuela-tule-com-rosas.webp',
  24: 'pecas/olivia-cetim-um-ombro-so.webp',
  25: 'pecas/carolina-glitter-com-babados.webp',
  85: 'pecas/esmeralda-paete-verde.webp',
  94: 'pecas/nicole-paete-marinho.webp',
  40: 'pecas/bianca-azul-sereno.webp',

  // ------------------------------------------------------------ debutante
  31: 'pecas/giovana-dourado-bordado.webp',
  32: 'pecas/alice-dourado-sereia.webp',
  80: 'pecas/vitoria-princesa-marinho.webp',
  81: 'pecas/laura-princesa-prata.webp',
  84: 'pecas/laura-princesa-prata-2.webp',
  33: 'pecas/rebeca-sereia-preto.webp',

  // ATENÇÃO: a logo NÃO entra nesta tabela, e este script não gera mais nada
  // de marca. A logo nova e os ícones saem de scripts/logo.mjs.

  // ----------------------------------------------------------- casamentos
  29: 'casamentos/nathalia-e-joao-1.webp',
  86: 'casamentos/nathalia-e-joao-2.webp',
  53: 'casamentos/camila-e-rodrigo-1.webp',
  54: 'casamentos/camila-e-rodrigo-2.webp',
  42: 'casamentos/camila-e-rodrigo-3.webp',
  68: 'casamentos/priscila-e-marcos-1.webp',
  95: 'casamentos/priscila-e-marcos-2.webp',
  102: 'casamentos/priscila-e-marcos-3.webp',
  92: 'casamentos/leticia-e-bruno-1.webp',
  106: 'casamentos/leticia-e-bruno-2.webp',
  108: 'casamentos/leticia-e-bruno-3.webp',

  // -------------------------------------------------------------- atelier
  66: 'atelier/provador.webp',
  63: 'atelier/provador-espelho.webp',
  88: 'atelier/atendimento.webp',
  107: 'atelier/manequim.webp',
  93: 'atelier/acessorios.webp',

}

/** Preview de link. Precisa ser JPEG e 1200x630, ver scripts/webp.mjs. */
const OG = { origem: 36, largura: 1200, altura: 630 }

const arquivos = await readdir(ORIGEM)

/** Acha o arquivo do dump pelo número: 36 → imgi_36_753237135_..._n.webp */
function acharOrigem(chave) {
  if (typeof chave === 'string') return arquivos.includes(chave) ? chave : null
  return arquivos.find((f) => f.startsWith(`imgi_${chave}_`)) ?? null
}

let escritos = 0
const faltando = []

for (const [chave, destinoRelativo] of Object.entries(MAPA)) {
  const numero = /^\d+$/.test(chave) ? Number(chave) : chave
  const origem = acharOrigem(numero)
  if (!origem) {
    faltando.push(chave)
    continue
  }

  const destino = path.join(DESTINO, destinoRelativo)
  await mkdir(path.dirname(destino), { recursive: true })

  await sharp(path.join(ORIGEM, origem))
    .rotate()
    .resize(LADO_MAXIMO, LADO_MAXIMO, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(destino)

  escritos++
}

// --- preview de link -------------------------------------------------------
const origemOg = acharOrigem(OG.origem)
if (origemOg) {
  await sharp(path.join(ORIGEM, origemOg))
    .resize(OG.largura, OG.altura, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 84 })
    .toFile(path.join(DESTINO, 'og-image.jpg'))
  escritos++
}

// --- logo e ícones ---------------------------------------------------------
// Saíram daqui em setembro de 2026, com a logo nova: ver scripts/logo.mjs.
// Rodar este script não toca mais em favicon.png nem apple-touch-icon.png.

// --- relatório -------------------------------------------------------------
const relatorio = Object.entries(MAPA)
  .map(([chave, destino]) => `${String(chave).padStart(4)} → ${destino}`)
  .join('\n')
await writeFile(path.join(import.meta.dirname, 'importar-instagram.txt'), relatorio + '\n')

console.log(`${escritos} arquivos escritos em public/`)
if (faltando.length) console.log(`não encontrados no dump: ${faltando.join(', ')}`)
