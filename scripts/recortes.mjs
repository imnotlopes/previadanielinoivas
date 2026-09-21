/**
 * Os recortes de detalhe da apresentação de noivas.
 *
 *   node scripts/recortes.mjs
 *
 * POR QUE RECORTAR
 * ================
 * A Danielli, no áudio de setembro de 2026: "mostrando detalhes, não
 * necessariamente tudo do vestido, porque senão não chama atenção". Cidade
 * pequena, ela atende a região, e a noiva que já viu o vestido inteiro chega
 * dizendo "esse eu já vi".
 *
 * As fotos do acervo são do vestido inteiro, ou quase, porque foram feitas
 * para catálogo. Estes recortes tiram de cada uma o detalhe que faz querer
 * ver o resto: o bordado, a renda da manga, a coroa e o decote, o ombro, o
 * laço das costas.
 *
 * A CAIXA
 * =======
 * `caixa` é [esquerda, topo, largura, altura], em fração da foto original, e
 * foi escolhida olhando cada foto com uma grade de 10% por cima. Fração, e
 * não pixel, para a caixa continuar certa se a foto de origem for trocada
 * por uma versão maior do mesmo arquivo.
 *
 * NÃO AMPLIA. O recorte sai no tamanho que a caixa tem na foto original. Os
 * menores (Rafaela e Antonia) ficam perto de 700 pixels de altura, o bastante
 * para o cartão do deslize, que tem dois terços da altura da tela.
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const PUBLICO = path.join(RAIZ, 'public')

const RECORTES = [
  /*
    A CAPA. Antes era a Aurora sentada com o vestido inteiro aberto, do colo
    à barra, e era a primeira imagem da página. Agora é o close dela de
    costas, com a gola de renda e o buquê: a foto já é um detalhe, e o
    recorte só ajusta a proporção.
  */
  {
    origem: 'pecas/aurora-renda-gola-alta.webp',
    destino: 'capa/aurora-alto.webp',
    caixa: [0, 0.02, 1, 0.94],
  },
  /*
    A capa larga, do desktop: uma faixa com o rosto e a gola. A foto de
    origem tem 1200 de largura, então no desktop a faixa aparece levemente
    ampliada; sob o véu escuro da capa, não se nota.
  */
  {
    origem: 'pecas/aurora-renda-gola-alta.webp',
    destino: 'capa/aurora-largo.webp',
    caixa: [0, 0.14, 1, 0.42],
  },

  /* As cinco do deslize, na ordem em que aparecem. */
  {
    origem: 'pecas/mariana-bordado-manga-longa.webp',
    destino: 'recortes/mariana-bordado.webp',
    caixa: [0.08, 0.14, 0.84, 0.84],
  },
  {
    origem: 'pecas/lorena-manga-longa-em-renda.webp',
    destino: 'recortes/lorena-renda-da-manga.webp',
    caixa: [0.2, 0.12, 0.8, 0.8],
  },
  {
    // A que mais entregava: o vestido quase inteiro, de frente. Fica a coroa,
    // o decote bordado e a mão de quem está vestindo ela.
    origem: 'pecas/rafaela-decote-profundo-bordado.webp',
    destino: 'recortes/rafaela-coroa-e-decote.webp',
    caixa: [0.14, 0.02, 0.6, 0.6],
  },
  {
    origem: 'pecas/helena-ombros-bordados.webp',
    destino: 'recortes/helena-ombro-bordado.webp',
    caixa: [0, 0, 0.94, 1],
  },
  {
    // De costas e de longe na original; o recorte chega no laço.
    origem: 'pecas/antonia-princesa-ombro-a-ombro.webp',
    destino: 'recortes/antonia-laco-nas-costas.webp',
    caixa: [0.25, 0.32, 0.6, 0.45],
  },
]

for (const { origem, destino, caixa } of RECORTES) {
  const entrada = sharp(path.join(PUBLICO, origem))
  const { width, height } = await entrada.metadata()
  const [e, t, l, a] = caixa

  const regiao = {
    left: Math.round(e * width),
    top: Math.round(t * height),
    width: Math.min(Math.round(l * width), width - Math.round(e * width)),
    height: Math.min(Math.round(a * height), height - Math.round(t * height)),
  }

  const saida = path.join(PUBLICO, destino)
  await mkdir(path.dirname(saida), { recursive: true })
  const info = await sharp(path.join(PUBLICO, origem))
    .extract(regiao)
    .webp({ quality: 84 })
    .toFile(saida)

  console.log(`${destino}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}
