import { selos } from '../data/selos'

interface SelosProps {
  /**
   * Quem está lendo. Padrão `noiva`, que é o público de três das quatro
   * peças — e o único lugar onde `festa` importa é a ficha de um vestido de
   * festa. Ver `detalheFesta` em data/selos.ts.
   */
  publico?: 'noiva' | 'festa'
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
export default function Selos({ publico = 'noiva' }: SelosProps) {
  if (selos.length === 0) return null

  return (
    <ul className="mt-10 grid gap-x-6 gap-y-5 border-t border-borda pt-7 sm:grid-cols-2">
      {selos.map((selo) => {
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
              className="mt-0.5 shrink-0 text-preto/70"
            />
            <div>
              <p className="font-display text-h6 uppercase tracking-luxo text-preto">
                {selo.titulo}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-preto/70">
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
