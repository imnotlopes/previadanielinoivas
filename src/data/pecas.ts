// A extensão .js é exigência do moduleResolution node16 do tsconfig.node,
// que alcança este arquivo através de scripts/seo.ts; o arquivo em disco é
// .ts, e tanto o TypeScript quanto o Vite fazem essa correspondência sozinhos.
import { brand } from '../lib/brand.js'

export type CategoriaPeca = 'noiva' | 'festa' | 'debutante'

export interface Peca {
  slug: string
  /** Nome do vestido. Ver a nota sobre nomes no bloco do catálogo. */
  nome: string
  categoria: CategoriaPeca
  /**
   * O vestido em uma linha curta: silhueta e o detalhe que o identifica.
   * Sem nome de tecido quando não há certeza — chutar "renda francesa" numa
   * peça de aluguel é pior do que dizer só "renda".
   */
  descricao: string
  /**
   * Caminhos servidos a partir de /public, por isso começam com "/".
   * Strings em /src/assets NÃO funcionam: o Vite só versiona esses arquivos
   * quando são importados como módulo. Para trocar as fotos, edite a tabela
   * em scripts/importar-instagram.mjs e rode o script de novo.
   */
  imagens: string[]
  /** Aparece na vitrine da home. */
  destaque?: boolean

  /**
   * Valor do aluguel, em reais. `null` significa "sob consulta", e é o
   * estado atual de todo o acervo: ninguém informou a tabela da loja, e
   * inventar preço de aluguel é o tipo de erro que a cliente só descobre
   * dentro da loja. A interface inteira já funciona com preço — basta
   * preencher aqui que o valor aparece no card, na página e no cálculo do
   * cupom.
   */
  precoAluguel: number | null
  /** Valor cheio, quando a peça está em promoção. Exibido riscado. */
  precoDe?: number | null

  /**
   * Cor dominante, usada no filtro do catálogo. Uma só por vestido: é o que
   * a cliente procura ("o verde", "o rosa"), e listar três tons de branco
   * transformaria o filtro num segundo catálogo.
   */
  cor: CorPeca
}

/**
 * Cores do filtro.
 *
 * A lista é curta de propósito. Cada nome precisa ser algo que a cliente
 * diria em voz alta; "off-white", "champagne" e "pérola" viram todos
 * `marfim` aqui, porque na arara ninguém filtra por três tons de branco.
 */
export type CorPeca =
  | 'branco'
  | 'marfim'
  | 'dourado'
  | 'prata'
  | 'rosa'
  | 'lilas'
  | 'azul'
  | 'verde'
  | 'preto'

export const rotulosCor: Record<CorPeca, string> = {
  branco: 'Branco',
  marfim: 'Marfim',
  dourado: 'Dourado',
  prata: 'Prata',
  rosa: 'Rosa',
  lilas: 'Lilás',
  azul: 'Azul',
  verde: 'Verde',
  preto: 'Preto',
}

/** Amostra exibida no filtro. Só decoração: o rótulo em texto vai junto. */
export const amostraCor: Record<CorPeca, string> = {
  branco: '#FFFFFF',
  marfim: '#F2EADC',
  dourado: '#C9B56B',
  prata: '#C9CCD1',
  rosa: '#C2185B',
  lilas: '#B892D4',
  azul: '#8FA9C9',
  verde: '#1F4B3F',
  preto: '#242321',
}

/** Rótulos legíveis para filtros e breadcrumbs. */
export const rotulosCategoria: Record<CategoriaPeca, string> = {
  noiva: 'Noiva',
  festa: 'Festa',
  debutante: 'Debutante',
}

/**
 * Títulos e descrições de SEO por categoria.
 *
 * São FUNÇÕES da cidade, e não tabelas prontas, por duas razões. A primeira é
 * que a busca desta loja é local: quem procura digita "aluguel de vestido de
 * noiva em <cidade>", e a cidade precisa entrar na frase, não ficar de fora.
 * A segunda é que a cidade é editável — vem de `brand.cidade` no site
 * publicado, e do painel na prévia —, então calcular na hora é o que mantém
 * as duas fontes de acordo.
 *
 * Com a cidade vazia as frases saem sem ela: continuam corretas, só perdem o
 * termo que mais traz cliente.
 */
function local(cidade: string): string {
  return cidade ? ` em ${cidade}` : ''
}

/**
 * Título de cada página de categoria, usado na tag <title>.
 *
 * O rótulo do filtro ("Noiva") não serve aqui: quem busca digita "aluguel de
 * vestido de noiva", não "noiva". A frase fica na frente porque o título
 * completo passa do que o Google exibe e ele corta o fim, não o começo.
 */
export function tituloCategoria(
  categoria: CategoriaPeca,
  cidade: string = brand.cidade,
): string {
  const onde = local(cidade)
  const frases: Record<CategoriaPeca, string> = {
    noiva: `Aluguel de vestidos de noiva${onde}`,
    festa: `Aluguel de vestidos de festa e madrinha${onde}`,
    debutante: `Aluguel de vestidos de 15 anos${onde}`,
  }
  return frases[categoria]
}

/**
 * Meta description de cada categoria.
 *
 * Uma por categoria, e não um texto montado por template, porque o buscador
 * trata cada uma como página de entrada própria: quem procura "vestido de
 * noiva para alugar" cai em /catalogo?categoria=noiva, não na home. Descrição
 * repetida entre páginas é desperdício, então cada uma diz algo diferente.
 *
 * Entre 120 e 160 caracteres, que é a faixa que o Google costuma exibir
 * inteira.
 */
export function descricaoCategoria(
  categoria: CategoriaPeca,
  cidade: string = brand.cidade,
): string {
  const onde = local(cidade)
  const frases: Record<CategoriaPeca, string> = {
    noiva: `Vestidos de noiva para alugar${onde}. Prova com hora marcada no showroom, ajuste incluso no aluguel e reserva da data com antecedência.`,
    festa: `Vestidos de festa e de madrinha para alugar${onde}. Do longo fluido ao paetê, com prova sem compromisso e ajuste feito na cliente.`,
    debutante: `Vestidos de 15 anos para alugar${onde}. Do princesa ao sereia, com prova acompanhada, ajuste incluso e reserva garantida para a data da festa.`,
  }
  return frases[categoria]
}

/**
 * Catálogo — o acervo de aluguel.
 *
 * NOMES DE VESTIDO, NÃO DE CLIENTE
 * --------------------------------
 * Cada modelo é batizado com um nome próprio, e é por ele que a cliente pede
 * na conversa do WhatsApp ("quero provar o Aurora"). Isso resolve dois
 * problemas de uma vez: o acervo é de aluguel, então o mesmo vestido veste
 * várias noivas ao longo do tempo e não pertence a nenhuma delas; e nenhuma
 * cliente aparece identificada pelo nome sem ter autorizado.
 *
 * ATENÇÃO — CONTEÚDO DE PRÉVIA
 * ----------------------------
 * Os nomes e as descrições abaixo foram escritos aqui, a partir das fotos do
 * Instagram, para o site poder ser visto de pé. Eles NÃO vieram da Danielli.
 * Antes de publicar, confira modelo a modelo: o nome que a loja usa de
 * verdade, se a peça ainda está no acervo e se a descrição bate com o vestido.
 */
export const pecas: Peca[] = [
  /* ---------------------------------------------------------------- noiva */
  {
    slug: 'noiva-aurora',
    nome: 'Aurora',
    categoria: 'noiva',
    descricao: 'Renda com gola alta e manga longa',
    precoAluguel: null,
    cor: 'marfim',
    imagens: [
      '/pecas/aurora-renda-gola-alta.webp',
      '/pecas/aurora-renda-gola-alta-2.webp',
      '/pecas/aurora-renda-gola-alta-3.webp',
    ],
    destaque: true,
  },
  {
    slug: 'noiva-isadora',
    nome: 'Isadora',
    categoria: 'noiva',
    descricao: 'Decote V em renda, com véu longo',
    precoAluguel: null,
    cor: 'branco',
    imagens: [
      '/pecas/isadora-decote-v-com-veu.webp',
      '/pecas/isadora-decote-v-com-veu-2.webp',
      '/pecas/isadora-decote-v-com-veu-3.webp',
    ],
    destaque: true,
  },
  {
    slug: 'noiva-lorena',
    nome: 'Lorena',
    categoria: 'noiva',
    descricao: 'Manga longa em renda e costas com botões',
    precoAluguel: null,
    cor: 'marfim',
    imagens: [
      '/pecas/lorena-manga-longa-em-renda.webp',
      '/pecas/lorena-manga-longa-em-renda-2.webp',
    ],
  },
  {
    slug: 'noiva-valentina',
    nome: 'Valentina',
    categoria: 'noiva',
    descricao: 'Decote V com manga fluida em tule',
    precoAluguel: null,
    cor: 'marfim',
    imagens: [
      '/pecas/valentina-decote-v-manga-fluida.webp',
      '/pecas/valentina-decote-v-manga-fluida-2.webp',
    ],
    destaque: true,
  },
  {
    slug: 'noiva-beatriz',
    nome: 'Beatriz',
    categoria: 'noiva',
    descricao: 'Tule marfim com decote V',
    precoAluguel: null,
    cor: 'marfim',
    imagens: ['/pecas/beatriz-tule-marfim.webp'],
  },
  {
    slug: 'noiva-helena',
    nome: 'Helena',
    categoria: 'noiva',
    descricao: 'Ombros bordados e saia em tule',
    precoAluguel: null,
    cor: 'branco',
    imagens: ['/pecas/helena-ombros-bordados.webp'],
  },
  {
    slug: 'noiva-marina',
    nome: 'Marina',
    categoria: 'noiva',
    descricao: 'Ombro a ombro em renda',
    precoAluguel: null,
    cor: 'branco',
    imagens: [
      '/pecas/marina-ombro-a-ombro.webp',
      '/pecas/marina-ombro-a-ombro-2.webp',
    ],
  },
  {
    slug: 'noiva-rafaela',
    nome: 'Rafaela',
    categoria: 'noiva',
    descricao: 'Decote profundo com bordado',
    precoAluguel: null,
    cor: 'branco',
    imagens: [
      '/pecas/rafaela-decote-profundo-bordado.webp',
      '/pecas/rafaela-decote-profundo-bordado-2.webp',
    ],
  },
  {
    slug: 'noiva-clarice',
    nome: 'Clarice',
    categoria: 'noiva',
    descricao: 'Costas em ilusão e saia em tule',
    precoAluguel: null,
    cor: 'branco',
    imagens: [
      '/pecas/clarice-costas-em-ilusao.webp',
      '/pecas/clarice-costas-em-ilusao-2.webp',
    ],
  },
  {
    slug: 'noiva-antonia',
    nome: 'Antônia',
    categoria: 'noiva',
    descricao: 'Princesa ombro a ombro, com laço nas costas',
    precoAluguel: null,
    cor: 'branco',
    imagens: ['/pecas/antonia-princesa-ombro-a-ombro.webp'],
  },
  {
    slug: 'noiva-eloa',
    nome: 'Eloá',
    categoria: 'noiva',
    descricao: 'Renda com gola alta e saia ampla',
    precoAluguel: null,
    cor: 'marfim',
    imagens: [
      '/pecas/eloa-renda-gola-alta.webp',
      '/pecas/eloa-renda-gola-alta-2.webp',
    ],
  },
  {
    slug: 'noiva-julia',
    nome: 'Júlia',
    categoria: 'noiva',
    descricao: 'Manga longa fluida, sem brilho',
    precoAluguel: null,
    cor: 'branco',
    imagens: [
      '/pecas/julia-manga-longa-minimalista.webp',
      '/pecas/julia-manga-longa-minimalista-2.webp',
    ],
  },
  {
    slug: 'noiva-thais',
    nome: 'Thaís',
    categoria: 'noiva',
    descricao: 'Um ombro só, com babado estruturado',
    precoAluguel: null,
    cor: 'branco',
    imagens: [
      '/pecas/thais-um-ombro-so-com-babado.webp',
      '/pecas/thais-um-ombro-so-com-babado-2.webp',
    ],
  },
  {
    slug: 'noiva-sofia',
    nome: 'Sofia',
    categoria: 'noiva',
    descricao: 'Cauda longa e véu catedral',
    precoAluguel: null,
    cor: 'branco',
    imagens: [
      '/pecas/sofia-cauda-longa.webp',
      '/pecas/sofia-cauda-longa-2.webp',
    ],
  },
  {
    slug: 'noiva-luiza',
    nome: 'Luíza',
    categoria: 'noiva',
    descricao: 'Princesa com cauda em tule',
    precoAluguel: null,
    cor: 'branco',
    imagens: [
      '/pecas/luiza-princesa-com-cauda.webp',
      '/pecas/luiza-princesa-com-cauda-2.webp',
    ],
  },
  {
    slug: 'noiva-celeste',
    nome: 'Celeste',
    categoria: 'noiva',
    descricao: 'Renda bordada com pérolas',
    precoAluguel: null,
    cor: 'marfim',
    imagens: [
      '/pecas/celeste-renda-e-perolas.webp',
      '/pecas/celeste-renda-e-perolas-2.webp',
    ],
  },

  /* ---------------------------------------------------------------- festa */
  {
    slug: 'festa-manuela',
    nome: 'Manuela',
    categoria: 'festa',
    descricao: 'Tule pink com rosas no decote',
    precoAluguel: null,
    cor: 'rosa',
    imagens: ['/pecas/manuela-tule-com-rosas.webp'],
    destaque: true,
  },
  {
    slug: 'festa-olivia',
    nome: 'Olívia',
    categoria: 'festa',
    descricao: 'Cetim lilás, um ombro só',
    precoAluguel: null,
    cor: 'lilas',
    imagens: ['/pecas/olivia-cetim-um-ombro-so.webp'],
  },
  {
    slug: 'festa-carolina',
    nome: 'Carolina',
    categoria: 'festa',
    descricao: 'Glitter prata com babados na saia',
    precoAluguel: null,
    cor: 'prata',
    imagens: ['/pecas/carolina-glitter-com-babados.webp'],
    destaque: true,
  },
  {
    slug: 'festa-esmeralda',
    nome: 'Esmeralda',
    categoria: 'festa',
    descricao: 'Paetê verde com gola alta e manga longa',
    precoAluguel: null,
    cor: 'verde',
    imagens: ['/pecas/esmeralda-paete-verde.webp'],
  },
  {
    slug: 'festa-nicole',
    nome: 'Nicole',
    categoria: 'festa',
    descricao: 'Paetê marinho, tomara que caia',
    precoAluguel: null,
    cor: 'azul',
    imagens: ['/pecas/nicole-paete-marinho.webp'],
  },
  {
    slug: 'festa-bianca',
    nome: 'Bianca',
    categoria: 'festa',
    descricao: 'Azul sereno, para madrinhas',
    precoAluguel: null,
    cor: 'azul',
    imagens: ['/pecas/bianca-azul-sereno.webp'],
  },

  /* ------------------------------------------------------------ debutante */
  {
    slug: 'debutante-giovana',
    nome: 'Giovana',
    categoria: 'debutante',
    descricao: 'Dourado bordado com decote V',
    precoAluguel: null,
    cor: 'dourado',
    imagens: ['/pecas/giovana-dourado-bordado.webp'],
    destaque: true,
  },
  {
    slug: 'debutante-alice',
    nome: 'Alice',
    categoria: 'debutante',
    descricao: 'Dourado sereia, todo em brilho',
    precoAluguel: null,
    cor: 'dourado',
    imagens: ['/pecas/alice-dourado-sereia.webp'],
  },
  {
    slug: 'debutante-vitoria',
    nome: 'Vitória',
    categoria: 'debutante',
    descricao: 'Princesa marinho com saia ampla',
    precoAluguel: null,
    cor: 'azul',
    imagens: ['/pecas/vitoria-princesa-marinho.webp'],
  },
  {
    slug: 'debutante-laura',
    nome: 'Laura',
    categoria: 'debutante',
    descricao: 'Princesa prata em tule',
    precoAluguel: null,
    cor: 'prata',
    imagens: [
      '/pecas/laura-princesa-prata.webp',
      '/pecas/laura-princesa-prata-2.webp',
    ],
  },
  {
    slug: 'debutante-rebeca',
    nome: 'Rebeca',
    categoria: 'debutante',
    descricao: 'Sereia preto, todo bordado',
    precoAluguel: null,
    cor: 'preto',
    imagens: ['/pecas/rebeca-sereia-preto.webp'],
  },
]

/**
 * TODO OS AUXILIARES ABAIXO RECEBEM A LISTA, NÃO A IMPORTAM.
 *
 * Antes eles eram constantes derivadas direto do array `pecas`. Deixaram de
 * ser quando o painel administrativo entrou: com as edições da prévia
 * guardadas no navegador, a lista que o site exibe não é mais a que está
 * escrita neste arquivo — é a semente daqui mesclada com o que foi editado.
 * Ver lib/loja.tsx. Quem chama passa a lista viva, via `useLoja()`.
 *
 * A semente continua exportada porque o build precisa dela: scripts/seo.ts
 * monta o sitemap sem navegador, e ali só existe o que está no código.
 */

export function pecasDestaque(lista: Peca[]): Peca[] {
  return lista.filter((peca) => peca.destaque)
}

export function buscarPeca(lista: Peca[], slug: string): Peca | undefined {
  return lista.find((peca) => peca.slug === slug)
}

/** Categorias que de fato têm vestido cadastrado, evitando filtro vazio. */
export function categoriasDisponiveis(lista: Peca[]): CategoriaPeca[] {
  return (Object.keys(rotulosCategoria) as CategoriaPeca[]).filter((categoria) =>
    lista.some((peca) => peca.categoria === categoria),
  )
}

export function pecasPorCategoria(lista: Peca[], categoria: CategoriaPeca): Peca[] {
  return lista.filter((peca) => peca.categoria === categoria)
}

/** Cores que de fato têm vestido, pela mesma razão das categorias. */
export function coresDisponiveis(lista: Peca[]): CorPeca[] {
  return (Object.keys(rotulosCor) as CorPeca[]).filter((cor) =>
    lista.some((peca) => peca.cor === cor),
  )
}

/** Categorias para a vitrine da home, já com capa e contagem. */
export function categoriasVitrine(lista: Peca[]) {
  return categoriasDisponiveis(lista).map((categoria) => {
    const doGrupo = pecasPorCategoria(lista, categoria)
    return {
      categoria,
      rotulo: rotulosCategoria[categoria],
      capa: doGrupo[0].imagens[0],
      quantidade: doGrupo.length,
    }
  })
}

/**
 * Existe pelo menos um vestido com preço?
 *
 * Enquanto a resposta for não, o filtro de faixa de preço e a ordenação por
 * preço não aparecem no catálogo. Filtro que não filtra nada é pior que
 * filtro ausente: a cliente mexe, não acontece nada, e ela conclui que o site
 * está quebrado.
 */
export function temPreco(lista: Peca[]): boolean {
  return lista.some((peca) => peca.precoAluguel !== null)
}
