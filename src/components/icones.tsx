import type { SVGProps } from 'react'

/**
 * O lucide-react v1 removeu os ícones de marca, não existem mais `Instagram`
 * nem WhatsApp no pacote. Estes dois são desenhados aqui, seguindo as mesmas
 * convenções do lucide (viewBox 24, traço em currentColor, cantos arredondados)
 * para que fiquem visualmente coerentes com os ícones importados.
 */

const base: SVGProps<SVGSVGElement> = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  width: 20,
  height: 20,
  'aria-hidden': true,
}

export function IconeInstagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconeYoutube(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="5.5" width="20" height="13" rx="4" />
      <path d="M10.2 9.4v5.2l4.5-2.6z" fill="currentColor" stroke="none" />
    </svg>
  )
}
