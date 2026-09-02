import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Carregando from '../components/Carregando'
import CascaCatalogo from '../components/CascaCatalogo'
import ScrollToTop from '../components/ScrollToTop'
import { montar } from './comum'

/** Peça 2 — o acervo de noiva, mandado depois que ela demonstra interesse. */
const CatalogoNoiva = lazy(() => import('../pages/CatalogoNoiva'))
const Peca = lazy(() => import('../pages/Peca'))

montar(
  <CascaCatalogo publico="noiva">
    <ScrollToTop />
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/catalogo" element={<CatalogoNoiva />} />
        {/*
          A ficha do vestido mora DENTRO do catálogo (`/catalogo/aurora`), e
          não numa rota global `/peca/:slug`. Duas razões: cada peça é uma
          aplicação separada e não conhece as rotas das outras; e a URL passa
          a dizer de onde a cliente veio, o que importa quando o mesmo
          componente serve noiva e festa.
        */}
        <Route path="/catalogo/:slug" element={<Peca base="/catalogo" />} />
        <Route path="*" element={<CatalogoNoiva />} />
      </Routes>
    </Suspense>
  </CascaCatalogo>,
)
