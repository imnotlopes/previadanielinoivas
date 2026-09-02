import type { ReactNode } from 'react'

import { CAMINHOS } from '../entradas/comum'
import { useSelecao } from '../lib/selecao'
import BannerCupom from './BannerCupom'
import BarraSelecao from './BarraSelecao'
import FloatWhatsapp from './FloatWhatsapp'
import Rodape from './Rodape'
import TopoMarca from './TopoMarca'

interface CascaCatalogoProps {
  /** Muda só o link de volta do topo — cada catálogo volta para a sua peça. */
  publico: 'noiva' | 'festa'
  children: ReactNode
}

/**
 * Casca do catálogo — ferramenta, não peça de marca.
 *
 * Quem chega aqui já foi apresentado à loja e está com uma tarefa na mão:
 * achar um vestido. Por isso a casca é enxuta e tudo que competiria com a
 * grade ficou de fora — FAQ, mapa, avaliações e depoimentos moram nas
 * apresentações.
 *
 * O rodapé vem na versão `compacto`: quem chegou ao fim de uma grade de
 * vestidos rolando o polegar não precisa de um bloco institucional de 400px,
 * precisa do WhatsApp.
 *
 * A barra da lista de prova mora aqui, e não em cada tela, porque ela precisa
 * seguir a noiva da grade para a ficha do vestido e de volta. Montada em cada
 * página, ela sumiria e reapareceria a cada navegação.
 */
export default function CascaCatalogo({ publico, children }: CascaCatalogoProps) {
  const { quantidade } = useSelecao()
  const base = publico === 'noiva' ? CAMINHOS.catalogoNoiva : CAMINHOS.festa

  return (
    <div className="flex min-h-svh flex-col bg-off-white">
      <BannerCupom />
      <TopoMarca voltarPara={publico === 'noiva' ? 'apresentacao' : null} />

      <main className="flex-1">{children}</main>

      <Rodape compacto />

      {/*
        Espaço para a barra não cobrir o fim do rodapé. A altura é generosa de
        propósito: a barra cresce com o número de vestidos marcados, e ficar
        curto significa esconder justamente o WhatsApp do rodapé.
      */}
      {quantidade > 0 && <div aria-hidden className="h-44 shrink-0 sm:h-32" />}

      {/*
        Um botão de contato por vez.

        Com a lista montada, o botão redondo e a barra ficariam empilhados no
        mesmo canto, oferecendo dois caminhos diferentes para o mesmo WhatsApp
        — e o da barra é melhor, porque leva junto os nomes dos vestidos.
      */}
      {quantidade === 0 && <FloatWhatsapp />}
      <BarraSelecao base={base} />
    </div>
  )
}
