/**
 * AS PEÇAS DO ATELIÊ, fonte única das três apresentações.
 * ======================================================
 *
 * Este arquivo substituiu o modelo de catálogo (`slug`, `categoria`, `cor`,
 * `numeracao`, `precoAluguel`, `publicado`). O produto deixou de ser catálogo
 * e virou apresentação de venda, e o modelo acompanhou.
 *
 * O QUE MUDOU DE VERDADE, E NÃO SÓ DE NOME
 * ----------------------------------------
 *  - `codigo` no lugar de `slug`: os nomes da prévia são todos inventados, e
 *    até a Danielli confirmar os de verdade a peça é identificada por código.
 *    Código também é o que ela já usa na arara.
 *  - `cores` e `tamanhos` no plural: uma peça existe em mais de uma cor e em
 *    várias numerações. O singular obrigava a escolher uma e mentir no resto.
 *  - `publico` no lugar de `categoria`: quem recebe o link, e não o que a peça
 *    é. É o que decide em qual das três apresentações ela aparece.
 *  - `preco` existe e está desligado. A Danielli já sinalizou que quer preço
 *    numa fase seguinte, e essa fase precisa ser uma chave, não uma
 *    refatoração.
 *
 * O QUE ESTÁ VAZIO, E POR QUE NÃO FOI CHUTADO
 * -------------------------------------------
 * `nome`, `cores` e `tamanhos` estão vazios em TODAS as peças. Os nomes e as
 * cores da prévia eram invenção minha para o site poder ser visto de pé, e o
 * brief mandou que nenhum vá para produção sem confirmação. Cor dá para ver na
 * foto, mas "branco" e "marfim" se confundem em tela e essa é exatamente a
 * pergunta que a noiva faz.
 *
 * Cada campo vazio some sozinho da tela. Nada aqui inventa para preencher.
 */

/** Quem recebe o link. Decide em qual apresentação a peça aparece. */
/**
 * O PÚBLICO DO ACERVO.
 *
 * Tinha três valores: `noivas`, `madrinhas` e `noivos`. Hoje tem um.
 *
 * A apresentação de madrinhas e a de noivos saíram do produto: a de madrinhas
 * nunca teve capa própria (usava um vestido de festa como provisório) e a de
 * noivos nunca teve uma única foto. Enquanto isso for verdade, elas não são
 * material de venda, são rascunho com URL.
 *
 * O tipo continua existindo, e com um valor só de propósito: no dia em que
 * uma delas voltar, basta acrescentar o valor aqui e o TypeScript aponta cada
 * lugar que precisa de atenção. As peças e as telas estão no histórico do
 * git, no commit "Converte o site em três apresentações de venda".
 */
export type Publico = 'noivas'

export interface Peca {
  /**
   * Identificação interna, obrigatória e estável.
   *
   * É a chave da peça em tudo: seleção, overlay, mensagem de WhatsApp. Foi
   * atribuído na ordem em que as peças entraram no acervo, e não deve ser
   * renumerado, porque ele já viajou em links e mensagens.
   */
  codigo: string

  /** Só depois que a Danielli confirmar. Vazio, a tela mostra o código. */
  nome?: string

  publico: Publico

  /** Caminhos a partir de /public. A primeira é a capa do card. */
  fotos: string[]

  /** Link ou arquivo. Peça parada e peça andando são coisas diferentes. */
  video?: string

  /** Ex.: ['Branco', 'Marfim']. Vazio esconde a linha. */
  cores: string[]

  /** Ex.: ['38', '40', '42']. Vazio esconde a linha. */
  tamanhos: string[]

  /** Uma linha: a silhueta e o detalhe que identifica a peça. */
  descricao: string

  /** Vai para o começo da grade da apresentação. */
  destaque: boolean

  /** A curadoria da Danielli: o acervo do ateliê é maior que a apresentação. */
  visivel: boolean

  /**
   * Construído e desligado.
   *
   * A apresentação não mostra valor nenhum, nem "sob consulta", que lê como
   * informação faltando. Quando a fase de catálogo com preço chegar, é aqui
   * que o número entra e em `Config.mostrarPrecos` que ele acende.
   */
  preco: null
}


export const pecas: Peca[] = [
  /* ------------------------------------------------------- noivas */
  {
    codigo: 'N-01',
    publico: 'noivas',
    descricao: 'Renda com gola alta e manga longa',
    cores: [],
    tamanhos: [],
    destaque: true,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/aurora-renda-gola-alta.webp',
      '/pecas/aurora-renda-gola-alta-2.webp',
      '/pecas/aurora-renda-gola-alta-3.webp',
      '/pecas/aurora-casamento.webp',
      '/pecas/aurora-casamento-2.webp',
      '/pecas/aurora-casamento-3.webp',
    ],
  },
  {
    codigo: 'N-02',
    publico: 'noivas',
    descricao: 'Decote V em renda, com véu longo',
    cores: [],
    tamanhos: [],
    destaque: true,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/isadora-decote-v-com-veu.webp',
      '/pecas/isadora-decote-v-com-veu-2.webp',
      '/pecas/isadora-decote-v-com-veu-3.webp',
    ],
  },
  {
    codigo: 'N-03',
    publico: 'noivas',
    descricao: 'Manga longa em renda e costas com botões',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/lorena-manga-longa-em-renda.webp',
      '/pecas/lorena-manga-longa-em-renda-2.webp',
    ],
  },
  {
    codigo: 'N-04',
    publico: 'noivas',
    descricao: 'Decote V com manga fluida em tule',
    cores: [],
    tamanhos: [],
    destaque: true,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/valentina-decote-v-manga-fluida.webp',
      '/pecas/valentina-decote-v-manga-fluida-2.webp',
    ],
  },
  {
    codigo: 'N-05',
    publico: 'noivas',
    descricao: 'Tule marfim com decote V',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/beatriz-tule-marfim.webp',
    ],
  },
  {
    codigo: 'N-06',
    publico: 'noivas',
    descricao: 'Ombros bordados e saia em tule',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/helena-ombros-bordados.webp',
    ],
  },
  {
    codigo: 'N-07',
    publico: 'noivas',
    descricao: 'Ombro a ombro em renda',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/marina-ombro-a-ombro.webp',
      '/pecas/marina-ombro-a-ombro-2.webp',
    ],
  },
  {
    codigo: 'N-08',
    publico: 'noivas',
    descricao: 'Decote profundo com bordado',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/rafaela-decote-profundo-bordado.webp',
      '/pecas/rafaela-decote-profundo-bordado-2.webp',
    ],
  },
  {
    codigo: 'N-09',
    publico: 'noivas',
    descricao: 'Costas em ilusão e saia em tule',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/clarice-costas-em-ilusao.webp',
      '/pecas/clarice-costas-em-ilusao-2.webp',
    ],
  },
  {
    codigo: 'N-10',
    publico: 'noivas',
    descricao: 'Princesa ombro a ombro, com laço nas costas',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/antonia-princesa-ombro-a-ombro.webp',
    ],
  },
  {
    codigo: 'N-11',
    publico: 'noivas',
    descricao: 'Renda com gola alta e saia ampla',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/eloa-renda-gola-alta.webp',
      '/pecas/eloa-renda-gola-alta-2.webp',
    ],
  },
  {
    codigo: 'N-12',
    publico: 'noivas',
    descricao: 'Manga longa fluida, sem brilho',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/julia-manga-longa-minimalista.webp',
      '/pecas/julia-manga-longa-minimalista-2.webp',
    ],
  },
  {
    codigo: 'N-13',
    publico: 'noivas',
    descricao: 'Um ombro só, com babado estruturado',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/thais-um-ombro-so-com-babado.webp',
      '/pecas/thais-um-ombro-so-com-babado-2.webp',
    ],
  },
  {
    codigo: 'N-14',
    publico: 'noivas',
    descricao: 'Cauda longa e véu catedral',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/sofia-cauda-longa.webp',
      '/pecas/sofia-cauda-longa-2.webp',
    ],
  },
  {
    codigo: 'N-15',
    publico: 'noivas',
    descricao: 'Princesa com cauda em tule',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/luiza-princesa-com-cauda.webp',
      '/pecas/luiza-princesa-com-cauda-2.webp',
    ],
  },
  {
    codigo: 'N-16',
    publico: 'noivas',
    descricao: 'Renda bordada com pérolas',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/celeste-renda-e-perolas.webp',
      '/pecas/celeste-renda-e-perolas-2.webp',
    ],
  },
  {
    codigo: 'N-17',
    publico: 'noivas',
    descricao: 'Renda com manga longa e decote ilusão',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/alicia-renda-manga-longa.webp',
      '/pecas/alicia-renda-manga-longa-2.webp',
      '/pecas/alicia-renda-manga-longa-3.webp',
    ],
  },
  {
    codigo: 'N-18',
    publico: 'noivas',
    descricao: 'Renda com decote ilusão e saia em tule',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/amanda-renda-decote-ilusao.webp',
    ],
  },
  {
    codigo: 'N-19',
    publico: 'noivas',
    descricao: 'Renda com manga longa e saia ampla',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/bruna-renda-manga-longa-saia-ampla.webp',
      '/pecas/bruna-renda-manga-longa-saia-ampla-2.webp',
    ],
  },
  {
    codigo: 'N-20',
    publico: 'noivas',
    descricao: 'Costas em renda com cauda longa',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/catarina-costas-em-renda-cauda-longa.webp',
    ],
  },
  {
    codigo: 'N-21',
    publico: 'noivas',
    descricao: 'Alça larga com decote coração e saia em tule',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/cecilia-alca-larga-saia-em-tule.webp',
    ],
  },
  {
    codigo: 'N-22',
    publico: 'noivas',
    descricao: 'Renda com manga longa e decote V',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/daniela-renda-manga-longa-decote-v.webp',
    ],
  },
  {
    codigo: 'N-23',
    publico: 'noivas',
    descricao: 'Manga curta em renda com cinto bordado',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/elisa-manga-curta-cinto-bordado.webp',
    ],
  },
  {
    codigo: 'N-24',
    publico: 'noivas',
    descricao: 'Ombro a ombro em renda',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/emanuelle-ombro-a-ombro-em-renda.webp',
      '/pecas/emanuelle-ombro-a-ombro-em-renda-2.webp',
      '/pecas/emanuelle-ombro-a-ombro-em-renda-3.webp',
    ],
  },
  {
    codigo: 'N-25',
    publico: 'noivas',
    descricao: 'Decote V sem manga, saia em tule',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/fernanda-decote-v-sem-manga.webp',
      '/pecas/fernanda-decote-v-sem-manga-2.webp',
    ],
  },
  {
    codigo: 'N-26',
    publico: 'noivas',
    descricao: 'Renda com manga longa e véu',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/gabriela-renda-manga-longa-com-veu.webp',
      '/pecas/gabriela-renda-manga-longa-com-veu-2.webp',
    ],
  },
  {
    codigo: 'N-27',
    publico: 'noivas',
    descricao: 'Renda com decote ilusão e manga longa',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/heloisa-renda-decote-ilusao.webp',
    ],
  },
  {
    codigo: 'N-28',
    publico: 'noivas',
    descricao: 'Renda com saia ampla e costas em ilusão',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/ingrid-renda-saia-ampla.webp',
      '/pecas/ingrid-renda-saia-ampla-2.webp',
      '/pecas/ingrid-renda-saia-ampla-3.webp',
    ],
  },
  {
    codigo: 'N-29',
    publico: 'noivas',
    descricao: 'Decote V com cinto e saia em tule',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/joana-decote-v-com-cinto.webp',
      '/pecas/joana-decote-v-com-cinto-2.webp',
    ],
  },
  {
    codigo: 'N-30',
    publico: 'noivas',
    descricao: 'Costas em ilusão com botões',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/larissa-costas-em-ilusao-com-botoes.webp',
      '/pecas/larissa-costas-em-ilusao-com-botoes-2.webp',
    ],
  },
  {
    codigo: 'N-31',
    publico: 'noivas',
    descricao: 'Ombro a ombro em tule',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/leticia-ombro-a-ombro-em-tule.webp',
      '/pecas/leticia-ombro-a-ombro-em-tule-2.webp',
      '/pecas/leticia-ombro-a-ombro-em-tule-3.webp',
      '/pecas/leticia-ombro-a-ombro-em-tule-4.webp',
    ],
  },
  {
    codigo: 'N-32',
    publico: 'noivas',
    descricao: 'Renda com manga longa e véu catedral',
    cores: [],
    tamanhos: [],
    destaque: true,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/malu-renda-manga-longa-veu-catedral.webp',
      '/pecas/malu-renda-manga-longa-veu-catedral-2.webp',
      '/pecas/malu-renda-manga-longa-veu-catedral-3.webp',
    ],
  },
  {
    codigo: 'N-33',
    publico: 'noivas',
    descricao: 'Bordado brilhante com manga longa',
    cores: [],
    tamanhos: [],
    destaque: true,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/mariana-bordado-manga-longa.webp',
      '/pecas/mariana-bordado-manga-longa-2.webp',
      '/pecas/mariana-bordado-manga-longa-3.webp',
      '/pecas/mariana-bordado-manga-longa-4.webp',
    ],
  },
  {
    codigo: 'N-34',
    publico: 'noivas',
    descricao: 'Sereia em renda',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/nina-sereia-em-renda.webp',
    ],
  },
  {
    codigo: 'N-35',
    publico: 'noivas',
    descricao: 'Renda com manga longa e decote redondo',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/paula-renda-manga-longa-decote-redondo.webp',
      '/pecas/paula-renda-manga-longa-decote-redondo-2.webp',
    ],
  },
  {
    codigo: 'N-36',
    publico: 'noivas',
    descricao: 'Manga curta com véu longo',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/pietra-manga-curta-veu-longo.webp',
      '/pecas/pietra-manga-curta-veu-longo-2.webp',
    ],
  },
  {
    codigo: 'N-37',
    publico: 'noivas',
    descricao: 'Corpo bordado ombro a ombro',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/renata-corpo-bordado-ombro-a-ombro.webp',
    ],
  },
  {
    codigo: 'N-38',
    publico: 'noivas',
    descricao: 'Decote V em renda com saia ampla',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/sarah-decote-v-em-renda.webp',
    ],
  },
  {
    codigo: 'N-39',
    publico: 'noivas',
    descricao: 'Costas em V bordado',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/talita-costas-em-v-bordado.webp',
      '/pecas/talita-costas-em-v-bordado-2.webp',
    ],
  },
  {
    codigo: 'N-40',
    publico: 'noivas',
    descricao: 'Manga longa em ilusão',
    cores: [],
    tamanhos: [],
    destaque: false,
    visivel: true,
    preco: null,
    fotos: [
      '/pecas/yasmin-manga-longa-em-ilusao.webp',
      '/pecas/yasmin-manga-longa-em-ilusao-2.webp',
      '/pecas/yasmin-manga-longa-em-ilusao-3.webp',
    ],
  },
]


/* -------------------------------------------------------------------------- */
/* Consultas                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * A CURADORIA.
 *
 * Toda tela que a cliente vê chama isto ANTES de qualquer outra coisa. O
 * acervo do ateliê é maior que o que vai na apresentação, e o que fica de
 * fora fica de fora em todo lugar: grade, overlay, seleção e a mensagem de
 * WhatsApp.
 */
export function visiveis(lista: Peca[]): Peca[] {
  return lista.filter((peca) => peca.visivel)
}

export function doPublico(lista: Peca[], publico: Publico): Peca[] {
  return lista.filter((peca) => peca.publico === publico)
}

export function buscarPorCodigo(lista: Peca[], codigo: string): Peca | undefined {
  return lista.find((peca) => peca.codigo === codigo)
}

/**
 * Destaque primeiro, resto na ordem do acervo.
 *
 * `sort` é estável, então dentro de cada grupo a ordem se mantém: o destaque
 * promove, não embaralha. É o controle que a Danielli tem sobre o que a noiva
 * vê primeiro.
 */
export function ordenadas(lista: Peca[]): Peca[] {
  return [...lista].sort(
    (a, b) => Number(Boolean(b.destaque)) - Number(Boolean(a.destaque)),
  )
}

/**
 * Como a peça se chama na tela e na mensagem.
 *
 * Enquanto a Danielli não confirmar os nomes, é o código. Ela precisa
 * conseguir achar a peça na arara com o que a noiva mandou.
 */
export function identificacao(peca: Peca): string {
  return peca.nome ? `${peca.nome} (${peca.codigo})` : peca.codigo
}
