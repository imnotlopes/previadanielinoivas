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
 * No celular eles empilham, e é o certo: um 9:16 numa tela 9:16 já preenche o
 * campo de visão sozinho.
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

        <ul className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {videosEditoriais.map((video, indice) => (
            <Revelar
              key={video.src}
              como="li"
              distancia="curta"
              /* Escalonado por coluna: os três chegam em cascata da esquerda
                 para a direita, que é a ordem em que serão vistos. */
              atraso={indice * 120}
            >
              <VideoVertical src={video.src} poster={video.poster} alt={video.alt} />
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  )
}
