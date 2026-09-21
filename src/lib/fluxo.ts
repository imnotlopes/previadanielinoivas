import type { Depoimento, ImagemDoDepoimento } from '../data/depoimentos'
import { ordenadas, type Peca } from '../data/pecas'

/**
 * FOTO, DEPOIMENTO, FOTO, DEPOIMENTO.
 * ===================================
 *
 * A seção de modelos mostrava doze vestidos em sequência, e os depoimentos
 * moravam numa seção separada, mais abaixo. Agora é uma sequência só: cinco
 * fotos, cada uma seguida de uma fala de noiva.
 *
 * Cinco, e não doze, pela regra da Danielli: "muita foto, ela vai tirar toda a
 * curiosidade dela". E intercalado porque foto sozinha é vitrine, e foto com
 * alguém contando como foi é história, que é o que ela pediu no lugar de
 * informação.
 */
export const FOTOS_NO_FLUXO = 5

export type ItemDoFluxo =
  /** Um vestido do acervo, com o cartão de sempre. */
  | { tipo: 'peca'; chave: string; peca: Peca }
  /** A foto que veio com o depoimento: um recorte de detalhe, sem legenda. */
  | { tipo: 'detalhe'; chave: string; imagem: ImagemDoDepoimento }
  | { tipo: 'depoimento'; chave: string; depoimento: Depoimento }
  /** O lugar de um depoimento que ainda não chegou. Só em desenvolvimento. */
  | { tipo: 'reservado'; chave: string }

/**
 * Monta a sequência.
 *
 * DE ONDE VEM A FOTO DE CADA PAR, EM ORDEM DE PREFERÊNCIA:
 *
 *   1. O recorte de detalhe que veio junto com o depoimento. É a foto dela.
 *   2. O vestido que ela usou, quando o depoimento diz qual (`peca`).
 *   3. O próximo destaque da lista, escolhido a dedo em data/apresentacoes.ts.
 *
 * A ordem existe por honestidade, e não por estética. Uma fala dizendo "amei
 * meu vestido" logo depois da foto de outro vestido faz a leitora concluir que
 * foi aquele, e ela vai chegar no ateliê pedindo por ele. Quando se sabe qual
 * foi, a foto certa vem antes da fala.
 *
 * Se um destaque tiver sido ocultado ou apagado do acervo, o lugar dele é
 * completado pela ordem normal das peças, para a sequência não encolher sem
 * ninguém perceber.
 *
 * Depoimentos além do quinto ficam de fora: cinco pares é o tamanho da peça.
 */
export function montarFluxo(
  pecas: Peca[],
  destaques: readonly string[],
  depoimentos: readonly Depoimento[],
  reservar: boolean,
): ItemDoFluxo[] {
  const porCodigo = new Map(pecas.map((peca) => [peca.codigo, peca]))

  const fila = [
    ...destaques.map((codigo) => porCodigo.get(codigo)).filter((p): p is Peca => !!p),
    ...ordenadas(pecas).filter((peca) => !destaques.includes(peca.codigo)),
  ]
  const usadas = new Set<string>()

  const proximaDaFila = (): Peca | undefined => {
    const peca = fila.find((p) => !usadas.has(p.codigo))
    if (peca) usadas.add(peca.codigo)
    return peca
  }

  const itens: ItemDoFluxo[] = []

  for (let i = 0; i < FOTOS_NO_FLUXO; i++) {
    const depoimento = depoimentos[i]

    if (depoimento?.imagem?.tipo === 'detalhe') {
      itens.push({ tipo: 'detalhe', chave: `detalhe-${depoimento.id}`, imagem: depoimento.imagem })
    } else {
      const usada = depoimento?.peca ? porCodigo.get(depoimento.peca) : undefined
      const peca = usada && !usadas.has(usada.codigo) ? usada : proximaDaFila()
      if (!peca) break
      usadas.add(peca.codigo)
      itens.push({ tipo: 'peca', chave: peca.codigo, peca })
    }

    if (depoimento) {
      itens.push({ tipo: 'depoimento', chave: depoimento.id, depoimento })
    } else if (reservar) {
      itens.push({ tipo: 'reservado', chave: `reservado-${i}` })
    }
  }

  return itens
}
