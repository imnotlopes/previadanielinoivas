import type { ReactNode } from 'react'

import Rodape from './Rodape'
import TopoMarca from './TopoMarca'

/**
 * A casca das três apresentações.
 *
 * SEM NAVEGAÇÃO, DE PROPÓSITO
 * ---------------------------
 * Não há menu, não há link para outra apresentação, não há botão flutuante de
 * WhatsApp. Quem abre isto veio de uma conversa e volta para ela: cada saída a
 * mais é uma chance de sair antes do fim.
 *
 * O botão de WhatsApp flutuante saiu por outro motivo também. Ele disputava o
 * mesmo canto com a barra da lista de prova, e a barra é melhor: ela leva os
 * códigos das peças junto, e o botão flutuante manda uma mensagem em branco.
 *
 * O topo fica porque é a marca, e ela é a única coisa que diz de quem é o link
 * antes de a foto carregar. Sem link de voltar: não há para onde voltar.
 *
 * O rodapé é o compacto. Quem chegou ao fim de uma apresentação rolando o
 * polegar não precisa de bloco institucional, precisa do contato.
 */
export default function CascaApresentacaoVenda({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-off-white">
      <TopoMarca />

      <main className="flex-1">{children}</main>

      <Rodape compacto />
    </div>
  )
}
