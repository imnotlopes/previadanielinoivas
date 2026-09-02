/**
 * O QUE SUSTENTA A AUTORIDADE DA CASA.
 *
 * A Danielli pediu uma apresentação que mostre a autoridade dela. Autoridade
 * não se declara — "referência em noivas" é o que toda loja escreve, e por
 * isso não convence ninguém. O que convence é número verificável e rosto.
 *
 * Este arquivo guarda os dois. Está vazio de propósito: nada aqui pode ser
 * estimado. "Mais de 500 noivas" inventado é a frase que a noiva descobre
 * sendo mentira na primeira conversa, e aí a apresentação inteira cai junto.
 *
 * O TERCEIRO NÚMERO JÁ EXISTE E É REAL: o tamanho do acervo publicado, que a
 * apresentação calcula do próprio catálogo. Ver ApresentacaoNoiva.
 */

export interface Marco {
  /** O número, já formatado como se lê. Ex.: '12', '+400', '2014'. */
  valor: string
  /** O que ele conta. Ex.: 'anos de atelier', 'noivas atendidas'. */
  rotulo: string
}

/**
 * PARA PREENCHER COM A DANIELLI. Perguntas que dão os números:
 *
 *   - Desde quando a loja existe? (vira "X anos de atelier")
 *   - Quantas noivas por ano, mais ou menos? (vira "+X noivas vestidas")
 *   - Quantas cidades/regiões ela atende?
 *
 * Dois ou três marcos, no máximo. Quatro números lado a lado já viram
 * infográfico, e infográfico não é o que esta página é.
 */
export const marcos: Marco[] = []

/**
 * Retrato da Danielli, caminho a partir de /public.
 *
 * A noiva vai entregar o dia do casamento a uma pessoa. Uma apresentação de
 * atelier sem o rosto de quem atende passa a impressão de intermediário — que
 * é exatamente o contrário do que ela quer comunicar.
 *
 * `null` enquanto não houver foto. Precisa ser foto DELA na loja, não foto de
 * vestido: o assunto deste bloco é quem atende.
 */
export const retrato: string | null = null
export const retratoAlt = ''

/**
 * Mostra as molduras tracejadas enquanto retrato e marcos não existirem.
 *
 * Mesmo motivo do espaço reservado dos depoimentos: sumir sozinho é o certo
 * em produção e péssimo agora, porque esconde da Danielli exatamente o que
 * falta ela mandar.
 *
 * **Vire para `false` antes de mandar qualquer link para uma noiva.**
 */
export const mostrarEspacoReservado = true
