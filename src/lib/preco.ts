import type { Cupom } from '../data/cupons.js'

/**
 * Dinheiro em reais. Aceita `null` e devolve o texto de "sob consulta",
 * porque a ausência de preço é um estado legítimo do catálogo, não um erro.
 */
export function precoBRL(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return 'Valor sob consulta'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

export interface PrecoCalculado {
  /** O que o vestido custa sem cupom. `null` quando é sob consulta. */
  original: number | null
  /** O que a cliente paga. Igual ao original quando não há cupom. */
  final: number | null
  /** Quanto o cupom abateu, em reais. Zero quando não há desconto. */
  desconto: number
  temDesconto: boolean
  /** Valor cheio da promoção do próprio vestido, para exibir riscado. */
  promocionalDe: number | null
}

/**
 * Preço de um vestido, já considerando o cupom ativo.
 *
 * É a única função do projeto que calcula desconto. Nenhum componente deve
 * multiplicar ou subtrair preço por conta própria, se a regra mudar (cupom
 * cumulativo, desconto só em festa), muda aqui e vale para o site inteiro.
 *
 * Duas coisas separadas convivem:
 * - `promocionalDe`: a promoção do próprio vestido, cadastrada no painel;
 * - `desconto`: o abatimento do cupom, aplicado sobre o preço já promocional.
 */
export function calcularPreco(
  peca: { precoAluguel: number | null; precoDe?: number | null },
  cupom?: Cupom | null,
): PrecoCalculado {
  const original = peca.precoAluguel

  // Sob consulta: não há o que descontar.
  if (original === null) {
    return {
      original: null,
      final: null,
      desconto: 0,
      temDesconto: false,
      promocionalDe: null,
    }
  }

  const promocionalDe =
    peca.precoDe !== null && peca.precoDe !== undefined && peca.precoDe > original
      ? peca.precoDe
      : null

  if (!cupom) {
    return { original, final: original, desconto: 0, temDesconto: false, promocionalDe }
  }

  const bruto =
    cupom.tipoDesconto === 'percentual' ? (original * cupom.valor) / 100 : cupom.valor

  // Nunca deixa o preço ficar negativo, e arredonda para centavos.
  const desconto = Math.min(Math.round(bruto * 100) / 100, original)
  const final = Math.round((original - desconto) * 100) / 100

  return { original, final, desconto, temDesconto: desconto > 0, promocionalDe }
}
