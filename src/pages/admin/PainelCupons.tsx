import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'

import { cupomEhValido, descontoLegivel, type Cupom } from '../../data/cupons'
import { useLoja } from '../../lib/loja'

export default function PainelCupons() {
  return (
    <Routes>
      <Route index element={<Listagem />} />
      <Route path="novo" element={<Formulario />} />
      <Route path=":id" element={<Formulario />} />
    </Routes>
  )
}

/* -------------------------------------------------------------------------- */
/* Listagem                                                                    */
/* -------------------------------------------------------------------------- */

function Listagem() {
  const { cupons, removerCupom } = useLoja()

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-h3 uppercase tracking-luxo">Cupons</h1>
          <span className="filete mt-5" />
        </div>

        <Link to="/admin/cupons/novo" className="btn-primario btn-sm">
          <Plus size={16} strokeWidth={1.75} aria-hidden />
          Novo cupom
        </Link>
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-preto/70">
        Cada cupom vira um link para a parceira divulgar:{' '}
        <code className="bg-branco px-1.5 py-0.5">
          {location.origin}/?cupom=CODIGO
        </code>
        . Quem abrir esse link vê a faixa de desconto no topo do site por 30
        dias, e o código vai junto na mensagem do WhatsApp.
      </p>

      <div className="mt-8 overflow-x-auto border border-borda-sutil bg-branco">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-borda-sutil">
            <tr className="font-display uppercase tracking-luxo text-preto/65">
              <th scope="col" className="p-4 font-normal">Código</th>
              <th scope="col" className="p-4 font-normal">Desconto</th>
              <th scope="col" className="p-4 font-normal">Parceira</th>
              <th scope="col" className="p-4 font-normal">Validade</th>
              <th scope="col" className="p-4 font-normal">Usos</th>
              <th scope="col" className="p-4 font-normal">Situação</th>
              <th scope="col" className="p-4 font-normal">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {cupons.map((cupom) => {
              const valido = cupomEhValido(cupom)
              return (
                <tr key={cupom.id} className="border-b border-borda-sutil last:border-b-0">
                  <td className="p-4">
                    <Link
                      to={`/admin/cupons/${cupom.id}`}
                      className="font-display uppercase tracking-luxo underline-offset-4 hover:underline"
                    >
                      {cupom.codigo}
                    </Link>
                  </td>
                  <td className="p-4">{descontoLegivel(cupom)}</td>
                  <td className="p-4">{cupom.parceira || '—'}</td>
                  <td className="p-4">
                    {cupom.validade ? formatarData(cupom.validade) : 'sem prazo'}
                  </td>
                  <td className="p-4">
                    {cupom.usos}
                    {cupom.limiteUsos !== null ? ` de ${cupom.limiteUsos}` : ''}
                  </td>
                  <td className="p-4">
                    {/* A situação é calculada, não digitada: um cupom "ativo"
                        que já venceu não vale, e mostrar "ativo" aqui faria a
                        loja prometer desconto que o site não aplica. */}
                    <span className={valido ? 'text-sucesso' : 'text-cinza'}>
                      {valido ? 'Valendo' : 'Não vale'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      aria-label={`Remover cupom ${cupom.codigo}`}
                      onClick={() => {
                        if (confirm(`Remover o cupom ${cupom.codigo}?`)) {
                          removerCupom(cupom.id)
                        }
                      }}
                      className="text-preto/50 transition-colors duration-300 ease-suave hover:text-erro"
                    >
                      <Trash2 size={17} strokeWidth={1.5} aria-hidden />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {cupons.length === 0 && (
        <p className="mt-8 text-sm text-preto/65">
          Nenhum cupom cadastrado. A faixa de desconto não aparece no site.
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Formulário                                                                  */
/* -------------------------------------------------------------------------- */

function novoCupom(): Cupom {
  return {
    id: `c${Date.now()}`,
    codigo: '',
    tipoDesconto: 'percentual',
    valor: 10,
    ativo: true,
    validade: null,
    limiteUsos: null,
    usos: 0,
  }
}

function Formulario() {
  const { id } = useParams<{ id: string }>()
  const { cupons, salvarCupom } = useLoja()
  const navegar = useNavigate()

  const existente = id ? cupons.find((c) => c.id === id) : undefined
  const [form, setForm] = useState<Cupom>(existente ?? novoCupom)
  const [erro, setErro] = useState('')

  const editando = Boolean(existente)

  function enviar(evento: React.FormEvent) {
    evento.preventDefault()

    /* Maiúsculas sempre: a cliente digita como quiser, e o código do link
       precisa bater com o cadastrado sem depender de caixa. */
    const codigo = form.codigo.trim().toUpperCase()
    if (!codigo) return setErro('Escreva o código que a cliente vai usar.')
    if (!/^[A-Z0-9]+$/.test(codigo)) {
      return setErro('Use só letras e números no código, sem espaço nem acento.')
    }
    if (form.valor <= 0) return setErro('O desconto precisa ser maior que zero.')
    if (
      !editando &&
      cupons.some((c) => c.codigo.toUpperCase() === codigo)
    ) {
      return setErro('Já existe um cupom com esse código.')
    }

    salvarCupom({ ...form, codigo })
    navegar('/admin/cupons')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-h3 uppercase tracking-luxo">
        {editando ? form.codigo : 'Novo cupom'}
      </h1>
      <span className="filete mt-5" />

      <form onSubmit={enviar} className="mt-10 flex flex-col gap-6">
        <div>
          <label className="label" htmlFor="codigo">Código</label>
          <input
            id="codigo"
            className="input uppercase"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            placeholder="NOIVA10"
            autoCapitalize="characters"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="tipo">Tipo de desconto</label>
            <select
              id="tipo"
              className="input"
              value={form.tipoDesconto}
              onChange={(e) =>
                setForm({
                  ...form,
                  tipoDesconto: e.target.value as Cupom['tipoDesconto'],
                })
              }
            >
              <option value="percentual">Porcentagem</option>
              <option value="valor">Valor em reais</option>
            </select>
          </div>

          <div>
            <label className="label" htmlFor="valor">
              {form.tipoDesconto === 'percentual' ? 'Porcentagem' : 'Valor em reais'}
            </label>
            <input
              id="valor"
              type="number"
              min={0}
              step={form.tipoDesconto === 'percentual' ? 1 : 0.01}
              className="input"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="parceira">Parceira (opcional)</label>
          <input
            id="parceira"
            className="input"
            value={form.parceira ?? ''}
            onChange={(e) => setForm({ ...form, parceira: e.target.value })}
            placeholder="Nome de quem divulga"
          />
          <p className="mt-2 text-sm text-preto/60">
            Aparece na faixa do site: "cupom NOIVA10 de Camila aplicado".
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="validade">Válido até (opcional)</label>
            <input
              id="validade"
              type="date"
              className="input"
              value={form.validade ?? ''}
              onChange={(e) =>
                setForm({ ...form, validade: e.target.value || null })
              }
            />
          </div>

          <div>
            <label className="label" htmlFor="limite">Limite de usos (opcional)</label>
            <input
              id="limite"
              type="number"
              min={0}
              className="input"
              value={form.limiteUsos ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  limiteUsos: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              placeholder="Sem limite"
            />
          </div>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.ativo}
            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            className="size-4 accent-preto"
          />
          <span className="text-sm">Cupom ativo</span>
        </label>

        {erro && (
          <p role="alert" className="border-l-2 border-erro bg-branco p-4 text-sm text-preto">
            {erro}
          </p>
        )}

        <div className="flex flex-wrap gap-4 pt-2">
          <button type="submit" className="btn-primario">
            {editando ? 'Salvar alterações' : 'Criar cupom'}
          </button>
          <Link to="/admin/cupons" className="btn-contorno">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

/** "2026-12-31" → "31/12/2026", sem depender de fuso. */
function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : iso
}
