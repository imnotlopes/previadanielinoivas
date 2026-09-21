/**
 * O QUE VALE COMO DEPOIMENTO AQUI.
 *
 * A Danielli disse, no áudio de setembro de 2026, como quer esta seção:
 * "a foto da noiva com o depoimento é uma foto ou outra, mostrando detalhes,
 * não necessariamente tudo do vestido, porque senão não chama atenção".
 *
 * O motivo dela é comercial e não estético. A cidade é pequena, ela atende a
 * região, e noiva que já viu o vestido inteiro chega dizendo "esse eu já vi"
 * e não quer mais casar com ele. Por isso a imagem de um depoimento é UMA só,
 * e é recorte: a renda, as costas, a manga, a cauda no chão.
 */

/** A imagem que acompanha a fala. Uma por depoimento, nunca duas. */
export interface ImagemDoDepoimento {
  /**
   * `detalhe` recorta em 3:4 e preenche. `print` cabe inteiro, sem corte.
   *
   * A distinção existe porque cortar um print corta a conversa: o mesmo
   * enquadramento que valoriza uma foto de renda decapita a primeira linha
   * da mensagem, que é justamente onde a noiva diz o que sentiu.
   */
  tipo: 'detalhe' | 'print'
  /** Caminho a partir de /public. */
  src: string
  alt: string
}

export interface Depoimento {
  id: string
  /** Nome de quem falou. */
  autora: string
  /** Uma linha de contexto: "casou em março", "mãe da debutante". */
  contexto?: string
  /**
   * A fala dela, como ela escreveu ou falou.
   *
   * Recorte pelo começo e pelo fim se precisar, nunca pelo meio: cortar o
   * miolo de uma frase muda o que a pessoa disse. Erro de digitação do
   * original se mantém, é o que faz soar como gente, e não como texto de
   * agência.
   */
  fala: string
  /**
   * Opcional, e de propósito.
   *
   * Uma fala sem imagem ainda é um depoimento. Uma imagem obrigatória seria
   * o caminho mais curto para alguém ilustrar a fala com uma foto qualquer
   * de banco de imagem, e aí a prova vira enfeite.
   */
  imagem?: ImagemDoDepoimento
  /**
   * Código do vestido que ela usou, quando se sabe ("N-08").
   *
   * Com ele, a foto que aparece antes da fala é a desse vestido, e não um
   * destaque qualquer. Sem ele, a leitora vê uma fala sobre "o meu vestido"
   * logo depois da foto de outro, conclui que foi aquele, e chega no ateliê
   * pedindo pelo vestido errado. Ver `montarFluxo` em lib/fluxo.ts.
   */
  peca?: string
}

/**
 * Depoimentos escolhidos pela loja.
 *
 * São diferentes das avaliações do Google (`data/google.ts`): aquelas são
 * transcrição literal de um perfil público, que ninguém edita; estas são a
 * seleção da própria casa.
 *
 * VAZIO À ESPERA DO REAL
 * ----------------------
 * Havia quatro depoimentos inventados aqui, escritos para o site poder ser
 * visto de pé. Foram removidos quando as peças viraram links mandados a
 * noivas de verdade, e não voltam.
 *
 * A Danielli ficou de conseguir os depoimentos. O print da conversa no
 * WhatsApp é o formato mais provável de chegar, e por isso é cidadão de
 * primeira classe aqui: dá para publicar o print em si, sem transcrever.
 *
 * PRECISA DE AUTORIZAÇÃO, E DE CADA COISA SEPARADAMENTE. Uma pessoa pode
 * topar que a fala apareça e não querer o rosto, ou topar as duas e não
 * querer o print com a foto de perfil e o telefone dela à mostra. Antes de
 * publicar um print: confira se não há número, sobrenome ou foto de perfil
 * legível no recorte.
 */
export const depoimentos: Depoimento[] = []
