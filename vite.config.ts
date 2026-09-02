import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

import { pluginSeo } from './scripts/seo.js'

/**
 * As quatro peças, e os endereços por onde cada uma responde.
 *
 * Cada peça é um HTML de verdade, com as próprias tags Open Graph — é isso que
 * dá a cada link um cartão diferente quando a Danielli cola no WhatsApp. O
 * robô que monta o cartão não executa JavaScript, então uma aplicação de
 * página única devolveria o mesmo preview para os três links.
 *
 * `prefixo` é o começo da URL que aquela peça atende. `arquivo` é o HTML.
 */
const PECAS = [
  { nome: 'catalogo', prefixo: '/catalogo', arquivo: 'catalogo.html' },
  { nome: 'festa', prefixo: '/festa', arquivo: 'festa.html' },
  { nome: 'admin', prefixo: '/admin', arquivo: 'admin.html' },
] as const

/**
 * Faz o servidor de desenvolvimento se comportar como a Vercel.
 *
 * Em produção quem resolve `/catalogo` → `/catalogo.html` é o `vercel.json`.
 * O servidor do Vite não lê aquele arquivo: sem este plugin, abrir
 * `/catalogo` em desenvolvimento cai no `index.html` e a pessoa vê a
 * apresentação de noiva no lugar do catálogo — sem erro nenhum no console,
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
      input: {
        // A apresentação de noiva é a raiz, e por isso continua em index.html.
        principal: resolve(import.meta.dirname, 'index.html'),
        ...Object.fromEntries(
          PECAS.map((p) => [p.nome, resolve(import.meta.dirname, p.arquivo)]),
        ),
      },
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
