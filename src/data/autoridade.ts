/**
 * O QUE SUSTENTA A AUTORIDADE DO ATELIÊ.
 *
 * Tudo aqui foi confirmado pela Danielli e nada existia no site antes. É a
 * diferença entre uma loja que diz ser boa e uma que mostra o que tem.
 *
 * Substituiu o arquivo `atelier.ts`, que era espaço reservado esperando
 * número que ninguém tinha. Estes existem.
 */

/**
 * O ano de abertura. Os anos de casa são calculados a partir dele.
 *
 * Calculado, e não escrito: "22 anos" escrito à mão vira mentira em abril de
 * 2027, e ninguém lembra de voltar aqui.
 */
/**
 * A FRASE DA MARCA.
 *
 * Veio da própria Danielli, e não é slogan decorativo que dá para trocar por
 * outro: ela responde à objeção que trava toda noiva, "já vi um vestido no
 * Instagram, por que eu iria até a loja?".
 *
 * O argumento inteiro cabe nela. A noiva chega com um print salvo no celular,
 * e quase nunca é esse o vestido que ela leva. Não porque mudou de ideia: é
 * que vestido bonito na foto e vestido bonito nela são coisas diferentes, e
 * isso só o espelho do provador resolve.
 *
 * VOLTOU DEPOIS DE SUMIR
 * ----------------------
 * Ela era o eixo da página de noiva antiga e se perdeu na conversão para
 * apresentação, junto com aquela página. No lugar dela, no fecho da seção de
 * modelos, eu tinha escrito uma frase minha. Frase inventada por mim no lugar
 * de frase da dona do ateliê é troca ruim em qualquer situação, e aqui era
 * pior: a dela resolve uma objeção, a minha só era bonita.
 *
 * USO RESTRITO: uma vez por apresentação. É o tratamento tipográfico mais
 * forte da peça, e repetido vira maneirismo.
 */
export const FRASE_DA_MARCA =
  'A noiva vem pra escolher o vestido, e o vestido acaba escolhendo ela.'

export const ABERTURA = 2004

export function anosDeCasa(hoje = new Date()): number {
  /* Abril de 2004. Antes de abril, o ano ainda não fechou. */
  const ANIVERSARIO_MES = 3 // abril, base zero
  const fechou = hoje.getMonth() >= ANIVERSARIO_MES
  return hoje.getFullYear() - ABERTURA - (fechou ? 0 : 1)
}

export interface Marca {
  nome: string
  /** Máscara de alfa em public/marcas. Gerada por scripts/marcas.mjs. */
  logo: string
  /**
   * Largura em pixels de CSS, calibrada no olho.
   *
   * Não é escolha de layout, é equilíbrio óptico, e por isso mora no dado e
   * não no componente: cada logotipo tem uma proporção diferente e só bate com
   * os vizinhos numa largura própria. O número sai da prova de contato do
   * script, e a razão de cada um está lá.
   */
  largura: number
  /** Proporção da máscara, para o navegador reservar o espaço antes de carregar. */
  proporcao: number
}

/**
 * As marcas que o ateliê representa.
 *
 * É o item de autoridade mais forte da lista, e o menos óbvio: representar
 * marca é o que separa ateliê de loja que compra vestido pronto. A noiva não
 * conhece os nomes, mas entende o que significa haver nomes.
 *
 * ERA UMA LISTA DE TEXTO, E VIRARAM LOGOTIPOS
 * -------------------------------------------
 * Nome em caixinha diz que existe uma lista. Logotipo diz que existe uma
 * relação comercial, que é o argumento de verdade. Foi a Danielli quem mandou
 * os arquivos.
 *
 * DUAS CORREÇÕES QUE OS ARQUIVOS TROUXERAM
 * ----------------------------------------
 * A lista antiga tinha "Monê", e o logotipo dela é "MONET.". Estava escrito
 * errado no site. E a lista não tinha ViaSposa nem My Vintage Dress, que
 * agora entram.
 *
 * FALTA UMA
 * ---------
 * "MD Noivas" estava na lista antiga e não veio logotipo. Ela não está aqui
 * porque a faixa é de logotipos e uma marca em texto no meio dos cinco leria
 * como falha. Não é decisão de que ela saiu: é pendência, ver SEM_LOGOTIPO.
 */
export const MARCAS: Marca[] = [
  { nome: 'Center Noivas', logo: '/marcas/center-noivas.webp', largura: 106, proporcao: 640 / 296 },
  { nome: 'Rainha Noivas', logo: '/marcas/rainha.webp', largura: 110, proporcao: 640 / 155 },
  { nome: 'Monet', logo: '/marcas/monet.webp', largura: 118, proporcao: 640 / 181 },
  { nome: 'ViaSposa', logo: '/marcas/viasposa.webp', largura: 136, proporcao: 640 / 106 },
  {
    nome: 'My Vintage Dress',
    logo: '/marcas/my-vintage-dress.webp',
    largura: 205,
    proporcao: 640 / 37,
  },
]

/**
 * Marca representada que ainda não tem logotipo.
 *
 * Fica registrado aqui, e não apagado, porque é informação verdadeira sobre o
 * ateliê: sumir com ela em silêncio seria tirar do ar uma afirmação correta só
 * porque falta um arquivo PNG. Chegando o logotipo, ela sobe para a lista de
 * cima e esta constante deixa de existir.
 */
export const SEM_LOGOTIPO = ['MD Noivas'] as const

/** De onde vêm as peças importadas. */
export const IMPORTADOS = 'Turquia'

/**
 * Quem o ateliê veste.
 *
 * Inclui formatura de alto padrão de propósito: é o público que a Danielli
 * atende e que ninguém supõe que ela atenda.
 */
export const ATENDE = [
  'noivas',
  'madrinhas',
  'padrinhos',
  'mães',
  'formandas',
] as const
