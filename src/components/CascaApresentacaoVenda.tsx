import type { ReactNode } from 'react'

import Rodape from './Rodape'

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
 * E NÃO HÁ MAIS CABEÇALHO
 * -----------------------
 * Havia uma barra fixa com o logotipo, grudada no topo em toda rolagem. Barra
 * fixa é chrome de site, e este material não é site: apresentação nenhuma
 * repete o logotipo em cima de cada página. A marca agora aparece uma vez só,
 * na abertura, como assinatura de folha de rosto, ver CapaApresentacao.
 *
 * O que ela custava era pior que o que dava: oitenta pixels permanentes de
 * tela de celular para repetir um nome que a pessoa acabou de ler no WhatsApp
 * da própria Danielli, disputando espaço com a foto de capa bem no instante em
 * que a foto tem de ganhar. O Instagram, que morava lá, já está no rodapé.
 *
 * O rodapé é o compacto. Quem chegou ao fim de uma apresentação rolando o
 * polegar não precisa de bloco institucional, precisa do contato.
 */
export default function CascaApresentacaoVenda({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-off-white">
      <main className="flex-1">{children}</main>

      <Rodape compacto />
    </div>
  )
}
