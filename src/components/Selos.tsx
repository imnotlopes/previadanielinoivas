import { selosConfirmados } from '../data/selos'
import { cn } from '../lib/utils'

interface SelosProps {
  /**
   * Quem está lendo. Padrão `noiva`, que é o público de três das quatro
   * peças, e o único lugar onde `festa` importa é a ficha de um vestido de
   * festa. Ver `detalheFesta` em data/selos.ts.
   */
  publico?: 'noiva' | 'festa'
  /**
   * Para uso sobre fundo escuro, como no painel de abertura do deslize.
   *
   * Inverte texto e ícone, e nada mais: a estrutura, o espaçamento e a borda
   * de cima são os mesmos. Um bloco de garantia que muda de forma conforme o
   * fundo vira dois blocos para manter.
   */
  claro?: boolean
}

/**
 * Selos de confiança.
 *
 * Respondem, sem que ninguém pergunte, as quatro dúvidas que fazem a noiva
 * adiar a prova: preciso agendar? o vestido vai servir em mim? ele vai estar
 * livre na minha data? e depois, quem lava?
 *
 * O texto de cada um mora em data/selos.ts, com o aviso de que selo é
 * promessa e precisa ser confirmado antes de publicar.
 */
export default function Selos({ publico = 'noiva', claro = false }: SelosProps) {
  if (selosConfirmados.length === 0) return null

  return (
    <ul
      className={cn(
        'mt-10 grid gap-x-6 gap-y-5 border-t pt-7 sm:grid-cols-2',
        claro ? 'border-branco/25' : 'border-borda',
      )}
    >
      {selosConfirmados.map((selo) => {
        const Icone = selo.icone
        return (
          <li key={selo.titulo} className="flex gap-3">
            {/*
              Ícone em preto rebaixado, e não em dourado. O dourado rende
              1,94:1 sobre o off-white: mesmo sendo decorativo, o traço fino
              destes ícones sumia e o bloco parecia mal carregado. O acento
              da seção fica no filete, que é linha cheia e aguenta.
            */}
            <Icone
              size={19}
              strokeWidth={1.5}
              aria-hidden
              className={cn('mt-0.5 shrink-0', claro ? 'text-branco rebaixado' : 'text-preto/70')}
            />
            <div>
              <p
                className={cn(
                  'font-display text-h6 uppercase tracking-luxo',
                  claro ? 'text-branco' : 'text-preto',
                )}
              >
                {selo.titulo}
              </p>
              <p
                className={cn(
                  'mt-1 text-sm leading-relaxed',
                  claro ? 'text-branco rebaixado' : 'text-preto/70',
                )}
              >
                {publico === 'festa' && selo.detalheFesta
                  ? selo.detalheFesta
                  : selo.detalhe}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
