import { videosEditoriais } from '../data/videos'
import Revelar from './Revelar'
import VideoVertical from './VideoVertical'

/**
 * O tríptico — três vestidos em movimento, sobre preto.
 *
 * POR QUE ESTA FOLHA EXISTE
 * -------------------------
 * É o argumento da própria marca, cumprido em vez de afirmado. A página já
 * diz, com todas as letras, que "vestido bonito na foto e vestido bonito nela
 * são coisas diferentes" — e até aqui provava isso só com fotos. O vídeo é o
 * que fecha a dúvida de caimento: o brilho do bordado muda com a luz, o tule
 * pesa, a cauda arrasta. Nada disso existe numa imagem parada.
 *
 * POR QUE SOBRE PRETO
 * -------------------
 * Duas razões, e nenhuma é estética pura. A primeira é que vídeo se vê melhor
 * sem luz em volta: fundo claro rebaixa o contraste de um marfim sobre marfim,
 * que é exatamente o que estes vídeos têm. A segunda é ritmo — esta é a
 * segunda batida escura da apresentação, e ela cai entre duas folhas claras.
 *
 * POR QUE TRÊS LADO A LADO
 * ------------------------
 * Três 9:16 em fileira formam uma faixa que ocupa a largura inteira sem cortar
 * quadro nenhum. Um vídeo vertical sozinho numa tela larga é uma coluna magra
 * cercada de vazio; três viram uma página dupla de revista.
 *
 * NO CELULAR É CARROSSEL, E O MOTIVO É PESO
 * -----------------------------------------
 * Empilhados, os três entravam na tela um depois do outro conforme ela rolava
 * — e os três baixavam. São 6,7 MB numa peça que é aberta no 4G, no meio de
 * uma conversa de WhatsApp. Também eram três telas cheias de vídeo para passar
 * antes de chegar ao resto da apresentação.
 *
 * Lado a lado com rolagem horizontal, só o primeiro entra na tela: os outros
 * dois não baixam enquanto ela não arrastar. Quem quer ver vê; quem não quer
 * não paga.
 *
 * Os quadros ocupam 78% da largura de propósito — o pedaço do vizinho
 * aparecendo na borda é o que diz que dá para arrastar. Em 100% pareceria um
 * vídeo só.
 */
export default function SecaoVestidosEmMovimento() {
  if (videosEditoriais.length === 0) return null

  return (
    <section className="border-t border-borda-sutil bg-preto text-branco">
      <div className="container-luxo folha">
        <Revelar>
          <div className="flex flex-col items-center text-center">
            <span className="font-display text-h6 uppercase tracking-luxo text-dourado">
              Os vestidos por dentro
            </span>
            <h2 className="mt-4 texto-display-sm uppercase tracking-luxo text-branco">
              De perto, e em movimento
            </h2>
            <span className="filete-claro mt-7" />
            <p className="mt-7 max-w-lg text-branco/70">
              É o que a foto não conta: como o bordado pega a luz, como o tule
              pesa, como a cauda anda com você.
            </p>
          </div>
        </Revelar>

        {/*
          `-mx-6 px-6` sangra a rolagem até a borda da tela: sem isso o
          carrossel para na margem do container e o vídeo do lado fica cortado
          no meio do nada. As larguras são PORCENTAGEM do container, e não
          `vw` — dentro de um container que rola de lado, `vw` ignora a barra
          de rolagem e devolve a rolagem lateral da página inteira.
        */}
        <ul
          className="mt-14 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2
                     sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {videosEditoriais.map((video, indice) => (
            <Revelar
              key={video.src}
              como="li"
              distancia="curta"
              /* Escalonado por coluna: os três chegam em cascata da esquerda
                 para a direita, que é a ordem em que serão vistos. */
              atraso={indice * 120}
              className="w-[78%] shrink-0 snap-center sm:w-auto sm:shrink"
            >
              <VideoVertical
                src={video.src}
                srcCelular={video.srcCelular}
                poster={video.poster}
                alt={video.alt}
              />
            </Revelar>
          ))}
        </ul>

        {/* Só no celular: sem isto, alguém pode não perceber que há mais dois. */}
        <p className="mt-4 text-center text-sm text-branco/45 sm:hidden">
          Arraste para ver os outros
        </p>
      </div>
    </section>
  )
}
