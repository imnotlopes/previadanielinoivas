import { Check, Plus } from 'lucide-react'

import { useSelecao } from '../lib/selecao'
import { cn } from '../lib/utils'

interface BotaoProvarProps {
  slug: string
  /** Nome do vestido, só para o rótulo acessível. */
  nome: string
  /**
   * `discreto` é o quadradinho sobre a foto, na grade.
   * `inteiro` é o botão de largura cheia, na ficha do vestido.
   */
  variante?: 'discreto' | 'inteiro'
  className?: string
}

/**
 * Marca um vestido para provar.
 *
 * ESTADO PRECISA SER ÓBVIO SEM COR
 * --------------------------------
 * Marcado e não marcado se distinguem por PREENCHIMENTO e por ÍCONE (＋ vira
 * ✓), não por matiz. Quem não enxerga a diferença entre o contorno claro e o
 * preto cheio ainda vê o símbolo mudar — e a paleta da marca não tem cor de
 * destaque para gastar aqui de qualquer forma.
 *
 * O rótulo acessível diz o nome do vestido inteiro. Numa grade de 40 cards,
 * "Marcar para provar" repetido 40 vezes não navega.
 */
export default function BotaoProvar({
  slug,
  nome,
  variante = 'discreto',
  className,
}: BotaoProvarProps) {
  const { tem, alternar, cheia } = useSelecao()
  const marcado = tem(slug)

  /* Lista cheia trava só o que ainda não entrou: desmarcar precisa continuar
     funcionando, senão a pessoa fica presa com a lista que montou. */
  const travado = cheia && !marcado

  const Icone = marcado ? Check : Plus

  if (variante === 'inteiro') {
    return (
      <button
        type="button"
        onClick={() => alternar(slug)}
        aria-pressed={marcado}
        disabled={travado}
        className={cn(marcado ? 'btn-primario' : 'btn-contorno', 'w-full', className)}
      >
        <Icone size={16} strokeWidth={2} aria-hidden />
        {marcado ? 'Na sua lista de prova' : 'Quero provar este'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => alternar(slug)}
      aria-pressed={marcado}
      disabled={travado}
      aria-label={
        marcado ? `Tirar ${nome} da lista de prova` : `Marcar ${nome} para provar`
      }
      title={travado ? 'A lista de prova já está cheia' : undefined}
      className={cn(
        'inline-flex size-9 items-center justify-center border transition-all',
        'duration-300 ease-suave disabled:cursor-not-allowed disabled:opacity-40',
        marcado
          ? 'border-preto bg-preto text-branco'
          : 'border-branco/70 bg-branco/85 text-preto hover:border-preto hover:bg-branco',
        className,
      )}
    >
      <Icone size={16} strokeWidth={2} aria-hidden />
    </button>
  )
}
