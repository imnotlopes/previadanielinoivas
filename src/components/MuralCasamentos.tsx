import { Pause, Play } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { Casamento } from '../data/casamentos'
import { movimentoReduzido } from '../lib/movimento'
import { cn } from '../lib/utils'

/**
 * Quantos quadros ficam na parede.
 *
 * Oito fecha as duas grades sem sobra: quatro linhas de dois no celular, duas
 * linhas de quatro no computador. Com seis, a última fileira do computador
 * ficaria com dois quadros e um buraco.
 */
const QUADROS = 8

/**
 * De quanto em quanto tempo UM quadro troca.
 *
 * Não é o tempo que cada foto fica — é o intervalo entre trocas na parede
 * inteira. Com oito quadros e 900 ms, cada um fica cerca de sete segundos, e
 * a cada instante só um está mudando.
 */
const PASSO = 900

interface MuralCasamentosProps {
  casamentos: Casamento[]
}

/**
 * O mural — várias fotos trocando ao mesmo tempo.
 *
 * COMO ISTO CHEGOU AQUI
 * ---------------------
 * Passou por três versões, e cada uma corrigiu um erro da anterior:
 *
 *  1. Mosaico estático de doze fotos. Dizia "temos fotos bonitas", que é o que
 *     todo perfil de Instagram já diz.
 *  2. Uma sequência grande por casamento, com setas, pausa, contador e barra
 *     de progresso. Virou player de vídeo, e isto não é vídeo.
 *  3. Duas sequências lado a lado, sem moldura. Melhor, mas com duas fotos na
 *     tela inteira a parede quase não se move — parece uma imagem só.
 *
 * Agora são oito quadros trocando, e o que se vê é o acervo inteiro passando.
 *
 * UM DE CADA VEZ, EM RODÍZIO
 * --------------------------
 * Um relógio só, que a cada 900 ms troca UM quadro e passa a vez adiante. Se
 * os oito tivessem cronômetro próprio, mais cedo ou mais tarde eles cairiam em
 * sincronia e a parede piscaria inteira — que é o efeito de máquina que este
 * bloco não pode ter. Em rodízio, o movimento nunca para e nunca chama a
 * atenção para si.
 *
 * OS DOIS CASAMENTOS SE ALTERNAM
 * ------------------------------
 * Quadros pares recebem fotos de um casamento, ímpares do outro. Sem isso, um
 * canto da parede seria um casamento e o outro canto o outro, e a leitura
 * viraria "duas coisas" em vez de "as noivas daqui".
 */
export default function MuralCasamentos({ casamentos }: MuralCasamentosProps) {
  const parede = useRef<HTMLUListElement>(null)
  const [naTela, setNaTela] = useState(false)

  const [semMovimento] = useState(movimentoReduzido)
  const [rodando, setRodando] = useState(!movimentoReduzido())

  /*
    A parede é dividida em oito pilhas de fotos. Cada quadro percorre a sua e
    só a sua — assim uma foto nunca aparece em dois lugares ao mesmo tempo,
    que é o defeito mais visível que um mural destes pode ter.
  */
  const pilhas = useMemo(() => dividir(casamentos, QUADROS), [casamentos])

  const [indices, setIndices] = useState<number[]>(() => new Array(QUADROS).fill(0))
  const vez = useRef(0)

  useEffect(() => {
    if (!rodando || !naTela || semMovimento) return

    const relogio = setInterval(() => {
      const quadro = vez.current % QUADROS
      vez.current += 1
      setIndices((anteriores) => {
        const pilha = pilhas[quadro]
        if (!pilha || pilha.length < 2) return anteriores
        const proximos = [...anteriores]
        proximos[quadro] = (proximos[quadro] + 1) % pilha.length
        return proximos
      })
    }, PASSO)

    return () => clearInterval(relogio)
  }, [rodando, naTela, semMovimento, pilhas])

  /* Fora da tela a parede para: é banda e bateria sem ninguém ver. */
  useEffect(() => {
    const alvo = parede.current
    if (!alvo || typeof IntersectionObserver === 'undefined') {
      setNaTela(true)
      return
    }
    const observador = new IntersectionObserver(
      ([entrada]) => setNaTela(entrada.isIntersecting),
      { threshold: 0.15 },
    )
    observador.observe(alvo)
    return () => observador.disconnect()
  }, [])

  return (
    <div>
      <ul ref={parede} className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {pilhas.map((pilha, quadro) => (
          <li key={quadro}>
            <Quadro
              fotos={pilha}
              atual={indices[quadro] ?? 0}
              /* Só os dois primeiros quadros descrevem; os outros são
                 decorativos. Oito descrições de variações da mesma cena não
                 ajudam quem usa leitor de tela, atrapalham. */
              descricao={quadro < casamentos.length ? casamentos[quadro].descricao : ''}
            />
          </li>
        ))}
      </ul>

      {/*
        O único controle, e ele é obrigação: conteúdo que se move sozinho por
        mais de cinco segundos precisa de um jeito de parar (WCAG 2.2.2).
        Discreto de propósito — o assunto da seção são as fotos, não o botão.
      */}
      {!semMovimento && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setRodando((v) => !v)}
            className="inline-flex items-center gap-2 text-sm text-cinza underline-offset-4
                       transition-colors duration-300 ease-suave hover:text-preto hover:underline"
          >
            {rodando ? (
              <Pause size={14} strokeWidth={1.75} aria-hidden />
            ) : (
              <Play size={14} strokeWidth={1.75} aria-hidden />
            )}
            {rodando ? 'Pausar as fotos' : 'Voltar a passar'}
          </button>
        </div>
      )}
    </div>
  )
}

function Quadro({
  fotos,
  atual,
  descricao,
}: {
  fotos: string[]
  atual: number
  descricao: string
}) {
  /*
    Só o que já apareceu, mais a próxima, fica no DOM. A próxima entra com
    opacidade zero justamente para o navegador buscá-la antes da hora —
    senão cada troca começaria com um quadro em branco.
  */
  const proxima = fotos.length > 0 ? (atual + 1) % fotos.length : 0
  const [montadas, setMontadas] = useState<Set<number>>(() => new Set([0, 1]))

  useEffect(() => {
    setMontadas((anteriores) => {
      if (anteriores.has(atual) && anteriores.has(proxima)) return anteriores
      return new Set(anteriores).add(atual).add(proxima)
    })
  }, [atual, proxima])

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-bege">
      {fotos.map((foto, indice) =>
        montadas.has(indice) ? (
          <img
            key={foto}
            src={foto}
            alt={indice === 0 ? descricao : ''}
            loading="lazy"
            decoding="async"
            className={cn(
              'absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-suave',
              indice === atual ? 'opacity-100' : 'opacity-0',
            )}
          />
        ) : null,
      )}
    </div>
  )
}

/**
 * Reparte as fotos dos casamentos entre os quadros, alternando os casamentos.
 *
 * O casamento 0 fica com os quadros pares, o 1 com os ímpares, e assim por
 * diante. Dentro de cada casamento as fotos são distribuídas em fatias
 * CONTÍGUAS, e não intercaladas: assim cada quadro percorre um trecho do dia
 * (a preparação, a igreja, a festa) em vez de saltar entre momentos soltos.
 */
function dividir(casamentos: Casamento[], quadros: number): string[][] {
  const pilhas: string[][] = Array.from({ length: quadros }, () => [])
  if (casamentos.length === 0) return pilhas

  for (let q = 0; q < quadros; q++) {
    const casamento = casamentos[q % casamentos.length]
    /* Qual fatia deste casamento cabe a este quadro. */
    const quantosDoMesmo = Math.ceil((quadros - (q % casamentos.length)) / casamentos.length)
    const posicao = Math.floor(q / casamentos.length)

    const total = casamento.fotos.length
    const inicio = Math.floor((posicao * total) / quantosDoMesmo)
    const fim = Math.floor(((posicao + 1) * total) / quantosDoMesmo)
    pilhas[q] = casamento.fotos.slice(inicio, fim)
  }

  return pilhas
}
