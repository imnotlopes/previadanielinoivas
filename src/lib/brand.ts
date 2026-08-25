/**
 * Constantes da marca — fonte única de verdade.
 * Tudo que é "identidade" ou "contato" mora aqui; nenhum componente
 * deve hardcodar número, @ ou nome do atelier.
 */
export const brand = {
  /**
   * Nome corrente. Use em texto que a cliente lê como conversa —
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
   * TODO: PREENCHER ANTES DE PUBLICAR.
   * Formato internacional, apenas dígitos: 55 + DDD + número.
   * Enquanto estiver vazio, todos os botões de WhatsApp do site caem no
   * Instagram — ver `linkWhatsApp` no fim deste arquivo.
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

/** Título usado como sufixo em todas as páginas. */
export const TITULO_BASE = 'Danielli Noivas | Aluguel de vestidos de noiva e festa'

/**
 * TODO: trocar pelo domínio real após o deploy.
 * Usado nas URLs canônicas e nas imagens de Open Graph, que precisam ser
 * absolutas — robô de preview não resolve caminho relativo.
 * Sem barra no final.
 */
export const SITE_URL = 'https://danielli-noivas.vercel.app'

export const navegacao = [
  { href: '/', rotulo: 'Início' },
  { href: '/catalogo', rotulo: 'Catálogo' },
  { href: '/como-funciona', rotulo: 'Como funciona' },
  { href: '/sobre', rotulo: 'Sobre' },
] as const

/** URL do perfil no Instagram, derivada do @. */
export const linkInstagram = `https://instagram.com/${brand.instagram.replace(/^@/, '')}`

/**
 * Monta o link de conversa no WhatsApp com mensagem pré-preenchida.
 *
 * Enquanto `brand.whatsapp` estiver vazio, devolve o Instagram: é melhor o
 * botão levar a um canal que existe do que a um `wa.me/` sem número, que abre
 * uma tela de erro do WhatsApp. Assim que o número for preenchido, todos os
 * botões passam a apontar para ele sozinhos.
 *
 * @example
 * linkWhatsApp('Olá! Tenho interesse no vestido Aurora.')
 * // → https://wa.me/5500000000000?text=Ol%C3%A1!%20Tenho%20interesse...
 */
export function linkWhatsApp(mensagem: string): string {
  if (!brand.whatsapp) return linkInstagram
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(mensagem)}`
}
