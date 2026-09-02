import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'

import {
  rotulosCategoria,
  rotulosCauda,
  rotulosCor,
  rotulosDecote,
  rotulosManga,
  rotulosOcasiao,
  rotulosSilhueta,
  type CategoriaPeca,
  type Cauda,
  type CorPeca,
  type Decote,
  type Manga,
  type OcasiaoFesta,
  type Peca,
  type Silhueta,
} from '../../data/pecas'
import { useLoja } from '../../lib/loja'
import { precoBRL } from '../../lib/preco'
import { cn } from '../../lib/utils'

export default function PainelVestidos() {
  return (
    <Routes>
      <Route index element={<Listagem />} />
      <Route path="novo" element={<Formulario />} />
      <Route path=":slug" element={<Formulario />} />
    </Routes>
  )
}

/* -------------------------------------------------------------------------- */
/* Listagem                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Lista do acervo, em cartões e não em tabela.
 *
 * A Danielli opera do celular — ela disse que não tem computador. Tabela com
 * seis colunas em tela de 375px vira rolagem lateral, e rolagem lateral com o
 * polegar é a forma mais rápida de alguém desistir de usar um painel.
 *
 * Cada cartão traz o interruptor de PUBLICADO em primeiro plano, porque é a
 * ação que ela vai fazer mais vezes: o acervo inteiro está cadastrado, e o que
 * muda no dia a dia é o que entra ou sai do catálogo que a cliente recebe.
 */
function Listagem() {
  const { pecas, salvarPeca, removerPeca } = useLoja()
  const [filtro, setFiltro] = useState<'todos' | 'publicados' | 'ocultos'>('todos')

  const listadas = pecas.filter((peca) =>
    filtro === 'todos' ? true : filtro === 'publicados' ? peca.publicado : !peca.publicado,
  )

  const publicados = pecas.filter((p) => p.publicado).length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-h3 uppercase tracking-luxo">Vestidos</h1>
          <span className="filete mt-5" />
        </div>

        <Link to="/admin/vestidos/novo" className="btn-primario btn-sm">
          <Plus size={16} strokeWidth={1.75} aria-hidden />
          Novo vestido
        </Link>
      </div>

      <p className="mt-8 text-sm text-preto/70">
        <strong>{publicados}</strong> de {pecas.length} aparecem no catálogo que a
        cliente recebe. Os ocultos continuam aqui, só não são mostrados a ela.
      </p>

      {/* Filtro rápido: no celular é o que substitui procurar na lista. */}
      <div className="mt-5 flex flex-wrap gap-2">
        {(
          [
            ['todos', `Todos (${pecas.length})`],
            ['publicados', `No catálogo (${publicados})`],
            ['ocultos', `Ocultos (${pecas.length - publicados})`],
          ] as const
        ).map(([valor, rotulo]) => (
          <button
            key={valor}
            type="button"
            onClick={() => setFiltro(valor)}
            aria-pressed={filtro === valor}
            className={cn(
              'border px-4 py-2 text-sm transition-colors duration-300 ease-suave',
              filtro === valor
                ? 'border-preto bg-preto text-branco'
                : 'border-borda text-preto hover:border-preto',
            )}
          >
            {rotulo}
          </button>
        ))}
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {listadas.map((peca) => (
          <li
            key={peca.slug}
            className={cn(
              'flex items-center gap-4 border bg-branco p-3',
              peca.publicado ? 'border-borda-sutil' : 'border-dashed border-borda',
            )}
          >
            <Link to={`/admin/vestidos/${peca.slug}`} className="flex min-w-0 flex-1 items-center gap-4">
              <img
                src={peca.imagens[0]}
                alt=""
                loading="lazy"
                className={cn(
                  'size-16 shrink-0 bg-bege object-cover',
                  !peca.publicado && 'opacity-45',
                )}
              />
              <span className="min-w-0">
                <span className="block truncate font-display text-h6 uppercase tracking-luxo">
                  {peca.nome}
                </span>
                <span className="mt-0.5 block truncate text-sm text-preto/60">
                  {rotulosCategoria[peca.categoria]} · {rotulosCor[peca.cor]}
                  {peca.numeracao.length > 0 && ` · ${peca.numeracao.join('/')}`}
                </span>
                <span className="mt-0.5 block text-sm text-preto/60">
                  {precoBRL(peca.precoAluguel)}
                </span>
              </span>
            </Link>

            {/*
              Alvo de toque grande (44px é o mínimo confortável para o polegar)
              e estado dito em palavra, não só em ícone: "olho cortado" sozinho
              é ambíguo — pode ser "está oculto" ou "clique para ocultar".
            */}
            <button
              type="button"
              onClick={() => salvarPeca({ ...peca, publicado: !peca.publicado })}
              aria-pressed={peca.publicado}
              className={cn(
                'flex min-h-11 shrink-0 items-center gap-2 border px-3 text-sm transition-colors duration-300 ease-suave',
                peca.publicado
                  ? 'border-preto bg-preto text-branco'
                  : 'border-borda text-preto/60 hover:border-preto hover:text-preto',
              )}
            >
              {peca.publicado ? (
                <Eye size={16} strokeWidth={1.5} aria-hidden />
              ) : (
                <EyeOff size={16} strokeWidth={1.5} aria-hidden />
              )}
              <span className="hidden sm:inline">
                {peca.publicado ? 'No catálogo' : 'Oculto'}
              </span>
              <span className="sr-only">
                {peca.publicado
                  ? `${peca.nome} está no catálogo. Clique para ocultar.`
                  : `${peca.nome} está oculto. Clique para publicar.`}
              </span>
            </button>

            <button
              type="button"
              aria-label={`Remover ${peca.nome}`}
              onClick={() => {
                if (confirm(`Remover o vestido ${peca.nome} do acervo?`)) {
                  removerPeca(peca.slug)
                }
              }}
              className="flex min-h-11 shrink-0 items-center px-2 text-preto/40 transition-colors duration-300 ease-suave hover:text-erro"
            >
              <Trash2 size={17} strokeWidth={1.5} aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      {listadas.length === 0 && (
        <p className="mt-8 text-sm text-preto/65">
          {pecas.length === 0
            ? 'Nenhum vestido cadastrado. O catálogo aparece vazio para a cliente.'
            : 'Nenhum vestido neste filtro.'}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Formulário                                                                  */
/* -------------------------------------------------------------------------- */

const VAZIO: Peca = {
  slug: '',
  nome: '',
  categoria: 'noiva',
  descricao: '',
  imagens: [],
  precoAluguel: null,
  cor: 'branco',
  numeracao: [],
  publicado: true,
}

/** "Vestido da Antônia" → "vestido-da-antonia". */
function paraSlug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function Formulario() {
  const { slug } = useParams<{ slug: string }>()
  const { pecas, salvarPeca } = useLoja()
  const navegar = useNavigate()

  const existente = slug ? pecas.find((p) => p.slug === slug) : undefined
  const [form, setForm] = useState<Peca>(existente ?? VAZIO)
  /* Guardados como texto: um campo livre é mais fácil de preencher no celular
     do que um construtor de lista, e o parse acontece no envio. */
  const [imagensTexto, setImagensTexto] = useState((existente?.imagens ?? []).join('\n'))
  const [numeracaoTexto, setNumeracaoTexto] = useState(
    (existente?.numeracao ?? []).join(', '),
  )
  const [erro, setErro] = useState('')

  const editando = Boolean(existente)

  function enviar(evento: React.FormEvent) {
    evento.preventDefault()

    const nome = form.nome.trim()
    if (!nome) return setErro('Dê um nome ao vestido. É por ele que a cliente pede.')

    const imagens = imagensTexto
      .split('\n')
      .map((linha) => linha.trim())
      .filter(Boolean)
    if (imagens.length === 0) {
      return setErro('Informe ao menos uma foto: o card do catálogo usa a primeira.')
    }

    const numeracao = numeracaoTexto
      .split(/[,\s]+/)
      .map((n) => n.trim())
      .filter(Boolean)

    const slugFinal = editando ? form.slug : `${form.categoria}-${paraSlug(nome)}`

    if (!editando && pecas.some((p) => p.slug === slugFinal)) {
      return setErro('Já existe um vestido com esse nome nesta categoria.')
    }

    salvarPeca({
      ...form,
      nome,
      slug: slugFinal,
      imagens,
      numeracao,
      /* Ocasião só existe dentro de festa: sair de festa limpa o campo, para
         não sobrar "madrinha" grudado num vestido de noiva. */
      ocasiao: form.categoria === 'festa' ? form.ocasiao : undefined,
      video: form.video?.trim() || undefined,
    })
    navegar('/admin/vestidos')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-h3 uppercase tracking-luxo">
        {editando ? form.nome : 'Novo vestido'}
      </h1>
      <span className="filete mt-5" />

      <form onSubmit={enviar} className="mt-10 flex flex-col gap-6">
        {/* A curadoria vem primeiro: é a decisão mais importante da tela. */}
        <label className="flex items-start gap-3 border-l-2 border-dourado bg-branco p-5">
          <input
            type="checkbox"
            checked={form.publicado}
            onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
            className="mt-0.5 size-5 shrink-0 accent-preto"
          />
          <span>
            <span className="block font-display text-h6 uppercase tracking-luxo">
              Mostrar no catálogo
            </span>
            <span className="mt-1 block text-sm text-preto/65">
              Desmarcado, o vestido continua cadastrado aqui mas não aparece para
              a cliente. Use para o que ainda não tem foto profissional.
            </span>
          </span>
        </label>

        <div>
          <label className="label" htmlFor="nome">Nome do vestido</label>
          <input
            id="nome"
            className="input"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Aurora"
          />
          <p className="mt-2 text-sm text-preto/60">
            O nome do modelo, não o da cliente: o mesmo vestido veste várias
            noivas ao longo do tempo.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            className="input"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            placeholder="Renda com gola alta e manga longa"
          />
          <p className="mt-2 text-sm text-preto/60">
            Uma linha: a silhueta e o detalhe que identifica o vestido.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="categoria">Categoria</label>
            <select
              id="categoria"
              className="input"
              value={form.categoria}
              onChange={(e) =>
                setForm({ ...form, categoria: e.target.value as CategoriaPeca })
              }
            >
              {(Object.keys(rotulosCategoria) as CategoriaPeca[]).map((c) => (
                <option key={c} value={c}>{rotulosCategoria[c]}</option>
              ))}
            </select>
            <p className="mt-2 text-sm text-preto/60">
              Decide em qual catálogo o vestido aparece.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="cor">Cor</label>
            <select
              id="cor"
              className="input"
              value={form.cor}
              onChange={(e) => setForm({ ...form, cor: e.target.value as CorPeca })}
            >
              {(Object.keys(rotulosCor) as CorPeca[]).map((c) => (
                <option key={c} value={c}>{rotulosCor[c]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ocasião só faz sentido em festa, e por isso só aparece lá. */}
        {form.categoria === 'festa' && (
          <div>
            <label className="label" htmlFor="ocasiao">Ocasião</label>
            <select
              id="ocasiao"
              className="input"
              value={form.ocasiao ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  ocasiao: (e.target.value || undefined) as OcasiaoFesta | undefined,
                })
              }
            >
              <option value="">Não informar</option>
              {(Object.keys(rotulosOcasiao) as OcasiaoFesta[]).map((o) => (
                <option key={o} value={o}>{rotulosOcasiao[o]}</option>
              ))}
            </select>
            <p className="mt-2 text-sm text-preto/60">
              Formanda, madrinha e mãe procuram coisas diferentes. É por aqui que
              a cliente filtra.
            </p>
          </div>
        )}

        {/*
          FICHA TÉCNICA — o vocabulário da arara.

          Vem depois da cor e antes da numeração porque é essa a ordem da
          conversa na loja: a noiva descarta por formato antes de perguntar
          tamanho.

          Todos começam em "não informar", e é assim que devem ficar até ela
          conferir peça por peça. Um decote errado no catálogo é uma noiva que
          vem à loja provar um vestido que não queria — pior que campo vazio.
        */}
        <fieldset className="border border-borda-sutil bg-branco p-5">
          <legend className="px-2 font-display text-h6 uppercase tracking-luxo">
            Ficha técnica
          </legend>

          <p className="text-sm text-preto/65">
            Cada campo preenchido vira um filtro no catálogo. Enquanto nenhum
            vestido tiver silhueta, por exemplo, o filtro de silhueta nem
            aparece para a cliente.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <SelecaoFicha
              id="silhueta"
              rotulo="Silhueta"
              valor={form.silhueta}
              rotulos={rotulosSilhueta}
              aoMudar={(v) => setForm({ ...form, silhueta: v as Silhueta | undefined })}
            />
            <SelecaoFicha
              id="decote"
              rotulo="Decote"
              valor={form.decote}
              rotulos={rotulosDecote}
              aoMudar={(v) => setForm({ ...form, decote: v as Decote | undefined })}
            />
            <SelecaoFicha
              id="manga"
              rotulo="Manga"
              valor={form.manga}
              rotulos={rotulosManga}
              aoMudar={(v) => setForm({ ...form, manga: v as Manga | undefined })}
            />
            <SelecaoFicha
              id="cauda"
              rotulo="Cauda"
              valor={form.cauda}
              rotulos={rotulosCauda}
              aoMudar={(v) => setForm({ ...form, cauda: v as Cauda | undefined })}
            />
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="numeracao">Numeração</label>
          <input
            id="numeracao"
            className="input"
            inputMode="numeric"
            value={numeracaoTexto}
            onChange={(e) => setNumeracaoTexto(e.target.value)}
            placeholder="38, 40, 42"
          />
          <p className="mt-2 text-sm text-preto/60">
            Separe por vírgula. É a segunda pergunta de toda cliente, e vai junto
            na mensagem do WhatsApp quando ela pedir para provar.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="preco">Valor do aluguel</label>
            <input
              id="preco"
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.precoAluguel ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  precoAluguel: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              placeholder="Vazio = sob consulta"
            />
          </div>

          <div>
            <label className="label" htmlFor="precoDe">Valor cheio (promoção)</label>
            <input
              id="precoDe"
              type="number"
              min={0}
              step="0.01"
              className="input"
              value={form.precoDe ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  precoDe: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              placeholder="Opcional"
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="video">Vídeo</label>
          <input
            id="video"
            className="input"
            value={form.video ?? ''}
            onChange={(e) => setForm({ ...form, video: e.target.value })}
            placeholder="Link do YouTube ou /videos/aurora.mp4"
          />
          <p className="mt-2 text-sm text-preto/60">
            Abre dentro da própria ficha, sem precisar mandar separado. Link do
            Instagram também funciona, mas abre fora — o Instagram não deixa
            outro site exibir o vídeo por dentro.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="imagens">Fotos</label>
          <textarea
            id="imagens"
            className="input min-h-32 font-mono text-sm"
            value={imagensTexto}
            onChange={(e) => setImagensTexto(e.target.value)}
            placeholder="/pecas/aurora-renda-gola-alta.webp"
          />
          {/*
            TODO: o envio de foto pelo celular é o buraco que mais dói neste
            painel — hoje é preciso colar um caminho de arquivo que já exista
            em public/. Resolver junto com o banco de verdade.
          */}
          <p className="mt-2 text-sm text-preto/60">
            Um caminho por linha. Esta prévia ainda não envia arquivo: as fotos
            precisam já estar em <code>public/pecas/</code>.
          </p>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(form.destaque)}
            onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
            className="size-5 accent-preto"
          />
          <span className="text-sm">Mostrar na amostra da apresentação</span>
        </label>

        {erro && (
          <p role="alert" className="border-l-2 border-erro bg-branco p-4 text-sm text-preto">
            {erro}
          </p>
        )}

        <div className="flex flex-wrap gap-4 pt-2">
          <button type="submit" className="btn-primario">
            {editando ? 'Salvar alterações' : 'Cadastrar vestido'}
          </button>
          <Link to="/admin/vestidos" className="btn-contorno">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

/**
 * Um campo da ficha técnica.
 *
 * Os quatro têm exatamente a mesma forma — rótulo, "não informar" e a lista de
 * opções —, e escrever quatro `<select>` iguais à mão é convidar a divergência
 * na quinta vez que alguém mexer aqui.
 *
 * "Não informar" é o valor vazio de propósito: é diferente de "sem cauda", que
 * é uma informação. Um vestido sem cauda cadastrado como "não informar" some
 * do filtro de quem quer justamente vestido sem cauda.
 */
function SelecaoFicha<T extends string>({
  id,
  rotulo,
  valor,
  rotulos,
  aoMudar,
}: {
  id: string
  rotulo: string
  valor: T | undefined
  rotulos: Record<T, string>
  aoMudar: (valor: string | undefined) => void
}) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {rotulo}
      </label>
      <select
        id={id}
        className="input"
        value={valor ?? ''}
        onChange={(e) => aoMudar(e.target.value || undefined)}
      >
        <option value="">Não informar</option>
        {(Object.keys(rotulos) as T[]).map((chave) => (
          <option key={chave} value={chave}>
            {rotulos[chave]}
          </option>
        ))}
      </select>
    </div>
  )
}
