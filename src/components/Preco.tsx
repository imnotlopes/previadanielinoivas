import { calcularPreco, precoBRL } from '../lib/preco'
import { useLoja } from '../lib/loja'
import { cn } from '../lib/utils'

interface PrecoProps {
  peca: { precoAluguel: number | null; precoDe?: number | null }
  /** `card` é a versão compacta da vitrine; `pagina`, a da peça aberta. */
  variante?: 'card' | 'pagina'
  className?: string
}

/**
 * Preço de aluguel, já com o cupom ativo aplicado.
 *
 * Todo o acervo está hoje como "sob consulta" (`precoAluguel: null`), e é
 * esse o texto que aparece. Não é placeholder à espera de conserto: é o que
 * a loja mostra enquanto não houver tabela publicada, e a frase existe para
 * a cliente entender que o valor vem na conversa, não que o site esqueceu de
 * carregar alguma coisa.
 */
export default function Preco({ peca, variante = 'card', className }: PrecoProps) {
  const { cupomAtivo } = useLoja()
  const { original, final, temDesconto, promocionalDe } = calcularPreco(peca, cupomAtivo)

  const naPagina = variante === 'pagina'

  if (original === null) {
    return (
      <p
        className={cn(
          naPagina ? 'font-display text-h4 text-preto' : 'text-sm text-preto/65',
          className,
        )}
      >
        Valor sob consulta
      </p>
    )
  }

  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2.5 gap-y-1', className)}>
      {/* Riscado: primeiro a promoção da própria peça, senão o preço cheio
          que o cupom abateu. Nunca os dois — dois valores riscados lado a
          lado é o tipo de vitrine que faz a cliente desconfiar da conta. */}
      {(promocionalDe ?? (temDesconto ? original : null)) !== null && (
        <span
          className={cn(
            'text-cinza line-through',
            naPagina ? 'text-base' : 'text-sm',
          )}
        >
          {precoBRL(promocionalDe ?? original)}
        </span>
      )}

      <span
        className={cn(
          'text-preto',
          naPagina ? 'font-display text-h3' : 'font-display text-h5',
        )}
      >
        {precoBRL(final)}
      </span>

      {naPagina && <span className="text-sm text-preto/65">o aluguel</span>}
    </p>
  )
}
