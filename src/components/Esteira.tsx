import { useEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '../lib/utils'

/**
 * A ESTEIRA, TRAZIDA DO PROJETO DA LENNYS ATELIÊ.
 *
 * Copiada de lá em setembro de 2026, a pedido do Edson, para a seção de
 * avaliações do Google ficar igual à de lá. A lógica é a mesma; mudaram só os
 * tokens de cor, que aqui são os deste projeto.
 *
 * Uma fileira de tamanho fixo por onde os itens passam. Com mais itens que
 * lugares, eles caminham para a esquerda e o que sai volta pela direita, em
 * vez de a fileira crescer: cinco cartões numa linha de três empurrariam os
 * outros para uma segunda fileira solta.
 *
 * DIFERENTE DA FAIXA DE MARCAS
 * ----------------------------
 * A faixa de marcas desliza sem parar. A esteira troca um item de cada vez e
 * espera: relato se lê, e texto que anda enquanto a pessoa lê obriga a
 * perseguir a frase com o olho. Aqui o cartão fica parado os segundos que
 * precisa, e só então dá a vez.
 *
 * Para no primeiro toque ou quando o foco entra, e nunca começa para quem
 * pediu menos movimento no sistema. Os pontinhos embaixo dizem quantos são e
 * deixam ir direto a qualquer um.
 */
export interface ItemEsteira {
  /**
   * Estável e única por item. É o que dispara a entrada suave: quando um
   * lugar troca de item, a chave daquele bloco muda, o React remonta e a
   * animação roda de novo.
   */
  chave: string
  /** Rótulo do pontinho. Ex.: "Ver a avaliação de Debora Silva". */
  rotulo: string
  conteudo: ReactNode
}

/** Quantos lugares a fileira tem, por faixa de largura. */
export interface LugaresEsteira {
  /** Celular. Também é o que aparece antes de o script medir a tela. */
  base: number
  /** A partir de 640px. Sem isto, repete `base`. */
  sm?: number
  /** A partir de 1025px. Sem isto, repete `sm` ou `base`. */
  lg?: number
}

interface EsteiraProps {
  itens: ItemEsteira[]
  lugares: LugaresEsteira
  /** Quanto tempo cada item fica na tela antes de dar a vez. */
  ms: number
  /** Classes da fileira. Precisa declarar as colunas e o espaçamento. */
  classeFileira: string
}

export default function Esteira({ itens, lugares, ms, classeFileira }: EsteiraProps) {
  const { base, sm, lg } = lugares
  const [atual, setAtual] = useState(0)
  const [parado, setParado] = useState(false)
  const [quantos, setQuantos] = useState(base)
  const menosMovimento = useRef(false)

  useEffect(() => {
    menosMovimento.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const medir = () => {
      const largura = window.innerWidth
      if (largura >= 1025) setQuantos(lg ?? sm ?? base)
      else if (largura >= 640) setQuantos(sm ?? base)
      else setQuantos(base)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [base, sm, lg])

  // Só faz sentido girar quando há mais item que lugar na fileira.
  const gira = itens.length > quantos

  useEffect(() => {
    if (!gira || parado || menosMovimento.current) return

    const id = window.setInterval(() => setAtual((i) => (i + 1) % itens.length), ms)
    return () => window.clearInterval(id)
  }, [gira, parado, itens.length, ms])

  const mostrados = Array.from(
    { length: Math.min(quantos, itens.length) },
    (_, posicao) => itens[(atual + posicao) % itens.length],
  )

  return (
    <div className="flex flex-col gap-5">
      <ul
        onPointerDown={() => setParado(true)}
        onFocusCapture={() => setParado(true)}
        className={cn('grid', classeFileira)}
      >
        {mostrados.map((item, posicao) => (
          <li key={posicao} className="h-full">
            <div key={item.chave} className={cn('h-full', gira && 'esteira-entrando')}>
              {item.conteudo}
            </div>
          </li>
        ))}
      </ul>

      {/* Pontinhos: um por item. Só aparecem quando a fileira gira; parada,
          todos já estão à vista. */}
      {gira ? (
        <div className="flex justify-center gap-1">
          {itens.map((item, indice) => (
            <button
              key={item.chave}
              type="button"
              aria-label={item.rotulo}
              aria-current={indice === atual ? 'true' : undefined}
              onClick={() => {
                setAtual(indice)
                setParado(true)
              }}
              /* O ponto tem 8px, mas o alvo de toque tem 32: o padding é
                 área tocável, não desenho. */
              className="group flex size-8 items-center justify-center"
            >
              <span
                className={cn(
                  'size-2 rounded-full transition-colors duration-200 ease-suave',
                  indice === atual ? 'bg-preto' : 'bg-borda',
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
