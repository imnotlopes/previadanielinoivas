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
 * Só o que seria diferente entre uma apresentação e outra. A mecânica (grade,
 * overlay, seleção, mensagem) vive nos componentes.
 *
 * A frase de origem é o item menos vistoso e o mais importante: é ela que faz
 * a Danielli saber de qual link veio cada contato, sem instalar ferramenta
 * nenhuma de análise.
 */
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
   * Como a mensagem de WhatsApp se apresenta.
   *
   * "Vi a apresentação de noivas" é o carimbo de origem na mensagem que chega
   * para a Danielli. Com uma apresentação só ele não separa nada ainda, e é
   * exatamente por isso que continua aqui: no dia da segunda, os contatos já
   * chegam separados desde a primeira mensagem, sem migração nenhuma.
   */
  origem: string

  /** Quando não há peça visível ainda. Some quando houver. */
  semPecas?: string
}

/**
 * QUANTAS PEÇAS CADA APRESENTAÇÃO MOSTRA.
 *
 * O acervo tem 40 vestidos de noiva. Mostrar os 40 transformaria a
 * apresentação de volta em catálogo, que é justamente o que ela deixou de
 * ser: quarenta cards sem filtro e sem busca não é amostra, é lista.
 *
 * Doze é o teto do brief e o limite prático de uma leitura de dois minutos no
 * polegar. Quem escolhe QUAIS doze é a Danielli, pelo `destaque` no painel:
 * destacadas primeiro, o resto na ordem do acervo.
 */
export const PECAS_POR_APRESENTACAO = 12

export const apresentacoes: Apresentacao[] = [
  {
    publico: 'noivas',
    rota: '/noivas',
    titulo: 'Vestidos de noiva',
    descricao:
      'Alguns dos modelos do ateliê, com prova com hora marcada, ajuste incluso e a data do seu casamento reservada.',
    capa: {
      largo: '/casamentos/aurora-hero.webp',
      alto: '/casamentos/aurora-hero-alto.webp',
      alt: 'Noiva sentada, de vestido de renda com gola alta e manga longa, no dia do casamento.',
    },
    ogImagem: '/og-noiva.jpg',
    palavra: 'Noivas',
    saudacao: 'Que bom que você chegou até aqui',
    posicionamento:
      'Separei alguns modelos para você ver. O ateliê tem muito mais, e o melhor é provar.',
    origem: 'a apresentação de noivas',
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
