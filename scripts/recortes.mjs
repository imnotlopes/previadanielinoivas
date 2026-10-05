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
 * ver o resto: o bordado, o véu, as costas.
 *
 * A CAIXA
 * =======
 * `caixa` é [esquerda, topo, largura, altura], em fração da foto original, e
 * foi escolhida olhando cada foto com uma grade de 10% por cima. Fração, e
 * não pixel, para a caixa continuar certa se a foto de origem for trocada
 * por uma versão maior do mesmo arquivo.
 *
 * NÃO AMPLIA. O recorte sai no tamanho que a caixa tem na foto original.
 */
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const PUBLICO = path.join(RAIZ, 'public')

const RECORTES = [
  /*
    A CAPA. Desde 28 de setembro de 2026 é a filha da Danielli, de olhos
    baixos, com a tiara no coque, o véu e o bordado nos ombros. Pedido do
    Edson, com a foto na mão.

    UMA FOTO SÓ, VERTICAL, PARA AS DUAS TELAS. A capa anterior tinha uma
    versão deitada para o desktop, e esta foto não aceita: o rosto ocupa do
    alto até o meio, e uma faixa deitada ou corta o queixo ou joga o rosto
    no pé da tela, onde a foto se desmancha no papel. No desktop a capa virou
    duas colunas, e a foto fica em pé na da direita. Ver CapaApresentacao.

    A caixa corta 3% da direita: a original é print de celular e tem a sobra
    da barra de rolagem na borda, na altura do queixo. E corta o alto, que é
    parede, para o rosto subir na tela do celular.
  */
  {
    origem: 'pecas/mariana-bordado-manga-longa.webp',
    destino: 'capa/filha.webp',
    caixa: [0, 0.07, 0.97, 0.91],
  },

  /*
    AS FOLHAS DO DESLIZE: QUATRO NOIVAS, UMA FOLHA DE CADA.

    A sequência já foi de cinco noivas e depois de três folhas só da filha
    da Danielli. No áudio de 5 de outubro de 2026 ela pediu o meio-termo:
    "quatro fotos e uma de cada noiva, não precisa ser da mesma noiva". Três
    folhas do mesmo vestido eram vestido demais mostrado.

    Ficaram a Lorena, a Helena, a filha e a Antonia. A Natália (a Aurora do
    acervo) fica de fora porque já está em "No dia delas"; a Rafaela, porque
    o recorte dela era o que mais entregava do vestido.

    Cada folha tem a grande e a de perto (a pequena de moldura branca, em
    4:5). A foto da filha é print de celular, com a sobra da barra de rolagem
    na borda direita: a caixa não passa de 97% da largura.
  */
  {
    // A renda da manga com o buquê, e o sorriso.
    origem: 'pecas/lorena-manga-longa-em-renda.webp',
    destino: 'recortes/lorena-renda-da-manga.webp',
    caixa: [0.2, 0.12, 0.8, 0.8],
  },
  {
    // As folhas de renda da manga, de perto.
    origem: 'pecas/lorena-manga-longa-em-renda.webp',
    destino: 'recortes/lorena-renda-da-manga-perto.webp',
    caixa: [0.6, 0.55, 0.4, 0.375],
  },
  {
    // O rosto e o bordado de pedras do ombro.
    origem: 'pecas/helena-ombros-bordados.webp',
    destino: 'recortes/helena-ombro-bordado.webp',
    caixa: [0, 0, 0.94, 1],
  },
  {
    // O bordado do ombro, de perto.
    origem: 'pecas/helena-ombros-bordados.webp',
    destino: 'recortes/helena-ombro-bordado-perto.webp',
    caixa: [0, 0.56, 0.42, 0.42],
  },
  {
    // A filha da Danielli de perfil: o coque, o véu caindo e as pedras do
    // ombro. A capa já mostra o rosto dela de frente; aqui é o véu.
    origem: 'pecas/mariana-bordado-manga-longa-3.webp',
    destino: 'recortes/filha-veu.webp',
    caixa: [0.12, 0.04, 0.8, 0.8],
  },
  {
    // O véu sobre o bordado do ombro.
    origem: 'pecas/mariana-bordado-manga-longa-3.webp',
    destino: 'recortes/filha-veu-perto.webp',
    caixa: [0.55, 0.45, 0.4, 0.375],
  },
  {
    // De costas e de longe na original; o recorte chega no laço.
    origem: 'pecas/antonia-princesa-ombro-a-ombro.webp',
    destino: 'recortes/antonia-laco-nas-costas.webp',
    caixa: [0.25, 0.32, 0.6, 0.45],
  },
  {
    // A renda das costas, os botões e o laço. É a menor de perto (288px de
    // largura): a original foi feita de longe. Basta para a moldura pequena.
    origem: 'pecas/antonia-princesa-ombro-a-ombro.webp',
    destino: 'recortes/antonia-laco-nas-costas-perto.webp',
    caixa: [0.34, 0.455, 0.32, 0.225],
  },
  {
    // A tiara no coque dela. Vai para "Tudo para o seu casamento", no lugar
    // da noiva de costas no espelho do provador: acessório mostrado nela, e
    // não um vestido inteiro de outra cliente.
    origem: 'pecas/mariana-bordado-manga-longa-3.webp',
    destino: 'oferece/filha-tiara.webp',
    caixa: [0.38, 0.05, 0.36, 0.337],
  },

  /*
    NO DIA DELAS: UMA FOTO DE CADA NOIVA.

    No áudio de 5 de outubro de 2026 a Danielli pediu quatro fotos, uma de
    cada noiva, no lugar das 23 da mesma noiva. Três vêm do Instagram dela
    (fotos que ela mesma já publicou), a quarta é o recorte do casal da
    Natália, mais abaixo.

    A origem é o dump do Instagram, que mora fora do repositório (instagram/,
    no .gitignore). Sem ele, estas três são puladas com aviso, e os arquivos
    publicados continuam valendo.

    Cada uma recortada no momento, e não no vestido: o rosto, o abraço, os
    braços erguidos. A saia fica fora sempre que dá.
  */
  {
    // A filha da Danielli e o noivo, abraçados, com o buquê. Post 95.
    origem: '../instagram/imgi_95_624198517_18186602110360773_3687668331175928721_n.webp',
    destino: 'casamentos/no-dia/abraco.webp',
    caixa: [0, 0.02, 1, 0.75],
  },
  {
    // O beijo, ela inclinada para trás: os rostos e o buquê, sem a saia. Post 86.
    origem: '../instagram/imgi_86_637748399_18394521604196463_2382495323666521258_n.webp',
    destino: 'casamentos/no-dia/beijo.webp',
    caixa: [0.25, 0.06, 0.48, 0.512],
  },
  {
    // A saída da igreja, os dois de braços erguidos, em preto e branco.
    // Até o joelho. Post 106.
    origem: '../instagram/imgi_106_590711812_18545407441037005_4628112711545292596_n.webp',
    destino: 'casamentos/no-dia/saida.webp',
    caixa: [0.2, 0, 0.6, 0.8],
  },

  /*
    A NATÁLIA, a quarta noiva de "No dia delas": o casal, dos rostos ao
    buquê. É o que sobrou do mural de 23 fotos do casamento dela, que saiu em
    outubro de 2026 (ver data/casamentos.ts). Os outros seis recortes do
    mural e as fotos de origem saíram de public/ junto; scripts/casamentos.mjs
    regenera as fotos se um dia o mural voltar, e a seleção antiga está no
    histórico do git.
  */
  {
    origem: 'casamentos/joao-natalia-27.webp',
    destino: 'casamentos/recortes/joao-natalia-27.webp',
    caixa: [0.15, 0, 0.6, 0.6],
  },
]

for (const { origem, destino, caixa, pequena } of RECORTES) {
  if (!existsSync(path.join(PUBLICO, origem))) {
    console.log(`pulado, origem fora do disco: ${origem}`)
    continue
  }
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

  if (pequena) {
    const destinoPequena = saida.replace(/\.webp$/, `-${pequena}.webp`)
    const infoPequena = await sharp(saida)
      .resize({ width: pequena, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destinoPequena)
    console.log(`  + -${pequena}  ${infoPequena.width}x${infoPequena.height}`)
  }
}
