import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '../index.css'

/**
 * UMA APRESENTAÇÃO HOJE, QUATRO DEPOIS
 * ====================================
 *
 * Cada peça tem o seu HTML de verdade:
 *
 *   noivas.html     Apresentação de noivas
 *
 * A Danielli pediu quatro (noiva, trajes femininos, debutante e trajes
 * masculinos) e a de noiva vem primeiro. As outras entram como HTMLs irmãos
 * deste, pelo mesmo motivo explicado abaixo.
 *
 * O painel /admin saiu em setembro de 2026. Ele gravava as edições só no
 * `localStorage` de quem editava, então nunca controlou o que a noiva via:
 * mudar o acervo sempre foi, e continua sendo, editar src/data/ e publicar.
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
 * QUANDO VOLTAR A EXISTIR UMA SEGUNDA PEÇA: NAVEGAR ENTRE ELAS É NAVEGAÇÃO DE
 * VERDADE, NÃO <Link>.
 *
 * Cada uma é uma aplicação separada: o React Router de uma não conhece as
 * rotas da outra. Um `<Link>` para fora da própria peça renderiza a rota
 * curinga dela, e o erro é silencioso. Hoje não há para onde navegar; a regra
 * fica escrita porque o erro que ela evita é mudo.
 */

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
        {app}
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
