import { cn } from '../lib/utils'

interface SecaoTituloProps {
  /** Rótulo pequeno em cinza, acima do título. */
  eyebrow?: string
  titulo: string
  /** Linha de apoio abaixo do filete. */
  descricao?: string
  centralizado?: boolean
  /** Use 1 apenas quando este for o título principal da página. */
  nivel?: 1 | 2 | 3
  className?: string
}

/**
 * Título de seção padronizado: caixa alta, entreletra larga e um filete
 * dourado abaixo. Único lugar onde esse ritmo é definido.
 *
 * A DESCRIÇÃO É EM ITÁLICO, E NÃO EM CORPO
 * ----------------------------------------
 * Era um parágrafo comum em Montserrat rebaixado. Virou serifada em itálico
 * e caixa baixa, que é o papel tipográfico que faltava na apresentação.
 *
 * O efeito é o de alguém falando no meio de uma página inteira em caixa alta.
 * A linha sob o título de seção é justamente onde a Danielli explica em uma
 * frase o que aquele bloco é, então é ali que a voz dela deve aparecer.
 *
 * Como passa por AQUI, a mudança vale para todas as seções de uma vez, e
 * nenhuma delas precisou ser tocada.
 */
export default function SecaoTitulo({
  eyebrow,
  titulo,
  descricao,
  centralizado = false,
  nivel = 2,
  className,
}: SecaoTituloProps) {
  const Titulo = `h${nivel}` as 'h1' | 'h2' | 'h3'

  return (
    <div className={cn(centralizado && 'flex flex-col items-center text-center', className)}>
      {eyebrow && <span className="eyebrow block">{eyebrow}</span>}

      <Titulo className={cn('uppercase tracking-luxo', eyebrow && 'mt-3')}>
        {titulo}
      </Titulo>

      <span className="filete mt-5" />

      {descricao && (
        <p className={cn('t-italico mt-6 max-w-[38ch]', centralizado && 'mx-auto')}>
          {descricao}
        </p>
      )}
    </div>
  )
}
