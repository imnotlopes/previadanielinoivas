import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { brand, navegacao } from '../lib/brand'
import { useContato } from '../lib/loja'
import { cn } from '../lib/utils'
import { IconeInstagram } from './icones'

export default function Header() {
  const [aberto, setAberto] = useState(false)
  const { pathname } = useLocation()
  const { instagram, linkInstagram } = useContato()

  // Fecha o menu ao navegar — sem isso ele fica aberto sobre a página nova.
  useEffect(() => setAberto(false), [pathname])

  // Trava o scroll do fundo enquanto o painel mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [aberto])

  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  const classeLink = ({ isActive }: { isActive: boolean }) =>
    cn('link-menu', isActive && 'text-cinza')

  return (
    <header className="sticky top-0 z-40 border-b border-borda-sutil bg-off-white/95 backdrop-blur">
      <div className="container-luxo flex h-20 items-center justify-between gap-6 md:h-24">
        {/*
          Lockup horizontal: o selo da marca + o nome em texto.
          A logo é um selo circular com o nome escrito dentro; reduzida à
          altura do header, o "DANIELLI" dela ficaria com ~4px e ilegível. Por
          isso usamos o selo como símbolo e compomos o nome com a tipografia
          do site, que é o que mantém o cabeçalho legível em 320px de tela.
        */}
        {/*
          `min-w-0` em vez de `shrink-0`: o nome é `whitespace-nowrap`, e num
          aparelho bem estreito (tipo Galaxy Fold, 280px) um lockup que não
          encolhe empurra o botão do menu para fora e a página passa a rolar
          de lado. Assim ele cede espaço antes de estourar.
        */}
        <NavLink
          to="/"
          className="group flex min-w-0 items-center gap-3 leading-none sm:gap-4"
          aria-label={`${brand.nome}, ${brand.subtitulo}, página inicial`}
        >
          <img
            src="/logo-simbolo.webp"
            alt=""
            width={150}
            height={150}
            className="h-9 w-auto shrink-0 md:h-11"
          />
          <span className="block min-w-0">
            <span className="block truncate font-display text-h4 uppercase tracking-luxo-lg text-preto transition-colors duration-300 ease-suave group-hover:text-cinza">
              {brand.nome}
            </span>
            <span className="mt-1.5 block font-display text-[0.6875rem] uppercase tracking-luxo-lg text-cinza">
              {brand.subtitulo}
            </span>
          </span>
        </NavLink>

        {/* Navegação desktop */}
        <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
          {navegacao.map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === '/'} className={classeLink}>
              {item.rotulo}
            </NavLink>
          ))}

          <a
            href={linkInstagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram da loja (${instagram})`}
            className="text-preto transition-colors duration-300 ease-suave hover:text-cinza"
          >
            <IconeInstagram />
          </a>
        </nav>

        {/* Gatilho mobile */}
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          className="-mr-2 p-2 text-preto transition-colors duration-300 ease-suave hover:text-cinza md:hidden"
        >
          {aberto ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Painel mobile */}
      <div
        id="menu-mobile"
        hidden={!aberto}
        className="border-t border-borda-sutil bg-off-white md:hidden"
      >
        <nav aria-label="Principal (mobile)" className="container-luxo flex flex-col py-2">
          {navegacao.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'border-b border-borda-sutil py-5 last:border-b-0',
                  'link-menu',
                  isActive && 'text-cinza',
                )
              }
            >
              {item.rotulo}
            </NavLink>
          ))}

          <a
            href={linkInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="link-menu flex items-center gap-3 border-t border-borda-sutil py-5"
          >
            <IconeInstagram width={18} height={18} />
            Instagram
          </a>
        </nav>
      </div>
    </header>
  )
}
