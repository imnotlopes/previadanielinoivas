/**
 * Ingestão dos casamentos — as fotos do dia, não do vestido.
 *
 *   node scripts/casamentos.mjs --folhas   monta as folhas de contato
 *   node scripts/casamentos.mjs            processa a SELEÇÃO
 *
 * POR QUE É UM SCRIPT SEPARADO DE importar-fotografos.mjs
 * ======================================================
 * Aquele traduz cobertura de fotógrafo em CATÁLOGO: uma foto por vestido,
 * recortada em 3:4, para virar card. Este traduz a mesma cobertura em
 * NARRATIVA: dezenas de fotos de um casamento só, em ordem cronológica, para
 * virar uma sequência que passa sozinha.
 *
 * São dois produtos diferentes a partir da mesma pasta, e misturá-los num
 * script só significaria um arquivo com dois modos que se contradizem.
 *
 * A ORDEM DA SELEÇÃO É A ORDEM DA APRESENTAÇÃO
 * ============================================
 * Os números abaixo não estão em ordem crescente por acaso — estão na ordem em
 * que a noiva vai ver: preparação, o vestido entrando, os pais, a igreja, a
 * festa. Reordenar a lista reordena a sequência na tela. É de propósito que
 * seja assim: assim a curadoria mora num lugar só, legível, versionado.
 *
 * PRIVACIDADE — LER ANTES DE MEXER
 * ================================
 * A pasta Fotográfos/ está no .gitignore e precisa continuar. São pessoas
 * reais, identificáveis, no dia do casamento delas, e o repositório é PÚBLICO.
 * O que entra no Git é o WebP derivado das fotos que a Danielli aprovou E que
 * têm AUTORIZAÇÃO DOS NOIVOS. Ver o bloqueador no README.
 */
import { existsSync } from 'node:fs'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const DESTINO = path.join(RAIZ, 'public', 'casamentos')

/** A pasta tem acento e o nome varia; acha por padrão em vez de fixar. */
const ORIGEM = (await readdir(RAIZ, { withFileTypes: true }))
  .filter((e) => e.isDirectory() && /^fotogr[aá]fos$/i.test(e.name))
  .map((e) => path.join(RAIZ, e.name))[0]

const EXTRAIDO = ORIGEM && path.join(ORIGEM, 'extraido')
const FOLHAS = ORIGEM && path.join(ORIGEM, 'folhas-casamentos')

/**
 * DUAS LARGURAS, PORQUE O MOSAICO TEM QUADROS DE TAMANHOS DIFERENTES.
 *
 * Um quadro pequeno no celular tem 160px de largura. Servir nele a mesma foto
 * de 900px que a peça grande usa é mandar quatro vezes mais bytes do que a
 * tela consegue mostrar — e a maioria das noivas abre isto no 4G.
 *
 * 400 cobre os quadros pequenos e médios até em tela retina; 900 cobre o
 * grande. Quem escolhe é o navegador, pelo `srcset` do componente.
 */
const LARGURAS = [400, 900]

/* -------------------------------------------------------------------------- */
/* A SELEÇÃO                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Os números vêm das folhas de contato (`--folhas`), e estão na ORDEM DA
 * SEQUÊNCIA — cronológica, do "se arrumando" até a festa.
 *
 * O que ficou de fora, e por quê:
 *
 *  - **Mesa de doces, bandeja de frios, bar, decoração.** O conjunto
 *    "Fornecedores" existe porque o mesmo pacote vai para o buffet, a banda e
 *    o decorador. Isso é catálogo de outra pessoa. Aqui a seção se chama "No
 *    dia delas" e fala de vestido.
 *  - **Retratos de convidados e padrinhos.** São pessoas identificáveis que
 *    não são os noivos, e não somam nada ao que este bloco precisa dizer.
 *  - **A colagem de miniaturas** (nº 1 de João e Natália): é um print, não uma
 *    foto.
 *  - **Qualquer foto com o NOME DO CASAL legível** — o bastidor bordado do nº 4
 *    de Thamiris e Rodrigo, as placas, os cardápios. O campo `casal` em
 *    data/casamentos.ts está vazio de propósito, à espera da autorização do
 *    nome; deixar o nome aparecer dentro da foto publicaria exatamente o que
 *    aquele campo vazio está segurando.
 */
const SELECAO = [
  {
    slug: 'joao-natalia',
    conjunto: 'Casamento João e Natália',
    /* Preparação → vestido → os pais → igreja → festa. */
    numeros: [
      8, 10, 12, 14, 24, 25,
      28, 31, 33, 35, 37, 39,
      41, 42, 44, 45, 47,
      50, 53, 55,
      67, 72, 73, 74, 76, 84, 85, 88,
      118, 123, 124, 133,
    ],
  },
  {
    slug: 'thamiris-rodrigo',
    conjunto: 'Fornecedores - Thamiris e Rodrigo',
    numeros: [
      22, 24, 68,
      12, 13, 40, 42, 45,
      62, 65, 71, 73, 76, 78, 79,
      81, 84, 85, 86, 89, 91, 94, 96,
      115,
      177, 179, 180, 183, 185,
    ],
  },
]

/**
 * A CAPA DO CATÁLOGO.
 *
 * Pedido da própria Danielli: a filha dela, Natália, é a capa. Não é escolha
 * de banco de imagem — é o argumento de autoridade mais forte que a loja tem:
 * quando a filha da dona casou, casou vestida pelo acervo da casa.
 *
 * O nº 41 é ela sentada com o vestido inteiro aberto e a tiara: o vestido é o
 * protagonista e o rosto aparece. Duas larguras porque a capa aparece em tela
 * cheia no celular (~430px, 860 em retina) e numa coluna de ~590px no
 * computador (1180 em retina).
 */
const CAPA = {
  conjunto: 'Casamento João e Natália',
  numero: 41,
  nome: 'capa-natalia',
  larguras: [800, 1400],
}

/**
 * AS HEROES DA FICHA — duas fotos da mesma peça, uma por formato de tela.
 *
 * Não é redundância: é direção de arte. Uma hero de tela cheia no celular é
 * um retângulo em pé; no computador é uma faixa deitada. A MESMA foto não
 * serve nos dois — a horizontal cortada em retrato perde 60% da largura, e a
 * vertical esticada em faixa mostra o umbigo da noiva.
 *
 * Então são duas fotos escolhidas para cada forma, servidas por `<picture>`
 * com `media` — que, ao contrário do `<source media>` de vídeo, funciona.
 *
 * As duas foram escolhidas pelo mesmo critério: a que mais mostra VESTIDO na
 * forma que aquela tela pede. A nº 43 é a noiva recostada com a saia toda
 * aberta; a nº 42 são as costas com a saia inteira, em pé no quadro.
 */
const HEROIS = [
  {
    conjunto: 'Casamento João e Natália',
    nome: 'aurora-hero',
    largo: { numero: 43, proporcao: 16 / 9, larguras: [1000, 1800] },
    /*
      A 123 (perfil na festa) era mais bonita como retrato e errada como hero:
      o recorte 4:5 fechava no busto e o VESTIDO sumia. Numa hero de ficha de
      vestido, o vestido é o assunto — a 42 mostra as costas e a saia inteira.
    */
    alto: { numero: 42, proporcao: 4 / 5, larguras: [600, 1000] },
  },
]

async function processarHerois() {
  for (const { conjunto, nome, largo, alto } of HEROIS) {
    const { dir, arquivos } = await fotosDe(conjunto)

    for (const [sufixo, plano] of [['', largo], ['-alto', alto]]) {
      const origem = arquivos[plano.numero - 1]
      if (!origem) {
        console.log(`· hero ${nome}${sufixo}: nº ${plano.numero} não existe`)
        continue
      }
      for (const largura of plano.larguras) {
        const maior = Math.max(...plano.larguras)
        const arquivo =
          largura === maior ? `${nome}${sufixo}.webp` : `${nome}${sufixo}-${largura}.webp`
        const buffer = await recortar(path.join(dir, origem), largura, plano.proporcao)
        await writeFile(path.join(DESTINO, arquivo), buffer)
      }
    }
    console.log(`✓ hero: ${nome} (largo e alto, duas larguras cada)`)
  }
}

async function processarCapa() {
  const { dir, arquivos } = await fotosDe(CAPA.conjunto)
  const origem = arquivos[CAPA.numero - 1]
  if (!origem) {
    console.log(`· capa: nº ${CAPA.numero} não existe em ${CAPA.conjunto}`)
    return
  }

  for (const largura of CAPA.larguras) {
    const nome =
      largura === Math.max(...CAPA.larguras)
        ? `${CAPA.nome}.webp`
        : `${CAPA.nome}-${largura}.webp`
    const buffer = await recortar(path.join(dir, origem), largura)
    await writeFile(path.join(DESTINO, nome), buffer)
  }
  console.log(`✓ capa: ${CAPA.nome} em ${CAPA.larguras.join(' e ')}px`)
}

/* -------------------------------------------------------------------------- */
/* Passo 1 — folhas de contato                                                 */
/* -------------------------------------------------------------------------- */

const COLUNAS = 8
const LINHAS = 6
const CELULA_L = 170
const CELULA_A = 227

async function fotosDe(conjunto) {
  const dir = path.join(EXTRAIDO, conjunto)
  if (!existsSync(dir)) return { dir, arquivos: [] }
  const arquivos = (await readdir(dir))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort()
  return { dir, arquivos }
}

async function montarFolhas() {
  await mkdir(FOLHAS, { recursive: true })

  for (const { slug, conjunto } of SELECAO) {
    const { dir, arquivos } = await fotosDe(conjunto)
    if (arquivos.length === 0) {
      console.log(`· ${conjunto}: pasta não encontrada`)
      continue
    }

    const porFolha = COLUNAS * LINHAS
    for (let f = 0; f * porFolha < arquivos.length; f++) {
      const lote = arquivos.slice(f * porFolha, (f + 1) * porFolha)
      const pecas = []

      for (let i = 0; i < lote.length; i++) {
        const numero = f * porFolha + i + 1
        const miniatura = await sharp(path.join(dir, lote[i]))
          .rotate()
          .resize(CELULA_L, CELULA_A - 22, { fit: 'cover' })
          .toBuffer()

        const coluna = i % COLUNAS
        const linha = Math.floor(i / COLUNAS)
        pecas.push({ input: miniatura, left: coluna * CELULA_L, top: linha * CELULA_A })

        const rotulo = await sharp({
          text: { text: `<span foreground="#fff" size="9000">${numero}</span>`, rgba: true },
        })
          .png()
          .toBuffer()
        pecas.push({
          input: rotulo,
          left: coluna * CELULA_L + 4,
          top: linha * CELULA_A + CELULA_A - 20,
        })
      }

      await sharp({
        create: {
          width: COLUNAS * CELULA_L,
          height: LINHAS * CELULA_A,
          channels: 3,
          background: '#1a1a1a',
        },
      })
        .composite(pecas)
        .jpeg({ quality: 72 })
        .toFile(path.join(FOLHAS, `${slug}-${f + 1}.jpg`))
    }

    console.log(
      `✓ ${conjunto}: ${arquivos.length} fotos em ${Math.ceil(arquivos.length / porFolha)} folha(s)`,
    )
  }

  console.log(`\nFolhas em ${path.relative(RAIZ, FOLHAS)}/`)
}

/* -------------------------------------------------------------------------- */
/* Passo 2 — processar a seleção                                               */
/* -------------------------------------------------------------------------- */

/**
 * Recorta em 3:4 — sempre, sem exceção.
 *
 * Passou por duas versões erradas antes desta, e as duas por bons motivos:
 *
 *  1. Recorte 3:4 COM faixa borrada quando a perda passava de 30%. Metade das
 *     fotos saía com faixa, e numa sequência que passa sozinha isso alterna
 *     entre dois formatos — parece defeito de carregamento.
 *  2. Sem recorte nenhum, com a foto inteira sobre fundo preto. Resolvia o
 *     corte e criou outro problema: tarja preta em volta da imagem é a
 *     linguagem visual de PLAYER DE VÍDEO, e este bloco não é vídeo. São
 *     fotos passando.
 *
 * Então: recorte único, todas iguais, a foto preenchendo o quadro inteiro.
 * `position: 'attention'` deixa o sharp achar a região de maior contraste, que
 * numa foto de casamento é quase sempre o rosto ou o vestido — recorte central
 * cego decapita noiva em foto vertical.
 *
 * O QUE ISTO CUSTA: uma horizontal perde metade da largura. Numa foto de grupo
 * na igreja isso corta gente de fora do quadro. É perda real, aceita porque a
 * alternativa era a sequência inteira parecer quebrada — e porque cada foto
 * dessas ainda mostra o momento, só mais de perto.
 */
async function recortar(origem, largura, proporcao = 3 / 4) {
  const alvoA = Math.round(largura / proporcao)

  return sharp(origem)
    .rotate()
    .resize(largura, alvoA, { fit: 'cover', position: 'attention', withoutEnlargement: true })
    .webp({ quality: 76 })
    .toBuffer()
}

async function processarSelecao() {
  await mkdir(DESTINO, { recursive: true })

  let total = 0
  let bytes = 0

  for (const { slug, conjunto, numeros } of SELECAO) {
    const { dir, arquivos } = await fotosDe(conjunto)
    if (arquivos.length === 0) {
      console.log(`· ${conjunto}: pasta não encontrada, pulando`)
      continue
    }

    const caminhos = []

    for (let i = 0; i < numeros.length; i++) {
      const indice = numeros[i] - 1
      if (indice < 0 || indice >= arquivos.length) {
        console.log(`  ! ${slug} nº ${numeros[i]} não existe (são ${arquivos.length})`)
        continue
      }

      const base = `${slug}-${String(i + 1).padStart(2, '0')}`

      for (const largura of LARGURAS) {
        /* A maior fica com o nome limpo: é ela que vai no `src`, o que o
           navegador antigo sem `srcset` baixa. */
        const nome =
          largura === Math.max(...LARGURAS) ? `${base}.webp` : `${base}-${largura}.webp`
        const buffer = await recortar(path.join(dir, arquivos[indice]), largura)
        await writeFile(path.join(DESTINO, nome), buffer)
        bytes += buffer.length
      }

      caminhos.push(`/casamentos/${base}.webp`)
      total += 1
    }

    console.log(`✓ ${slug}: ${caminhos.length} fotos`)
    /* Impresso para colar em src/data/casamentos.ts sem redigitar caminho. */
    console.log(caminhos.map((c) => `      '${c}',`).join('\n'))
  }

  console.log(
    `\n${total} fotos em ${LARGURAS.length} larguras · ${(bytes / 1024 / 1024).toFixed(1)} MB`,
  )
}

/* -------------------------------------------------------------------------- */

if (!ORIGEM || !existsSync(EXTRAIDO)) {
  console.log('Pasta Fotográfos/extraido não encontrada.')
} else if (process.argv.includes('--folhas')) {
  await montarFolhas()
} else {
  await processarSelecao()
  await processarCapa()
  await processarHerois()
}
