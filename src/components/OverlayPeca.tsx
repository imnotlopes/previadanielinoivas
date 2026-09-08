import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { identificacao, type Peca } from '../data/pecas'
import { useSelecao } from '../lib/selecao'
import { cn } from '../lib/utils'
import BotaoProvar from './BotaoProvar'

interface OverlayPecaProps {
  peca: Peca
  aoFechar: () => void
}

/**
 * A peça em tela cheia, sobre a apresentação.
 *
 * POR QUE OVERLAY, E NÃO PÁGINA
 * -----------------------------
 * Antes cada peça tinha rota própria: 46 páginas. Numa apresentação que a
 * pessoa lê no polegar dentro de uma conversa, mandar ela para outra página é
 * o jeito mais rápido de perdê-la — sai da apresentação, o botão voltar vira
 * a única saída, e a seleção que ela estava montando parece ter sumido.
 *
 * Em overlay ela abre, olha, marca e fecha, e a grade continua exatamente
 * onde estava. É a diferença entre folhear e navegar.
 *
 * O QUE APARECE, E O QUE NÃO
 * --------------------------
 * Fotos grandes, identificação, descrição, cores e tamanhos. Não aparece
 * preço, nem "sob consulta": valor não faz parte desta fase, e um rótulo
 * dizendo que o valor não está ali lê como informação faltando.
 */
export default function OverlayPeca({ peca, aoFechar }: OverlayPecaProps) {
  const dialogo = useRef<HTMLDivElement>(null)
  const [ativa, setAtiva] = useState(0)
  const { tem } = useSelecao()

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aoFechar])

  /* Trava a rolagem de trás: sem isto, arrastar no overlay rola a
     apresentação embaixo e a pessoa perde o lugar onde estava. */
  useEffect(() => {
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogo.current?.focus()
    return () => {
      document.body.style.overflow = anterior
    }
  }, [])

  const marcada = tem(peca.codigo)

  return (
    <div
      ref={dialogo}
      role="dialog"
      aria-modal="true"
      aria-label={`Peça ${identificacao(peca)}`}
      tabIndex={-1}
      className="fixed inset-0 z-[60] overflow-y-auto bg-off-white outline-none"
    >
      {/* O fechar acompanha a rolagem: numa peça com seis fotos, ele some no
          topo e a pessoa fica presa dentro do overlay. */}
      <div className="sticky top-0 z-10 flex justify-end border-b border-borda-sutil bg-off-white/95 p-3 backdrop-blur">
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          className="inline-flex size-11 items-center justify-center border border-borda text-preto transition-colors duration-300 ease-suave hover:border-preto hover:bg-preto hover:text-branco"
        >
          <X size={20} strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      <div className="container-luxo py-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="overflow-hidden bg-bege">
              <img
                src={peca.fotos[ativa]}
                alt={identificacao(peca)}
                decoding="async"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>

            {peca.fotos.length > 1 && (
              <ul className="mt-3 grid grid-cols-4 gap-3">
                {peca.fotos.map((foto, indice) => (
                  <li key={foto}>
                    <button
                      type="button"
                      onClick={() => setAtiva(indice)}
                      aria-label={`Ver foto ${indice + 1} de ${peca.fotos.length}`}
                      aria-current={indice === ativa}
                      className={cn(
                        'block w-full overflow-hidden border-2 transition-colors duration-300 ease-suave',
                        indice === ativa ? 'border-preto' : 'border-transparent hover:border-borda',
                      )}
                    >
                      <img
                        src={foto}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="aspect-[3/4] w-full object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:pt-2">
            <span className="eyebrow">Peça {peca.codigo}</span>
            {peca.nome && (
              <h2 className="mt-3 text-h3 uppercase tracking-luxo">{peca.nome}</h2>
            )}

            <span className="filete mt-6" />

            <p className="mt-7 font-display text-h4 font-light text-preto/80">
              {peca.descricao}
            </p>

            {/*
              Cores e tamanhos entraram no lugar do preço. Cada linha some
              sozinha enquanto a Danielli não informar: rótulo com traço no
              lugar do dado é a informação faltando que o brief mandou tirar.
            */}
            <dl className="mt-8 flex flex-col gap-3 text-sm">
              {peca.cores.length > 0 && (
                <Linha rotulo="Cores" valor={peca.cores.join(' · ')} />
              )}
              {peca.tamanhos.length > 0 && (
                <Linha rotulo="Tamanhos" valor={peca.tamanhos.join(' · ')} />
              )}
            </dl>

            <div className="mt-9">
              <BotaoProvar
                codigo={peca.codigo}
                nome={identificacao(peca)}
                variante="inteiro"
              />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-preto/65">
              {marcada
                ? 'Está na sua lista. No fim da apresentação você manda todas de uma vez.'
                : 'Marcar não reserva nada. É só para a gente separar antes de você chegar.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex gap-3">
      <dt className="min-w-24 font-display uppercase tracking-luxo text-preto/60">
        {rotulo}
      </dt>
      <dd className="text-preto/80">{valor}</dd>
    </div>
  )
}
