/**
 * NO DIA DELAS: UMA FOTO DE CADA NOIVA.
 * =====================================
 *
 * Foi uma sequência de 23 fotos do casamento da Natália passando num mural de
 * oito quadros, com a ideia de mostrar um vestido daqui atravessando o dia
 * inteiro de alguém. No áudio de 5 de outubro de 2026 a Danielli pediu o
 * contrário: "quatro fotos e uma de cada noiva, não precisa ser da mesma
 * noiva". Muita foto do mesmo vestido é muito vestido mostrado, e a regra
 * dela, numa cidade pequena, é mostrar pouco.
 *
 * Quatro noivas diferentes, então, e cada uma num momento, não no vestido: o
 * sorriso ao lado do noivo, o abraço, o beijo, a saída da igreja. Os recortes
 * saem de scripts/recortes.mjs, e a saia fica fora sempre que dá.
 *
 * DE ONDE VÊM
 * -----------
 * A da Natália é da cobertura do casamento dela, que a cliente autorizou. As
 * outras três são fotos que a própria Danielli já publicou no Instagram do
 * ateliê. Uma delas é a filha da Danielli, a noiva da capa, com o noivo.
 *
 * ⚠️ SEM NOME NENHUM
 * ------------------
 * São pessoas reais, identificáveis, no dia do casamento delas, e o link vai
 * para desconhecidas por WhatsApp. A seção não diz quem é ninguém, e o `alt`
 * descreve a cena sem nomear. Se alguma noiva pedir para sair, é tirar a
 * linha dela daqui.
 */
export interface NoivaNoAltar {
  /** Identificador estável, usado como chave. */
  id: string
  /** Caminho a partir de /public. Recorte 3:4 do momento. */
  foto: string
  /** A cena, para quem não vê. Sem nome. */
  alt: string
}

/**
 * Na ordem em que aparecem. A de preto e branco fica por último: no meio das
 * coloridas ela leria como engano; no fim, fecha a fileira.
 */
export const noivasNoAltar: NoivaNoAltar[] = [
  {
    id: 'natalia',
    foto: '/casamentos/recortes/joao-natalia-27.webp',
    alt: 'Noiva de gola alta de renda, sorrindo, ao lado do noivo de terno preto.',
  },
  {
    id: 'filha',
    foto: '/casamentos/no-dia/abraco.webp',
    alt: 'Noiva de vestido bordado e noivo de terno claro abraçados, de olhos fechados, com o buquê de rosas.',
  },
  {
    id: 'beijo',
    foto: '/casamentos/no-dia/beijo.webp',
    alt: 'Noivo beijando a noiva inclinada para trás, diante da mesa do bolo.',
  },
  {
    id: 'saida',
    foto: '/casamentos/no-dia/saida.webp',
    alt: 'Noivos saindo da igreja de braços erguidos, em preto e branco.',
  },
]
