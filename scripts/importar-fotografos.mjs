/**
 * Ingestão do material dos fotógrafos.
 *
 *   node scripts/importar-fotografos.mjs --folhas   monta as folhas de contato
 *   node scripts/importar-fotografos.mjs            processa a SELEÇÃO
 *
 * POR QUE ESTE SCRIPT NÃO IMPORTA TUDO
 * ====================================
 * Os fotógrafos entregam a cobertura inteira do casamento, não um catálogo de
 * vestidos. O conjunto "Fornecedores - Thamiris e Rodrigo" tem 185 fotos e a
 * maioria é maquiagem, sapato do noivo, decoração, banda e mesa de doces,
 * o arquivo existe porque o mesmo pacote vai para todos os fornecedores da
 * festa. Só uma fração é o vestido.
 *
 * Um import cego jogaria bandeja de frios no catálogo de noiva. Por isso o
 * fluxo tem três passos, e o do meio é humano:
 *
 *   1. `--folhas` monta folhas de contato NUMERADAS, uma por conjunto, em
 *      Fotográfos/folhas/. É o que se abre no celular junto com a Danielli.
 *   2. os números escolhidos entram na tabela SELECAO abaixo.
 *   3. rodar sem argumento processa só o que está na tabela: gira pelo EXIF,
 *      corta em 3:4, redimensiona e grava WebP em public/.
 *
 * É o mesmo desenho de scripts/importar-instagram.mjs, e pelo mesmo motivo: a
 * tabela é a fonte de verdade da tradução, fica versionada no Git, e trocar
 * uma foto é mudar um número e rodar de novo.
 *
 * PRIVACIDADE: LER ANTES DE MEXER
 * ================================
 * A pasta Fotográfos/ está no .gitignore e precisa continuar. São noivas
 * reais, identificáveis, no dia do casamento delas, e o repositório é PÚBLICO.
 * O que entra no Git é só o WebP derivado das fotos que a Danielli aprovou E
 * que têm autorização por escrito da noiva.
 *
 * COMO EXTRAIR OS ZIPS
 * ====================
 * Este script não descompacta: o Node não traz leitor de zip, e instalar um
 * pacote para descompactar três arquivos que já estão no disco não se paga.
 * Descompacte à mão para `Fotográfos/extraido/<nome do conjunto>/`, uma pasta
 * por conjunto, as fotos soltas dentro.
 */
import { existsSync } from 'node:fs'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const DESTINO = path.join(RAIZ, 'public')

/** A pasta tem acento e o nome varia; acha por padrão em vez de fixar. */
const ORIGEM = (await readdir(RAIZ, { withFileTypes: true }))
  .filter((e) => e.isDirectory() && /^fotogr[aá]fos$/i.test(e.name))
  .map((e) => path.join(RAIZ, e.name))[0]

const EXTRAIDO = ORIGEM && path.join(ORIGEM, 'extraido')
const FOLHAS = ORIGEM && path.join(ORIGEM, 'folhas')

/** Lado maior de qualquer foto publicada. Acima disso é peso sem ganho. */
const LADO_MAXIMO = 1600

/** Acima desta perda no corte, a foto ganha fundo desfocado em vez de corte. */
const PERDA_TOLERADA = 0.25

/**
 * A SELEÇÃO, conjunto → { número na folha: caminho dentro de public/ }.
 *
 * O número é o que aparece no canto de cada miniatura da folha de contato.
 *
 * COMO ESTE AGRUPAMENTO FOI FEITO, E O QUE ELE TEM DE PROVISÓRIO
 * ==============================================================
 * As fotos foram agrupadas POR VESTIDO olhando as folhas: mesma noiva, mesma
 * sessão, mesma peça. Onde a certeza era menor, o vestido entrou SOZINHO em
 * vez de ser juntado a outro, juntar depois é uma linha; separar um vestido
 * que virou dois na cabeça da cliente é conversa ruim no balcão.
 *
 * Os NOMES são inventados, como os do resto do catálogo, e existem para a
 * Danielli ter por onde começar a corrigir. Ela vai dizer o nome de verdade,
 * a numeração e a cor de cada um.
 *
 * O QUE FICOU DE FORA, E POR QUÊ
 * ==============================
 * **20 fotos com marca d'água de outra loja**: VIASPOSA/vértice (30, 31, 32),
 * RAINHA (33 a 41), IDEAL noivas/Raízes (59, 60, 61, 63, 64) e CENTER
 * NOIVAS/Solar (62, 65, 66). São fotos de catálogo dos fornecedores, e várias
 * estão entre as melhores do conjunto, mas a marca de outra loja dentro do
 * catálogo da Danielli derruba justamente a autoridade que ele existe para
 * construir. Pedir a versão limpa ao fornecedor resolve; fotografar as peças
 * dela resolve melhor.
 *
 * **4 prints de tela** (42, 43, 68, 96): resolução de captura de celular.
 *
 * **Fotos de noivo e de casal** (73, 74, 89 a 95): são material de casamento,
 * não de catálogo. Entram na apresentação quando houver autorização.
 *
 * **Um vestido de festa** (94), dourado bordado, boa foto. Fica anotado aqui
 * para entrar no catálogo de festa quando a ocasião for confirmada.
 */
const SELECAO = {
  /*
    O VESTIDO DA FILHA DA CASA.

    A Aurora é o vestido que a Natália, filha da Danielli, usou no próprio
    casamento, e ela é a capa do catálogo. Estas três fotos vêm da cobertura
    do casamento: o vestido inteiro, as costas e ele dentro da igreja. É a
    ficha mais rica do acervo de propósito: é para ela que a capa aponta.
  */
  'Casamento João e Natália': {
    /*
      O nº 41 NÃO entra aqui: ele é a capa do catálogo. Se a ficha abrisse com
      a mesma foto, o clique na capa pareceria não ter levado a lugar nenhum.

      Os três são VERTICAIS de propósito. As horizontais da cobertura (a saia
      espalhada, o corredor da igreja) perdem metade da largura no corte 3:4 e
      caem na regra do fundo desfocado, numa galeria de ficha, metade das
      fotos com faixa borrada parece defeito.

      A nº 42 também não entra: ela é a hero de celular desta mesma ficha, e
      valeria a mesma repetição.

      Mostram o que a foto de estúdio não mostra: as costas abertas de perfil,
      o vestido dentro da igreja com o véu aberto, e ele em movimento na festa.
    */
    24: 'pecas/aurora-casamento.webp',
    72: 'pecas/aurora-casamento-2.webp',
    124: 'pecas/aurora-casamento-3.webp',
  },

  'WhatsApp Unknown 2026-08-31': {
    /* -------------------------------------------------------------- noiva */
    1: 'pecas/alicia-renda-manga-longa.webp',
    3: 'pecas/alicia-renda-manga-longa-2.webp',
    4: 'pecas/alicia-renda-manga-longa-3.webp',

    5: 'pecas/amanda-renda-decote-ilusao.webp',

    6: 'pecas/bruna-renda-manga-longa-saia-ampla.webp',
    7: 'pecas/bruna-renda-manga-longa-saia-ampla-2.webp',

    8: 'pecas/catarina-costas-em-renda-cauda-longa.webp',

    9: 'pecas/cecilia-alca-larga-saia-em-tule.webp',

    10: 'pecas/daniela-renda-manga-longa-decote-v.webp',

    11: 'pecas/elisa-manga-curta-cinto-bordado.webp',

    13: 'pecas/emanuelle-ombro-a-ombro-em-renda.webp',
    14: 'pecas/emanuelle-ombro-a-ombro-em-renda-2.webp',
    15: 'pecas/emanuelle-ombro-a-ombro-em-renda-3.webp',

    17: 'pecas/fernanda-decote-v-sem-manga.webp',
    18: 'pecas/fernanda-decote-v-sem-manga-2.webp',

    19: 'pecas/gabriela-renda-manga-longa-com-veu.webp',
    20: 'pecas/gabriela-renda-manga-longa-com-veu-2.webp',

    21: 'pecas/heloisa-renda-decote-ilusao.webp',

    23: 'pecas/ingrid-renda-saia-ampla.webp',
    24: 'pecas/ingrid-renda-saia-ampla-2.webp',
    25: 'pecas/ingrid-renda-saia-ampla-3.webp',

    26: 'pecas/joana-decote-v-com-cinto.webp',
    27: 'pecas/joana-decote-v-com-cinto-2.webp',

    28: 'pecas/larissa-costas-em-ilusao-com-botoes.webp',
    29: 'pecas/larissa-costas-em-ilusao-com-botoes-2.webp',

    47: 'pecas/leticia-ombro-a-ombro-em-tule.webp',
    48: 'pecas/leticia-ombro-a-ombro-em-tule-2.webp',
    49: 'pecas/leticia-ombro-a-ombro-em-tule-3.webp',
    50: 'pecas/leticia-ombro-a-ombro-em-tule-4.webp',

    51: 'pecas/malu-renda-manga-longa-veu-catedral.webp',
    52: 'pecas/malu-renda-manga-longa-veu-catedral-2.webp',
    54: 'pecas/malu-renda-manga-longa-veu-catedral-3.webp',

    55: 'pecas/mariana-bordado-manga-longa.webp',
    56: 'pecas/mariana-bordado-manga-longa-2.webp',
    57: 'pecas/mariana-bordado-manga-longa-3.webp',
    58: 'pecas/mariana-bordado-manga-longa-4.webp',

    /* O único sereia do acervo: vale entrar mesmo com uma foto só. */
    75: 'pecas/nina-sereia-em-renda.webp',

    77: 'pecas/paula-renda-manga-longa-decote-redondo.webp',
    78: 'pecas/paula-renda-manga-longa-decote-redondo-2.webp',

    79: 'pecas/pietra-manga-curta-veu-longo.webp',
    80: 'pecas/pietra-manga-curta-veu-longo-2.webp',

    81: 'pecas/renata-corpo-bordado-ombro-a-ombro.webp',

    82: 'pecas/sarah-decote-v-em-renda.webp',

    83: 'pecas/talita-costas-em-v-bordado.webp',
    84: 'pecas/talita-costas-em-v-bordado-2.webp',

    85: 'pecas/yasmin-manga-longa-em-ilusao.webp',
    86: 'pecas/yasmin-manga-longa-em-ilusao-2.webp',
    87: 'pecas/yasmin-manga-longa-em-ilusao-3.webp',
  },
}

/* -------------------------------------------------------------------------- */
/* Passo 1, folhas de contato                                                 */
/* -------------------------------------------------------------------------- */

const COLS = 6
const LARGURA = 260
const ALTURA = 340
const PAD = 4
const ROTULO = 26
const POR_FOLHA = 24

async function montarFolhas() {
  for (const conjunto of await readdir(EXTRAIDO)) {
    const dir = path.join(EXTRAIDO, conjunto)
    const arquivos = (await readdir(dir))
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()

    const cw = LARGURA + PAD * 2
    const ch = ALTURA + ROTULO + PAD * 2

    for (let f = 0; f * POR_FOLHA < arquivos.length; f++) {
      const lote = arquivos.slice(f * POR_FOLHA, (f + 1) * POR_FOLHA)
      const linhas = Math.ceil(lote.length / COLS)
      const comps = []

      for (let i = 0; i < lote.length; i++) {
        const col = i % COLS
        const row = (i / COLS) | 0
        const numero = f * POR_FOLHA + i + 1

        const miniatura = await sharp(path.join(dir, lote[i]))
          .rotate()
          .resize(LARGURA, ALTURA, { fit: 'contain', background: '#eeeeee' })
          .toBuffer()

        comps.push({
          input: miniatura,
          left: col * cw + PAD,
          top: row * ch + PAD + ROTULO,
        })

        /*
          O número é o que a Danielli fala em voz alta ao escolher, e é a chave
          da tabela SELECAO. Grande e em negrito para ser legível no celular,
          que é onde ela vai abrir a folha.
        */
        const etiqueta = `<svg width="${LARGURA}" height="${ROTULO}"><text x="3" y="20" font-family="Arial" font-weight="bold" font-size="19" fill="#000">${numero}</text></svg>`
        comps.push({
          input: Buffer.from(etiqueta),
          left: col * cw + PAD,
          top: row * ch + PAD,
        })
      }

      await mkdir(FOLHAS, { recursive: true })
      const nome = conjunto.replace(/[^\w]+/g, '-').toLowerCase()
      await sharp({
        create: {
          width: COLS * cw,
          height: linhas * ch,
          channels: 3,
          background: '#ffffff',
        },
      })
        .composite(comps)
        .jpeg({ quality: 72 })
        .toFile(path.join(FOLHAS, `${nome}-${String(f + 1).padStart(2, '0')}.jpg`))
    }

    const folhas = Math.ceil(arquivos.length / POR_FOLHA)
    console.log(`  ${conjunto}: ${arquivos.length} fotos em ${folhas} folha(s)`)
  }
}

/* -------------------------------------------------------------------------- */
/* Passo 2, processar a seleção                                               */
/* -------------------------------------------------------------------------- */

/**
 * Corta em 3:4, que é como o card e a galeria exibem toda foto do site.
 *
 * Foto muito fora dessa proporção perde demais no corte: uma 1:2,6 mostra só
 * 51% de si mesma, o que decapita a noiva ou come a barra do vestido. Quando o
 * corte passaria de 25%, a saída é preencher as laterais com uma versão
 * desfocada e escurecida da própria imagem até fechar 3:4, o vestido aparece
 * inteiro e o enquadramento continua sendo o do fotógrafo.
 *
 * `position: 'attention'` no corte normal: o sharp procura a região de maior
 * entropia em vez de cortar pelo centro, o que na prática segura o rosto e o
 * corpo do vestido quando a foto tem muito chão ou muito céu.
 */
async function paraTresQuartos(origem) {
  const metadados = await sharp(origem).rotate().metadata()
  const largura = metadados.width ?? 0
  const altura = metadados.height ?? 0
  if (!largura || !altura) throw new Error(`sem dimensões: ${origem}`)

  const ALVO = 3 / 4
  const razao = largura / altura
  const perda = razao > ALVO ? 1 - ALVO / razao : 1 - razao / ALVO

  const larguraFinal = Math.min(LADO_MAXIMO, largura)
  const alturaFinal = Math.round((larguraFinal / 3) * 4)

  if (perda <= PERDA_TOLERADA) {
    return sharp(origem)
      .rotate()
      .resize(larguraFinal, alturaFinal, { fit: 'cover', position: 'attention' })
      .webp({ quality: 82, effort: 5 })
      .toBuffer()
  }

  const fundo = await sharp(origem)
    .rotate()
    .resize(larguraFinal, alturaFinal, { fit: 'cover' })
    .blur(28)
    .modulate({ brightness: 0.55 })
    .toBuffer()

  const frente = await sharp(origem)
    .rotate()
    .resize(larguraFinal, alturaFinal, { fit: 'inside' })
    .toBuffer()

  return sharp(fundo)
    .composite([{ input: frente, gravity: 'center' }])
    .webp({ quality: 82, effort: 5 })
    .toBuffer()
}

async function processarSelecao() {
  let escritos = 0
  const faltando = []

  for (const [conjunto, escolhas] of Object.entries(SELECAO)) {
    const dir = path.join(EXTRAIDO, conjunto)
    if (!existsSync(dir)) {
      faltando.push(`conjunto não extraído: ${conjunto}`)
      continue
    }

    const arquivos = (await readdir(dir))
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
      .sort()

    for (const [numero, destinoRelativo] of Object.entries(escolhas)) {
      const origem = arquivos[Number(numero) - 1]
      if (!origem) {
        faltando.push(`${conjunto} #${numero}`)
        continue
      }
      const destino = path.join(DESTINO, destinoRelativo)
      await mkdir(path.dirname(destino), { recursive: true })
      await writeFile(destino, await paraTresQuartos(path.join(dir, origem)))
      escritos++
    }
  }

  console.log(`${escritos} fotos escritas em public/`)
  if (faltando.length) console.log('não encontradas:', faltando.join(', '))
}

/* -------------------------------------------------------------------------- */

if (!ORIGEM) {
  console.log('Pasta Fotográfos/ não encontrada na raiz do projeto.')
} else if (process.argv.includes('--folhas')) {
  if (!existsSync(EXTRAIDO)) {
    console.log(`Descompacte os zips para ${EXTRAIDO}/<nome do conjunto>/ e rode de novo.`)
  } else {
    console.log('Montando folhas de contato…')
    await montarFolhas()
    console.log(`\nFolhas em ${FOLHAS}`)
    console.log('Abra com a Danielli, anote os números e preencha a SELECAO deste arquivo.')
  }
} else if (Object.keys(SELECAO).length === 0) {
  console.log('A tabela SELECAO está vazia, nada a processar.')
  console.log('Rode com --folhas para montar as folhas de contato primeiro.')
} else {
  await processarSelecao()
}
