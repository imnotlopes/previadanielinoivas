import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { LojaProvider } from '../components/LojaProvider'
import '../index.css'

/**
 * TRÊS APRESENTAÇÕES, UM PAINEL, QUATRO APLICAÇÕES
 * ================================================
 *
 * Cada peça tem o seu HTML de verdade:
 *
 *   noivas.html     Apresentação de noivas
 *   madrinhas.html  Apresentação de madrinhas, formandas e mães
 *   noivos.html     Apresentação de noivos e padrinhos
 *   admin.html      Painel, a loja do celular dela
 *
 * ISSO NÃO É ORGANIZAÇÃO DE PASTA, É REQUISITO DE PRODUTO.
 *
 * A Danielli não quer site: ela quer links para colar no WhatsApp no meio da
 * conversa. Quando um link é colado, o WhatsApp mostra um cartão com foto e
 * título, e esse cartão é a primeira impressão, antes de qualquer clique.
 *
 * O robô que monta esse cartão NÃO EXECUTA JAVASCRIPT. Numa aplicação de
 * página única, os três links devolveriam o mesmo cartão: a madrinha receberia
 * o preview de noiva. Um HTML por apresentação, cada um com as suas próprias
 * tags Open Graph escritas no arquivo, é o que resolve, e mantém tudo estático
 * e barato na Vercel.
 *
 * O preço disso é a regra abaixo.
 */

/**
 * NAVEGAR ENTRE APRESENTAÇÕES É NAVEGAÇÃO DE VERDADE, NÃO <Link>.
 *
 * Cada uma é uma aplicação separada: o React Router de uma não conhece as
 * rotas da outra. Um `<Link to="/madrinhas">` dentro da apresentação de noivas
 * renderiza a rota curinga dela, e o erro é silencioso.
 *
 * Na prática isto quase não é usado: as apresentações não têm navegação entre
 * si de propósito, porque cada uma existe para devolver a pessoa ao WhatsApp,
 * e não para levá-la a outra página.
 */
export const CAMINHOS = {
  noivas: '/noivas',
  madrinhas: '/madrinhas',
  noivos: '/noivos',
  painel: '/admin',
} as const

/**
 * Sobe uma peça na `<div id="root">`.
 *
 * A limpeza das tags de SEO estáticas roda aqui, e não em cada entrada, para
 * não ser esquecida numa delas: sem ela o documento fica com DUAS
 * `<meta name="description">` e o Google considera a primeira, que é a
 * estática e genérica, ou seja, as descrições por rota seriam escritas e
 * ignoradas.
 */
export function montar(app: ReactNode) {
  document.querySelectorAll('[data-seo-estatico]').forEach((tag) => tag.remove())

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <LojaProvider>{app}</LojaProvider>
      </BrowserRouter>
    </StrictMode>,
  )

  /*
    Diagnóstico de rolagem lateral, ligado por `?overflow` na URL. Import
    dinâmico de propósito: vira um chunk separado que visitante nenhum baixa.
  */
  if (new URLSearchParams(location.search).has('overflow')) {
    import('../lib/diagnosticoOverflow')
      .then(({ diagnosticarOverflow }) => setTimeout(diagnosticarOverflow, 1500))
      .catch(() => {})
  }
}
