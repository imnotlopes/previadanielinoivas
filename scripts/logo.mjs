/**
 * A logo nova da Danielli Noivas, e os ícones que saem dela.
 *
 *   node scripts/logo.mjs
 *
 * DE ONDE VEM
 * ===========
 * A Danielli mandou a logo nova em setembro de 2026, num PDF de uma página
 * ("DANIELLI NOIVAS logo PDF.pdf"). O PDF não é vetorial: dentro dele há uma
 * imagem só, um JPEG de 1024 por 1024 em CMYK, com o desenho rosé sobre um
 * fundo rosado de textura leve.
 *
 * Essa imagem foi tirada do PDF sem reamostragem (PyMuPDF, convertendo CMYK
 * para RGB) e mora em logo-original/danielli-noivas.png, junto com o PDF.
 * A pasta fica fora do repositório, mesma regra de marcas-originais/.
 *
 * O FUNDO SAI PELA LUMINÂNCIA, E A COR É REPINTADA
 * ================================================
 * O fundo não é liso: tem uma textura de papel entre 224 e 239 de luminância.
 * Recortar por cor exata deixaria manchas. Aqui o alfa de cada pixel é o
 * quanto ele é mais escuro que o fundo, numa rampa entre FUNDO e TINTA:
 * pixel na cor do papel vira transparente, pixel na cor do traço vira opaco,
 * e o meio-tom da borda do traço vira meio-tom de alfa, que é o que mantém o
 * desenho fino sem serrilhar.
 *
 * Depois o RGB inteiro vira uma cor só. Isso não muda a marca: o traço já era
 * de uma cor, e o que variava era só o antialiasing contra o papel, que agora
 * está no alfa. O ganho é poder pintar a mesma arte de branco para a capa.
 *
 * O ROSÉ É O DA PRÓPRIA LOGO
 * --------------------------
 * 162 114 104 (#A27268) é a média dos pixels de traço cheio. É a mesma cor
 * de `--rose-rgb` em src/index.css: a paleta nova saiu daqui.
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const PUBLICO = path.join(RAIZ, 'public')
const ORIGEM = path.join(RAIZ, 'logo-original', 'danielli-noivas.png')

/** Luminância do papel (vira alfa 0) e do traço cheio (vira alfa 1). */
const FUNDO = 226
const TINTA = 128

const ROSE = [162, 114, 104]
const BRANCO = [255, 255, 255]

/**
 * As três partes da arte, em pixels da imagem de 1024.
 *
 * Medidas pelas faixas de linhas que têm traço: o símbolo (o arco e o
 * vestido) vai da linha 115 à 626, o nome manuscrito da 698 à 832 e a frase
 * da 847 à 864. Cada caixa tem 12px de folga, para o traço não encostar na
 * borda do arquivo.
 *
 *   completo     tudo. É o fecho da apresentação, no rodapé.
 *   simbolo      só o vestido no arco. Vira o ícone da aba.
 *   assinatura   o nome e a frase, sem o desenho. É a marca da capa, onde o
 *                vestido desenhado brigaria com a foto de um vestido de verdade.
 */
const PARTES = {
  completo: { left: 102, top: 103, width: 834, height: 774 },
  simbolo: { left: 231, top: 103, width: 560, height: 536 },
  assinatura: { left: 102, top: 686, width: 834, height: 191 },
}

const SAIDAS = [
  { parte: 'completo', cor: ROSE, arquivo: 'logo/danielli-noivas.webp' },
  { parte: 'completo', cor: BRANCO, arquivo: 'logo/danielli-noivas-claro.webp' },
  { parte: 'assinatura', cor: ROSE, arquivo: 'logo/assinatura.webp' },
  { parte: 'assinatura', cor: BRANCO, arquivo: 'logo/assinatura-claro.webp' },
  { parte: 'simbolo', cor: ROSE, arquivo: 'logo/simbolo.webp' },
]

/** O fundo dos ícones: o rosado claro do papel da logo, mais limpo. */
const FUNDO_ICONE = { r: 245, g: 238, b: 234 }

async function alfa() {
  const { data, info } = await sharp(ORIGEM)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const mascara = Buffer.alloc(info.width * info.height)
  for (let i = 0, p = 0; p < mascara.length; i += 3, p++) {
    const luz = (data[i] + data[i + 1] + data[i + 2]) / 3
    let a = (FUNDO - luz) / (FUNDO - TINTA)
    // Abaixo de 5% é textura do papel, não traço.
    if (a < 0.05) a = 0
    mascara[p] = Math.round(Math.min(1, Math.max(0, a)) * 255)
  }
  return { mascara, largura: info.width, altura: info.height }
}

/** Filtro de máximo separável, raio `r`: primeiro nas linhas, depois nas colunas. */
function engrossar(mascara, largura, altura, r) {
  const linhas = Buffer.alloc(mascara.length)
  for (let y = 0; y < altura; y++) {
    for (let x = 0; x < largura; x++) {
      let m = 0
      for (let d = Math.max(0, x - r); d <= Math.min(largura - 1, x + r); d++) {
        m = Math.max(m, mascara[y * largura + d])
      }
      linhas[y * largura + x] = m
    }
  }
  const saida = Buffer.alloc(mascara.length)
  for (let x = 0; x < largura; x++) {
    for (let y = 0; y < altura; y++) {
      let m = 0
      for (let d = Math.max(0, y - r); d <= Math.min(altura - 1, y + r); d++) {
        m = Math.max(m, linhas[d * largura + x])
      }
      saida[y * largura + x] = m
    }
  }
  return saida
}

function pintar({ mascara, largura, altura }, cor) {
  return sharp({
    create: { width: largura, height: altura, channels: 3, background: { r: cor[0], g: cor[1], b: cor[2] } },
  }).joinChannel(mascara, { raw: { width: largura, height: altura, channels: 1 } })
}

const arte = await alfa()
await mkdir(path.join(PUBLICO, 'logo'), { recursive: true })

for (const { parte, cor, arquivo } of SAIDAS) {
  const png = await pintar(arte, cor).png().toBuffer()
  await sharp(png)
    .extract(PARTES[parte])
    // alphaQuality no máximo: o desenho é todo traço fino, e é no alfa que a
    // compressão come o traço antes de comer a cor.
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(path.join(PUBLICO, arquivo))
  console.log(`  ${arquivo}`)
}

/*
  ÍCONES DE ABA E DE TELA INICIAL.

  O símbolo sozinho, e não a logo inteira: a 32px o nome manuscrito vira uma
  linha tremida, e o vestido no arco continua sendo um vestido. Achatado sobre
  o rosado claro porque o iOS não aceita alfa no apple-touch-icon, e porque
  traço rosé fino some sobre a barra escura de um navegador em tema escuro.

  O traço é ENGROSSADO antes de reduzir. Na arte ele tem uns 3px; reduzido a
  32px de aba, viraria meio pixel e o ícone seria um quadrado rosado vazio. O
  alargamento é um filtro de máximo, que engorda o traço sem mudar o desenho,
  e o tom desce para o rosé escuro pelo mesmo motivo: em ícone pequeno,
  contraste é o que resta.

  Feito à mão, e não com o `dilate` do sharp: aquele trata a imagem como
  binária e, sobre um alfa com meio-tom, devolveu o traço quase apagado.
*/
const ROSE_ESCURO = [128, 84, 74]
const simbolo = await pintar(
  { ...arte, mascara: engrossar(arte.mascara, arte.largura, arte.altura, 6) },
  ROSE_ESCURO,
)
  .png()
  .toBuffer()
const recorte = await sharp(simbolo).extract(PARTES.simbolo).png().toBuffer()

for (const { arquivo, lado } of [
  { arquivo: 'favicon.png', lado: 180 },
  { arquivo: 'apple-touch-icon.png', lado: 180 },
]) {
  const miolo = Math.round(lado * 0.78)
  const desenho = await sharp(recorte)
    .resize(miolo, miolo, { fit: 'contain', background: { ...FUNDO_ICONE, alpha: 0 } })
    .png()
    .toBuffer()
  await sharp({ create: { width: lado, height: lado, channels: 3, background: FUNDO_ICONE } })
    .composite([{ input: desenho, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLICO, arquivo))
  console.log(`  ${arquivo}`)
}
