import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import BannerCupom from './BannerCupom'
import Faq from './Faq'
import FloatWhatsapp from './FloatWhatsapp'
import Footer from './Footer'
import Header from './Header'
import ScrollToTop from './ScrollToTop'
import SecaoDepoimentos from './SecaoDepoimentos'
import SecaoAvaliacoes, { SecaoMapa } from './SecaoGoogle'

/** Reserva altura durante o carregamento do chunk, para o rodapé não saltar. */
function Carregando() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center" role="status">
      <span className="sr-only">Carregando…</span>
      <span aria-hidden className="filete animate-pulse" />
    </div>
  )
}

/** Casca do site: header sticky, conteúdo da rota, rodapé e contato flutuante. */
export default function Layout() {
  return (
    <div className="flex min-h-svh flex-col bg-off-white">
      <ScrollToTop />

      {/* Acima do cabeçalho e fora do sticky: a faixa é do fluxo, não da
          casca fixa. Some sozinha quando não há cupom ativo. */}
      <BannerCupom />
      <Header />

      <main className="flex-1">
        <Suspense fallback={<Carregando />}>
          <Outlet />
        </Suspense>

        {/* Fecham toda página do site, nesta ordem: prova social escolhida
            pela casa, prova social pública, dúvidas e, por último, onde
            encontrar a loja. */}
        <SecaoDepoimentos />
        <SecaoAvaliacoes />
        <Faq />
        <SecaoMapa />
      </main>

      <Footer />
      <FloatWhatsapp />
    </div>
  )
}
