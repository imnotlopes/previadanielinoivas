import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

import { buscarCupom } from '../data/cupons'
import type { Cupom } from '../data/cupons'
import type { Peca } from '../data/pecas'
import {
  CHAVE_CUPOM,
  CHAVE_PAINEL,
  ContextoLoja,
  carregar,
  semente,
  type ConfigLoja,
  type EstadoPersistido,
  type Loja,
} from '../lib/loja'

/**
 * Provedor do estado da loja.
 *
 * Mora aqui, e não em lib/loja.ts, por uma razão de ferramenta: um arquivo
 * que exporta componente e também funções soltas quebra o recarregamento a
 * quente do Vite. As funções, os tipos e os ganchos ficam no lib; o
 * componente fica neste arquivo, sozinho.
 *
 * O que este estado é — e o que ele não é — está documentado em lib/loja.ts.
 */
export function LojaProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoPersistido>(semente)
  const [codigoCupom, setCodigoCupom] = useState<string | null>(null)
  const [params, setParams] = useSearchParams()

  /*
    A leitura do storage acontece depois da primeira renderização, e não no
    inicializador do `useState`, porque este componente também roda em
    contexto sem `window` durante um eventual pré-render. O custo é um
    repintar; o ganho é não explodir fora do navegador.
  */
  useEffect(() => {
    setEstado(carregar())
    try {
      setCodigoCupom(localStorage.getItem(CHAVE_CUPOM))
    } catch {
      /* storage bloqueado: segue sem cupom */
    }
  }, [])

  /**
   * `?cupom=CODIGO` na URL.
   *
   * O parâmetro é consumido e removido do endereço: ele é a porta de entrada
   * do link da parceira, não faz parte da identidade da página. Deixá-lo
   * grudado sujaria toda URL compartilhada dali em diante e criaria duas
   * versões do mesmo endereço aos olhos do buscador.
   */
  useEffect(() => {
    const daUrl = params.get('cupom')
    if (!daUrl) return

    const encontrado = buscarCupom(estado.cupons, daUrl)
    if (encontrado) {
      setCodigoCupom(encontrado.codigo)
      try {
        localStorage.setItem(CHAVE_CUPOM, encontrado.codigo)
      } catch {
        /* sem storage o cupom vale só nesta navegação */
      }
    }

    const limpos = new URLSearchParams(params)
    limpos.delete('cupom')
    setParams(limpos, { replace: true })
  }, [params, setParams, estado.cupons])

  const persistir = useCallback((proximo: EstadoPersistido) => {
    setEstado(proximo)
    try {
      localStorage.setItem(CHAVE_PAINEL, JSON.stringify(proximo))
    } catch {
      /* storage cheio ou bloqueado: a edição vale só nesta aba */
    }
  }, [])

  const salvarPeca = useCallback(
    (peca: Peca) => {
      setEstado((atual) => {
        const existe = atual.pecas.some((p) => p.slug === peca.slug)
        const pecas = existe
          ? atual.pecas.map((p) => (p.slug === peca.slug ? peca : p))
          : [peca, ...atual.pecas]
        const proximo = { ...atual, pecas }
        try {
          localStorage.setItem(CHAVE_PAINEL, JSON.stringify(proximo))
        } catch {
          /* idem */
        }
        return proximo
      })
    },
    [],
  )

  const removerPeca = useCallback((slug: string) => {
    setEstado((atual) => {
      const proximo = { ...atual, pecas: atual.pecas.filter((p) => p.slug !== slug) }
      try {
        localStorage.setItem(CHAVE_PAINEL, JSON.stringify(proximo))
      } catch {
        /* idem */
      }
      return proximo
    })
  }, [])

  const salvarCupom = useCallback((cupom: Cupom) => {
    setEstado((atual) => {
      const existe = atual.cupons.some((c) => c.id === cupom.id)
      const cupons = existe
        ? atual.cupons.map((c) => (c.id === cupom.id ? cupom : c))
        : [cupom, ...atual.cupons]
      const proximo = { ...atual, cupons }
      try {
        localStorage.setItem(CHAVE_PAINEL, JSON.stringify(proximo))
      } catch {
        /* idem */
      }
      return proximo
    })
  }, [])

  const removerCupom = useCallback((id: string) => {
    setEstado((atual) => {
      const proximo = { ...atual, cupons: atual.cupons.filter((c) => c.id !== id) }
      try {
        localStorage.setItem(CHAVE_PAINEL, JSON.stringify(proximo))
      } catch {
        /* idem */
      }
      return proximo
    })
  }, [])

  const salvarConfig = useCallback(
    (config: ConfigLoja) => {
      persistir({ ...estado, config })
    },
    [estado, persistir],
  )

  const restaurarSemente = useCallback(() => {
    try {
      localStorage.removeItem(CHAVE_PAINEL)
    } catch {
      /* idem */
    }
    setEstado(semente())
  }, [])

  const aplicarCupom = useCallback(
    (codigo: string) => {
      const encontrado = buscarCupom(estado.cupons, codigo)
      if (!encontrado) return false
      setCodigoCupom(encontrado.codigo)
      try {
        localStorage.setItem(CHAVE_CUPOM, encontrado.codigo)
      } catch {
        /* idem */
      }
      return true
    },
    [estado.cupons],
  )

  const limparCupom = useCallback(() => {
    setCodigoCupom(null)
    try {
      localStorage.removeItem(CHAVE_CUPOM)
    } catch {
      /* idem */
    }
  }, [])

  /*
    O cupom é revalidado a cada render, e não guardado como objeto: ele pode
    ter vencido desde que foi salvo, ou ter sido desativado no painel. Guardar
    só o código e resolver na hora evita mostrar desconto que não vale mais.
  */
  const cupomAtivo = useMemo(
    () => (codigoCupom ? buscarCupom(estado.cupons, codigoCupom) : null),
    [codigoCupom, estado.cupons],
  )

  const editado = useMemo(() => {
    const base = semente()
    return (
      JSON.stringify(estado.pecas) !== JSON.stringify(base.pecas) ||
      JSON.stringify(estado.cupons) !== JSON.stringify(base.cupons) ||
      JSON.stringify(estado.config) !== JSON.stringify(base.config)
    )
  }, [estado])

  const valor = useMemo<Loja>(
    () => ({
      ...estado,
      cupomAtivo,
      editado,
      salvarPeca,
      removerPeca,
      salvarCupom,
      removerCupom,
      salvarConfig,
      restaurarSemente,
      aplicarCupom,
      limparCupom,
    }),
    [
      estado,
      cupomAtivo,
      editado,
      salvarPeca,
      removerPeca,
      salvarCupom,
      removerCupom,
      salvarConfig,
      restaurarSemente,
      aplicarCupom,
      limparCupom,
    ],
  )

  return <ContextoLoja.Provider value={valor}>{children}</ContextoLoja.Provider>
}
