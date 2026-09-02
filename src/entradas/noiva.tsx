import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import CascaApresentacao from '../components/CascaApresentacao'
import Carregando from '../components/Carregando'
import { montar } from './comum'

/** Peça 1 — a apresentação que a noiva recebe quando chama no WhatsApp. */
const ApresentacaoNoiva = lazy(() => import('../pages/ApresentacaoNoiva'))

montar(
  <CascaApresentacao>
    <Suspense fallback={<Carregando />}>
      <Routes>
        {/*
          Uma rota só, e um `*` que cai nela também: a apresentação é uma peça
          única. Se alguém chegar em /qualquer-coisa por link velho, vê a
          apresentação em vez de um 404 — numa peça de marketing que circula
          por WhatsApp, tela de erro é conversa perdida.
        */}
        <Route path="*" element={<ApresentacaoNoiva />} />
      </Routes>
    </Suspense>
  </CascaApresentacao>,
)
