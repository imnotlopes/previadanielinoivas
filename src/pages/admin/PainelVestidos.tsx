import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'

import { PECAS_POR_APRESENTACAO } from '../../data/apresentacoes'
import { identificacao, type Peca } from '../../data/pecas'
import { useLoja } from '../../lib/loja'
import { cn } from '../../lib/utils'

export default function PainelVestidos() {
  return (
    <Routes>
      <Route index element={<Listagem />} />
      <Route path="novo" element={<Formulario />} />
      <Route path=":codigo" element={<Formulario />} />
    </Routes>
  )
}

/* -------------------------------------------------------------------------- */
/* Listagem                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Lista do acervo, em cartões e não em tabela.
 *
 * A Danielli opera do celular, ela disse que não tem computador. Tabela com
 * seis colunas em tela de 375px vira rolagem lateral, e rolagem lateral com o
 * polegar é a forma mais rápida de alguém desistir de usar um painel.
 *
 * Cada cartão traz o interruptor de VISÍVEL em primeiro plano, porque é a ação
 * que ela vai fazer mais vezes: o acervo do ateliê é maior que a apresentação,
 * e o que muda no dia a dia é o que entra e o que sai dela.
 */
function Listagem() {
  const { pecas, salvarPeca, removerPeca } = useLoja()
  const [filtro, setFiltro] = useState<'todas' | 'visiveis' | 'ocultas'>('todas')

  const listadas = pecas.filter((peca) =>
    filtro === 'todas' ? true : filtro === 'visiveis' ? peca.visivel : !peca.visivel,
  )

  const naApresentacao = pecas.filter((p) => p.visivel).length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-h3 uppercase tracking-luxo">Peças</h1>
          <span className="filete mt-5" />
        </div>

        <Link to="/admin/vestidos/novo" className="btn-primario btn-sm">
          <Plus size={16} strokeWidth={1.75} aria-hidden />
          Nova peça
        </Link>
      </div>

      <p className="mt-8 text-sm text-preto/70">
        <strong>{naApresentacao}</strong> de {pecas.length} estão liberadas
        para as apresentações. As ocultas continuam aqui, só não são mostradas
        à cliente.
      </p>

      {/*
        O teto é o que mais confunde no painel: ela libera trinta peças e vê
        doze na apresentação. Dito aqui, com o número, e explicando que o
        destaque é o controle dela sobre quais.
      */}
      <p className="mt-2 text-sm text-preto/70">
        Cada apresentação mostra até <strong>{PECAS_POR_APRESENTACAO}</strong>{' '}
        peças. Marque como <strong>destaque</strong> as que você quer que
        apareçam primeiro.
      </p>

      {/* Filtro rápido: no celular é o que substitui procurar na lista. */}
      <div className="mt-5 flex flex-wrap gap-2">
        {(
          [
            ['todas', `Todas (${pecas.length})`],
            ['visiveis', `Na apresentação (${naApresentacao})`],
            ['ocultas', `Ocultas (${pecas.length - naApresentacao})`],
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
            key={peca.codigo}
            className={cn(
              'flex items-center gap-4 border bg-branco p-3',
              peca.visivel ? 'border-borda-sutil' : 'border-dashed border-borda',
            )}
          >
            <Link
              to={`/admin/vestidos/${peca.codigo}`}
              className="flex min-w-0 flex-1 items-center gap-4"
            >
              <img
                src={peca.fotos[0]}
                alt=""
                loading="lazy"
                className={cn(
                  'size-16 shrink-0 bg-bege object-cover',
                  !peca.visivel && 'opacity-45',
                )}
              />
              <span className="min-w-0">
                <span className="block truncate font-display text-h6 uppercase tracking-luxo">
                  {identificacao(peca)}
                </span>
                {/*
                  Cor e tamanho entraram no lugar do preço, e a falta deles é
                  dita em palavra: é o que ela precisa preencher, e some da
                  linha assim que preencher.
                */}
                <span className="mt-0.5 block truncate text-sm text-preto/60">
                  {peca.cores.length > 0 ? peca.cores.join(', ') : 'sem cor'}
                  {' · '}
                  {peca.tamanhos.length > 0 ? peca.tamanhos.join('/') : 'sem tamanho'}
                </span>
              </span>
            </Link>

            {/*
              Alvo de toque grande (44px é o mínimo confortável para o polegar)
              e estado dito em palavra, não só em ícone: "olho cortado" sozinho
              é ambíguo, pode ser "está oculto" ou "clique para ocultar".
            */}
            <button
              type="button"
              onClick={() => salvarPeca({ ...peca, visivel: !peca.visivel })}
              aria-pressed={peca.visivel}
              className={cn(
                'flex min-h-11 shrink-0 items-center gap-2 border px-3 text-sm transition-colors duration-300 ease-suave',
                peca.visivel
                  ? 'border-preto bg-preto text-branco'
                  : 'border-borda text-preto/60 hover:border-preto hover:text-preto',
              )}
            >
              {peca.visivel ? (
                <Eye size={16} strokeWidth={1.5} aria-hidden />
              ) : (
                <EyeOff size={16} strokeWidth={1.5} aria-hidden />
              )}
              <span className="hidden sm:inline">
                {peca.visivel ? 'Na apresentação' : 'Oculta'}
              </span>
              <span className="sr-only">
                {peca.visivel
                  ? `${identificacao(peca)} está na apresentação. Clique para ocultar.`
                  : `${identificacao(peca)} está oculta. Clique para mostrar.`}
              </span>
            </button>

            <button
              type="button"
              aria-label={`Remover ${identificacao(peca)}`}
              onClick={() => {
                if (confirm(`Remover a peça ${identificacao(peca)} do acervo?`)) {
                  removerPeca(peca.codigo)
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
            ? 'Nenhuma peça cadastrada. As apresentações aparecem sem modelos.'
            : 'Nenhuma peça neste filtro.'}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Formulário                                                                  */
/* -------------------------------------------------------------------------- */

const VAZIA: Peca = {
  codigo: '',
  publico: 'noivas',
  fotos: [],
  cores: [],
  tamanhos: [],
  descricao: '',
  destaque: false,
  visivel: true,
  preco: null,
}

/** "38, 40 e 42" vira ['38', '40', '42']. */
function paraLista(texto: string): string[] {
  return texto
    .split(/[,;/]| e /)
    .map((v) => v.trim())
    .filter(Boolean)
}

function Formulario() {
  const { codigo } = useParams<{ codigo: string }>()
  const { pecas, salvarPeca } = useLoja()
  const navegar = useNavigate()

  const existente = codigo ? pecas.find((p) => p.codigo === codigo) : undefined
  const [form, setForm] = useState<Peca>(existente ?? VAZIA)

  /* Guardados como texto: campo livre é mais fácil de preencher no celular do
     que um construtor de lista, e a conversão acontece no envio. */
  const [fotosTexto, setFotosTexto] = useState((existente?.fotos ?? []).join('\n'))
  const [coresTexto, setCoresTexto] = useState((existente?.cores ?? []).join(', '))
  const [tamanhosTexto, setTamanhosTexto] = useState((existente?.tamanhos ?? []).join(', '))
  const [erro, setErro] = useState('')

  const editando = Boolean(existente)

  function enviar(evento: FormEvent) {
    evento.preventDefault()

    const codigoFinal = form.codigo.trim().toUpperCase()
    if (!codigoFinal) {
      return setErro('Dê um código à peça. É por ele que você acha na arara.')
    }
    if (!editando && pecas.some((p) => p.codigo === codigoFinal)) {
      return setErro('Já existe uma peça com esse código.')
    }

    const fotos = fotosTexto
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (fotos.length === 0) {
      return setErro('Informe ao menos uma foto: a primeira é a capa do card.')
    }

    salvarPeca({
      ...form,
      codigo: codigoFinal,
      nome: form.nome?.trim() || undefined,
      fotos,
      cores: paraLista(coresTexto),
      tamanhos: paraLista(tamanhosTexto),
      preco: null,
    })
    navegar('/admin/vestidos')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-h3 uppercase tracking-luxo">
        {editando ? identificacao(form) : 'Nova peça'}
      </h1>
      <span className="filete mt-5" />

      <form onSubmit={enviar} className="mt-10 flex flex-col gap-6">
        {/* A curadoria vem primeiro: é a decisão mais importante da tela. */}
        <label className="flex items-start gap-3 border-l-2 border-dourado bg-branco p-5">
          <input
            type="checkbox"
            checked={form.visivel}
            onChange={(e) => setForm({ ...form, visivel: e.target.checked })}
            className="mt-0.5 size-5 shrink-0 accent-preto"
          />
          <span>
            <span className="block font-display text-h6 uppercase tracking-luxo">
              Mostrar na apresentação
            </span>
            <span className="mt-1 block text-sm text-preto/65">
              Desmarcada, a peça continua cadastrada aqui e não aparece para a
              cliente. Use para o que ainda não tem foto boa.
            </span>
          </span>
        </label>

        {/*
          O seletor "Para quem" saiu daqui junto com as apresentações de
          madrinhas e de noivos. Ele dizia "decide em qual das três
          apresentações a peça aparece", e com uma só isso deixou de ser
          verdade: um campo de escolha única que muda nada é pior que campo
          nenhum, porque parece que faz alguma coisa.

          A grade continua de duas colunas para o código ficar com largura de
          código, e não de linha inteira.
        */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="codigo">
              Código
            </label>
            <input
              id="codigo"
              className="input uppercase"
              value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })}
              placeholder="N-41"
              disabled={editando}
            />
            <p className="mt-2 text-sm text-preto/60">
              {editando
                ? 'O código não muda depois de criado: ele já viajou em links e mensagens.'
                : 'Como você chama a peça na arara. É o que a cliente manda de volta.'}
            </p>
          </div>

        </div>

        <div>
          <label className="label" htmlFor="nome">
            Nome <span className="text-cinza">(opcional)</span>
          </label>
          <input
            id="nome"
            className="input"
            value={form.nome ?? ''}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Deixe vazio para aparecer só o código"
          />
          <p className="mt-2 text-sm text-preto/60">
            Só preencha com o nome de verdade da peça. Vazio, a apresentação
            mostra o código.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="descricao">
            Descrição
          </label>
          <input
            id="descricao"
            className="input"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            placeholder="Renda com gola alta e manga longa"
          />
          <p className="mt-2 text-sm text-preto/60">
            Uma linha: a silhueta e o detalhe que identifica a peça.
          </p>
        </div>

        {/*
          CORES E TAMANHOS ENTRARAM NO LUGAR DO PREÇO.

          A apresentação não mostra valor nenhum nesta fase, nem "sob
          consulta", que lê como informação faltando. O que a cliente quer
          saber antes de ir até lá é se existe na cor dela e no tamanho dela.
        */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="cores">
              Cores disponíveis
            </label>
            <input
              id="cores"
              className="input"
              value={coresTexto}
              onChange={(e) => setCoresTexto(e.target.value)}
              placeholder="Branco, Marfim"
            />
            <p className="mt-2 text-sm text-preto/60">
              Separe por vírgula. Vazio, a linha some da apresentação.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="tamanhos">
              Tamanhos
            </label>
            <input
              id="tamanhos"
              className="input"
              inputMode="numeric"
              value={tamanhosTexto}
              onChange={(e) => setTamanhosTexto(e.target.value)}
              placeholder="38, 40, 42"
            />
            <p className="mt-2 text-sm text-preto/60">
              É a segunda pergunta de toda cliente, depois da foto.
            </p>
          </div>
        </div>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={form.destaque}
            onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
            className="mt-0.5 size-5 shrink-0 accent-preto"
          />
          <span>
            <span className="block font-display text-h6 uppercase tracking-luxo">
              Destaque
            </span>
            <span className="mt-1 block text-sm text-preto/65">
              Vai para o começo da apresentação. É o que a cliente vê primeiro.
            </span>
          </span>
        </label>

        <div>
          <label className="label" htmlFor="video">
            Vídeo <span className="text-cinza">(opcional)</span>
          </label>
          <input
            id="video"
            className="input"
            value={form.video ?? ''}
            onChange={(e) => setForm({ ...form, video: e.target.value || undefined })}
            placeholder="/videos/peca.mp4"
          />
          <p className="mt-2 text-sm text-preto/60">
            Peça parada e peça andando são coisas diferentes, e é o vídeo que
            fecha a dúvida sobre caimento.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="fotos">
            Fotos
          </label>
          <textarea
            id="fotos"
            className="input min-h-32"
            value={fotosTexto}
            onChange={(e) => setFotosTexto(e.target.value)}
            placeholder={'/pecas/exemplo.webp\n/pecas/exemplo-2.webp'}
          />
          <p className="mt-2 text-sm text-preto/60">
            Um caminho por linha, a primeira é a capa. Nesta demonstração o
            painel não envia arquivo: a foto precisa já estar em `public/`.
          </p>
        </div>

        {erro && (
          <p role="alert" className="border-l-2 border-erro bg-branco p-4 text-sm text-preto">
            {erro}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primario">
            Salvar
          </button>
          <Link to="/admin/vestidos" className="btn-contorno">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
