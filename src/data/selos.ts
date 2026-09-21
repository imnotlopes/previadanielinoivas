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
  /**
   * `true` só depois de a Danielli confirmar que é verdade. Ver o aviso
   * abaixo; enquanto for `false`, o selo não aparece em lugar nenhum.
   */
  confirmado: boolean
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
 * Os quatro abaixo nasceram de redação de prévia, e nenhum foi confirmado com
 * a Danielli. Mesmo assim ficaram no ar, indo para noivas de verdade, até
 * setembro de 2026.
 *
 * DESLIGADOS ATÉ A CONFIRMAÇÃO
 * ----------------------------
 * Agora cada selo tem `confirmado`, e todos começam em `false`. A pergunta já
 * foi feita a ela; quando a resposta chegar:
 *
 *   - é verdade: vire `confirmado` para `true`, e o selo aparece sozinho;
 *   - é verdade com outra redação: corrija o texto e vire para `true`;
 *   - não é verdade: apague o selo.
 *
 * Com nenhum confirmado, o bloco "O que está incluído" inteiro some, e no
 * celular o painel dele sai da sequência.
 */
export const selos: Selo[] = [
  {
    icone: CalendarCheck,
    titulo: 'Prova com hora marcada',
    detalhe: 'Atendimento individual, sem fila e sem pressa.',
    confirmado: false,
  },
  {
    icone: Scissors,
    titulo: 'Ajuste no seu corpo',
    detalhe: 'Incluído no aluguel, feito antes de você levar.',
    confirmado: false,
  },
  {
    icone: CalendarHeart,
    titulo: 'Data reservada',
    detalhe: 'O vestido fica bloqueado para o dia do seu casamento.',
    detalheFesta: 'O vestido fica bloqueado para o dia da sua festa.',
    confirmado: false,
  },
  {
    icone: Sparkles,
    titulo: 'Devolução sem lavar',
    detalhe: 'Traga como está. Da higienização cuidamos nós.',
    confirmado: false,
  },
]

/** Só o que a Danielli já confirmou. É esta lista que a página usa. */
export const selosConfirmados = selos.filter((selo) => selo.confirmado)
