/**
 * OS VÍDEOS DA APRESENTAÇÃO.
 *
 * Todos verticais (9:16), mudos e em laço. Os arquivos servidos aqui são a
 * versão comprimida — os originais ficam em `videos-originais/`, fora do Git,
 * e `scripts/videos.mjs` gera o par .mp4 + .webp (o pôster).
 *
 * VERTICAL NÃO É FORMATO DE FUNDO
 * -------------------------------
 * 9:16 numa tela larga significa cortar dois terços do quadro ou deixar tarja.
 * Por isso nenhum destes vídeos vai para a abertura: eles moram nos blocos de
 * duas colunas e no tríptico, onde a coluna já é retrato e nada é cortado.
 */

export interface VideoEditorial {
  src: string
  /**
   * Arquivo menor, para telas estreitas.
   *
   * No carrossel do celular o vídeo aparece com ~255px de largura, e servir
   * ali o arquivo de 720px é mandar o dobro dos pixels que cabem — num bloco
   * que responde por quase todo o peso da página. Ausente quando o vídeo já
   * nasceu pequeno.
   */
  srcCelular?: string
  poster: string
  /** O que se vê, para quem não vê. */
  alt: string
}

/*
  POR QUE NÃO HÁ LEGENDA EMBAIXO DE CADA VÍDEO
  --------------------------------------------
  A primeira versão tinha: "O bordado de perto", "O caimento no corpo", "A
  cauda em movimento". Bonito, e falso — foram escritas olhando UM quadro de
  cada arquivo. Vendo os trinta segundos inteiros, os três são reels de
  vários vestidos em vários salões, e nenhum é sobre um assunto só.

  Legenda que descreve errado é pior que legenda nenhuma: ela promete um
  recorte que o vídeo não entrega, e quem está assistindo percebe. O título da
  seção já diz o que o bloco é.
*/

/**
 * A loja por dentro — panorâmica pelos manequins.
 *
 * Vai no bloco "Quem atende", que é o de autoridade: uma noiva que recebe um
 * link precisa saber que existe loja de verdade, com acervo pendurado, e não
 * um perfil que revende foto.
 *
 * ATENÇÃO: a Danielli NÃO aparece neste vídeo. Ele mostra o acervo, não quem
 * atende — o retrato dela continua faltando. Ver `retrato` em data/atelier.ts.
 */
export const videoAtelier: VideoEditorial = {
  src: '/videos/atelier.mp4',
  poster: '/videos/atelier.webp',
  alt: 'Vestidos de noiva em manequins dentro da loja, com véu e buquê ao lado.',
}

/**
 * O tríptico — três vestidos em movimento.
 *
 * São três reels de trinta segundos, cada um passeando por vários vestidos em
 * salões diferentes — plano aberto, caminhada e fechado no bordado. Como os
 * três têm a mesma natureza, a ordem entre eles é indiferente; o que importa
 * é serem três, porque três 9:16 lado a lado formam uma faixa que ocupa a
 * largura inteira sem cortar quadro nenhum.
 */
export const videosEditoriais: VideoEditorial[] = [
  {
    src: '/videos/editorial-1.mp4',
    srcCelular: '/videos/editorial-1-540.mp4',
    poster: '/videos/editorial-1.webp',
    alt: 'Noivas em um salão de janelas altas, em vestidos bordados de manga longa, e o detalhe das costas em renda transparente.',
  },
  {
    src: '/videos/editorial-2.mp4',
    srcCelular: '/videos/editorial-2-540.mp4',
    poster: '/videos/editorial-2.webp',
    alt: 'Noivas descendo uma escadaria e caminhando por um salão, em vestidos de renda com manga longa.',
  },
  {
    src: '/videos/editorial-3.mp4',
    srcCelular: '/videos/editorial-3-540.mp4',
    poster: '/videos/editorial-3.webp',
    alt: 'Noivas em um salão de parede de tijolo, com a cauda do vestido estendida sobre a escada.',
  },
]
