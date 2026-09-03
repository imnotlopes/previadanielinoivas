import { useState } from 'react'
import { Play } from 'lucide-react'

interface VideoPecaProps {
  /** Link do YouTube/Instagram ou caminho de um arquivo em /public. */
  src: string
  nome: string
}

/**
 * Vídeo do vestido em movimento.
 *
 * Vestido parado na foto e vestido andando são coisas diferentes, e é o vídeo
 * que fecha a dúvida sobre caimento, foi por isso que a Danielli pediu vídeo
 * dentro do catálogo, em vez de mandar separado no WhatsApp.
 *
 * NADA CARREGA ANTES DO CLIQUE. Um `<iframe>` do YouTube puxa perto de 1 MB de
 * script e planta cookies de rastreio antes de alguém dar play; um `<video>`
 * com autoload come a franquia de dados de quem está no celular. Aqui o
 * elemento pesado só entra depois que a pessoa pede.
 */
export default function VideoPeca({ src, nome }: VideoPecaProps) {
  const [aberto, setAberto] = useState(false)

  const idYoutube = extrairYoutube(src)
  const ehArquivo = /\.(mp4|webm|mov)$/i.test(src)

  /*
    Link que não é YouTube nem arquivo (um post do Instagram, por exemplo) não
    dá para embutir: o Instagram bloqueia iframe de terceiros. Nesse caso o
    honesto é mandar para fora, e dizer que vai sair daqui.
  */
  if (!idYoutube && !ehArquivo) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-contorno btn-sm mt-5 w-full"
      >
        <Play size={15} strokeWidth={1.75} aria-hidden />
        Ver o vídeo do vestido
      </a>
    )
  }

  if (!aberto) {
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="btn-contorno btn-sm mt-5 w-full"
      >
        <Play size={15} strokeWidth={1.75} aria-hidden />
        Ver o vestido em movimento
      </button>
    )
  }

  return (
    <div className="mt-5 overflow-hidden bg-preto">
      {ehArquivo ? (
        <video
          src={src}
          controls
          autoPlay
          playsInline
          className="aspect-[3/4] w-full object-cover"
        >
          <track kind="captions" />
        </video>
      ) : (
        /*
          `youtube-nocookie.com` e não `youtube.com`: não planta cookie de
          rastreio de quem só quis ver um vestido.

          `w-px min-w-full` mais o invólucro com overflow-hidden: o Safari do
          iOS ignora largura percentual em iframe e dimensiona o elemento pelo
          conteúdo, o que estoura a coluna e arrasta a página de lado.
        */
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${idYoutube}?autoplay=1`}
          title={`Vídeo do vestido ${nome}`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-[3/4] w-px min-w-full border-0"
        />
      )}
    </div>
  )
}

/** Extrai o identificador de qualquer formato de link do YouTube. */
function extrairYoutube(link: string): string | null {
  const limpo = link.trim()
  if (/^[\w-]{11}$/.test(limpo)) return limpo

  const padroes = [
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
  ]
  for (const padrao of padroes) {
    const achou = limpo.match(padrao)
    if (achou) return achou[1]
  }
  return null
}
