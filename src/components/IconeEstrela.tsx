import type { SVGProps } from 'react'

/** Estrela cheia. Monocromática, como o resto do site. */
export function IconeEstrela(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={16}
      height={16}
      aria-hidden
      {...props}
    >
      <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" />
    </svg>
  )
}

/** Fileira de estrelas com rótulo textual, a nota não fica só no desenho. */
export function Estrelas({ nota, className }: { nota: number; className?: string }) {
  const cheias = Math.round(nota)

  return (
    <span className={className}>
      <span aria-hidden className="inline-flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <IconeEstrela key={i} className={i < cheias ? 'opacity-100' : 'opacity-25'} />
        ))}
      </span>
      <span className="sr-only">
        {nota.toLocaleString('pt-BR')} de 5 estrelas
      </span>
    </span>
  )
}
