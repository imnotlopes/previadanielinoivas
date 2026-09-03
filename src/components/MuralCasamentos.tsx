import { Pause, Play } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { Casamento } from '../data/casamentos'
import { movimentoReduzido } from '../lib/movimento'
import { cn } from '../lib/utils'

/**
 * O MOSAICO — quadros de três tamanhos.
 *
 * Uma grade de quadros iguais é uma planilha de fotos. O que dá ritmo é a
 * diferença de tamanho: uma foto grande puxa o olho, as pequenas ao redor
 * fazem o contorno. É como uma página de revista se organiza, e era o que a
 * versão original desta seção fazia antes de virar grade uniforme.
 *
 * OS TRÊS TAMANHOS SÃO TODOS 3:4
 * ------------------------------
 * Não é coincidência: as alturas de linha foram escolhidas para que
 * `1 coluna × 2 linhas`, `2 × 4` e `3 × 6` caiam todas na mesma proporção das
 * fotos. Sem isso, o quadro pequeno seria uma tira horizontal e mostraria uma
 * faixa do meio da noiva — sem cabeça e sem saia.
 *
 * O TERCEIRO TAMANHO SÓ EXISTE EM TELA LARGA
 * ------------------------------------------
 * Abaixo de 1280px a média vira pequena e sobram dois tamanhos. Não é
 * simplificação por preguiça: num celular de duas colunas, um quadro médio
 * seria idêntico ao grande, e a seção passaria de três telas de altura sem
 * ganhar nenhuma variedade.
 */
/*
  O DESENHO DO MOSAICO, PEÇA POR PEÇA.

  Até 1279px vale o encaixe automático: só existem dois tamanhos, ambos com
  uma ou duas colunas, e eles se acomodam sozinhos sem deixar vão.

  A partir de 1280px a posição é DITADA. Com peças de três larguras num grid
  de seis colunas, o encaixe automático — mesmo com `dense` — deixava duas
  linhas de buraco: ele acomoda cada peça no primeiro lugar em que ela cabe,
  e "cabe" não é o mesmo que "fecha o desenho". Escrito à mão, o mosaico
  fecha exatamente em doze linhas.

  São dois blocos de seis linhas, espelhados: no primeiro a peça grande fica à
  esquerda, no segundo à direita. Espelhar é o que impede a página de ter um
  lado pesado e outro leve.
*/
const GRANDE = 'col-span-2 row-span-4'
const MEDIA = 'col-span-1 row-span-2'
const PEQUENA = 'col-span-1 row-span-2'

/*
  `sizes` DIZ AO NAVEGADOR DE QUE TAMANHO O QUADRO VAI SER — antes de a folha
  de estilo existir, que e quando ele decide qual arquivo buscar.

  Sem isto, ele assume a largura da janela inteira e baixa a foto de 900px
  para um quadro de 160px. Com isto, o quadro pequeno no celular pega a de
  400px: um terco dos bytes, sem diferenca visivel.

  Os numeros sao a largura real medida em cada faixa. Se as colunas do mosaico
  mudarem, estes valores mudam junto - senao o navegador volta a chutar.
*/
const PEQUENA_SIZES = '(min-width: 1280px) 190px, (min-width: 768px) 170px, 160px'
const MEDIA_SIZES = '(min-width: 1280px) 392px, (min-width: 768px) 170px, 160px'
const GRANDE_SIZES = '(min-width: 1280px) 594px, (min-width: 768px) 345px, 330px'

interface Formato {
  classe: string
  sizes: string
}

const FORMATOS: Formato[] = [
  /* Bloco 1 — a grande à esquerda. */
  { classe: `${GRANDE} xl:col-start-1 xl:col-span-3 xl:row-start-1 xl:row-span-6`, sizes: GRANDE_SIZES },
  { classe: `${MEDIA} xl:col-start-4 xl:col-span-2 xl:row-start-1 xl:row-span-4`, sizes: MEDIA_SIZES },
  { classe: `${PEQUENA} xl:col-start-6 xl:col-span-1 xl:row-start-1 xl:row-span-2`, sizes: PEQUENA_SIZES },
  { classe: `${PEQUENA} xl:col-start-6 xl:col-span-1 xl:row-start-3 xl:row-span-2`, sizes: PEQUENA_SIZES },
  { classe: `${PEQUENA} xl:col-start-4 xl:col-span-1 xl:row-start-5 xl:row-span-2`, sizes: PEQUENA_SIZES },
  { classe: `${PEQUENA} xl:col-start-5 xl:col-span-1 xl:row-start-5 xl:row-span-2`, sizes: PEQUENA_SIZES },
  { classe: `${PEQUENA} xl:col-start-6 xl:col-span-1 xl:row-start-5 xl:row-span-2`, sizes: PEQUENA_SIZES },
  /* Bloco 2 — a grande à direita. */
  { classe: `${MEDIA} xl:col-start-1 xl:col-span-2 xl:row-start-7 xl:row-span-4`, sizes: MEDIA_SIZES },
  { classe: `${PEQUENA} xl:col-start-3 xl:col-span-1 xl:row-start-7 xl:row-span-2`, sizes: PEQUENA_SIZES },
  { classe: `${PEQUENA} xl:col-start-3 xl:col-span-1 xl:row-start-9 xl:row-span-2`, sizes: PEQUENA_SIZES },
  { classe: `${GRANDE} xl:col-start-4 xl:col-span-3 xl:row-start-7 xl:row-span-6`, sizes: GRANDE_SIZES },
  { classe: `${PEQUENA} xl:col-start-1 xl:col-span-1 xl:row-start-11 xl:row-span-2`, sizes: PEQUENA_SIZES },
  { classe: `${PEQUENA} xl:col-start-2 xl:col-span-1 xl:row-start-11 xl:row-span-2`, sizes: PEQUENA_SIZES },
  { classe: `${PEQUENA} xl:col-start-3 xl:col-span-1 xl:row-start-11 xl:row-span-2`, sizes: PEQUENA_SIZES },
]

const QUADROS = FORMATOS.length

/**
 * De quanto em quanto tempo UM quadro troca.
 *
 * Não é o tempo que cada foto fica — é o intervalo entre trocas no mosaico
 * inteiro. Com catorze quadros e 900 ms, cada um fica cerca de treze segundos,
 * e a cada instante só um está mudando.
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
 *  4. Oito quadros iguais em grade. Movimento resolvido, ritmo não: grade
 *     uniforme é planilha de fotos.
 *
 * Agora são catorze quadros de três tamanhos, trocando em rodízio — o mosaico
 * de antes, só que vivo.
 *
 * UM DE CADA VEZ, EM RODÍZIO
 * --------------------------
 * Um relógio só, que a cada 900 ms troca UM quadro e passa a vez adiante. Se
 * os catorze tivessem cronômetro próprio, mais cedo ou mais tarde eles cairiam em
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
    O mosaico é dividido em catorze pilhas de fotos. Cada quadro percorre a sua e
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
      {/*
        `grid-flow-dense` é o que fecha os buracos: com quadros de três
        tamanhos, a colocação normal deixa vãos toda vez que o próximo quadro
        não cabe no espaço que sobrou. O preço é a ordem visual não seguir
        exatamente a do DOM — irrelevante aqui, onde as fotos são decorativas.

        A ALTURA DA LINHA MUDA JUNTO COM O NÚMERO DE COLUNAS, e é isso que
        mantém os quadros em pé. A proporção de um quadro é largura da coluna
        contra duas linhas: aumentar a tela sem aumentar a linha engorda a
        coluna e o quadro vira faixa horizontal — que numa foto de noiva
        mostra o meio do vestido, sem cabeça e sem saia. Por isso a contagem
        de colunas sobe (2 → 4 → 6) e a linha acompanha.
      */}
      <ul
        ref={parede}
        className="grid grid-flow-dense grid-cols-2 gap-2 [grid-auto-rows:6.25rem]
                   sm:gap-3 md:grid-cols-4
                   lg:[grid-auto-rows:8.5rem]
                   xl:grid-cols-6 xl:[grid-auto-rows:8rem]"
      >
        {pilhas.map((pilha, quadro) => (
          <li key={quadro} className={FORMATOS[quadro].classe}>
            <Quadro
              fotos={pilha}
              atual={indices[quadro] ?? 0}
              sizes={FORMATOS[quadro].sizes}
              /* Só os dois primeiros quadros descrevem; os outros são
                 decorativos. Catorze descrições de variações da mesma cena não
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
            /* `px-4 py-2.5` é alvo de toque: o texto tem 20px de altura e no
               celular isso é erro de dedo. */
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-cinza
                       underline-offset-4 transition-colors duration-300 ease-suave
                       hover:text-preto hover:underline"
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
  sizes,
  descricao,
}: {
  fotos: string[]
  atual: number
  sizes: string
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

  /* `size-full`, e não `aspect-[3/4]`: quem manda na forma é a célula da
     grade, e ela já vem em 3:4 pela combinação de coluna e altura de linha. */
  return (
    <div className="relative size-full overflow-hidden bg-bege">
      {fotos.map((foto, indice) =>
        montadas.has(indice) ? (
          <img
            key={foto}
            src={foto}
            /* A de 400px e a de 900px. O `sizes` acima é quem decide. */
            srcSet={`${foto.replace(/\.webp$/, '-400.webp')} 400w, ${foto} 900w`}
            sizes={sizes}
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
