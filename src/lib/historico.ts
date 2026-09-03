/**
 * Histórico de vestidos vistos, guardado no navegador da visitante.
 *
 * Fica em `localStorage` e não em cookie de propósito: é informação só dela,
 * não precisa ir para servidor nenhum, e o site é estático, não há servidor
 * para receber.
 *
 * Nada aqui identifica a pessoa. É uma lista de slugs no aparelho dela.
 */

const CHAVE = 'danielli_vistos'
const LIMITE = 12

/** Lê o histórico. Devolve vazio se o storage estiver bloqueado. */
export function lerHistorico(): string[] {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return []
    const lista: unknown = JSON.parse(bruto)
    if (!Array.isArray(lista)) return []
    return lista.filter(
      (s): s is string => typeof s === 'string' && /^[a-z0-9-]+$/.test(s),
    )
  } catch {
    return []
  }
}

/**
 * Põe o vestido no topo do histórico.
 *
 * Se ele já estava na lista, sobe em vez de duplicar, o que interessa é a
 * última vez que ela olhou, não quantas vezes.
 */
export function registrarVisto(slug: string): void {
  try {
    const atual = lerHistorico().filter((s) => s !== slug)
    localStorage.setItem(CHAVE, JSON.stringify([slug, ...atual].slice(0, LIMITE)))
  } catch {
    // Storage bloqueado ou cheio: a seção simplesmente não aparece.
  }
}
