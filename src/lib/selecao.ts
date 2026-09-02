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
 * ELA TEM UM CASAMENTO SÓ
 * -----------------------
 * A data e o manequim moram aqui, junto da lista, e não em cada vestido. Isso
 * não é economia de código: uma noiva que marca cinco modelos tem UMA data, e
 * pedir a mesma data cinco vezes é o tipo de repetição que faz a pessoa parar
 * de preencher.
 *
 * E são os dois campos que decidem a resposta da loja. Sem eles a Danielli
 * recebe "quero provar esses" e gasta duas mensagens perguntando data e
 * manequim; com eles, a primeira resposta já pode ser "esses três estão
 * livres no seu dia, vem quinta?". A conversa começa duas trocas à frente.
 *
 * NENHUM DOS DOIS É OBRIGATÓRIO. Exigir preenchimento antes de falar com
 * alguém é a forma mais rápida de perder quem só queria tirar uma dúvida.
 *
 * POR QUE NÃO É CARRINHO
 * ----------------------
 * Não reserva, não cobra e não promete disponibilidade. É um bilhete. Chamar
 * de carrinho faria a noiva achar que garantiu o vestido, e garantir vestido
 * de aluguel é coisa que só a agenda da loja pode fazer.
 *
 * POR QUE FORA DO REACT
 * ---------------------
 * A seleção é lida em quatro lugares que não se conhecem (o marcador no card,
 * a ficha do vestido, o bloco de agendar e a barra do rodapé). Um provider a
 * mais só para isso significaria re-renderizar o catálogo inteiro a cada
 * clique numa estrela.
 */

const CHAVE = 'danielli:provar'

/** Teto de segurança. Ver a nota em `alternar`. */
const LIMITE = 12

interface Guardado {
  slugs: string[]
  /** Data do casamento, em ISO (`2026-10-12`). Vazia enquanto não informada. */
  data: string
  /** Como ela se veste hoje: "38", "42", "M". Texto livre de propósito. */
  manequim: string
}

const INICIAL: Guardado = { slugs: [], data: '', manequim: '' }

let estado: Guardado = INICIAL
const ouvintes = new Set<() => void>()

function texto(valor: unknown): string {
  return typeof valor === 'string' ? valor : ''
}

function lerDoDisco(): Guardado {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return INICIAL
    const dados: unknown = JSON.parse(bruto)

    /* Formato antigo: só o array de slugs. Ler em vez de descartar mantém a
       lista de quem já tinha marcado vestido antes destes campos existirem. */
    if (Array.isArray(dados)) {
      return {
        ...INICIAL,
        slugs: dados.filter((v): v is string => typeof v === 'string').slice(0, LIMITE),
      }
    }

    if (!dados || typeof dados !== 'object') return INICIAL
    const objeto = dados as Record<string, unknown>
    return {
      slugs: Array.isArray(objeto.slugs)
        ? objeto.slugs.filter((v): v is string => typeof v === 'string').slice(0, LIMITE)
        : [],
      data: texto(objeto.data),
      manequim: texto(objeto.manequim),
    }
  } catch {
    /* Modo anônimo, armazenamento cheio ou JSON corrompido por versão antiga.
       Em todos os casos a resposta certa é "nada marcado", nunca derrubar o
       catálogo. */
    return INICIAL
  }
}

function gravarNoDisco() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado))
  } catch {
    /* Sem espaço ou sem permissão: a seleção continua valendo nesta aba e
       só não sobrevive ao recarregamento. */
  }
}

function avisar() {
  for (const ouvinte of ouvintes) ouvinte()
}

function definir(proximo: Guardado) {
  estado = proximo
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
    estado = {
      ...INICIAL,
      slugs: doLink
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, LIMITE),
      /* A data também viaja no link, para a Danielli abrir a seleção já
         sabendo o dia. Formato ISO; qualquer outra coisa é ignorada. */
      data: /^\d{4}-\d{2}-\d{2}$/.test(params.get('data') ?? '') ? params.get('data')! : '',
    }
    gravarNoDisco()

    params.delete('provar')
    params.delete('data')
    const busca = params.toString()
    history.replaceState(null, '', `${location.pathname}${busca ? `?${busca}` : ''}${location.hash}`)
    return
  }

  estado = lerDoDisco()

  /* Duas abas abertas na loja é cenário comum quando ela atende. */
  window.addEventListener('storage', (evento) => {
    if (evento.key !== CHAVE) return
    estado = lerDoDisco()
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
  `useSyncExternalStore` compara o retorno por identidade. Por isso `estado` é
  SEMPRE substituído por um objeto novo, nunca mutado: um `push` no array
  deixaria a referência igual e nenhuma tela se atualizaria.
*/
function instantaneo(): Guardado {
  return estado
}

/** Constante para o servidor. Ver a nota de identidade acima. */
function instantaneoServidor(): Guardado {
  return INICIAL
}

export interface Selecao {
  slugs: string[]
  quantidade: number
  cheia: boolean
  /** Data do casamento em ISO, ou string vazia. */
  data: string
  manequim: string
  tem: (slug: string) => boolean
  alternar: (slug: string) => void
  remover: (slug: string) => void
  limpar: () => void
  definirData: (data: string) => void
  definirManequim: (manequim: string) => void
}

/** Assina a seleção. Re-renderiza só o componente que chamou. */
export function useSelecao(): Selecao {
  const atual = useSyncExternalStore(assinar, instantaneo, instantaneoServidor)

  return {
    slugs: atual.slugs,
    quantidade: atual.slugs.length,
    cheia: atual.slugs.length >= LIMITE,
    data: atual.data,
    manequim: atual.manequim,
    tem: (slug) => atual.slugs.includes(slug),
    alternar,
    remover,
    limpar,
    definirData,
    definirManequim,
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
  if (estado.slugs.includes(slug)) {
    definir({ ...estado, slugs: estado.slugs.filter((s) => s !== slug) })
    return
  }
  if (estado.slugs.length >= LIMITE) return
  definir({ ...estado, slugs: [...estado.slugs, slug] })
}

export function remover(slug: string) {
  if (!estado.slugs.includes(slug)) return
  definir({ ...estado, slugs: estado.slugs.filter((s) => s !== slug) })
}

/**
 * Esvazia a lista, mas NÃO apaga data e manequim.
 *
 * "Limpar" ali quer dizer "quero escolher outros", não "esquece quem eu sou".
 * Apagar a data junto obrigaria a redigitar o dia do casamento por ter mudado
 * de ideia sobre os vestidos.
 */
export function limpar() {
  if (estado.slugs.length === 0) return
  definir({ ...estado, slugs: [] })
}

export function definirData(data: string) {
  if (data === estado.data) return
  definir({ ...estado, data })
}

export function definirManequim(manequim: string) {
  if (manequim === estado.manequim) return
  definir({ ...estado, manequim: manequim.slice(0, 20) })
}

/** "2026-10-12" → "12/10/2026", sem depender de fuso. */
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : iso
}

export { LIMITE as LIMITE_SELECAO }
