import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { LojaProvider } from '../components/LojaProvider'
import '../index.css'

/**
 * QUATRO PEÇAS, QUATRO APLICAÇÕES
 * ===============================
 *
 * O projeto deixou de ser um site com várias rotas e virou quatro peças
 * independentes, cada uma com o seu HTML de verdade:
 *
 *   index.html     Apresentação Noiva     o que ela manda quando a noiva chama
 *   catalogo.html  Catálogo Noiva         o que ela manda depois do interesse
 *   festa.html     Festa e Formatura      apresentação curta + acervo, num link
 *   admin.html     Painel                 a loja, do celular dela
 *
 * ISSO NÃO É ORGANIZAÇÃO DE PASTA, É REQUISITO DE PRODUTO.
 *
 * A Danielli não quer site: ela quer links para colar no WhatsApp no meio da
 * conversa. Quando um link é colado, o WhatsApp mostra um cartão com foto e
 * título, e esse cartão é a primeira impressão, antes de qualquer clique.
 *
 * O robô que monta esse cartão NÃO EXECUTA JAVASCRIPT. Numa aplicação de
 * página única, os três links devolveriam o mesmo `index.html` e portanto o
 * mesmo cartão: a noiva e a formanda receberiam previews idênticos. Um HTML
 * por peça, cada um com as suas próprias tags Open Graph escritas no arquivo,
 * é o que resolve, e mantém tudo estático e barato na Vercel.
 *
 * O preço disso é a regra abaixo.
 */

/**
 * NAVEGAR ENTRE PEÇAS É NAVEGAÇÃO DE VERDADE, NÃO <Link>.
 *
 * Cada peça é uma aplicação separada: o React Router de uma não conhece as
 * rotas da outra. Um `<Link to="/catalogo">` dentro da apresentação renderiza
 * a rota "não encontrada" dela, porque `/catalogo` não existe naquele
 * roteador, e o erro é silencioso, sem nada no console.
 *
 * Para ir de uma peça a outra use `<a href>`, que faz o navegador buscar o
 * HTML novo. `<Link>` continua certo DENTRO da mesma peça (catálogo → ficha
 * do vestido, por exemplo).
 */
export const CAMINHOS = {
  apresentacaoNoiva: '/',
  catalogoNoiva: '/catalogo',
  festa: '/festa',
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
