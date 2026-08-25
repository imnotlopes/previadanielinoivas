import { createContext, useContext, useMemo } from 'react'

import { cupons as cuponsSemente, type Cupom } from '../data/cupons.js'
import { pecas as pecasSemente, type Peca } from '../data/pecas.js'
import { brand } from './brand.js'

/**
 * ESTADO DA LOJA — E O QUE ELE NÃO É
 * ==================================
 *
 * Este arquivo é a espinha da prévia. Ele junta três coisas:
 *
 *   1. a SEMENTE, que é o conteúdo escrito em src/data/ e versionado no Git;
 *   2. as EDIÇÕES feitas no painel administrativo, guardadas no
 *      `localStorage` do navegador de quem está mexendo;
 *   3. o CUPOM ATIVO da visitante, que chega por `?cupom=` na URL.
 *
 * ISTO NÃO É UM BANCO DE DADOS. É de propósito, e vale entender o limite
 * antes de mostrar o painel para alguém:
 *
 *   - o que é editado no painel fica SÓ no navegador de quem editou. Não
 *     aparece para a cliente, não aparece no celular da dona, não sobrevive a
 *     "limpar dados do navegador";
 *   - dois computadores enxergam catálogos diferentes;
 *   - o build (sitemap, JSON-LD) continua lendo só a semente.
 *
 * Serve para demonstrar as telas e o fluxo — "é assim que vai ser cadastrar
 * um vestido" — e para experimentar conteúdo sem mexer em código. Publicar
 * de verdade continua sendo editar src/data/ e fazer deploy, até existir um
 * backend. O painel avisa isso na própria tela.
 */

/** Uma versão no nome da chave evita quebrar ao mudar o formato depois. */
export const CHAVE_PAINEL = 'danielli_painel_v1'
export const CHAVE_CUPOM = 'danielli_cupom'
const CHAVE_SESSAO = 'danielli_painel_sessao'

/** Contatos que o painel pode sobrescrever por cima de lib/brand.ts. */
export interface ConfigLoja {
  whatsapp: string
  whatsappExibicao: string
  cidade: string
  instagram: string
}

export interface EstadoPersistido {
  pecas: Peca[]
  cupons: Cupom[]
  config: ConfigLoja
}

export function configDaSemente(): ConfigLoja {
  return {
    whatsapp: brand.whatsapp,
    whatsappExibicao: brand.whatsappExibicao,
    cidade: brand.cidade,
    instagram: brand.instagram,
  }
}

export function semente(): EstadoPersistido {
  return {
    pecas: pecasSemente,
    cupons: cuponsSemente,
    config: configDaSemente(),
  }
}

/**
 * Lê o painel do storage.
 *
 * Qualquer coisa estranha lá dentro (JSON quebrado, formato antigo, storage
 * bloqueado) devolve a semente em vez de derrubar o site. Prévia que não abre
 * porque o `localStorage` de alguém está sujo não serve para nada.
 */
export function carregar(): EstadoPersistido {
  const base = semente()
  try {
    const bruto = localStorage.getItem(CHAVE_PAINEL)
    if (!bruto) return base
    const salvo = JSON.parse(bruto) as Partial<EstadoPersistido>
    return {
      pecas: Array.isArray(salvo.pecas) ? salvo.pecas : base.pecas,
      cupons: Array.isArray(salvo.cupons) ? salvo.cupons : base.cupons,
      config: { ...base.config, ...(salvo.config ?? {}) },
    }
  } catch {
    return base
  }
}

export interface Loja extends EstadoPersistido {
  /** Cupom que a visitante trouxe, já validado. `null` quando não há. */
  cupomAtivo: Cupom | null
  /** `true` enquanto houver qualquer edição do painel por cima da semente. */
  editado: boolean

  salvarPeca: (peca: Peca) => void
  removerPeca: (slug: string) => void
  salvarCupom: (cupom: Cupom) => void
  removerCupom: (id: string) => void
  salvarConfig: (config: ConfigLoja) => void
  /** Descarta tudo que foi editado no painel e volta à semente do código. */
  restaurarSemente: () => void

  aplicarCupom: (codigo: string) => boolean
  limparCupom: () => void
}

export const ContextoLoja = createContext<Loja | null>(null)

export function useLoja(): Loja {
  const contexto = useContext(ContextoLoja)
  if (!contexto) throw new Error('useLoja precisa estar dentro de <LojaProvider>')
  return contexto
}

/**
 * Contatos da marca já com o que o painel sobrescreveu.
 *
 * Use no lugar de `brand.whatsapp` e companhia em qualquer componente. O
 * `brand` continua sendo a fonte de verdade do que vai ao ar; isto é a
 * fonte de verdade do que a tela mostra agora.
 */
export function useContato() {
  const { config } = useLoja()
  return useMemo(
    () => ({
      ...config,
      linkInstagram: `https://instagram.com/${config.instagram.replace(/^@/, '')}`,
      linkWhatsApp(mensagem: string) {
        if (!config.whatsapp) {
          return `https://instagram.com/${config.instagram.replace(/^@/, '')}`
        }
        return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`
      },
    }),
    [config],
  )
}

/** Sessão do painel. Não é segurança: é só não abrir o painel por acidente. */
export function lerSessaoPainel(): boolean {
  try {
    return sessionStorage.getItem(CHAVE_SESSAO) === '1'
  } catch {
    return false
  }
}

export function gravarSessaoPainel(entrou: boolean): void {
  try {
    if (entrou) sessionStorage.setItem(CHAVE_SESSAO, '1')
    else sessionStorage.removeItem(CHAVE_SESSAO)
  } catch {
    /* sem storage a sessão dura só esta navegação */
  }
}
