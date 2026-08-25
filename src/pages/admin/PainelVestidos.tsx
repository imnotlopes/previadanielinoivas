import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'

import {
  rotulosCategoria,
  rotulosCor,
  type CategoriaPeca,
  type CorPeca,
  type Peca,
} from '../../data/pecas'
import { useLoja } from '../../lib/loja'
import { precoBRL } from '../../lib/preco'

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

function Listagem() {
  const { pecas, removerPeca } = useLoja()

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

      <div className="mt-10 overflow-x-auto border border-borda-sutil bg-branco">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-borda-sutil">
            <tr className="font-display uppercase tracking-luxo text-preto/65">
              <th scope="col" className="p-4 font-normal">Vestido</th>
              <th scope="col" className="p-4 font-normal">Categoria</th>
              <th scope="col" className="p-4 font-normal">Cor</th>
              <th scope="col" className="p-4 font-normal">Preço</th>
              <th scope="col" className="p-4 font-normal">Destaque</th>
              <th scope="col" className="p-4 font-normal">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pecas.map((peca) => (
              <tr key={peca.slug} className="border-b border-borda-sutil last:border-b-0">
                <td className="p-4">
                  <Link
                    to={`/admin/vestidos/${peca.slug}`}
                    className="flex items-center gap-3 underline-offset-4 hover:underline"
                  >
                    <img
                      src={peca.imagens[0]}
                      alt=""
                      loading="lazy"
                      className="size-12 shrink-0 bg-bege object-cover"
                    />
                    <span>
                      <span className="block font-display text-h6 uppercase tracking-luxo">
                        {peca.nome}
                      </span>
                      <span className="block text-preto/60">{peca.descricao}</span>
                    </span>
                  </Link>
                </td>
                <td className="p-4">{rotulosCategoria[peca.categoria]}</td>
                <td className="p-4">{rotulosCor[peca.cor]}</td>
                <td className="p-4">{precoBRL(peca.precoAluguel)}</td>
                <td className="p-4">{peca.destaque ? 'Sim' : '—'}</td>
                <td className="p-4 text-right">
                  <button
                    type="button"
                    aria-label={`Remover ${peca.nome}`}
                    onClick={() => {
                      if (confirm(`Remover o vestido ${peca.nome} do acervo?`)) {
                        removerPeca(peca.slug)
                      }
                    }}
                    className="text-preto/50 transition-colors duration-300 ease-suave hover:text-erro"
                  >
                    <Trash2 size={17} strokeWidth={1.5} aria-hidden />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pecas.length === 0 && (
        <p className="mt-8 text-sm text-preto/65">
          Nenhum vestido no acervo. O site mostra o catálogo vazio.
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
  /* Guardado à parte: um textarea com uma imagem por linha é mais fácil de
     colar do que um construtor de lista, e a prévia não tem upload. */
  const [imagensTexto, setImagensTexto] = useState((existente?.imagens ?? []).join('\n'))
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

    const slugFinal = editando
      ? form.slug
      : `${form.categoria}-${paraSlug(nome)}`

    if (!editando && pecas.some((p) => p.slug === slugFinal)) {
      return setErro('Já existe um vestido com esse nome nesta categoria.')
    }

    salvarPeca({ ...form, nome, slug: slugFinal, imagens })
    navegar('/admin/vestidos')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-h3 uppercase tracking-luxo">
        {editando ? form.nome : 'Novo vestido'}
      </h1>
      <span className="filete mt-5" />

      <form onSubmit={enviar} className="mt-10 flex flex-col gap-6">
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
              placeholder="Deixe vazio para sob consulta"
            />
            <p className="mt-2 text-sm text-preto/60">
              Vazio faz o site mostrar "valor sob consulta".
            </p>
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
            <p className="mt-2 text-sm text-preto/60">
              Aparece riscado ao lado do valor, quando for maior que ele.
            </p>
          </div>
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
          <p className="mt-2 text-sm text-preto/60">
            Um caminho por linha, começando com barra. A prévia não tem envio de
            arquivo: as fotos precisam já estar em <code>public/pecas/</code>.
          </p>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(form.destaque)}
            onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
            className="size-4 accent-preto"
          />
          <span className="text-sm">Mostrar na vitrine da página inicial</span>
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
