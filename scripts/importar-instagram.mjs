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
 * de uma peça, mude o número à esquerda e rode de novo — o resto do site
 * continua apontando para o mesmo caminho.
 *
 * A pasta instagram/ NÃO faz parte do repositório (ver .gitignore). Ela é
 * material de trabalho; o que o site publica é o resultado deste script.
 */
import { existsSync } from 'node:fs'
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

  // ATENÇÃO: a logo NÃO entra nesta tabela. A arte da marca é
  // public/logo.png, com fundo removido à mão — ver o bloco de identidade
  // mais abaixo. A foto de perfil do Instagram não serve mais como origem.

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

/**
 * Arte da marca, já com o fundo removido à mão.
 *
 * Fica em public/ e não em instagram/ porque é asset de verdade, versionado
 * junto com o site — a origem dele foi a foto de perfil do Instagram, mas o
 * recorte do fundo é trabalho manual que não dá para refazer por script.
 */
const LOGO = path.join(DESTINO, 'logo.png')

/** Preview de link. Precisa ser JPEG e 1200x630 — ver scripts/webp.mjs. */
const OG = { origem: 36, largura: 1200, altura: 630 }

/**
 * Ícones de aba e de tela inicial.
 *
 * Os dois vão ACHATADOS sobre branco, e não com o fundo transparente da arte.
 * A logo é dourada e clara: sobre a barra escura de um navegador em tema
 * escuro, ou sobre a tela inicial de um celular com papel de parede claro, o
 * traço somem. Um quadrado branco com a logo dentro aparece em qualquer
 * lugar — e é o que o iOS espera do apple-touch-icon, que não suporta alfa.
 */
const ICONES = [
  { arquivo: 'favicon.png', lado: 180 },
  { arquivo: 'apple-touch-icon.png', lado: 180 },
]

/**
 * Variações da logo que os componentes consomem.
 *
 * `claro` é a versão para fundo escuro (o rodapé preto). Ela não é a mesma
 * arte: é a silhueta da logo preenchida de branco, tirada do próprio canal
 * alfa. Foi preciso porque a arte perdeu o fundo creme — sobre preto, o
 * "Danielli" em dourado escuro e o "NOIVAS" simplesmente sumiriam. Como a
 * filigrana é desenhada em traço fino, a silhueta preserva o desenho inteiro
 * em vez de virar uma mancha.
 *
 * A arte tem 150px de lado, o que basta para o símbolo do cabeçalho (44px) e
 * para o selo do rodapé (128px), mas não para muito mais. Quando chegar o
 * arquivo vetorial da marca, é ele que substitui public/logo.png.
 */
const LOGOS = [
  { arquivo: 'logo-simbolo.webp', claro: false },
  { arquivo: 'logo-completo.webp', claro: false },
  { arquivo: 'logo-simbolo-claro.webp', claro: true },
  { arquivo: 'logo-completo-claro.webp', claro: true },
]

/**
 * Encorpa a arte para uso em fundo claro.
 *
 * O dourado da logo é bem claro; reduzida à altura do cabeçalho (44px) sobre
 * o off-white, ela ficava como uma mancha pálida — parecia imagem quebrada,
 * não selo de marca. O `linear(0.8, 0)` multiplica os canais RGB por 0,8:
 * escurece mantendo o matiz e o alfa intactos, então o lettering continua
 * sendo o mesmo, só que presente. Não é recolorir a marca.
 */
function encorparParaFundoClaro(origem) {
  return sharp(origem).linear(0.8, 0)
}

/**
 * Repinta a arte de branco usando o próprio alfa como máscara.
 * Devolve um buffer PNG, pronto para ser convertido pelo chamador.
 */
async function silhuetaBranca(origem) {
  const { data, info } = await sharp(origem)
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true })

  return sharp({
    create: {
      width: info.width,
      height: info.height,
      channels: 3,
      background: '#ffffff',
    },
  })
    .joinChannel(data, {
      raw: { width: info.width, height: info.height, channels: 1 },
    })
    .png()
    .toBuffer()
}

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
if (existsSync(LOGO)) {
  const branca = await silhuetaBranca(LOGO)

  for (const { arquivo, claro } of LOGOS) {
    await (claro ? sharp(branca) : encorparParaFundoClaro(LOGO))
      // alphaQuality no máximo: a filigrana é toda meio-tom de alfa, e é aí
      // que a compressão come o desenho antes de comer a cor.
      .webp({ quality: 90, alphaQuality: 100, effort: 5 })
      .toFile(path.join(DESTINO, arquivo))
    escritos++
  }

  for (const { arquivo, lado } of ICONES) {
    await sharp(LOGO)
      .resize(lado, lado, { fit: 'contain', background: '#ffffff' })
      .flatten({ background: '#ffffff' })
      .png()
      .toFile(path.join(DESTINO, arquivo))
    escritos++
  }
} else {
  console.log(`logo não encontrada em ${LOGO} — variações não foram geradas`)
}

// --- relatório -------------------------------------------------------------
const relatorio = Object.entries(MAPA)
  .map(([chave, destino]) => `${String(chave).padStart(4)} → ${destino}`)
  .join('\n')
await writeFile(path.join(import.meta.dirname, 'importar-instagram.txt'), relatorio + '\n')

console.log(`${escritos} arquivos escritos em public/`)
if (faltando.length) console.log(`não encontrados no dump: ${faltando.join(', ')}`)
