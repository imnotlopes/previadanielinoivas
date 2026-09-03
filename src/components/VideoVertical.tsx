import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { movimentoReduzido } from '../lib/movimento'
import { cn } from '../lib/utils'

interface VideoVerticalProps {
  /** Caminho do .mp4 a partir de /public. */
  src: string
  /** Pôster .webp, gerado por scripts/videos.mjs. */
  poster: string
  /**
   * Descrição do que se vê, para quem não vê.
   *
   * O vídeo é mudo e decorativo do ponto de vista da informação, mas não do
   * ponto de vista do conteúdo: quem usa leitor de tela precisa saber que ali
   * tem um vestido, e qual.
   */
  alt: string
  className?: string
}

/**
 * Vídeo vertical (9:16) que toca sozinho, mudo, em laço.
 *
 * NADA BAIXA ANTES DE ENTRAR NA TELA
 * ----------------------------------
 * `preload="none"` e o `src` só é preenchido quando o bloco chega ao campo de
 * visão. Três vídeos de ~2,5 MB carregados de largada seriam 7 MB gastos por
 * uma noiva que talvez pare na terceira folha — e esta apresentação vive de
 * ser aberta no 4G, no meio de uma conversa de WhatsApp.
 *
 * E PAUSA AO SAIR
 * ---------------
 * Vídeo tocando fora da tela é bateria e dados queimados sem ninguém ver.
 * O mesmo observador que dá o play tira quando o bloco sai.
 *
 * POR QUE MUDO
 * ------------
 * Não é escolha estética: navegador nenhum deixa um vídeo com som começar
 * sozinho. Os arquivos já vêm sem faixa de áudio (ver scripts/videos.mjs),
 * então não há nada para desmutar — se um dia entrar vídeo com a Danielli
 * falando, ele precisa de outro tratamento: capa e botão de play.
 *
 * ACESSIBILIDADE
 * --------------
 * Conteúdo que se move sozinho por mais de cinco segundos precisa de um jeito
 * de parar (WCAG 2.2.2) — daí o botão de pausa, que aparece no hover e para
 * quem navega por teclado. E com `prefers-reduced-motion` o vídeo nem é
 * montado: fica o pôster, que é um quadro do próprio vídeo.
 */
export default function VideoVertical({ src, poster, alt, className }: VideoVerticalProps) {
  const moldura = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)

  const [carregar, setCarregar] = useState(false)
  const [naTela, setNaTela] = useState(false)
  const [tocando, setTocando] = useState(true)
  /* Decidido uma vez, na montagem: trocar de ideia no meio faria o vídeo
     aparecer e sumir se a pessoa mudasse a preferência do sistema. */
  const [semMovimento] = useState(movimentoReduzido)

  /* O observador só responde uma coisa: está na tela ou não. */
  useEffect(() => {
    if (semMovimento) return
    const alvo = moldura.current
    if (!alvo || typeof IntersectionObserver === 'undefined') return

    const observador = new IntersectionObserver(
      ([entrada]) => setNaTela(entrada.isIntersecting),
      /* 25%: só conta como "na tela" quando um quarto do bloco aparece. Com
         0, o vídeo começaria com uma tira de dois pixels visível. */
      { threshold: 0.25 },
    )

    observador.observe(alvo)
    return () => observador.disconnect()
  }, [semMovimento])

  /* Entrou na tela uma vez: o arquivo passa a valer a pena baixar. Não volta
     atrás — descarregar e rebaixar a cada rolagem seria pior que manter. */
  useEffect(() => {
    if (naTela) setCarregar(true)
  }, [naTela])

  /*
    O PLAY MORA AQUI, E NÃO NO OBSERVADOR.

    Chamar `play()` de dentro do callback do observador não funciona: naquele
    instante o `src` ainda é `undefined`, porque o React só o aplica no
    render seguinte. O vídeo recusava em silêncio e nunca mais tentava.
    Este efeito roda DEPOIS do render que já tem o `src`.
  */
  useEffect(() => {
    const elemento = video.current
    if (!elemento || semMovimento) return

    /* Os `paused` nas duas pontas evitam mandar o comando que já está valendo:
       este efeito roda de novo quando `carregar` vira true logo depois de
       `naTela`, e sem a guarda isso vira um play/pause/play visível. */
    if (naTela && carregar && tocando) {
      /* A promessa rejeita se o navegador recusar (aba em segundo plano,
         política de autoplay). Silenciar é o certo: o pôster continua na
         tela e nada quebra. */
      if (elemento.paused) elemento.play().catch(() => {})
    } else if (!naTela && !elemento.paused) {
      elemento.pause()
    }
  }, [naTela, carregar, tocando, semMovimento])

  function alternar() {
    const elemento = video.current
    if (!elemento) return
    if (elemento.paused) {
      elemento.play().catch(() => {})
      setTocando(true)
    } else {
      elemento.pause()
      setTocando(false)
    }
  }

  return (
    <div
      ref={moldura}
      className={cn('group relative overflow-hidden bg-preto', className)}
    >
      {semMovimento ? (
        <img src={poster} alt={alt} className="aspect-[9/16] w-full object-cover" />
      ) : (
        <>
          <video
            ref={video}
            /* Vazio até entrar na tela — é isto que segura o download. */
            src={carregar ? src : undefined}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={alt}
            className="aspect-[9/16] w-full object-cover"
          />

          <button
            type="button"
            onClick={alternar}
            aria-label={tocando ? `Pausar o vídeo: ${alt}` : `Tocar o vídeo: ${alt}`}
            className="absolute bottom-3 right-3 inline-flex size-10 items-center justify-center
                       bg-preto/60 text-branco opacity-0 transition-opacity duration-300
                       ease-suave hover:bg-preto/85 focus-visible:opacity-100
                       group-hover:opacity-100"
          >
            {tocando ? (
              <Pause size={16} strokeWidth={1.75} aria-hidden />
            ) : (
              <Play size={16} strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </>
      )}
    </div>
  )
}
