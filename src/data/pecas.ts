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

  /**
   * Numeração disponível daquele vestido: `['38', '40', '42']`.
   *
   * É a SEGUNDA PERGUNTA de toda cliente, depois do preço, e por isso é campo
   * de primeira classe e não observação solta na descrição. Lista vazia quer
   * dizer "ainda não informada", e nesse caso a tela some com a linha em vez
   * de mostrar um rótulo vazio.
   *
   * TODO: a Danielli confirmou ter a numeração de todas as fotos. Preencher.
   */
  numeracao: string[]

  /**
   * Ocasião, só dentro de festa. A cliente de festa não é uma só: formanda de
   * alto padrão, formatura, madrinha e mãe procuram coisas diferentes e é
   * assim que a loja separa a arara. Em vestido de noiva não se aplica.
   */
  ocasiao?: OcasiaoFesta

  /**
   * Vídeo do vestido em movimento. Link do Instagram/YouTube ou caminho de
   * arquivo em /public. Vestido parado na foto e vestido andando são coisas
   * diferentes, e é o vídeo que fecha a dúvida sobre caimento.
   */
  video?: string

  /**
   * FICHA TÉCNICA — o vocabulário da arara.
   * ---------------------------------------
   * Estes quatro campos são a linguagem que a Danielli usa de pé na loja, ao
   * lado da noiva: "esse é sereia", "esse tem manga longa", "esse é tomara
   * que caia". Não são adjetivos de catálogo, são a forma como a escolha
   * acontece de verdade — a noiva chega dizendo "não quero nada tomara que
   * caia" e isso, sozinho, corta metade da arara.
   *
   * Por isso são campo, e não texto solto na descrição: campo vira filtro, e
   * o filtro é o que transforma um catálogo de 40 vestidos numa conversa de
   * três.
   *
   * TODOS OPCIONAIS, E TODOS VAZIOS HOJE. A ficha esconde a linha que não tem
   * valor, e o filtro só aparece quando existe vestido classificado. Preencher
   * exige a Danielli olhando peça por peça: deduzir silhueta de foto é o tipo
   * de erro que a noiva descobre vestindo.
   */
  silhueta?: Silhueta
  decote?: Decote
  manga?: Manga
  /** Comprimento da cauda, quando existe. */
  cauda?: Cauda

  /**
   * HERO DA FICHA — duas fotos, uma por formato de tela.
   *
   * Só os vestidos que têm história ganham hero. Um acervo em que todo mundo
   * abre com foto de tela cheia não destaca ninguém.
   *
   * São DUAS fotos, e não uma redimensionada: uma hero de tela cheia é
   * retângulo em pé no celular e faixa deitada no computador, e a mesma foto
   * não serve nos dois. A horizontal cortada em retrato perde 60% da largura;
   * a vertical esticada em faixa mostra o umbigo da noiva. Servidas por
   * `<picture media>`, que — ao contrário do `<source media>` de vídeo —
   * funciona.
   */
  hero?: { largo: string; alto: string }

  /**
   * Uma linha sobre o vestido que não é descrição de produto.
   *
   * É onde entra o que torna a peça diferente das outras trinta e nove: quem
   * já casou com ela, de onde ela veio. Vazio na esmagadora maioria — história
   * inventada para dar corpo ao catálogo é o tipo de frase que a noiva
   * descobre sendo falsa na loja.
   */
  historia?: string

  /**
   * A CURADORIA.
   *
   * Nem todo vestido do acervo entra no catálogo que a cliente recebe — a
   * regra da Danielli é que só entra o que tem foto profissional. Este campo
   * é o interruptor disso, e ela liga e desliga do celular no painel.
   *
   * O acervo interno pode (e deve) ser maior que o catálogo publicado.
   */
  publicado: boolean
}

/**
 * Ocasiões dentro de festa.
 *
 * Existem porque a loja atende quatro clientes diferentes sob o mesmo rótulo,
 * com necessidade e orçamento distintos. Noiva não entra aqui: ela tem peça
 * própria.
 */
export type OcasiaoFesta = 'formanda' | 'formatura' | 'madrinha' | 'mae'

export const rotulosOcasiao: Record<OcasiaoFesta, string> = {
  formanda: 'Formanda',
  formatura: 'Formatura',
  madrinha: 'Madrinha',
  mae: 'Mãe',
}

/**
 * SILHUETA — o formato do vestido no corpo.
 *
 * A lista é curta por decisão, não por preguiça. Uma taxonomia de estilista
 * (trompete, semi-sereia, evasê, império…) é precisa e inútil aqui: a noiva
 * não filtra pelo que não sabe nomear. Estes cinco cobrem o que se ouve na
 * loja, e o que não couber neles fica sem silhueta em vez de ser forçado.
 */
export type Silhueta = 'sereia' | 'princesa' | 'reto' | 'rodado' | 'justo'

export const rotulosSilhueta: Record<Silhueta, string> = {
  sereia: 'Sereia',
  princesa: 'Princesa',
  reto: 'Reto',
  rodado: 'Rodado',
  justo: 'Justo',
}

/** DECOTE — depois da silhueta, é a segunda coisa que a noiva descarta. */
export type Decote = 'tomara-que-caia' | 'v' | 'ilusao' | 'gola-alta' | 'ombro-a-ombro' | 'coracao'

export const rotulosDecote: Record<Decote, string> = {
  'tomara-que-caia': 'Tomara que caia',
  v: 'Decote V',
  ilusao: 'Decote ilusão',
  'gola-alta': 'Gola alta',
  'ombro-a-ombro': 'Ombro a ombro',
  coracao: 'Coração',
}

/** MANGA — o filtro de quem casa de dia, na igreja ou no calor. */
export type Manga = 'sem-manga' | 'alca-fina' | 'alca-larga' | 'curta' | 'tres-quartos' | 'longa'

export const rotulosManga: Record<Manga, string> = {
  'sem-manga': 'Sem manga',
  'alca-fina': 'Alça fina',
  'alca-larga': 'Alça larga',
  curta: 'Manga curta',
  'tres-quartos': 'Três quartos',
  longa: 'Manga longa',
}

/** CAUDA — muda o preço do buquê, do carro e da igreja. Não é detalhe. */
export type Cauda = 'sem-cauda' | 'curta' | 'media' | 'longa'

export const rotulosCauda: Record<Cauda, string> = {
  'sem-cauda': 'Sem cauda',
  curta: 'Cauda curta',
  media: 'Cauda média',
  longa: 'Cauda longa',
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
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/aurora-renda-gola-alta.webp',
      '/pecas/aurora-renda-gola-alta-2.webp',
      '/pecas/aurora-renda-gola-alta-3.webp',
      /* Da cobertura do casamento da Natália: as costas de perfil, a igreja
         com o véu aberto, e o vestido em movimento na festa. */
      '/pecas/aurora-casamento.webp',
      '/pecas/aurora-casamento-2.webp',
      '/pecas/aurora-casamento-3.webp',
    ],
    destaque: true,

    /*
      O VESTIDO DA CAPA.

      A Danielli pediu a filha, Natália, como capa do catálogo — e a Aurora é
      o vestido que ela usou. É o argumento de autoridade mais forte que a
      loja tem, e não custa nada dizer: quando a filha da dona casou, casou
      com uma peça do acervo da casa.

      TODO: confirmar a frase com a Danielli antes de publicar, e confirmar
      com a Natália a autorização de aparecer com o nome.
    */
    hero: {
      largo: '/casamentos/aurora-hero.webp',
      alto: '/casamentos/aurora-hero-alto.webp',
    },
    historia:
      'Foi o vestido que a Natália, filha da Danielli, escolheu para o próprio casamento.',
  },
  {
    slug: 'noiva-isadora',
    nome: 'Isadora',
    categoria: 'noiva',
    descricao: 'Decote V em renda, com véu longo',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
    imagens: ['/pecas/beatriz-tule-marfim.webp'],
  },
  {
    slug: 'noiva-helena',
    nome: 'Helena',
    categoria: 'noiva',
    descricao: 'Ombros bordados e saia em tule',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: ['/pecas/helena-ombros-bordados.webp'],
  },
  {
    slug: 'noiva-marina',
    nome: 'Marina',
    categoria: 'noiva',
    descricao: 'Ombro a ombro em renda',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
    imagens: ['/pecas/antonia-princesa-ombro-a-ombro.webp'],
  },
  {
    slug: 'noiva-eloa',
    nome: 'Eloá',
    categoria: 'noiva',
    descricao: 'Renda com gola alta e saia ampla',
    precoAluguel: null,
    cor: 'marfim',
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/celeste-renda-e-perolas.webp',
      '/pecas/celeste-renda-e-perolas-2.webp',
    ],
  },

  /* ------------------------------------------------------------------------
     Vestidos vindos do material dos fotógrafos.

     Agrupados por peça a partir das folhas de contato (ver
     scripts/importar-fotografos.mjs). NOMES INVENTADOS, como os de cima —
     são um ponto de partida para a Danielli corrigir, junto com a numeração
     e a cor de cada um.

     Onde a certeza de ser o mesmo vestido era menor, a peça entrou sozinha em
     vez de ser juntada a outra: juntar depois é uma linha; separar um vestido
     que virou dois na cabeça da cliente é conversa ruim no balcão.
     ---------------------------------------------------------------------- */
  {
    slug: 'noiva-alicia',
    nome: 'Alícia',
    categoria: 'noiva',
    descricao: 'Renda com manga longa e decote ilusão',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/alicia-renda-manga-longa.webp',
      '/pecas/alicia-renda-manga-longa-2.webp',
      '/pecas/alicia-renda-manga-longa-3.webp',
    ],
  },
  {
    slug: 'noiva-amanda',
    nome: 'Amanda',
    categoria: 'noiva',
    descricao: 'Renda com decote ilusão e saia em tule',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/amanda-renda-decote-ilusao.webp',
    ],
  },
  {
    slug: 'noiva-bruna',
    nome: 'Bruna',
    categoria: 'noiva',
    descricao: 'Renda com manga longa e saia ampla',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/bruna-renda-manga-longa-saia-ampla.webp',
      '/pecas/bruna-renda-manga-longa-saia-ampla-2.webp',
    ],
  },
  {
    slug: 'noiva-catarina',
    nome: 'Catarina',
    categoria: 'noiva',
    descricao: 'Costas em renda com cauda longa',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/catarina-costas-em-renda-cauda-longa.webp',
    ],
  },
  {
    slug: 'noiva-cecilia',
    nome: 'Cecília',
    categoria: 'noiva',
    descricao: 'Alça larga com decote coração e saia em tule',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/cecilia-alca-larga-saia-em-tule.webp',
    ],
  },
  {
    slug: 'noiva-daniela',
    nome: 'Daniela',
    categoria: 'noiva',
    descricao: 'Renda com manga longa e decote V',
    precoAluguel: null,
    cor: 'marfim',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/daniela-renda-manga-longa-decote-v.webp',
    ],
  },
  {
    slug: 'noiva-elisa',
    nome: 'Elisa',
    categoria: 'noiva',
    descricao: 'Manga curta em renda com cinto bordado',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/elisa-manga-curta-cinto-bordado.webp',
    ],
  },
  {
    slug: 'noiva-emanuelle',
    nome: 'Emanuelle',
    categoria: 'noiva',
    descricao: 'Ombro a ombro em renda',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/emanuelle-ombro-a-ombro-em-renda.webp',
      '/pecas/emanuelle-ombro-a-ombro-em-renda-2.webp',
      '/pecas/emanuelle-ombro-a-ombro-em-renda-3.webp',
    ],
  },
  {
    slug: 'noiva-fernanda',
    nome: 'Fernanda',
    categoria: 'noiva',
    descricao: 'Decote V sem manga, saia em tule',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/fernanda-decote-v-sem-manga.webp',
      '/pecas/fernanda-decote-v-sem-manga-2.webp',
    ],
  },
  {
    slug: 'noiva-gabriela',
    nome: 'Gabriela',
    categoria: 'noiva',
    descricao: 'Renda com manga longa e véu',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/gabriela-renda-manga-longa-com-veu.webp',
      '/pecas/gabriela-renda-manga-longa-com-veu-2.webp',
    ],
  },
  {
    slug: 'noiva-heloisa',
    nome: 'Heloísa',
    categoria: 'noiva',
    descricao: 'Renda com decote ilusão e manga longa',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/heloisa-renda-decote-ilusao.webp',
    ],
  },
  {
    slug: 'noiva-ingrid',
    nome: 'Ingrid',
    categoria: 'noiva',
    descricao: 'Renda com saia ampla e costas em ilusão',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/ingrid-renda-saia-ampla.webp',
      '/pecas/ingrid-renda-saia-ampla-2.webp',
      '/pecas/ingrid-renda-saia-ampla-3.webp',
    ],
  },
  {
    slug: 'noiva-joana',
    nome: 'Joana',
    categoria: 'noiva',
    descricao: 'Decote V com cinto e saia em tule',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/joana-decote-v-com-cinto.webp',
      '/pecas/joana-decote-v-com-cinto-2.webp',
    ],
  },
  {
    slug: 'noiva-larissa',
    nome: 'Larissa',
    categoria: 'noiva',
    descricao: 'Costas em ilusão com botões',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/larissa-costas-em-ilusao-com-botoes.webp',
      '/pecas/larissa-costas-em-ilusao-com-botoes-2.webp',
    ],
  },
  {
    slug: 'noiva-leticia',
    nome: 'Letícia',
    categoria: 'noiva',
    descricao: 'Ombro a ombro em tule',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/leticia-ombro-a-ombro-em-tule.webp',
      '/pecas/leticia-ombro-a-ombro-em-tule-2.webp',
      '/pecas/leticia-ombro-a-ombro-em-tule-3.webp',
      '/pecas/leticia-ombro-a-ombro-em-tule-4.webp',
    ],
  },
  {
    slug: 'noiva-malu',
    nome: 'Malu',
    categoria: 'noiva',
    descricao: 'Renda com manga longa e véu catedral',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/malu-renda-manga-longa-veu-catedral.webp',
      '/pecas/malu-renda-manga-longa-veu-catedral-2.webp',
      '/pecas/malu-renda-manga-longa-veu-catedral-3.webp',
    ],
    destaque: true,
  },
  {
    slug: 'noiva-mariana',
    nome: 'Mariana',
    categoria: 'noiva',
    descricao: 'Bordado brilhante com manga longa',
    precoAluguel: null,
    cor: 'marfim',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/mariana-bordado-manga-longa.webp',
      '/pecas/mariana-bordado-manga-longa-2.webp',
      '/pecas/mariana-bordado-manga-longa-3.webp',
      '/pecas/mariana-bordado-manga-longa-4.webp',
    ],
    destaque: true,
  },
  {
    slug: 'noiva-nina',
    nome: 'Nina',
    categoria: 'noiva',
    descricao: 'Sereia em renda',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/nina-sereia-em-renda.webp',
    ],
  },
  {
    slug: 'noiva-paula',
    nome: 'Paula',
    categoria: 'noiva',
    descricao: 'Renda com manga longa e decote redondo',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/paula-renda-manga-longa-decote-redondo.webp',
      '/pecas/paula-renda-manga-longa-decote-redondo-2.webp',
    ],
  },
  {
    slug: 'noiva-pietra',
    nome: 'Pietra',
    categoria: 'noiva',
    descricao: 'Manga curta com véu longo',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/pietra-manga-curta-veu-longo.webp',
      '/pecas/pietra-manga-curta-veu-longo-2.webp',
    ],
  },
  {
    slug: 'noiva-renata',
    nome: 'Renata',
    categoria: 'noiva',
    descricao: 'Corpo bordado ombro a ombro',
    precoAluguel: null,
    cor: 'marfim',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/renata-corpo-bordado-ombro-a-ombro.webp',
    ],
  },
  {
    slug: 'noiva-sarah',
    nome: 'Sarah',
    categoria: 'noiva',
    descricao: 'Decote V em renda com saia ampla',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/sarah-decote-v-em-renda.webp',
    ],
  },
  {
    slug: 'noiva-talita',
    nome: 'Talita',
    categoria: 'noiva',
    descricao: 'Costas em V bordado',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/talita-costas-em-v-bordado.webp',
      '/pecas/talita-costas-em-v-bordado-2.webp',
    ],
  },
  {
    slug: 'noiva-yasmin',
    nome: 'Yasmin',
    categoria: 'noiva',
    descricao: 'Manga longa em ilusão',
    precoAluguel: null,
    cor: 'branco',
    numeracao: [],
    publicado: true,
    imagens: [
      '/pecas/yasmin-manga-longa-em-ilusao.webp',
      '/pecas/yasmin-manga-longa-em-ilusao-2.webp',
      '/pecas/yasmin-manga-longa-em-ilusao-3.webp',
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
    imagens: ['/pecas/olivia-cetim-um-ombro-so.webp'],
  },
  {
    slug: 'festa-carolina',
    nome: 'Carolina',
    categoria: 'festa',
    descricao: 'Glitter prata com babados na saia',
    precoAluguel: null,
    cor: 'prata',
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
    imagens: ['/pecas/esmeralda-paete-verde.webp'],
  },
  {
    slug: 'festa-nicole',
    nome: 'Nicole',
    categoria: 'festa',
    descricao: 'Paetê marinho, tomara que caia',
    precoAluguel: null,
    cor: 'azul',
    numeracao: [],
    publicado: true,
    imagens: ['/pecas/nicole-paete-marinho.webp'],
  },
  {
    slug: 'festa-bianca',
    nome: 'Bianca',
    categoria: 'festa',
    descricao: 'Azul sereno, para madrinhas',
    precoAluguel: null,
    cor: 'azul',
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
    imagens: ['/pecas/alice-dourado-sereia.webp'],
  },
  {
    slug: 'debutante-vitoria',
    nome: 'Vitória',
    categoria: 'debutante',
    descricao: 'Princesa marinho com saia ampla',
    precoAluguel: null,
    cor: 'azul',
    numeracao: [],
    publicado: true,
    imagens: ['/pecas/vitoria-princesa-marinho.webp'],
  },
  {
    slug: 'debutante-laura',
    nome: 'Laura',
    categoria: 'debutante',
    descricao: 'Princesa prata em tule',
    precoAluguel: null,
    cor: 'prata',
    numeracao: [],
    publicado: true,
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
    numeracao: [],
    publicado: true,
    imagens: ['/pecas/rebeca-sereia-preto.webp'],
  },
]

/**
 * TODOS OS AUXILIARES ABAIXO RECEBEM A LISTA, NÃO A IMPORTAM.
 *
 * Antes eles eram constantes derivadas direto do array `pecas`. Deixaram de
 * ser quando o painel administrativo entrou: com as edições guardadas no
 * navegador, a lista que a tela exibe não é mais a que está escrita neste
 * arquivo — é a semente daqui mesclada com o que foi editado. Ver lib/loja.ts.
 * Quem chama passa a lista viva, via `useLoja()`.
 *
 * A semente continua exportada porque o build precisa dela: scripts/seo.ts
 * monta o sitemap sem navegador, e ali só existe o que está no código.
 */

/**
 * O FILTRO DA CURADORIA — passa em todo lugar que a cliente enxerga.
 *
 * O acervo interno é maior que o catálogo publicado: entra no catálogo só o
 * que tem foto profissional, e quem decide isso é a Danielli, no painel.
 *
 * A regra prática: TELA DE CLIENTE chama `publicadas()` antes de qualquer
 * outra coisa; TELA DE PAINEL usa a lista crua, porque lá o ponto é
 * justamente ver e mexer no que está oculto.
 */
export function publicadas(lista: Peca[]): Peca[] {
  return lista.filter((peca) => peca.publicado)
}

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

/** Numerações que de fato existem na lista, já ordenadas. */
export function numeracoesDisponiveis(lista: Peca[]): string[] {
  const todas = new Set<string>()
  for (const peca of lista) for (const n of peca.numeracao) todas.add(n)
  return [...todas].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b, 'pt-BR'))
}

/** Ocasiões que de fato existem na lista. */
export function ocasioesDisponiveis(lista: Peca[]): OcasiaoFesta[] {
  return (Object.keys(rotulosOcasiao) as OcasiaoFesta[]).filter((ocasiao) =>
    lista.some((peca) => peca.ocasiao === ocasiao),
  )
}

/**
 * Silhuetas que de fato existem na lista, na ordem dos rótulos.
 *
 * Como todo grupo de filtro deste catálogo, devolve lista vazia enquanto
 * ninguém classificou nada — e um grupo vazio não é desenhado. Filtro que não
 * filtra nada é pior que filtro nenhum: ele promete um corte que não existe.
 */
export function silhuetasDisponiveis(lista: Peca[]): Silhueta[] {
  return (Object.keys(rotulosSilhueta) as Silhueta[]).filter((silhueta) =>
    lista.some((peca) => peca.silhueta === silhueta),
  )
}

/** Decotes que de fato existem na lista. */
export function decotesDisponiveis(lista: Peca[]): Decote[] {
  return (Object.keys(rotulosDecote) as Decote[]).filter((decote) =>
    lista.some((peca) => peca.decote === decote),
  )
}

/** Mangas que de fato existem na lista. */
export function mangasDisponiveis(lista: Peca[]): Manga[] {
  return (Object.keys(rotulosManga) as Manga[]).filter((manga) =>
    lista.some((peca) => peca.manga === manga),
  )
}

/** Categorias para a vitrine, já com capa e contagem. */
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
 * Enquanto a resposta for não, a ordenação por preço não aparece no catálogo.
 * Filtro que não filtra nada é pior que filtro ausente: a cliente mexe, não
 * acontece nada, e ela conclui que o site está quebrado. A mesma lógica vale
 * para `numeracoesDisponiveis` e `ocasioesDisponiveis` acima.
 */
export function temPreco(lista: Peca[]): boolean {
  return lista.some((peca) => peca.precoAluguel !== null)
}
