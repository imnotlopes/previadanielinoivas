import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import CascaApresentacaoVenda from '../components/CascaApresentacaoVenda'
import Carregando from '../components/Carregando'
import { montar } from './comum'

/** A apresentação de noivas, um link que a Danielli cola no WhatsApp. */
const Apresentacao = lazy(() => import('../pages/Apresentacao'))

montar(
  <CascaApresentacaoVenda>
    <Suspense fallback={<Carregando />}>
      <Routes>
        {/*
          A rota curinga devolve a própria apresentação, e não uma página de
          erro. Um link colado numa conversa chega torto com frequência (uma
          barra a mais, um parâmetro estranho), e "não encontrado" no meio de
          um atendimento é pior do que abrir a apresentação certa.
        */}
        <Route path="*" element={<Apresentacao publico="noivas" />} />
      </Routes>
    </Suspense>
  </CascaApresentacaoVenda>,
)
