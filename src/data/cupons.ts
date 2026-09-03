export interface Cupom {
  id: string
  /** Como a cliente digita, sempre em maiúsculas. Vira o `?cupom=` da URL. */
  codigo: string
  tipoDesconto: 'percentual' | 'valor'
  /** 10 para 10%, ou 50 para R$ 50,00, conforme o tipo. */
  valor: number
  /** Nome de quem divulga. Aparece na faixa: "cupom X de Fulana". */
  parceira?: string
  ativo: boolean
  /** ISO curto, "2026-12-31". `null` = sem prazo. */
  validade: string | null
  /** `null` = ilimitado. */
  limiteUsos: number | null
  usos: number
}

/**
 * Cupons de divulgação.
 *
 * COMO FUNCIONA NA PRÉVIA
 * -----------------------
 * A parceira divulga um link com `?cupom=CODIGO`. O site guarda o código no
 * navegador da visitante por 30 dias, mostra a faixa no topo e leva o código
 * para dentro da mensagem do WhatsApp. Não há checkout: o cupom é um recado
 * para a loja saber por onde a cliente chegou e qual desconto prometer.
 *
 * ATENÇÃO: DADOS DE PRÉVIA
 * -------------------------
 * Os três cupons abaixo foram inventados para demonstrar o mecanismo. Antes de
 * publicar: troque pelos combinados de verdade, ou esvazie a lista, sem
 * cupom cadastrado, a faixa e todo o resto somem sozinhos.
 *
 * Enquanto os vestidos estiverem sem preço ("sob consulta"), o desconto não
 * tem sobre o que incidir e o site mostra só o código na conversa. Assim que
 * `precoAluguel` for preenchido em data/pecas.ts, o valor riscado aparece.
 */
export const cupons: Cupom[] = [
  {
    id: 'exemplo-1',
    codigo: 'NOIVA10',
    tipoDesconto: 'percentual',
    valor: 10,
    parceira: 'Camila Duarte',
    ativo: true,
    validade: null,
    limiteUsos: null,
    usos: 0,
  },
  {
    id: 'exemplo-2',
    codigo: 'DEBUTANTE15',
    tipoDesconto: 'percentual',
    valor: 15,
    parceira: 'Jéssica Alves',
    ativo: true,
    validade: '2026-12-31',
    limiteUsos: 50,
    usos: 12,
  },
  {
    id: 'exemplo-3',
    codigo: 'VERAO50',
    tipoDesconto: 'valor',
    valor: 50,
    ativo: false,
    validade: '2026-03-31',
    limiteUsos: null,
    usos: 87,
  },
]

/**
 * Um cupom só vale quando está ativo, dentro da validade e abaixo do limite
 * de usos. As três condições são checadas juntas aqui para que a faixa, a
 * página do vestido e o painel nunca discordem sobre o que é válido.
 */
export function cupomEhValido(cupom: Cupom): boolean {
  if (!cupom.ativo) return false

  if (cupom.validade) {
    const hoje = new Date().toISOString().slice(0, 10)
    if (cupom.validade < hoje) return false
  }

  if (cupom.limiteUsos !== null && cupom.usos >= cupom.limiteUsos) return false

  return true
}

/** "10%" ou "R$ 50,00", conforme o tipo. Para o texto da faixa. */
export function descontoLegivel(cupom: Cupom): string {
  if (cupom.tipoDesconto === 'percentual') {
    // Sem casas decimais quando for inteiro: "10%" e não "10,00%".
    const valor = Number.isInteger(cupom.valor)
      ? String(cupom.valor)
      : cupom.valor.toFixed(1).replace('.', ',')
    return `${valor}%`
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cupom.valor)
}

/** Acha um cupom válido pelo código, ignorando caixa e espaços. */
export function buscarCupom(lista: Cupom[], codigo: string): Cupom | null {
  const limpo = codigo.trim().toUpperCase()
  if (!limpo) return null
  const achado = lista.find((c) => c.codigo.toUpperCase() === limpo)
  return achado && cupomEhValido(achado) ? achado : null
}
