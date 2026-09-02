import type { ReactNode } from 'react'

import BannerCupom from './BannerCupom'
import FloatWhatsapp from './FloatWhatsapp'
import Rodape from './Rodape'
import TopoMarca from './TopoMarca'

/**
 * Casca da apresentação — peça de marca.
 *
 * Sem menu de navegação. A apresentação é uma peça única que se lê de cima a
 * baixo, e um menu com quatro itens convidaria a sair dela antes do fim. O
 * único caminho adiante é o botão do fim da página, que leva ao catálogo.
 *
 * O que ficava grudado no fim de TODA rota — depoimentos, avaliações, FAQ e
 * mapa — saiu do layout e virou conteúdo desta peça, montado à mão dentro da
 * página. A regra antiga ("qualquer página precisa fechar sozinha, porque não
 * se controla por onde a visita entra") deixou de valer quando cada link
 * passou a ter um destino conhecido: a noiva não cai aqui pelo Google, ela
 * recebe o link pronto da Danielli.
 */
export default function CascaApresentacao({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-off-white">
      <BannerCupom />
      <TopoMarca />

      <main className="flex-1">{children}</main>

      <Rodape />
      <FloatWhatsapp />
    </div>
  )
}
