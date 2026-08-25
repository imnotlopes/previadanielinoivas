export interface Depoimento {
  id: string
  autora: string
  /** Uma linha de contexto: "noiva, casou em março" ou "mãe da debutante". */
  contexto?: string
  texto: string
}

/**
 * Depoimentos escolhidos pela loja.
 *
 * São diferentes das avaliações do Google (`data/google.ts`): aquelas são
 * transcrição literal de um perfil público, que ninguém edita; estas são a
 * seleção da própria casa, e podem ser recortadas para caber no bloco.
 *
 * ATENÇÃO — TEXTOS DE PRÉVIA
 * --------------------------
 * Os quatro abaixo foram inventados para o site poder ser visto de pé. Antes
 * de publicar: substitua por depoimentos reais, com autorização de quem
 * escreveu, ou esvazie a lista — a seção some sozinha.
 */
export const depoimentos: Depoimento[] = [
  {
    id: 'exemplo-1',
    autora: 'Aline Ferreira',
    contexto: 'noiva',
    texto:
      'Entrei só para ter ideia de preço e saí com o vestido reservado. O que eu escolhi não era nem parecido com a foto que eu levei salva no celular.',
  },
  {
    id: 'exemplo-2',
    autora: 'Renata Souza',
    contexto: 'mãe da debutante',
    texto:
      'Provamos com calma, sem ninguém olhando o relógio. Minha filha se sentiu uma princesa e o valor coube no que a gente tinha.',
  },
  {
    id: 'exemplo-3',
    autora: 'Patrícia Nogueira',
    contexto: 'madrinha',
    texto:
      'Terceira vez que alugo aqui. Sempre tem modelo novo e nunca peguei uma peça gasta ou com marca. Isso conta muito.',
  },
  {
    id: 'exemplo-4',
    autora: 'Vanessa Rocha',
    contexto: 'noiva',
    texto:
      'Emagreci seis quilos entre a reserva e o casamento e refizeram o ajuste sem cobrar nada a mais. Valeu mais que qualquer desconto.',
  },
]
