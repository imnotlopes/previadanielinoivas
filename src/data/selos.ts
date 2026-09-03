import { CalendarCheck, CalendarHeart, Scissors, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Selo {
  icone: LucideIcon
  titulo: string
  /** O texto padrão, escrito para a noiva, que é o público das três peças. */
  detalhe: string
  /**
   * Alternativa para a peça de festa, quando a frase da noiva não serve.
   *
   * Existe por causa de UMA palavra: "o dia do seu casamento" está certo para
   * a noiva e errado para a formanda, e trocar a palavra é mais honesto do
   * que achatar as duas num "seu evento" que não é a fala de ninguém.
   *
   * Só preencha nos selos que realmente mudam. Sem isto, vale `detalhe`.
   */
  detalheFesta?: string
}

/**
 * Selos de confiança da página do vestido.
 *
 * ATENÇÃO: CONFIRME CADA UM ANTES DE PUBLICAR.
 * Selo no site é promessa. Se diz "ajuste incluso" e o ajuste for cobrado à
 * parte, a cliente descobre na hora de pagar e a conversa começa errada.
 * Melhor três selos verdadeiros que quatro bonitos: apague o que não for
 * verdade em vez de suavizar o texto.
 *
 * Os quatro abaixo são consistentes com o "Como funciona" da home e da página
 * Sobre, mas nasceram da mesma redação de prévia, nenhum foi confirmado com
 * a Danielli.
 */
export const selos: Selo[] = [
  {
    icone: CalendarCheck,
    titulo: 'Prova com hora marcada',
    detalhe: 'Atendimento individual, sem fila e sem pressa.',
  },
  {
    icone: Scissors,
    titulo: 'Ajuste no seu corpo',
    detalhe: 'Incluído no aluguel, feito antes de você levar.',
  },
  {
    icone: CalendarHeart,
    titulo: 'Data reservada',
    detalhe: 'O vestido fica bloqueado para o dia do seu casamento.',
    detalheFesta: 'O vestido fica bloqueado para o dia da sua festa.',
  },
  {
    icone: Sparkles,
    titulo: 'Devolução sem lavar',
    detalhe: 'Traga como está. Da higienização cuidamos nós.',
  },
]
