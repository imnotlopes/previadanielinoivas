import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

import { pluginSeo } from './scripts/seo.js'

/**
 * As quatro peças, e os endereços por onde cada uma responde.
 *
 * Cada peça é um HTML de verdade, com as próprias tags Open Graph, e é isso que
 * dá a cada link um cartão diferente quando a Danielli cola no WhatsApp. O
 * robô que monta o cartão não executa JavaScript, então uma aplicação de
 * página única devolveria o mesmo preview para os três links.
 *
 * `prefixo` é o começo da URL que aquela peça atende. `arquivo` é o HTML.
 */
const PECAS = [
  { nome: 'noivas', prefixo: '/noivas', arquivo: 'noivas.html' },
] as const

/**
 * As rotas do produto antigo, e para onde elas vão agora.
 *
 * `/catalogo` e `/festa` circularam em conversas de WhatsApp, e link colado
 * numa conversa não se apaga: quem abrir o antigo precisa cair na apresentação
 * equivalente, e não num 404 no meio de um atendimento.
 *
 * A raiz entra aqui porque a home institucional é fase 2 e ainda não existe.
 * Enquanto isso, quem abre o domínio cai na apresentação de noivas.
 */
const APOSENTADAS = [
  { de: '/', para: '/noivas' },
  { de: '/catalogo', para: '/noivas' },
  { de: '/festa', para: '/noivas' },

  /*
    As duas que saíram do produto.

    Redirecionar, e não deixar dar 404: elas existiram no repositório e podem
    ter sido abertas em pré-visualização. Custa duas linhas e evita que alguém
    caia num erro no meio de um atendimento.
  */
  { de: '/madrinhas', para: '/noivas' },
  { de: '/noivos', para: '/noivas' },
] as const

/**
 * Faz o servidor de desenvolvimento se comportar como a Vercel.
 *
 * Em produção quem resolve `/catalogo` → `/catalogo.html` é o `vercel.json`.
 * O servidor do Vite não lê aquele arquivo: sem este plugin, abrir
 * `/catalogo` em desenvolvimento cai no `index.html` e a pessoa vê a
 * apresentação de noiva no lugar do catálogo, sem erro nenhum no console,
 * que é o tipo de divergência entre dev e produção que custa uma tarde.
 *
 * As duas tabelas precisam andar juntas: mexeu em PECAS, mexa no vercel.json.
 */
function roteamentoDePecas(): Plugin {
  return {
    name: 'roteamento-de-pecas',
    apply: 'serve',
    configureServer(servidor) {
      servidor.middlewares.use((req, _res, proximo) => {
        const caminho = (req.url ?? '/').split('?')[0]

        // Deixa passar o que já é arquivo (assets, /src/..., HTML direto).
        if (caminho.includes('.')) return proximo()

        /* Rota aposentada: redireciona de verdade, como a Vercel faz, para o
           desenvolvimento não divergir da produção. */
        const velha = APOSENTADAS.find(
          (r) => caminho === r.de || (r.de !== '/' && caminho.startsWith(`${r.de}/`)),
        )
        if (velha) {
          _res.statusCode = 307
          _res.setHeader('Location', velha.para)
          _res.end()
          return
        }

        const peca = PECAS.find(
          (p) => caminho === p.prefixo || caminho.startsWith(`${p.prefixo}/`),
        )
        if (peca) req.url = `/${peca.arquivo}`

        proximo()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), roteamentoDePecas(), pluginSeo()],

  build: {
    rollupOptions: {
      /*
        Não há mais `index.html`. A raiz redireciona para `/noivas` (ver
        APOSENTADAS acima e o vercel.json): a home institucional é fase 2 e
        ainda não existe, e uma raiz servindo a apresentação de noiva com
        outra URL só criaria duas páginas iguais.
      */
      input: Object.fromEntries(
        PECAS.map((p) => [p.nome, resolve(import.meta.dirname, p.arquivo)]),
      ),
    },
  },

  server: {
    // O Vite ignora PORT e vai somando a partir da 5173 quando a porta está
    // ocupada. Respeitar a variável deixa quem sobe o servidor escolher a
    // porta, o que importa quando há outro projeto rodando na mesma máquina.
    // Só afeta desenvolvimento: o build é estático e não usa isto.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
