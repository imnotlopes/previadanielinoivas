import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import Carregando from '../components/Carregando'
import CascaCatalogo from '../components/CascaCatalogo'
import ScrollToTop from '../components/ScrollToTop'
import { montar } from './comum'

/**
 * Peça 3, festa e formatura: apresentação curta E acervo no mesmo link.
 *
 * Não é economia de trabalho, é o pedido da loja. Noiva e festa são clientes
 * diferentes, com sazonalidade diferente, e a de festa não passa por um
 * primeiro contato de apresentação: ela já chega procurando vestido. Mandar
 * dois links para quem quer ver vestido agora é atrito à toa.
 */
const FestaFormatura = lazy(() => import('../pages/FestaFormatura'))
const Peca = lazy(() => import('../pages/Peca'))

montar(
  <CascaCatalogo publico="festa">
    <ScrollToTop />
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/festa" element={<FestaFormatura />} />
        <Route path="/festa/:slug" element={<Peca base="/festa" />} />
        <Route path="*" element={<FestaFormatura />} />
      </Routes>
    </Suspense>
  </CascaCatalogo>,
)
