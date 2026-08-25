import type { ReactNode } from 'react'

import { useContato } from '../lib/loja'
import { cn } from '../lib/utils'
import { IconeWhatsapp } from './icones'

interface BotaoWhatsappProps {
  /** Texto já pré-preenchido na conversa. Personalize por vestido/contexto. */
  mensagem: string
  children?: ReactNode
  /**
   * Sem cor de acento, o peso do botão vem do preenchimento:
   * `principal` (preto cheio) para fundo claro, `claro` (branco cheio) para
   * fundo escuro, e os contornos para uso secundário em cada fundo.
   */
  variante?: 'principal' | 'claro' | 'contorno' | 'contorno-claro'
  tamanho?: 'padrao' | 'sm'
  className?: string
}

/**
 * Único caminho de contato do site. Abre o WhatsApp em nova aba com a
 * mensagem já escrita — a cliente só precisa apertar enviar.
 */
export default function BotaoWhatsapp({
  mensagem,
  children = 'Falar no WhatsApp',
  variante = 'principal',
  tamanho = 'padrao',
  className,
}: BotaoWhatsappProps) {
  const { linkWhatsApp } = useContato()

  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        variante === 'principal' && 'btn-primario',
        variante === 'claro' && 'btn-secundario',
        variante === 'contorno' && 'btn-contorno',
        variante === 'contorno-claro' && 'btn-contorno-claro',
        tamanho === 'sm' && 'btn-sm',
        className,
      )}
    >
      <IconeWhatsapp className="size-[1.15em] shrink-0" strokeWidth={1.75} />
      {children}
    </a>
  )
}
