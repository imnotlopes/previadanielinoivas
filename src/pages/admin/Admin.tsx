import { LayoutDashboard, LogOut, Settings, Shirt, Tag } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'

import Seo from '../../components/Seo'
import { gravarSessaoPainel, lerSessaoPainel, useLoja } from '../../lib/loja'
import { cn } from '../../lib/utils'
import PainelConfiguracoes from './PainelConfiguracoes'
import PainelCupons from './PainelCupons'
import PainelVestidos from './PainelVestidos'

/**
 * PAINEL ADMINISTRATIVO — PRÉVIA
 * ==============================
 *
 * Existe para mostrar como será operar a loja: cadastrar vestido, criar
 * cupom, trocar o WhatsApp. As telas são de verdade e as edições aparecem no
 * site na hora.
 *
 * O QUE ELE NÃO É:
 *
 *   - não tem banco de dados. Tudo é gravado no `localStorage` do navegador
 *     de quem está mexendo (ver lib/loja.tsx);
 *   - não tem autenticação. A "entrada" abaixo é um botão, e o endereço
 *     /admin é público. Não guarde nada sensível aqui;
 *   - não publica nada. O que a visitante vê continua sendo o conteúdo de
 *     src/data/, versionado no Git e enviado no deploy.
 *
 * O aviso é repetido dentro do painel de propósito: a pessoa que for ver a
 * demonstração precisa entender o limite antes de cadastrar trinta vestidos e
 * descobrir que nada foi para o ar.
 */
export default function Admin() {
  const [entrou, setEntrou] = useState(lerSessaoPainel)

  if (!entrou) return <Entrada aoEntrar={() => setEntrou(true)} />

  return (
    <div className="flex min-h-svh flex-col bg-off-white lg:flex-row">
      {/* O painel nunca deve aparecer em busca. */}
      <Seo titulo="Painel" descricao="Painel administrativo." naoIndexar />

      <Sidebar aoSair={() => setEntrou(false)} />

      <main className="min-w-0 flex-1 px-6 py-10 md:px-10 lg:py-14">
        <AvisoPrevia />

        <Routes>
          <Route index element={<Inicio />} />
          <Route path="vestidos/*" element={<PainelVestidos />} />
          <Route path="cupons/*" element={<PainelCupons />} />
          <Route path="configuracoes" element={<PainelConfiguracoes />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Entrada                                                                     */
/* -------------------------------------------------------------------------- */

function Entrada({ aoEntrar }: { aoEntrar: () => void }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-off-white px-6">
      <Seo titulo="Painel" descricao="Painel administrativo." naoIndexar />

      <div className="w-full max-w-md border border-borda-sutil bg-branco p-10 text-center">
        <img src="/logo-simbolo.webp" alt="" width={150} height={150} className="mx-auto h-14 w-auto" />

        <h1 className="mt-6 text-h4 uppercase tracking-luxo">Painel da loja</h1>
        <span className="filete mx-auto mt-5" />

        {/*
          Sem campo de senha de propósito. Um formulário de login que aceita
          qualquer coisa ensina a pessoa a confiar numa proteção que não
          existe — e este endereço é público. Melhor dizer a verdade na cara.
        */}
        <p className="mt-6 text-sm leading-relaxed text-preto/70">
          Esta é uma <strong>demonstração</strong>. Não há senha nem banco de
          dados: o que você editar fica guardado só neste navegador e serve para
          ver como o painel vai funcionar.
        </p>

        <button
          type="button"
          onClick={() => {
            gravarSessaoPainel(true)
            aoEntrar()
          }}
          className="btn-primario mt-8 w-full"
        >
          Entrar no painel
        </button>

        <Link
          to="/"
          className="mt-6 inline-block text-sm text-cinza underline-offset-4 hover:text-preto hover:underline"
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Casca                                                                       */
/* -------------------------------------------------------------------------- */

const MENU = [
  { para: '/admin', rotulo: 'Início', icone: LayoutDashboard, exato: true },
  { para: '/admin/vestidos', rotulo: 'Vestidos', icone: Shirt, exato: false },
  { para: '/admin/cupons', rotulo: 'Cupons', icone: Tag, exato: false },
  { para: '/admin/configuracoes', rotulo: 'Configurações', icone: Settings, exato: false },
]

function Sidebar({ aoSair }: { aoSair: () => void }) {
  const navegar = useNavigate()

  return (
    <aside className="shrink-0 border-b border-borda-sutil bg-branco lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-6 py-6">
        <img src="/logo-simbolo.webp" alt="" width={150} height={150} className="h-9 w-auto" />
        <span className="font-display text-h6 uppercase tracking-luxo">Painel</span>
      </div>

      <nav aria-label="Painel" className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible">
        {MENU.map((item) => (
          <NavLink
            key={item.para}
            to={item.para}
            end={item.exato}
            className={({ isActive }) =>
              cn(
                'flex shrink-0 items-center gap-3 px-4 py-3 text-sm transition-colors duration-300 ease-suave',
                isActive ? 'bg-preto text-branco' : 'text-preto/75 hover:bg-off-white',
              )
            }
          >
            <item.icone size={17} strokeWidth={1.5} aria-hidden />
            {item.rotulo}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-borda-sutil px-4 py-4 lg:mt-auto">
        <button
          type="button"
          onClick={() => {
            gravarSessaoPainel(false)
            aoSair()
            navegar('/')
          }}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-preto/75 transition-colors duration-300 ease-suave hover:bg-off-white"
        >
          <LogOut size={17} strokeWidth={1.5} aria-hidden />
          Sair e voltar ao site
        </button>
      </div>
    </aside>
  )
}

function AvisoPrevia() {
  const { editado, restaurarSemente } = useLoja()

  return (
    <div className="mb-10 border-l-2 border-dourado bg-branco p-6">
      <p className="font-display text-h6 uppercase tracking-luxo">Demonstração</p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-preto/75">
        As alterações feitas aqui ficam guardadas <strong>só neste navegador</strong>.
        Elas não vão para o site publicado, não aparecem em outro computador e
        somem se você limpar os dados de navegação. Para publicar de verdade,
        as mudanças precisam ser feitas nos arquivos do projeto e enviadas num
        deploy.
      </p>

      {editado && (
        <button
          type="button"
          onClick={() => {
            if (confirm('Descartar todas as alterações e voltar ao conteúdo original?')) {
              restaurarSemente()
            }
          }}
          className="btn-contorno btn-sm mt-5"
        >
          Descartar minhas alterações
        </button>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Início                                                                      */
/* -------------------------------------------------------------------------- */

function Inicio() {
  const { pecas, cupons, config } = useLoja()

  const cartoes = [
    { rotulo: 'Vestidos no acervo', valor: pecas.length, para: '/admin/vestidos' },
    {
      rotulo: 'Em destaque na home',
      valor: pecas.filter((p) => p.destaque).length,
      para: '/admin/vestidos',
    },
    {
      rotulo: 'Cupons ativos',
      valor: cupons.filter((c) => c.ativo).length,
      para: '/admin/cupons',
    },
    {
      rotulo: 'Vestidos com preço',
      valor: pecas.filter((p) => p.precoAluguel !== null).length,
      para: '/admin/vestidos',
    },
  ]

  const pendencias = [
    !config.whatsapp && 'Número de WhatsApp não preenchido — os botões do site caem no Instagram.',
    !config.cidade && 'Cidade não preenchida — os títulos de busca saem sem ela.',
    pecas.every((p) => p.precoAluguel === null) &&
      'Nenhum vestido tem preço: todos aparecem como "valor sob consulta".',
  ].filter(Boolean) as string[]

  return (
    <div>
      <h1 className="text-h3 uppercase tracking-luxo">Início</h1>
      <span className="filete mt-5" />

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cartoes.map((cartao) => (
          <li key={cartao.rotulo}>
            <Link
              to={cartao.para}
              className="block border border-borda-sutil bg-branco p-6 transition-colors duration-300 ease-suave hover:border-preto"
            >
              <p className="font-display text-h2 leading-none">{cartao.valor}</p>
              <p className="mt-3 text-sm text-preto/65">{cartao.rotulo}</p>
            </Link>
          </li>
        ))}
      </ul>

      {pendencias.length > 0 && (
        <div className="mt-10 border border-borda-sutil bg-branco p-7">
          <h2 className="font-display text-h5 uppercase tracking-luxo">
            Falta preencher
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {pendencias.map((texto) => (
              <li key={texto} className="flex gap-3 text-sm text-preto/75">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-dourado" />
                {texto}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
