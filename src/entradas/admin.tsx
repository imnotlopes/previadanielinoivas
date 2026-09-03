import { lazy, Suspense } from 'react'

import Carregando from '../components/Carregando'
import { montar } from './comum'

/** Peça 4: o painel, operado do celular. Casca própria, dentro do Admin. */
const Admin = lazy(() => import('../pages/admin/Admin'))

montar(
  <Suspense fallback={<Carregando />}>
    <Admin />
  </Suspense>,
)
