import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import { LojaProvider } from './components/LojaProvider'

/**
 * Cada rota vira um chunk próprio: quem abre a home não baixa o catálogo
 * inteiro. O Layout fica fora do lazy porque é a casca de todas as páginas.
 *
 * O painel administrativo tem casca própria (sem cabeçalho, rodapé nem botão
 * flutuante do WhatsApp) e por isso mora fora do <Layout>.
 */
const Home = lazy(() => import('./pages/Home'))
const Catalogo = lazy(() => import('./pages/Catalogo'))
const Peca = lazy(() => import('./pages/Peca'))
const Sobre = lazy(() => import('./pages/Sobre'))
const ComoFunciona = lazy(() => import('./pages/ComoFunciona'))
const NaoEncontrada = lazy(() => import('./pages/NaoEncontrada'))
const Admin = lazy(() => import('./pages/admin/Admin'))

function App() {
  return (
    /*
      O provedor fica dentro do Router e por fora das rotas: ele lê `?cupom=`
      da URL (precisa do Router) e o painel administrativo precisa do mesmo
      estado que o site, para uma edição aparecer na vitrine na hora.
    */
    <LojaProvider>
      <Routes>
        {/* O Suspense mora dentro do Layout, em volta do <Outlet />, para que
            header e rodapé não pisquem a cada troca de rota. */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="peca/:slug" element={<Peca />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="como-funciona" element={<ComoFunciona />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>

        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </LojaProvider>
  )
}

export default App
