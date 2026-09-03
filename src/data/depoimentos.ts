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
   * Foto DELA. Não é ilustração: é metade do depoimento.
   *
   * Uma frase elogiosa sem rosto é indistinguível de texto inventado, e este
   * projeto já teve depoimento inventado uma vez. A foto é o que transforma
   * "alguém disse isso" em "esta noiva disse isso".
   *
   * Caminho a partir de /public. Exibida em 3:4, como o resto do site.
   */
  foto: string
  alt: string
}

/**
 * Depoimentos escolhidos pela loja.
 *
 * São diferentes das avaliações do Google (`data/google.ts`): aquelas são
 * transcrição literal de um perfil público, que ninguém edita; estas são a
 * seleção da própria casa, com a foto da noiva junto.
 *
 * VAZIO À ESPERA DO REAL
 * ----------------------
 * Havia quatro depoimentos inventados aqui, escritos para o site poder ser
 * visto de pé. Foram removidos quando as peças viraram links mandados a
 * noivas de verdade.
 *
 * A Danielli quer depoimentos e disse ter: print de conversa no WhatsApp já
 * serve de fonte para a fala. A foto sai do material dos fotógrafos.
 *
 * PRECISA DE AUTORIZAÇÃO: DAS DUAS COISAS. Uma pessoa pode topar que a fala
 * dela apareça e não querer o rosto, ou o contrário. Confirme as duas antes
 * de publicar.
 */
export const depoimentos: Depoimento[] = []

/**
 * Mostra o espaço reservado enquanto não há depoimento cadastrado.
 *
 * Existe porque "a seção some sozinha quando está vazia" é o comportamento
 * certo em produção e péssimo agora: sem isto, não dá para ver o formato nem
 * decidir se ele funciona antes de sair caçando depoimento.
 *
 * O espaço é desenhado para ser INCONFUNDÍVEL com conteúdo, moldura
 * tracejada e o texto dizendo o que vai ali. Ninguém olha e acha que é um
 * depoimento de verdade.
 *
 * **Vire para `false` antes de mandar qualquer link para uma noiva.** Com a
 * lista preenchida ele é ignorado de qualquer forma.
 */
export const mostrarEspacoReservado = true
