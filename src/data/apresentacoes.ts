import type { Publico } from './pecas'

/**
 * A APRESENTAÇÃO.
 * ===============
 *
 * Cada uma é um link que a Danielli cola numa conversa de WhatsApp já em
 * andamento. Ninguém chega aqui pelo Google: a pessoa já a procurou, e agora
 * está esperando ver alguma coisa.
 *
 * Isso muda tudo em relação a um site. A peça não precisa explicar o que é um
 * ateliê nem se apresentar ao mundo. Ela tem três trabalhos: criar desejo,
 * provar autoridade, e devolver a pessoa para a conversa com a escolha feita.
 *
 * ERAM TRÊS, E HOJE É UMA
 * -----------------------
 * A de madrinhas e a de noivos saíram do produto. A de madrinhas nunca teve
 * capa própria, usava um vestido de festa do acervo como provisório; a de
 * noivos nunca teve uma única foto de traje masculino. Nesse estado elas não
 * eram material de venda, eram rascunho com URL, e URL vaza.
 *
 * A estrutura de LISTA fica, e é o ponto: o dia em que uma delas voltar, ela
 * é uma entrada aqui, e nada mais precisa mudar. As duas que saíram estão no
 * histórico do git.
 *
 * O QUE MORA AQUI, E POR QUÊ
 * --------------------------
 * Só o que seria diferente entre uma apresentação e outra. A mecânica vive
 * nos componentes.
 *
 * Havia aqui uma frase de origem ("Vi a apresentação de noivas") que ia
 * dentro da mensagem de WhatsApp pré-escrita, para a Danielli saber de qual
 * link veio o contato. Saiu com os botões: a noiva já está na conversa quando
 * abre o link, então a Danielli sabe de onde ela veio porque foi ela quem
 * mandou.
 */
/**
 * Uma foto da sequência de modelos: a peça e o recorte que a representa.
 *
 * O recorte mostra um detalhe (o bordado, a renda, o laço) e não o vestido
 * inteiro, pela regra da Danielli. Sai de scripts/recortes.mjs.
 */
export interface Destaque {
  codigo: string
  recorte: string
}

export interface Apresentacao {
  publico: Publico
  /** Rota e nome do HTML: `/noivas` sai de `noivas.html`. */
  rota: string

  /**
   * Título da aba e `og:title`, SEM o nome da marca.
   *
   * Quem acrescenta " | Danielli Noivas" é o componente de SEO. Repetir aqui
   * dava "Vestidos de noiva | Danielli Noivas | Danielli Noivas" no cartão do
   * WhatsApp, que é onde o título mais aparece.
   */
  titulo: string
  /** `og:description`. Uma linha, lida antes de a página abrir. */
  descricao: string

  /**
   * Capa. Se um dia houver mais de uma apresentação, elas precisam ser
   * DIFERENTES: o cartão do WhatsApp é a primeira impressão, e dois links com
   * a mesma foto denunciam que é o mesmo material reetiquetado.
   *
   * `largo` é a imagem de compartilhamento e a capa em tela deitada; `alto` é
   * a capa em tela em pé. A mesma foto não serve nas duas, ver `<picture>` em
   * components/CapaApresentacao.
   */
  capa: { largo: string; alto: string; alt: string } | null
  /** Imagem do cartão de WhatsApp. Absoluta na hora de montar a tag. */
  ogImagem: string

  /**
   * A PALAVRA GRANDE DA CAPA.
   *
   * Uma só, em corpo colossal, encostada no rodapé da abertura. Ela não
   * explica nada e não precisa: diz de quem é aquela apresentação antes de
   * qualquer frase ser lida, e é o que transforma a capa em folha de rosto de
   * revista em vez de topo de página.
   *
   * Curta obrigatoriamente. A classe `.texto-colosso` divide a largura da
   * linha pelo número de letras, então palavra comprida não estoura, ela
   * ENCOLHE, e a partir de umas doze letras o efeito se perde inteiro.
   */
  palavra: string

  /** Abertura sem `?nome=` na URL. */
  saudacao: string
  /** Com `?nome=Camila`, vira "Camila," antes desta linha. */
  posicionamento: string

  /**
   * As cinco fotos da sequência de modelos, na ordem em que aparecem.
   *
   * Escolhidas a dedo, e não as cinco primeiras da ordem do acervo, porque o
   * critério aqui é outro: a Danielli pediu detalhe e curiosidade, e não
   * vestido inteiro de frente. Cidade pequena, ela atende a região, e a noiva
   * que já viu o vestido todo chega dizendo "esse eu já vi".
   *
   * Um código que sumir do acervo é completado pela ordem normal, ver
   * `montarFluxo` em lib/fluxo.ts.
   */
  destaques: readonly Destaque[]

  /** Quando não há peça visível ainda. Some quando houver. */
  semPecas?: string
}

export const apresentacoes: Apresentacao[] = [
  {
    publico: 'noivas',
    rota: '/noivas',
    titulo: 'Vestidos de noiva',
    /*
      É o texto do cartão que o WhatsApp monta quando a Danielli cola o link,
      a primeira coisa que a noiva lê. Antes era uma lista de garantias, e
      nenhuma delas foi confirmada com a Danielli. Agora é um convite, e está
      repetido à mão nas tags de noivas.html, porque o robô do WhatsApp não
      executa JavaScript.
    */
    descricao: 'Um pouquinho do nosso ateliê para você conhecer antes de vir provar.',
    /*
      Era a Aurora sentada com o vestido inteiro aberto, do colo à barra, e
      era a primeira e maior imagem da página: exatamente o que a Danielli
      pediu para não fazer. Agora é o close dela de costas, a gola de renda e
      o buquê. Ver scripts/recortes.mjs.
    */
    capa: {
      largo: '/capa/aurora-largo.webp',
      alto: '/capa/aurora-alto.webp',
      alt: 'Noiva de costas olhando por cima do ombro, com gola alta de renda, véu e buquê.',
    },
    ogImagem: '/og-noiva.jpg',
    /*
      Setembro de 2026, escolhidas olhando as doze lado a lado:

        N-33 Mariana   bordado de perto, olhar baixo: o detalhe mais íntimo
        N-03 Lorena    renda da manga com o buquê, sorriso aberto
        N-08 Rafaela   sendo vestida, de coroa: a única que conta o antes
        N-06 Helena    rosto e o bordado do ombro
        N-10 Antonia   de costas, saindo pela porta azul: fecha a sequência
                       logo antes da frase da Danielli

      De fora: a Aurora, porque a capa já é ela (mesma noiva, outra foto); a
      Malu, vestido inteiro de frente, que é o que a Danielli pediu para
      evitar; e a Valentina, com cara de foto de catálogo de fornecedor.
    */
    destaques: [
      { codigo: 'N-33', recorte: '/recortes/mariana-bordado.webp' },
      { codigo: 'N-03', recorte: '/recortes/lorena-renda-da-manga.webp' },
      { codigo: 'N-08', recorte: '/recortes/rafaela-coroa-e-decote.webp' },
      { codigo: 'N-06', recorte: '/recortes/helena-ombro-bordado.webp' },
      { codigo: 'N-10', recorte: '/recortes/antonia-laco-nas-costas.webp' },
    ],
    palavra: 'Noivas',
    saudacao: 'Que bom que você chegou até aqui',
    posicionamento:
      'Separei um pouquinho do nosso ateliê para você conhecer. O resto é pessoalmente, com calma, do jeito que um vestido de noiva merece.',
  },
]

export function apresentacaoDe(publico: Publico): Apresentacao {
  const achada = apresentacoes.find((a) => a.publico === publico)
  if (!achada) throw new Error(`apresentação não configurada: ${publico}`)
  return achada
}

/**
 * Lê o `?nome=` da URL, ou devolve vazio.
 *
 * O valor vem de um link que a Danielli monta na mão e cola no WhatsApp, então
 * chega como ela digitou. Vai direto para dentro do HTML, e por isso passa por
 * aqui.
 *
 * RECUSA, EM VEZ DE LIMPAR
 * ------------------------
 * A primeira versão apagava o que não era letra e usava o resto. Com uma
 * tentativa de injeção na URL, a saudação virava "img srcx onerroralert An,
 * que bom que você chegou": inofensivo, e horrível.
 *
 * Ou o parâmetro é um nome, ou não é. Qualquer coisa fora de letra, espaço,
 * hífen e apóstrofo derruba tudo e a abertura mostra a versão neutra, que
 * está sempre correta. Um link que a Danielli escreve nunca tem outra coisa.
 *
 * O corte em 24 caracteres é de layout, não de segurança: nome maior que isso
 * quebra a linha da saudação em corpo de display no celular.
 */
export function nomeSanitizado(bruto: string | null): string {
  if (!bruto) return ''

  const limpo = bruto.replace(/\s+/g, ' ').trim()
  if (!limpo || limpo.length > 24) return ''
  if (!/^[\p{L}][\p{L}\s'-]*$/u.test(limpo)) return ''

  return limpo
}
