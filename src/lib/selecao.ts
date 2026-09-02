import { useSyncExternalStore } from 'react'

/**
 * "QUERO PROVAR ESSES" — a lista que a noiva monta enquanto folheia.
 * =================================================================
 *
 * É o recurso que transforma o catálogo de vitrine em ferramenta de venda.
 *
 * O QUE ELE RESOLVE
 * -----------------
 * Sem isto, a conversa acontece assim: a noiva rola 40 vestidos, gosta de
 * cinco, e manda "gostei do terceiro e daquele de manga". A Danielli não faz
 * ideia de quais são. Ou pior: a noiva chega na loja e não lembra.
 *
 * Com isto, ela marca enquanto vê, e sai UMA mensagem com os nomes — mais o
 * link que reabre exatamente a mesma seleção do lado da Danielli. Os vestidos
 * já estão separados quando ela chega.
 *
 * POR QUE NÃO É CARRINHO
 * ----------------------
 * Não reserva, não cobra e não promete disponibilidade. É um bilhete. Chamar
 * de carrinho faria a noiva achar que garantiu o vestido, e garantir vestido
 * de aluguel é coisa que só a agenda da loja pode fazer.
 *
 * POR QUE FORA DO REACT
 * ---------------------
 * A seleção é lida em três lugares que não se conhecem (o botão no card, a
 * ficha do vestido, a barra do rodapé). Um provider a mais só para isso
 * significaria re-renderizar o catálogo inteiro a cada clique numa estrela.
 * `useSyncExternalStore` assina só quem precisa.
 */

const CHAVE = 'danielli:provar'

/** Teto de segurança. Ver a nota em `alternar`. */
const LIMITE = 12

let slugs: string[] = []
const ouvintes = new Set<() => void>()

function lerDoDisco(): string[] {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return []
    const dados: unknown = JSON.parse(bruto)
    if (!Array.isArray(dados)) return []
    return dados.filter((v): v is string => typeof v === 'string').slice(0, LIMITE)
  } catch {
    /* Modo anônimo, armazenamento cheio ou JSON corrompido por versão antiga.
       Em todos os casos a resposta certa é "nenhum vestido marcado", nunca
       derrubar o catálogo. */
    return []
  }
}

function gravarNoDisco() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(slugs))
  } catch {
    /* Sem espaço ou sem permissão: a seleção continua valendo nesta aba e
       só não sobrevive ao recarregamento. */
  }
}

function avisar() {
  for (const ouvinte of ouvintes) ouvinte()
}

function definir(proximos: string[]) {
  slugs = proximos
  gravarNoDisco()
  avisar()
}

/**
 * Primeira leitura, e o resgate da seleção vinda por link.
 *
 * `?provar=slug-a,slug-b` na URL vence o que estiver guardado. É o caso da
 * Danielli abrindo, do computador da loja, o link que a noiva mandou: o que
 * ela precisa ver é a seleção DA NOIVA, não a que ela mesma montou testando
 * o catálogo ontem.
 *
 * O parâmetro é apagado da barra de endereço logo depois, com
 * `replaceState`. Se ficasse, recarregar a página desfaria qualquer vestido
 * que ela tirasse da lista — o link continuaria mandando na tela.
 */
function iniciar() {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(location.search)
  const doLink = params.get('provar')

  if (doLink) {
    slugs = doLink
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, LIMITE)
    gravarNoDisco()

    params.delete('provar')
    const busca = params.toString()
    history.replaceState(null, '', `${location.pathname}${busca ? `?${busca}` : ''}${location.hash}`)
    return
  }

  slugs = lerDoDisco()

  /* Duas abas abertas na loja é cenário comum quando ela atende. */
  window.addEventListener('storage', (evento) => {
    if (evento.key !== CHAVE) return
    slugs = lerDoDisco()
    avisar()
  })
}

iniciar()

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte)
  return () => {
    ouvintes.delete(ouvinte)
  }
}

/*
  `useSyncExternalStore` compara o retorno por identidade. Por isso `slugs`
  é SEMPRE substituído por um array novo, nunca mutado: um `push` deixaria a
  referência igual e nenhuma tela se atualizaria.
*/
function instantaneo(): string[] {
  return slugs
}

/** Constante para o servidor. Ver a nota de identidade acima. */
const VAZIO: string[] = []
function instantaneoServidor(): string[] {
  return VAZIO
}

export interface Selecao {
  slugs: string[]
  quantidade: number
  cheia: boolean
  tem: (slug: string) => boolean
  alternar: (slug: string) => void
  remover: (slug: string) => void
  limpar: () => void
}

/** Assina a seleção. Re-renderiza só o componente que chamou. */
export function useSelecao(): Selecao {
  const atuais = useSyncExternalStore(assinar, instantaneo, instantaneoServidor)

  return {
    slugs: atuais,
    quantidade: atuais.length,
    cheia: atuais.length >= LIMITE,
    tem: (slug) => atuais.includes(slug),
    alternar,
    remover,
    limpar,
  }
}

/**
 * Marca ou desmarca um vestido.
 *
 * O limite de 12 não é técnico. É que "quero provar esses" com 30 vestidos
 * não é uma seleção, é o catálogo de novo — e a Danielli receberia uma
 * mensagem que não ajuda a separar nada. Uma prova rende de seis a dez
 * vestidos; 12 já é folga.
 */
export function alternar(slug: string) {
  if (slugs.includes(slug)) {
    definir(slugs.filter((s) => s !== slug))
    return
  }
  if (slugs.length >= LIMITE) return
  definir([...slugs, slug])
}

export function remover(slug: string) {
  if (!slugs.includes(slug)) return
  definir(slugs.filter((s) => s !== slug))
}

export function limpar() {
  if (slugs.length === 0) return
  definir([])
}

export { LIMITE as LIMITE_SELECAO }
