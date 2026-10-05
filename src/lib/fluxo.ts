import type { Destaque } from '../data/apresentacoes'
import type { Depoimento, ImagemDoDepoimento } from '../data/depoimentos'
import { ordenadas, type Peca } from '../data/pecas'

/**
 * FOTO, DEPOIMENTO, FOTO, DEPOIMENTO.
 * ===================================
 *
 * A seção de modelos mostrava doze vestidos em sequência, e os depoimentos
 * moravam numa seção separada, mais abaixo. Agora é uma sequência só: quatro
 * fotos, cada uma seguida de uma fala de noiva.
 *
 * Quatro, e não doze, pela regra da Danielli: "muita foto, ela vai tirar toda
 * a curiosidade dela". Foram cinco, depois três só da filha dela, e em 5 de
 * outubro de 2026 ficaram quatro, uma de cada noiva, a pedido dela. E
 * intercalado porque foto sozinha é vitrine, e foto com alguém contando como
 * foi é história, que é o que ela pediu no lugar de informação.
 */
export const FOTOS_NO_FLUXO = 4

export type ItemDoFluxo =
  /**
   * Um vestido do acervo. `recorte` é o detalhe escolhido para ele, `perto` e
   * `rotulo` completam a folha (ver `Destaque`); sem recorte (um vestido que
   * veio pelo depoimento e não é destaque), vale a primeira foto da peça.
   */
  | {
      tipo: 'peca'
      chave: string
      peca: Peca
      recorte?: string
      perto?: string
      rotulo?: string
    }
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
 * UMA PEÇA PODE TER MAIS DE UMA FOLHA. Hoje cada destaque é de uma noiva,
 * mas a sequência já foi de três folhas do mesmo vestido, e pode voltar a
 * ser. Por isso a fila é de FOLHAS, cada uma com a própria chave (o
 * recorte), e não de peças: uma fila de peças engolia as três numa só.
 *
 * Depoimentos além do quarto ficam de fora: quatro pares é o tamanho da peça.
 */
export function montarFluxo(
  pecas: Peca[],
  destaques: readonly Destaque[],
  depoimentos: readonly Depoimento[],
  reservar: boolean,
): ItemDoFluxo[] {
  const porCodigo = new Map(pecas.map((peca) => [peca.codigo, peca]))
  const codigos = new Set(destaques.map((d) => d.codigo))

  interface Folha {
    chave: string
    peca: Peca
    destaque?: Destaque
  }

  const fila: Folha[] = [
    ...destaques.flatMap((destaque) => {
      const peca = porCodigo.get(destaque.codigo)
      return peca ? [{ chave: destaque.recorte, peca, destaque }] : []
    }),
    ...ordenadas(pecas)
      .filter((peca) => !codigos.has(peca.codigo))
      .map((peca) => ({ chave: peca.codigo, peca })),
  ]
  const usadas = new Set<string>()

  /** A próxima folha ainda não usada que passa no filtro. */
  const tirar = (filtro: (folha: Folha) => boolean = () => true): Folha | undefined => {
    const folha = fila.find((f) => !usadas.has(f.chave) && filtro(f))
    if (folha) usadas.add(folha.chave)
    return folha
  }

  const itens: ItemDoFluxo[] = []

  for (let i = 0; i < FOTOS_NO_FLUXO; i++) {
    const depoimento = depoimentos[i]

    if (depoimento?.imagem?.tipo === 'detalhe') {
      itens.push({ tipo: 'detalhe', chave: `detalhe-${depoimento.id}`, imagem: depoimento.imagem })
    } else {
      const doVestidoDela = depoimento?.peca
        ? tirar((f) => f.peca.codigo === depoimento.peca)
        : undefined
      const folha = doVestidoDela ?? tirar()
      if (!folha) break
      itens.push({
        tipo: 'peca',
        chave: folha.chave,
        peca: folha.peca,
        recorte: folha.destaque?.recorte,
        perto: folha.destaque?.perto,
        rotulo: folha.destaque?.rotulo,
      })
    }

    if (depoimento) {
      itens.push({ tipo: 'depoimento', chave: depoimento.id, depoimento })
    } else if (reservar) {
      itens.push({ tipo: 'reservado', chave: `reservado-${i}` })
    }
  }

  return itens
}
