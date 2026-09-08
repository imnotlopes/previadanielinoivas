/**
 * O QUE SUSTENTA A AUTORIDADE DO ATELIÊ.
 *
 * Tudo aqui foi confirmado pela Danielli e nada existia no site antes. É a
 * diferença entre uma loja que diz ser boa e uma que mostra o que tem.
 *
 * Substituiu o arquivo `atelier.ts`, que era espaço reservado esperando
 * número que ninguém tinha. Estes existem.
 */

/**
 * O ano de abertura. Os anos de casa são calculados a partir dele.
 *
 * Calculado, e não escrito: "22 anos" escrito à mão vira mentira em abril de
 * 2027, e ninguém lembra de voltar aqui.
 */
export const ABERTURA = 2004

export function anosDeCasa(hoje = new Date()): number {
  /* Abril de 2004. Antes de abril, o ano ainda não fechou. */
  const ANIVERSARIO_MES = 3 // abril, base zero
  const fechou = hoje.getMonth() >= ANIVERSARIO_MES
  return hoje.getFullYear() - ABERTURA - (fechou ? 0 : 1)
}

/**
 * As marcas que o ateliê representa.
 *
 * É o item de autoridade mais forte da lista, e o menos óbvio: representar
 * marca é o que separa ateliê de loja que compra vestido pronto. A noiva não
 * conhece os nomes, mas entende o que significa haver nomes.
 */
export const MARCAS = [
  'Center Noivas',
  'Rainha Noivas',
  'MD Noivas',
  'Monê',
] as const

/** De onde vêm as peças importadas. */
export const IMPORTADOS = 'Turquia'

/**
 * Quem o ateliê veste.
 *
 * Inclui formatura de alto padrão de propósito: é o público que a Danielli
 * atende e que ninguém supõe que ela atenda.
 */
export const ATENDE = [
  'noivas',
  'madrinhas',
  'padrinhos',
  'mães',
  'formandas',
] as const
