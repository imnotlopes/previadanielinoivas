/**
 * Dados do perfil da loja no Google.
 *
 * Tudo aqui está vazio à espera do real. Nada é inventado, e nada deve voltar
 * a ser: este arquivo alimenta um bloco que diz à noiva o que outras pessoas
 * acharam da loja, e é a última coisa do projeto que pode ser suposição.
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

  /** TODO: copiar a nota e o total reais do Perfil da Empresa no Google. */
  nota: 0,
  totalAvaliacoes: 0,

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
 * VAZIO DE PROPÓSITO — não era, e foi esvaziado.
 *
 * Este arquivo continha 12 avaliações inventadas, mais `nota: 5` e
 * `totalAvaliacoes: 38` que o Google nunca deu. Serviam para o site poder ser
 * visto de pé enquanto era prévia.
 *
 * Deixaram de servir quando as peças passaram a ser links que a Danielli manda
 * direto para o WhatsApp de uma noiva: publicar avaliação inventada como real
 * é propaganda enganosa, e atribuir ao Google uma nota que ele não deu é pior
 * ainda.
 *
 * Para ligar a seção de volta: abra o Perfil da Empresa no Google, transcreva
 * as avaliações verdadeiras aqui e preencha `nota` e `totalAvaliacoes` com o
 * que consta lá. Enquanto a lista estiver vazia, a seção não é renderizada.
 */
export const avaliacoesGoogle: AvaliacaoGoogle[] = []
