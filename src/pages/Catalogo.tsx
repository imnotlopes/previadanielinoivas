import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import CardPeca from '../components/CardPeca'
import SecaoTitulo from '../components/SecaoTitulo'
import Seo from '../components/Seo'
import {
  amostraCor,
  categoriasDisponiveis,
  coresDisponiveis,
  descricaoCategoria,
  rotulosCategoria,
  rotulosCor,
  temPreco,
  tituloCategoria,
  type CategoriaPeca,
  type CorPeca,
  type Peca,
} from '../data/pecas'
import { SITE_URL } from '../lib/brand'
import { useContato, useLoja } from '../lib/loja'
import { cn } from '../lib/utils'

/**
 * O ESTADO DO CATÁLOGO MORA NA URL
 * ================================
 * Nada de `useState` para filtro. A query string é a fonte de verdade, e isso
 * resolve quatro coisas de uma vez: o card da home entra já filtrado, o botão
 * voltar do navegador funciona, o link filtrado pode ser colado no WhatsApp
 * ("olha os verdes que eu vi") e cada categoria vira página de entrada
 * própria para o buscador.
 *
 * `mostrar` também está na URL. Sem isso, quem clicou "carregar mais" três
 * vezes, abriu um vestido e voltou, cairia de volta na primeira dúzia.
 */
const PASSO_PAGINA = 12

const ORDENACOES = [
  { valor: 'padrao', rotulo: 'Ordem do acervo' },
  { valor: 'nome', rotulo: 'Nome (A–Z)' },
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
] as const

type Ordem = (typeof ORDENACOES)[number]['valor']

/** Lê a URL. Valor inválido é ignorado em silêncio, nunca quebra a página. */
function lista(bruto: string | null): string[] {
  if (!bruto) return []
  return bruto.split(',').map((v) => v.trim()).filter(Boolean)
}

export default function Catalogo() {
  const { pecas } = useLoja()
  /* A cidade sai do estado da loja, e não da constante do código: assim o
     campo "cidade" do painel realmente muda os títulos de busca, que é o que
     a tela do painel promete. */
  const { cidade } = useContato()
  const [params, setParams] = useSearchParams()
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)

  const categorias = categoriasDisponiveis(pecas)
  const cores = coresDisponiveis(pecas)
  const comPreco = temPreco(pecas)

  const catsAtivas = lista(params.get('categoria')).filter((c): c is CategoriaPeca =>
    categorias.includes(c as CategoriaPeca),
  )
  const coresAtivas = lista(params.get('cor')).filter((c): c is CorPeca =>
    cores.includes(c as CorPeca),
  )
  const busca = (params.get('busca') ?? '').trim()
  const ordemBruta = params.get('ordem')
  const ordem: Ordem = ORDENACOES.some((o) => o.valor === ordemBruta)
    ? (ordemBruta as Ordem)
    : 'padrao'
  const mostrar = Math.max(PASSO_PAGINA, Number(params.get('mostrar')) || PASSO_PAGINA)

  const filtradas = useMemo(() => {
    const termo = busca.toLowerCase()

    const resultado = pecas.filter((peca) => {
      if (catsAtivas.length > 0 && !catsAtivas.includes(peca.categoria)) return false
      if (coresAtivas.length > 0 && !coresAtivas.includes(peca.cor)) return false
      if (termo) {
        const alvo = `${peca.nome} ${peca.descricao}`.toLowerCase()
        if (!alvo.includes(termo)) return false
      }
      return true
    })

    if (ordem === 'nome') {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    } else if (ordem === 'menor-preco' || ordem === 'maior-preco') {
      /* Vestido sob consulta vai para o fim em qualquer direção: ele não tem
         posição numa lista de preço, e jogá-lo para o topo em "menor preço"
         daria a entender que é o mais barato. */
      resultado.sort((a, b) => {
        if (a.precoAluguel === null) return 1
        if (b.precoAluguel === null) return -1
        return ordem === 'menor-preco'
          ? a.precoAluguel - b.precoAluguel
          : b.precoAluguel - a.precoAluguel
      })
    }

    return resultado
  }, [pecas, catsAtivas, coresAtivas, busca, ordem])

  const visiveis = filtradas.slice(0, mostrar)
  const temMais = filtradas.length > visiveis.length
  const filtrando = catsAtivas.length > 0 || coresAtivas.length > 0 || busca !== ''

  /** Categoria única selecionada: só então a página tem SEO próprio. */
  const categoriaSozinha = catsAtivas.length === 1 ? catsAtivas[0] : null

  const dadosEstruturados = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: categoriaSozinha ? tituloCategoria(categoriaSozinha, cidade) : 'Catálogo',
      numberOfItems: visiveis.length,
      itemListElement: visiveis.map((peca, indice) => ({
        '@type': 'ListItem',
        position: indice + 1,
        url: `${SITE_URL}/peca/${peca.slug}`,
        name: `${peca.nome}, ${peca.descricao}`,
      })),
    }),
    [categoriaSozinha, visiveis, cidade],
  )

  /** Escreve na URL preservando o resto e zerando a paginação. */
  function atualizar(mudancas: Record<string, string | null>) {
    const proximos = new URLSearchParams(params)
    for (const [chave, valor] of Object.entries(mudancas)) {
      if (valor === null || valor === '') proximos.delete(chave)
      else proximos.set(chave, valor)
    }
    /* Trocar filtro reinicia a contagem: manter "mostrar=48" depois de
       filtrar para três vestidos deixaria o botão "carregar mais" sumindo e
       aparecendo sem motivo aparente. */
    if (!('mostrar' in mudancas)) proximos.delete('mostrar')
    setParams(proximos)
  }

  function alternar(chave: 'categoria' | 'cor', valor: string) {
    const atuais = lista(params.get(chave))
    const proximos = atuais.includes(valor)
      ? atuais.filter((v) => v !== valor)
      : [...atuais, valor]
    atualizar({ [chave]: proximos.join(',') })
  }

  return (
    <section className="secao bg-off-white">
      <Seo
        titulo={categoriaSozinha ? tituloCategoria(categoriaSozinha, cidade) : 'Catálogo'}
        descricao={
          categoriaSozinha
            ? descricaoCategoria(categoriaSozinha, cidade)
            : 'Acervo completo da Danielli Noivas: vestidos de noiva, de festa e de 15 anos para alugar, com prova no showroom e ajuste incluso.'
        }
        imagem={visiveis[0]?.imagens[0]}
        /* Só a categoria entra na canônica. Cor, busca e ordenação são
           recortes da mesma página: se cada combinação virasse endereço
           próprio, o buscador acharia dezenas de páginas quase idênticas. */
        caminho={
          categoriaSozinha ? `/catalogo?categoria=${categoriaSozinha}` : '/catalogo'
        }
        dadosEstruturados={dadosEstruturados}
      />

      <div className="container-luxo">
        <SecaoTitulo
          eyebrow="Acervo"
          titulo="Catálogo"
          descricao="Todos os modelos são para aluguel, com prova no showroom e ajuste incluso."
          nivel={1}
          centralizado
        />

        {/* Barra superior: busca, ordenação e o gatilho dos filtros no celular */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinza"
            />
            <label className="sr-only" htmlFor="busca-catalogo">
              Buscar no acervo
            </label>
            <input
              id="busca-catalogo"
              type="search"
              className="input pl-11"
              placeholder="Buscar por nome ou detalhe"
              value={busca}
              onChange={(e) => atualizar({ busca: e.target.value })}
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="ordem-catalogo">
              Ordenar
            </label>
            <select
              id="ordem-catalogo"
              className="input w-auto"
              value={ordem}
              onChange={(e) => atualizar({ ordem: e.target.value })}
            >
              {ORDENACOES.filter(
                /* Ordenar por preço só faz sentido quando existe preço. */
                (o) => comPreco || !o.valor.includes('preco'),
              ).map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setFiltrosAbertos((v) => !v)}
            aria-expanded={filtrosAbertos}
            aria-controls="painel-filtros"
            className="btn-contorno btn-sm sm:hidden"
          >
            <SlidersHorizontal size={15} strokeWidth={1.5} aria-hidden />
            Filtros
          </button>
        </div>

        {/* Painel de filtros: sempre visível a partir de sm, dobrável no celular */}
        <div
          id="painel-filtros"
          className={cn(
            'mt-8 flex-col items-center gap-7',
            filtrosAbertos ? 'flex' : 'hidden sm:flex',
          )}
        >
          <GrupoFiltro rotulo="Categoria">
            {categorias.map((categoria) => (
              <Chip
                key={categoria}
                ativo={catsAtivas.includes(categoria)}
                aoClicar={() => alternar('categoria', categoria)}
              >
                {rotulosCategoria[categoria]}
              </Chip>
            ))}
          </GrupoFiltro>

          <GrupoFiltro rotulo="Cor">
            {cores.map((cor) => (
              <Chip
                key={cor}
                ativo={coresAtivas.includes(cor)}
                aoClicar={() => alternar('cor', cor)}
              >
                <span
                  aria-hidden
                  className="size-3 shrink-0 border border-preto/20"
                  style={{ backgroundColor: amostraCor[cor] }}
                />
                {rotulosCor[cor]}
              </Chip>
            ))}
          </GrupoFiltro>
        </div>

        {/* Contagem — dá retorno imediato de que o filtro agiu. */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <p aria-live="polite" className="text-sm text-preto/65">
            {filtradas.length} {filtradas.length === 1 ? 'vestido' : 'vestidos'}
          </p>

          {filtrando && (
            <button
              type="button"
              onClick={() => setParams({})}
              className="inline-flex items-center gap-1.5 text-sm text-cinza underline-offset-4 transition-colors duration-300 ease-suave hover:text-preto hover:underline"
            >
              <X size={14} strokeWidth={1.75} aria-hidden />
              Limpar filtros
            </button>
          )}
        </div>

        {visiveis.length > 0 ? (
          <>
            <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visiveis.map((peca: Peca, indice: number) => (
                <li key={peca.slug}>
                  <CardPeca peca={peca} prioridade={indice < 4} />
                </li>
              ))}
            </ul>

            {temMais && (
              <div className="mt-16 flex justify-center">
                <button
                  type="button"
                  onClick={() => atualizar({ mostrar: String(mostrar + PASSO_PAGINA) })}
                  className="btn-contorno"
                >
                  Carregar mais
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center border border-borda-sutil bg-branco px-8 py-20 text-center">
            <span className="filete" />
            <h2 className="mt-8 text-h4 uppercase tracking-luxo">
              Nenhum vestido com esses filtros
            </h2>
            <p className="mt-4 max-w-sm text-preto/65">
              O acervo é renovado com frequência, e nem tudo que chega já está no
              site. Tire um filtro ou chame no WhatsApp para saber o que entrou.
            </p>
            <button
              type="button"
              onClick={() => setParams({})}
              className="btn-contorno mt-10"
            >
              Ver todos os vestidos
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function GrupoFiltro({
  rotulo,
  children,
}: {
  rotulo: string
  children: React.ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={`Filtrar por ${rotulo.toLowerCase()}`}
      className="flex flex-wrap items-center justify-center gap-3"
    >
      <span className="eyebrow mr-1">{rotulo}</span>
      {children}
    </div>
  )
}

function Chip({
  ativo,
  aoClicar,
  children,
}: {
  ativo: boolean
  aoClicar: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      aria-pressed={ativo}
      className={cn(
        'inline-flex items-center gap-2 border px-5 py-2.5 font-display text-h6',
        'uppercase leading-none tracking-luxo transition-all duration-300 ease-suave',
        ativo
          ? 'border-preto bg-preto text-branco'
          : 'border-borda bg-transparent text-preto hover:border-preto hover:text-cinza',
      )}
    >
      {children}
    </button>
  )
}
