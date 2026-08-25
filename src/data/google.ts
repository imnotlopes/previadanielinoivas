/**
 * Dados do perfil da loja no Google.
 *
 * ATENÇÃO — DADOS DE PRÉVIA
 * -------------------------
 * NADA neste arquivo veio do Google. Nota, quantidade de avaliações e os dez
 * depoimentos abaixo foram ESCRITOS AQUI para o site poder ser visto de pé.
 *
 * Publicar depoimento inventado como se fosse de cliente é propaganda enganosa
 * — e, no caso de nota e contagem, é atribuir ao Google um número que ele não
 * deu. Antes do site ir ao ar, uma das duas coisas precisa acontecer:
 *
 *   1. abrir o Perfil da Empresa no Google e transcrever as avaliações reais,
 *      junto com a nota e o total que constam lá; ou
 *   2. esvaziar `avaliacoesGoogle` (`= []`) e zerar `totalAvaliacoes`, o que
 *      já tira o bloco de avaliações do ar sozinho.
 */
export const googleNegocio = {
  nome: 'Atelier Danielli Noivas',

  /**
   * TODO: PREENCHER ANTES DE PUBLICAR, a partir do Perfil da Empresa.
   * Enquanto endereço e cidade estiverem vazios, o bloco de endereço e o mapa
   * não aparecem — ver os guardas em components/SecaoGoogle.tsx.
   */
  endereco: '',
  cidade: '',
  estado: '',
  cep: '',

  /** TODO: FICTÍCIO. Copiar a nota e o total reais do perfil no Google. */
  nota: 5,
  totalAvaliacoes: 38,

  /** TODO: link do perfil no Google. Vazio esconde os botões que dependem dele. */
  url: '',

  /**
   * Busca pelo endereço completo, e não pelo nome, para o pin cair no lugar
   * certo mesmo que o perfil mude de nome. Fica vazio enquanto não houver
   * endereço, e nesse caso o mapa não é renderizado.
   */
  get mapaEmbed() {
    const completo = [this.endereco, this.cidade, this.estado, this.cep]
      .filter(Boolean)
      .join(', ')
    return completo
      ? `https://www.google.com/maps?q=${encodeURIComponent(completo)}&output=embed`
      : ''
  },

  /** TODO: conforme o perfil no Google. Deixe vazio para ocultar o bloco. */
  horarios: [] as Array<{ dias: string; horas: string }>,
}

export interface AvaliacaoGoogle {
  id: string
  autor: string
  /** Nota de 1 a 5, como consta no Google. */
  nota: number
  /** Texto integral, transcrito do perfil. Não edite o conteúdo alheio. */
  texto: string
  /** Como o Google exibe: "2 meses atrás", "um ano atrás". */
  quando: string
  /** Selo de Local Guide, quando o autor tiver. */
  localGuide?: boolean
}

/**
 * DEPOIMENTOS FICTÍCIOS — conteúdo de prévia, não publicar.
 *
 * Os `id` começam com `exemplo-` de propósito: enquanto houver um `exemplo-`
 * neste arquivo, o conteúdo ainda não é real. Ao transcrever as avaliações
 * verdadeiras do Google, troque o id pelo nome de quem escreveu, como no
 * restante do projeto.
 */
export const avaliacoesGoogle: AvaliacaoGoogle[] = [
  {
    id: 'exemplo-1',
    autor: 'Aline Ferreira',
    nota: 5,
    quando: '2 meses atrás',
    texto:
      'Fui provar sem nenhuma expectativa, só para ter ideia de preço, e saí de lá com o vestido reservado. Provei uns oito modelos com toda a calma do mundo, ninguém me apressou em momento nenhum. O que eu escolhi não era nem parecido com a foto que eu levei salva no celular.',
  },
  {
    id: 'exemplo-2',
    autor: 'Camila Duarte',
    nota: 5,
    quando: 'um mês atrás',
    localGuide: true,
    texto:
      'Atendimento maravilhoso do começo ao fim. O ajuste ficou perfeito, o vestido parecia feito para mim. Recebi elogio a festa inteira e ninguém acreditou que era alugado.',
  },
  {
    id: 'exemplo-3',
    autor: 'Renata Souza',
    nota: 5,
    quando: '3 meses atrás',
    texto:
      'Aluguei o vestido da minha filha para os 15 anos dela. Fomos muito bem atendidas, provamos com calma e o preço cabia no que a gente tinha. Ela se sentiu uma princesa.',
  },
  {
    id: 'exemplo-4',
    autor: 'Patrícia Nogueira',
    nota: 5,
    quando: '5 meses atrás',
    texto:
      'Sou madrinha de casamento com frequência e já é a terceira vez que alugo aqui. Sempre tem modelo novo e o acervo é muito bem cuidado. Nunca peguei vestido gasto ou com marca.',
  },
  {
    id: 'exemplo-5',
    autor: 'Jéssica Alves',
    nota: 5,
    quando: '6 meses atrás',
    texto:
      'Marquei a prova pelo WhatsApp e me responderam na hora. Chegando lá já tinham separado alguns modelos dentro do que eu tinha descrito. Isso economizou meu tempo e me deixou muito à vontade.',
  },
  {
    id: 'exemplo-6',
    autor: 'Bruna Carvalho',
    nota: 5,
    quando: '7 meses atrás',
    texto:
      'O que me ganhou foi a sinceridade. Eu estava decidida em um modelo e me disseram com todo o cuidado que outro cairia melhor em mim. Provei e era verdade. Confiei e não me arrependi.',
  },
  {
    id: 'exemplo-7',
    autor: 'Larissa Pimenta',
    nota: 5,
    quando: '8 meses atrás',
    localGuide: true,
    texto:
      'Casei em dezembro e o vestido chegou impecável, passado e embalado. A devolução também foi simples, sem burocracia nenhuma. Recomendo de olhos fechados.',
  },
  {
    id: 'exemplo-8',
    autor: 'Vanessa Rocha',
    nota: 5,
    quando: '9 meses atrás',
    texto:
      'Emagreci quase seis quilos entre a reserva e o casamento e refizeram o ajuste sem cobrar nada a mais. Isso para mim valeu mais do que qualquer desconto.',
  },
  {
    id: 'exemplo-9',
    autor: 'Débora Martins',
    nota: 5,
    quando: 'um ano atrás',
    texto:
      'Loja linda, organizada e com uma variedade muito maior do que aparenta pela frente. Vale a visita mesmo que você já tenha ido em outras.',
  },
  {
    id: 'exemplo-10',
    autor: 'Simone Barbosa',
    nota: 5,
    quando: 'um ano atrás',
    texto:
      'Levei minha mãe e minha irmã junto e todo mundo foi bem recebido, com café e paciência para a nossa indecisão. Saí com o vestido e com o véu combinando.',
  },
]
