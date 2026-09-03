import { LayoutGrid, Rows3, Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  amostraCor,
  coresDisponiveis,
  decotesDisponiveis,
  mangasDisponiveis,
  numeracoesDisponiveis,
  ocasioesDisponiveis,
  rotulosCor,
  rotulosDecote,
  rotulosManga,
  rotulosOcasiao,
  rotulosSilhueta,
  silhuetasDisponiveis,
  temPreco,
  type CorPeca,
  type Decote,
  type Manga,
  type OcasiaoFesta,
  type Peca,
  type Silhueta,
} from '../data/pecas'
import { cn } from '../lib/utils'
import CardPeca from './CardPeca'

/**
 * O ESTADO DOS FILTROS MORA NA URL
 * ================================
 * Nada de `useState` para filtro. A query string é a fonte de verdade, e isso
 * resolve o caso que mais importa aqui: a Danielli consegue mandar para a
 * noiva um link **já filtrado** — "olha os marfins no 42" — direto do
 * WhatsApp. Também faz o botão voltar do navegador funcionar.
 *
 * `mostrar` e `vista` estão na URL pelo mesmo motivo: sem eles, quem clicou
 * "carregar mais" três vezes, abriu um vestido e voltou, cairia na primeira
 * dúzia — e no meio de um atendimento isso é ter que refazer o caminho na
 * frente da noiva.
 */

/** Quantos entram por vez. A folha de contato mostra mais, porque cabe mais. */
const PASSO_PADRAO = 12
const PASSO_DENSO = 30

const ORDENACOES_BASE = [
  { valor: 'padrao', rotulo: 'Destaques primeiro' },
  { valor: 'nome', rotulo: 'Nome (A–Z)' },
] as const

const ORDENACOES_PRECO = [
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
] as const

type Ordem =
  | (typeof ORDENACOES_BASE)[number]['valor']
  | (typeof ORDENACOES_PRECO)[number]['valor']

/** Lê a URL. Valor inválido é ignorado em silêncio, nunca quebra a página. */
function lista(bruto: string | null): string[] {
  if (!bruto) return []
  return bruto.split(',').map((v) => v.trim()).filter(Boolean)
}

/**
 * Tira acento e caixa para comparar.
 *
 * A busca precisa achar "Alícia" quando alguém digita "alicia", e achar
 * "Cecília" com "cecilia". Ninguém digita acento no meio de um atendimento —
 * e uma busca que devolve zero resultado para um vestido que está ali é o
 * tipo de falha que faz a pessoa desistir da busca e voltar a rolar.
 */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

/**
 * Tudo que a busca enxerga num vestido.
 *
 * Inclui os RÓTULOS, e não só os códigos: quem digita "sereia" ou "manga
 * longa" espera achar, e `peca.silhueta` guarda `'sereia'` mas
 * `peca.manga` guarda `'longa'`. Sem os rótulos, metade das buscas que a
 * noiva faz em voz alta não encontraria nada.
 */
function textoBuscavel(peca: Peca): string {
  return normalizar(
    [
      peca.nome,
      peca.descricao,
      rotulosCor[peca.cor],
      peca.silhueta && rotulosSilhueta[peca.silhueta],
      peca.decote && rotulosDecote[peca.decote],
      peca.manga && rotulosManga[peca.manga],
      peca.ocasiao && rotulosOcasiao[peca.ocasiao],
      ...peca.numeracao,
    ]
      .filter(Boolean)
      .join(' '),
  )
}

interface GradeAcervoProps {
  /** Já filtrada por categoria e por `publicadas()` pelo chamador. */
  acervo: Peca[]
  /** Prefixo das fichas: `/catalogo` ou `/festa`. */
  base: string
  /** Ocasião só faz sentido em festa; em noiva o grupo nem aparece. */
  comOcasiao?: boolean
  /** Texto do estado vazio, que muda com o público da peça. */
  vazio: ReactNode
}

/**
 * Grade filtrável do acervo, compartilhada pelo catálogo de noiva e pelo de
 * festa.
 *
 * O que muda entre os dois é a lista que entra e um grupo de filtro; a
 * mecânica é a mesma, e duplicá-la significaria corrigir bug em dois lugares.
 *
 * ESTA TELA É USADA DE PÉ, COM UMA NOIVA DO LADO
 * ----------------------------------------------
 * Três decisões saem daí, e todas custam alguma coisa:
 *
 *  1. **A barra de busca e filtro gruda no topo.** Achar um vestido no meio da
 *     lista e ter que rolar até em cima para filtrar é o atrito mais caro que
 *     esta tela pode ter — acontece a cada atendimento.
 *  2. **A folha de contato.** Um modo em que cabem seis vestidos por linha, só
 *     foto e nome, para a noiva apontar. Descrição e preço em cada card são
 *     úteis para quem lê sozinha em casa e atrapalham quem está escolhendo com
 *     alguém do lado.
 *  3. **A busca ignora acento** e enxerga cor, silhueta, decote e numeração.
 */
export default function GradeAcervo({
  acervo,
  base,
  comOcasiao = false,
  vazio,
}: GradeAcervoProps) {
  const [params, setParams] = useSearchParams()
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)

  const cores = coresDisponiveis(acervo)
  const numeracoes = numeracoesDisponiveis(acervo)
  const ocasioes = comOcasiao ? ocasioesDisponiveis(acervo) : []
  const comPreco = temPreco(acervo)

  /*
    OS FILTROS DA ARARA
    -------------------
    Silhueta, decote e manga são como a escolha acontece de pé na loja: a
    noiva chega dizendo "nada tomara que caia" e isso corta metade do acervo
    antes de olhar foto. Cor e numeração respondem depois.

    Cada grupo só existe quando há vestido classificado — hoje nenhum está, e
    por isso os três somem inteiros. Ver a ficha técnica em data/pecas.ts.
  */
  const silhuetas = silhuetasDisponiveis(acervo)
  const decotes = decotesDisponiveis(acervo)
  const mangas = mangasDisponiveis(acervo)

  const coresAtivas = lista(params.get('cor')).filter((c): c is CorPeca =>
    cores.includes(c as CorPeca),
  )
  const numsAtivas = lista(params.get('numeracao')).filter((n) => numeracoes.includes(n))
  const ocasioesAtivas = lista(params.get('ocasiao')).filter((o): o is OcasiaoFesta =>
    ocasioes.includes(o as OcasiaoFesta),
  )
  const silhuetasAtivas = lista(params.get('silhueta')).filter((v): v is Silhueta =>
    silhuetas.includes(v as Silhueta),
  )
  const decotesAtivos = lista(params.get('decote')).filter((v): v is Decote =>
    decotes.includes(v as Decote),
  )
  const mangasAtivas = lista(params.get('manga')).filter((v): v is Manga =>
    mangas.includes(v as Manga),
  )
  const busca = (params.get('busca') ?? '').trim()

  /*
    A ordenação por nome existe SEMPRE.

    Antes o seletor inteiro só aparecia quando havia preço cadastrado — e como
    o acervo está todo "sob consulta", ninguém conseguia ordenar por nome. Com
    40 vestidos batizados, "A–Z" é justamente o que resolve "cadê o Malu?".
  */
  const ordenacoes = comPreco
    ? [...ORDENACOES_BASE, ...ORDENACOES_PRECO]
    : ORDENACOES_BASE

  const ordemBruta = params.get('ordem')
  const ordem: Ordem = ordenacoes.some((o) => o.valor === ordemBruta)
    ? (ordemBruta as Ordem)
    : 'padrao'

  const denso = params.get('vista') === 'denso'
  const passo = denso ? PASSO_DENSO : PASSO_PADRAO
  const mostrar = Math.max(passo, Number(params.get('mostrar')) || passo)

  const filtradas = useMemo(() => {
    const termo = normalizar(busca)

    const resultado = acervo.filter((peca) => {
      if (coresAtivas.length > 0 && !coresAtivas.includes(peca.cor)) return false
      if (numsAtivas.length > 0 && !peca.numeracao.some((n) => numsAtivas.includes(n))) {
        return false
      }
      if (ocasioesAtivas.length > 0) {
        if (!peca.ocasiao || !ocasioesAtivas.includes(peca.ocasiao)) return false
      }
      if (silhuetasAtivas.length > 0) {
        if (!peca.silhueta || !silhuetasAtivas.includes(peca.silhueta)) return false
      }
      if (decotesAtivos.length > 0) {
        if (!peca.decote || !decotesAtivos.includes(peca.decote)) return false
      }
      if (mangasAtivas.length > 0) {
        if (!peca.manga || !mangasAtivas.includes(peca.manga)) return false
      }
      /* Cada palavra digitada precisa aparecer em algum lugar do vestido:
         "renda longa" acha o que tem os dois, em qualquer ordem. */
      if (termo) {
        const alvo = textoBuscavel(peca)
        if (!termo.split(/\s+/).every((palavra) => alvo.includes(palavra))) return false
      }
      return true
    })

    /*
      A ORDEM PADRÃO É A CURADORIA DELA.

      `destaque` já existia para escolher a amostra da apresentação; usá-lo
      também aqui dá à Danielli um controle que ela não tinha: marcar um
      vestido como destaque no painel o leva para o topo do catálogo. Quem
      abre o link vê primeiro o que a loja quer mostrar, e não o que foi
      cadastrado primeiro.

      `sort` é estável, então dentro de cada grupo a ordem do acervo se
      mantém — o destaque promove, não embaralha.
    */
    if (ordem === 'padrao') {
      resultado.sort((a, b) => Number(Boolean(b.destaque)) - Number(Boolean(a.destaque)))
    } else if (ordem === 'nome') {
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
  }, [
    acervo,
    coresAtivas,
    numsAtivas,
    ocasioesAtivas,
    silhuetasAtivas,
    decotesAtivos,
    mangasAtivas,
    busca,
    ordem,
  ])

  const visiveis = filtradas.slice(0, mostrar)
  const temMais = filtradas.length > visiveis.length
  const filtrando =
    coresAtivas.length > 0 ||
    numsAtivas.length > 0 ||
    ocasioesAtivas.length > 0 ||
    silhuetasAtivas.length > 0 ||
    decotesAtivos.length > 0 ||
    mangasAtivas.length > 0 ||
    busca !== ''

  /** Escreve na URL preservando o resto e zerando a paginação. */
  function atualizar(mudancas: Record<string, string | null>) {
    const proximos = new URLSearchParams(params)
    for (const [chave, valor] of Object.entries(mudancas)) {
      if (valor === null || valor === '') proximos.delete(chave)
      else proximos.set(chave, valor)
    }
    /* Trocar filtro reinicia a contagem: manter "mostrar=48" depois de
       filtrar para três vestidos faria o botão "carregar mais" sumir e
       aparecer sem motivo aparente. */
    if (!('mostrar' in mudancas)) proximos.delete('mostrar')
    setParams(proximos)
  }

  function alternar(chave: string, valor: string) {
    const atuais = lista(params.get(chave))
    const proximos = atuais.includes(valor)
      ? atuais.filter((v) => v !== valor)
      : [...atuais, valor]
    atualizar({ [chave]: proximos.join(',') })
  }

  /* Quantos grupos estão cortando a lista agora. Vai no próprio botão, que
     com o painel fechado é o único lugar que pode avisar. */
  const quantosFiltros =
    coresAtivas.length +
    numsAtivas.length +
    ocasioesAtivas.length +
    silhuetasAtivas.length +
    decotesAtivos.length +
    mangasAtivas.length

  return (
    <>
      {/*
        A BARRA GRUDA NO TOPO.

        `top-20 md:top-24` é exatamente a altura do cabeçalho (`h-20 md:h-24`
        em TopoMarca) — as duas medidas andam juntas, e mexer numa sem mexer na
        outra deixa a barra por baixo do cabeçalho ou com um vão entre eles.

        O `z-30` fica ABAIXO do cabeçalho (z-40) e da barra da lista de prova
        (z-50), que é a ordem certa de quem tapa quem.

        `-mx-6` e `px-6` desfazem e refazem a margem do container: sem isso a
        faixa de fundo teria as bordas soltas e os cards passariam por baixo
        nas laterais ao rolar.
      */}
      <div
        className="sticky top-20 z-30 -mx-6 mt-12 border-b border-borda-sutil
                   bg-off-white/95 px-6 py-3 backdrop-blur
                   md:top-24 md:-mx-10 md:px-10 lg:-mx-14 lg:px-14"
      >
        {/*
          UMA LINHA SÓ, E CURTA.

          Esta barra fica na tela o tempo todo, então cada pixel dela é pixel
          que o vestido não tem. Numa tela de 812px, uma barra de 230px come
          quase um terço do que a noiva veio ver — e a foto é o produto.

          Por isso ordenação e filtros moram no painel dobrável, e só busca,
          modo de exibição e o gatilho do painel ficam sempre visíveis.
        */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              strokeWidth={1.5}
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cinza"
            />
            <label className="sr-only" htmlFor="busca-acervo">
              Buscar no acervo
            </label>
            <input
              id="busca-acervo"
              type="search"
              className="input py-2.5 pl-11"
              placeholder="Nome, cor, detalhe ou numeração"
              value={busca}
              onChange={(e) => atualizar({ busca: e.target.value })}
            />
          </div>

          {/*
            O interruptor da folha de contato. Só ícone no celular: é onde
            menos cabe texto e onde ele mais é usado, porque é a diferença
            entre ver dois vestidos por tela e ver seis.
          */}
          <button
            type="button"
            onClick={() => atualizar({ vista: denso ? null : 'denso', mostrar: null })}
            aria-pressed={denso}
            aria-label={denso ? 'Ver os cards com descrição' : 'Ver mais vestidos por vez'}
            className="btn-contorno btn-sm shrink-0 px-3 sm:px-6"
          >
            {denso ? (
              <Rows3 size={16} strokeWidth={1.5} aria-hidden />
            ) : (
              <LayoutGrid size={16} strokeWidth={1.5} aria-hidden />
            )}
            <span className="hidden sm:inline">{denso ? 'Com detalhe' : 'Mais por vez'}</span>
          </button>

          <button
            type="button"
            onClick={() => setFiltrosAbertos((v) => !v)}
            aria-expanded={filtrosAbertos}
            aria-controls="painel-filtros"
            className={cn(
              'btn-sm shrink-0 px-3 sm:px-6',
              filtrando ? 'btn-primario' : 'btn-contorno',
            )}
          >
            <SlidersHorizontal size={16} strokeWidth={1.5} aria-hidden />
            <span className="hidden sm:inline">Filtros</span>
            {/* O número de filtros ligados aparece no próprio botão: com o
                painel fechado, é o único aviso de que a lista está cortada. */}
            {quantosFiltros > 0 && <span aria-hidden>{quantosFiltros}</span>}
            <span className="sr-only">
              Filtros e ordenação
              {quantosFiltros > 0 &&
                `, ${quantosFiltros} ${quantosFiltros === 1 ? 'ativo' : 'ativos'}`}
            </span>
          </button>
        </div>

        {/*
          A CONTAGEM MORA NA BARRA, e não solta no meio da página.

          É a resposta a "quantos ainda restam depois desse filtro?", e essa
          pergunta é feita enquanto se rola — não só no topo.
        */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <p aria-live="polite" className="text-sm text-preto/65">
            {filtradas.length === acervo.length
              ? `${acervo.length} vestidos`
              : `${filtradas.length} de ${acervo.length}`}
          </p>

          {filtrando && (
            <button
              type="button"
              onClick={() => setParams(denso ? { vista: 'denso' } : {})}
              className="inline-flex items-center gap-1.5 text-sm text-cinza underline-offset-4 transition-colors duration-300 ease-suave hover:text-preto hover:underline"
            >
              <X size={14} strokeWidth={1.75} aria-hidden />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/*
        O painel dobrável: ordenação e filtros.

        A ORDENAÇÃO MORA AQUI, e não na barra. Ela é usada uma vez por sessão
        ("me mostra em ordem alfabética"), não a cada rolagem, e não vale a
        linha permanente que custaria. O painel existe mesmo quando não há
        nenhum grupo de filtro, porque ordenar por nome sempre existe — se
        dependesse de `temAlgumFiltro`, um acervo de uma cor só ficaria sem
        jeito de ordenar.
      */}
      {filtrosAbertos && (
        <div id="painel-filtros" className="mt-8 flex flex-col items-center gap-7">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="eyebrow mr-1" htmlFor="ordem-acervo">
              Ordenar
            </label>
            <select
              id="ordem-acervo"
              className="input w-auto py-2.5"
              value={ordem}
              onChange={(e) => atualizar({ ordem: e.target.value })}
            >
              {ordenacoes.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </div>

          {ocasioes.length > 1 && (
            <Grupo rotulo="Ocasião">
              {ocasioes.map((ocasiao) => (
                <Chip
                  key={ocasiao}
                  ativo={ocasioesAtivas.includes(ocasiao)}
                  aoClicar={() => alternar('ocasiao', ocasiao)}
                >
                  {rotulosOcasiao[ocasiao]}
                </Chip>
              ))}
            </Grupo>
          )}

          {silhuetas.length > 1 && (
            <Grupo rotulo="Silhueta">
              {silhuetas.map((silhueta) => (
                <Chip
                  key={silhueta}
                  ativo={silhuetasAtivas.includes(silhueta)}
                  aoClicar={() => alternar('silhueta', silhueta)}
                >
                  {rotulosSilhueta[silhueta]}
                </Chip>
              ))}
            </Grupo>
          )}

          {decotes.length > 1 && (
            <Grupo rotulo="Decote">
              {decotes.map((decote) => (
                <Chip
                  key={decote}
                  ativo={decotesAtivos.includes(decote)}
                  aoClicar={() => alternar('decote', decote)}
                >
                  {rotulosDecote[decote]}
                </Chip>
              ))}
            </Grupo>
          )}

          {mangas.length > 1 && (
            <Grupo rotulo="Manga">
              {mangas.map((manga) => (
                <Chip
                  key={manga}
                  ativo={mangasAtivas.includes(manga)}
                  aoClicar={() => alternar('manga', manga)}
                >
                  {rotulosManga[manga]}
                </Chip>
              ))}
            </Grupo>
          )}

          {cores.length > 1 && (
            <Grupo rotulo="Cor">
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
            </Grupo>
          )}

          {/*
            Numeração é a segunda pergunta de toda cliente. O grupo só aparece
            quando existe numeração cadastrada — hoje não existe nenhuma, e um
            filtro vazio seria pior que filtro nenhum.
          */}
          {numeracoes.length > 0 && (
            <Grupo rotulo="Numeração">
              {numeracoes.map((numero) => (
                <Chip
                  key={numero}
                  ativo={numsAtivas.includes(numero)}
                  aoClicar={() => alternar('numeracao', numero)}
                >
                  {numero}
                </Chip>
              ))}
            </Grupo>
          )}
        </div>
      )}

      {visiveis.length > 0 ? (
        <>
          <ul
            className={cn(
              'mt-10 grid',
              denso
                ? 'grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'
                : 'gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
            )}
          >
            {visiveis.map((peca, indice) => (
              <li key={peca.slug}>
                <CardPeca
                  peca={peca}
                  base={base}
                  /* A primeira fileira do modo aberto tem 4 cards; a da folha
                     de contato tem 6. Adiantar mais que a fileira visível só
                     disputa banda com o que já está na tela. */
                  prioridade={indice < (denso ? 6 : 4)}
                  variante={denso ? 'denso' : 'padrao'}
                  comProvar
                />
              </li>
            ))}
          </ul>

          {temMais && (
            <div className="mt-16 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => atualizar({ mostrar: String(mostrar + passo) })}
                className="btn-contorno"
              >
                Carregar mais
              </button>

              {/*
                O atalho para quem está atendendo: com a noiva do lado, clicar
                "carregar mais" três vezes é tempo morto. Só aparece quando
                ainda falta mais de uma leva.
              */}
              {filtradas.length - visiveis.length > passo && (
                <button
                  type="button"
                  onClick={() => atualizar({ mostrar: String(filtradas.length) })}
                  className="px-3 py-2.5 text-sm text-cinza underline-offset-4 transition-colors duration-300 ease-suave hover:text-preto hover:underline"
                >
                  Mostrar todos os {filtradas.length} de uma vez
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="mt-16 flex flex-col items-center border border-borda-sutil bg-branco px-8 py-20 text-center">
          <span className="filete" />
          <div className="mt-8 max-w-sm">{vazio}</div>
          {filtrando && (
            <button
              type="button"
              onClick={() => setParams(denso ? { vista: 'denso' } : {})}
              className="btn-contorno mt-10"
            >
              Ver todos
            </button>
          )}
        </div>
      )}
    </>
  )
}

function Grupo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
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
  children: ReactNode
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
