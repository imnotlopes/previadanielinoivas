/**
 * Constantes da marca, fonte única de verdade.
 * Tudo que é "identidade" ou "contato" mora aqui; nenhum componente
 * deve hardcodar número, @ ou nome do atelier.
 */
export const brand = {
  /**
   * Nome corrente. Use em texto que a cliente lê como conversa,
   * mensagens de WhatsApp, descrições, meta tags.
   */
  nome: 'Danielli Noivas',

  subtitulo: 'Atelier',

  /**
   * Assinatura da marca, tirada da bio do Instagram.
   * TODO: a bio aparece truncada no perfil ("Sonhos Existe…"); confirme a
   * frase inteira com a Danielli antes de publicar.
   */
  assinatura: 'Sonhos existem para serem realizados',

  instagram: '@atelierdaniellinoivas',

  /**
   * Formato internacional, apenas dígitos: 55 + DDD + número.
   *
   * Nada na apresentação usa este campo hoje. Os botões de WhatsApp saíram em
   * setembro de 2026, porque quem abre o link já está conversando com a
   * Danielli no WhatsApp. Enquanto existiram, e com este campo vazio, todos
   * eles levavam para o Instagram sem ninguém perceber.
   */
  whatsapp: '',
  /** Mesmo número, formatado para leitura. */
  whatsappExibicao: '',

  /**
   * TODO: PREENCHER ANTES DE PUBLICAR.
   * Formato "Cidade, UF". A busca desta loja é local: enquanto esta constante
   * estiver vazia, os títulos e descrições de SEO saem sem cidade nenhuma, o
   * que funciona, mas joga fora o termo que mais traz cliente
   * ("aluguel de vestido de noiva em <cidade>"). Ver `local` em data/pecas.ts.
   */
  cidade: '',
  email: '',
} as const

/**
 * Sufixo de todos os títulos.
 *
 * É só o nome da marca, e não uma frase de venda: cada peça tem público
 * próprio e escreve o próprio título. "Aluguel de vestidos de noiva e festa"
 * ficava colado no fim do título da peça de festa, dizendo "noiva" para uma
 * formanda.
 */
export const TITULO_BASE = 'Danielli Noivas'

/**
 * Endereço onde as peças estão publicadas hoje.
 *
 * Usado nas URLs canônicas e nas imagens de Open Graph, que precisam ser
 * absolutas, robô de preview não resolve caminho relativo. Sem barra no fim.
 *
 * TODO: trocar quando houver domínio próprio, e atualizar junto as URLs
 * absolutas escritas à mão nos quatro HTML da raiz, elas são texto fixo e
 * não acompanham esta constante.
 */
export const SITE_URL = 'https://previadanielinoivas.vercel.app'

/** URL do perfil no Instagram, derivada do @. */
export const linkInstagram = `https://instagram.com/${brand.instagram.replace(/^@/, '')}`
