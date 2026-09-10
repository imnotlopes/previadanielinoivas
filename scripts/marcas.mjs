/**
 * PREPARA OS LOGOTIPOS DAS MARCAS REPRESENTADAS.
 * ==============================================
 *
 * Os arquivos que chegaram não servem lado a lado, e não é implicância:
 *
 *   Center Noivas      fundo BRANCO opaco
 *   Monet              fundo BEGE, com moldura fina e muita margem interna
 *   My Vintage Dress   fundo branco
 *   Rainha             vetor limpo, mas em caixa 765x401 com viewBox 4:1
 *   ViaSposa           fundo branco, e a marca é LARANJA
 *
 * Postos numa fileira sobre o off-white do ateliê, três deles apareceriam
 * como retângulos brancos recortados, o da Monet como um quadrado bege com
 * um logotipo pequeno no meio, e o laranja da ViaSposa brigaria com os outros
 * quatro em preto. Cada um com um tamanho óptico diferente do vizinho.
 *
 * O QUE ESTE ARQUIVO FAZ
 * ----------------------
 * Transforma cada um em MÁSCARA DE ALFA: uma imagem em que o canal alfa é a
 * tinta do logotipo e a cor não existe. Quem pinta é o CSS, com
 * `mask-image` e `background: currentColor`.
 *
 * Isso resolve os quatro problemas de uma vez:
 *
 *   1. Fundo branco e bege viram transparência de verdade.
 *   2. O laranja da ViaSposa deixa de existir, e ela entra no mesmo tom.
 *   3. A moldura da Monet é clara o bastante para cair junto com o fundo.
 *   4. Recortado na tinta e normalizado numa caixa, o tamanho óptico dos
 *      cinco passa a ser o mesmo.
 *
 * E dá de graça o que a fileira precisa: no dia em que a faixa for para
 * fundo escuro, `currentColor` muda e os cinco acompanham. Com PNG colorido
 * seria refazer os arquivos.
 *
 * O RECORTE É FEITO AQUI, NÃO PELO sharp
 * --------------------------------------
 * O `trim` do sharp corta pela cor do pixel do canto. Serviria para o fundo
 * branco chapado e falharia na Monet, cuja moldura encosta na borda. Ler a
 * caixa da tinta no laço abaixo é mais previsível e custa nada em 306 mil
 * pixels.
 *
 *   node scripts/marcas.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')

/**
 * OS ORIGINAIS FICAM FORA DE `public`, E ISSO IMPORTA.
 *
 * Tudo que está em `public` vai para produção, usado ou não. Os cinco
 * arquivos que a Danielli mandou somam 140 KB e não são lidos por página
 * nenhuma: quem o navegador baixa são as máscaras, que somam 60. Deixá-los lá
 * seria mandar 140 KB de arquivo morto junto de cada apresentação, numa peça
 * onde o peso foi cortado de 7,9 MB para 1,9.
 *
 * A prova de contato sai pelo mesmo motivo: é ferramenta de trabalho, não
 * material publicado.
 */
const ORIGEM = path.join(RAIZ, 'marcas-originais')
const DESTINO = path.join(RAIZ, 'public/marcas')
const PROVA = path.join(RAIZ, 'marcas-originais')

/**
 * A lista é ESCRITA À MÃO, e não lida da pasta.
 *
 * O nome da marca é informação de negócio: "images (1).png" não diz que é a
 * Center Noivas, e um script que adivinha nome a partir de nome de arquivo
 * publica erro no dia em que alguém salvar como "logo-final-2.png".
 *
 * Marca nova: acrescente uma linha aqui e rode de novo.
 */
const MARCAS = [
  { arquivo: 'images (1).png', slug: 'center-noivas', nome: 'Center Noivas' },
  { arquivo: 'rainha-765x401.svg', slug: 'rainha', nome: 'Rainha' },
  { arquivo: 'monet-765x401.png', slug: 'monet', nome: 'Monet' },
  {
    arquivo: 'viasposa-765x401.png',
    slug: 'viasposa',
    nome: 'ViaSposa',
    /*
      A ViaSposa é a única colorida, e a cor cobra o preço aqui.

      O terracota dela tem brilho por volta de 140. Na rampa padrão isso vira
      79% de alfa, e na prova ela aparecia visivelmente mais fraca que as
      outras quatro, como se estivesse meio apagada. Subindo o teto para 175, o
      terracota passa a contar como tinta cheia e ela entra com o mesmo peso.
    */
    tetoDeTinta: 175,
  },
  { arquivo: 'my-vintage-dress-765x401.png', slug: 'my-vintage-dress', nome: 'My Vintage Dress' },
]

/**
 * O LADO MAIOR DA MÁSCARA EXPORTADA.
 *
 * Só resolução, não tamanho de tela: quem decide o tamanho de cada logotipo é
 * o CSS, com uma largura por marca. 640 dá conta de qualquer tela de retina no
 * maior deles e ainda pesa poucos KB, porque a máscara é um canal só.
 *
 * TENTEI NORMALIZAR NUMA CAIXA, E NÃO FUNCIONA
 * --------------------------------------------
 * A primeira versão jogava os cinco num `fit: inside` de 200x44. O resultado
 * mediu o BLOCO, e não a letra:
 *
 *   Center Noivas   2,2:1   bateu na altura
 *   Rainha          4,1:1   bateu na altura
 *   Monet           3,5:1   bateu na altura
 *   ViaSposa        6,0:1   bateu na largura
 *   My Vintage      17,4:1  bateu na largura, e sobrou 11px de altura
 *
 * Ou seja: a My Vintage Dress, que é uma linha comprida e fina, virava um fio
 * ilegível ao lado de uma Monet trinta vezes mais gorda. Equilíbrio óptico de
 * logotipo não se automatiza por caixa. Se resolve marca a marca, no olho,
 * olhando os cinco juntos, e é para isso que existe a prova de contato.
 */
const LADO_MAIOR = 640

/**
 * Acima deste brilho, o pixel é fundo.
 *
 * 215 de 255. Escolhido pela Monet, que é o caso difícil: o campo bege dela
 * está por volta de 237 e a moldura por volta de 225, e as duas precisam
 * cair. O preto do logotipo está abaixo de 60, então há folga larga.
 */
const PISO_DE_FUNDO = 215

/**
 * Abaixo deste brilho, o pixel é tinta cheia. Entre os dois, meio-tom.
 *
 * Vale para logotipo preto ou cinza escuro, que é a regra. Marca colorida
 * sobrescreve na própria linha da lista, ver ViaSposa.
 */
const TETO_DE_TINTA = 120

async function preparar({ arquivo, slug, nome, tetoDeTinta = TETO_DE_TINTA }) {
  const origem = path.join(ORIGEM, arquivo)

  /*
    `density` só vale para o SVG, e vale muito: sem isso o libvips rasteriza
    na caixa declarada de 765x401 e a máscara sai serrilhada ao ser ampliada.
  */
  const { data, info } = await sharp(origem, { density: 600 })
    /* Achata sobre BRANCO, e não sobre transparente: um PNG que já tenha alfa
       precisa virar o mesmo problema dos outros quatro antes de ser resolvido,
       senão o alfa antigo se soma ao novo e a borda fica suja. */
    .flatten({ background: '#ffffff' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width: largura, height: altura } = info
  const rgba = Buffer.alloc(largura * altura * 4)

  let esq = largura
  let dir = -1
  let topo = altura
  let base = -1

  for (let i = 0; i < largura * altura; i++) {
    const brilho = data[i]

    /* Rampa linear entre os dois limiares. Um corte seco daria borda em
       escada; a rampa preserva o antialiasing da tipografia, que num logotipo
       fino como o da My Vintage Dress é metade do desenho. */
    let tinta = 0
    if (brilho <= tetoDeTinta) tinta = 255
    else if (brilho < PISO_DE_FUNDO) {
      tinta = Math.round(((PISO_DE_FUNDO - brilho) / (PISO_DE_FUNDO - tetoDeTinta)) * 255)
    }

    const j = i * 4
    rgba[j] = 255
    rgba[j + 1] = 255
    rgba[j + 2] = 255
    rgba[j + 3] = tinta

    /* A caixa da tinta ignora o quase-nada: sem o limite de 8, uma sujeira de
       compressão de JPEG num canto esticaria o recorte até a borda. */
    if (tinta > 8) {
      const x = i % largura
      const y = (i / largura) | 0
      if (x < esq) esq = x
      if (x > dir) dir = x
      if (y < topo) topo = y
      if (y > base) base = y
    }
  }

  if (dir < 0) throw new Error(`${arquivo}: nenhuma tinta encontrada, confira os limiares`)

  const recorte = {
    left: esq,
    top: topo,
    width: dir - esq + 1,
    height: base - topo + 1,
  }

  const saida = await sharp(rgba, { raw: { width: largura, height: altura, channels: 4 } })
    .extract(recorte)
    .resize({
      width: recorte.width >= recorte.height ? LADO_MAIOR : undefined,
      height: recorte.width >= recorte.height ? undefined : LADO_MAIOR,
      fit: 'inside',
    })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer()

  const destino = path.join(DESTINO, `${slug}.webp`)
  await writeFile(destino, saida)

  const final = await sharp(saida).metadata()
  const proporcao = (final.width / final.height).toFixed(1)
  console.log(
    `${nome.padEnd(18)} ${String(largura).padStart(5)}x${altura}` +
      ` -> ${String(final.width).padStart(4)}x${String(final.height).padEnd(4)}` +
      ` proporção ${proporcao.padStart(5)}:1   ${slug}.webp ${Math.round(saida.length / 1024)} KB`,
  )
  return { arquivo, slug, nome, largura: final.width, altura: final.height }
}

/**
 * A PROVA DE CONTATO.
 *
 * Os cinco empilhados, pintados no cinza da marca, cada um na largura que o
 * `LARGURAS` propõe, sobre o off-white do ateliê. É a única forma honesta de
 * julgar equilíbrio óptico: contagem de pixel não diz se duas palavras
 * parecem do mesmo tamanho, olho diz.
 *
 * Abrir marcas-originais/prova.png, mexer no `LARGURAS`, rodar de novo. As
 * larguras daqui são as mesmas que vão para o componente.
 */
/*
  Larguras em pixels de CSS, calibradas na prova por ALTURA DE CAIXA ALTA, e
  não por altura da caixa do arquivo.

  É a medida que o olho usa: cinco palavras parecem do mesmo tamanho quando o
  "C", o "R" e o "M" delas têm a mesma altura, mesmo que o bloco todo não
  tenha. Na primeira prova, com larguras iguais no chute, a Rainha media 24px
  de caixa alta e a My Vintage Dress 15px, e a diferença saltava aos olhos.

  A meta é 20px, com uma exceção anotada.
*/
const LARGURAS = {
  /* Duas linhas com filete no meio, então o BLOCO fica alto. É o mais alto
     dos cinco e mesmo assim tem a menor letra: normal em lockup empilhado. */
  'center-noivas': 106,
  rainha: 110,
  monet: 118,
  viasposa: 136,
  /* Fica em 17px de caixa alta, e não em 20. Para chegar a 20 ela precisaria
     de 228px de largura, mais que o dobro da Rainha, e uma palavra dessa
     largura desequilibra a fileira mais do que a letra menor desequilibra. */
  'my-vintage-dress': 205,
}

const FAIXA = 120
const MARGEM = 40

async function provaDeContato(processadas) {
  const largura = 640
  const altura = processadas.length * FAIXA + MARGEM * 2
  const camadas = []

  for (const [i, m] of processadas.entries()) {
    const larguraFinal = Math.round((LARGURAS[m.slug] ?? 120) * 2)
    const alturaFinal = Math.max(1, Math.round((larguraFinal * m.altura) / m.largura))

    const mascara = await sharp(path.join(DESTINO, `${m.slug}.webp`))
      .resize({ width: larguraFinal })
      .toBuffer()

    /* Pinta a máscara no cinza da marca. `dest-in` mantém o retângulo chapado
       só onde a máscara tem alfa, que é exatamente o que o `mask-image` do CSS
       faz depois. Assim a prova mostra o que a página vai mostrar. */
    const tingido = await sharp({
      create: {
        width: larguraFinal,
        height: alturaFinal,
        channels: 4,
        background: { r: 107, g: 101, b: 96, alpha: 1 },
      },
    })
      .composite([{ input: mascara, blend: 'dest-in' }])
      .png()
      .toBuffer()

    camadas.push({
      input: tingido,
      left: Math.round((largura - larguraFinal) / 2),
      top: Math.round(MARGEM + i * FAIXA + (FAIXA - alturaFinal) / 2),
    })
  }

  const folha = await sharp({
    create: { width: largura, height: altura, channels: 4, background: '#FAF9F6' },
  })
    .composite(camadas)
    .png()
    .toBuffer()

  await writeFile(path.join(PROVA, 'prova.png'), folha)
  console.log('\nProva de contato: marcas-originais/prova.png')
}

await mkdir(DESTINO, { recursive: true })
console.log('Preparando máscaras de logotipo\n')
const processadas = []
for (const marca of MARCAS) processadas.push(await preparar(marca))
await provaDeContato(processadas)
console.log('As máscaras são pintadas pelo CSS, ver .marca-logo em index.css.')
