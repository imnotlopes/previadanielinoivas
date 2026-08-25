import { Play } from 'lucide-react'
import { useState } from 'react'

import { canalYoutube, videosValidos } from '../data/youtube'
import { IconeYoutube } from './icones'
import SecaoTitulo from './SecaoTitulo'

/**
 * Vitrine dos Shorts do canal.
 *
 * Os cards mostram a capa do vídeo e só carregam o player do YouTube depois
 * do clique. Isso não é detalhe: cada iframe do YouTube puxa perto de 1 MB
 * de script e planta cookies de rastreio antes mesmo de alguém dar play —
 * seis deles na home deixariam a página lenta para todo mundo, inclusive
 * para quem nunca vai assistir.
 */
export default function SecaoYoutube() {
  // Sem vídeo cadastrado, a seção simplesmente não existe.
  if (videosValidos.length === 0) return null

  return (
    <section className="secao bg-off-white">
      <div className="container-luxo">
        <SecaoTitulo
          eyebrow="No YouTube"
          titulo="Bastidores em vídeo"
          descricao="Provas, bastidores e vestidos em movimento — que é como eles realmente aparecem na festa."
          centralizado
        />

        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {videosValidos.map((video) => (
            <li key={video.id}>
              <CardVideo id={video.id} titulo={video.titulo} />
            </li>
          ))}
        </ul>

        <div className="mt-14 flex justify-center">
          <a
            href={canalYoutube.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contorno"
          >
            <IconeYoutube className="size-[1.15em] shrink-0" strokeWidth={1.75} />
            Ver o canal
          </a>
        </div>
      </div>
    </section>
  )
}

function CardVideo({ id, titulo }: { id: string; titulo: string }) {
  const [tocando, setTocando] = useState(false)
  // Shorts costumam ter capa vertical em "oardefault", que é o que enche o
  // card 9:16 sem esticar. Nem todo vídeo tem.
  const [capa, setCapa] = useState(`https://i.ytimg.com/vi/${id}/oardefault.jpg`)

  const capaReserva = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

  /**
   * Quando não existe capa vertical, o YouTube não devolve 404: entrega um
   * placeholder cinza de 120x90 com status 200. Ou seja, `onError` nunca
   * dispara e o card ficaria com uma imagem minúscula esticada. Por isso a
   * troca é decidida pelo tamanho do que chegou, não pelo erro.
   */
  function aoCarregar(e: React.SyntheticEvent<HTMLImageElement>) {
    if (e.currentTarget.naturalWidth <= 120 && capa !== capaReserva) {
      setCapa(capaReserva)
    }
  }

  if (tocando) {
    return (
      <div className="aspect-[9/16] w-full overflow-hidden bg-preto">
        <iframe
          // nocookie: não planta cookie de rastreio antes do play.
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          /* `w-px min-w-full` pelo mesmo motivo do mapa: o Safari do iOS
             ignora largura percentual em iframe e dimensiona pelo conteúdo. */
          className="h-full w-px min-w-full border-0"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setTocando(true)}
      className="group block w-full text-left"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-borda-sutil">
        <img
          src={capa}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={aoCarregar}
          onError={() => setCapa(capaReserva)}
          className="size-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
        />

        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-preto/25 transition-colors duration-300 ease-suave group-hover:bg-preto/40"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-branco/95 text-preto">
            <Play size={22} strokeWidth={1.5} className="ml-0.5 fill-current" />
          </span>
        </span>
      </div>

      <h3 className="mt-4 text-h6 uppercase tracking-luxo transition-colors duration-300 ease-suave group-hover:text-cinza">
        {titulo}
      </h3>
      <span className="sr-only">Assistir ao vídeo</span>
    </button>
  )
}
