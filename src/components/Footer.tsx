import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

import { brand } from '../lib/brand'
import { useContato } from '../lib/loja'
import { IconeInstagram, IconeWhatsapp } from './icones'

const MENSAGEM_RODAPE = `Olá! Vim pelo site da ${brand.nome} e gostaria de conversar.`

const classeContato =
  'inline-flex items-center gap-3 font-display text-h6 uppercase tracking-luxo text-branco/80 transition-colors duration-300 ease-suave hover:text-branco'

export default function Footer() {
  const { instagram, linkInstagram, linkWhatsApp } = useContato()

  return (
    <footer className="bg-preto text-branco">
      <div className="container-luxo flex flex-col items-center gap-10 py-16 text-center md:py-20">
        {/*
          O selo da marca. A única arte disponível é a foto de perfil do
          Instagram, quadrada e com 150px de lado — em ~160px ela ainda se
          segura, mas é o limite. Quando chegar o arquivo vetorial da logo,
          troque em scripts/importar-instagram.mjs e ajuste width/height.
        */}
        <img
          src="/logo-completo-claro.webp"
          alt={`${brand.subtitulo} ${brand.nome}`}
          width={150}
          height={150}
          loading="lazy"
          decoding="async"
          className="h-auto w-32 md:w-40"
        />

        <span className="filete-claro" />

        <p className="max-w-sm text-sm leading-relaxed text-branco/60">
          Aluguel de vestidos de noiva, festa e 15 anos, com prova no showroom e
          ajuste incluso.
        </p>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-12">
          <a href={linkInstagram} target="_blank" rel="noopener noreferrer" className={classeContato}>
            <IconeInstagram width={18} height={18} />
            {instagram}
          </a>

          <a
            href={linkWhatsApp(MENSAGEM_RODAPE)}
            target="_blank"
            rel="noopener noreferrer"
            className={classeContato}
          >
            <IconeWhatsapp width={18} height={18} />
            WhatsApp
          </a>
        </div>

        {/*
          ACESSO AO PAINEL — PROVISÓRIO, SÓ PARA A PRÉVIA.

          Existe para quem estiver vendo a demonstração achar o painel sem
          precisar decorar o endereço. SAI ANTES DE PUBLICAR: no site de
          verdade, ninguém que veio ver vestido precisa de um link para a
          administração no rodapé.

          Para tirar, apague este bloco inteiro. A rota /admin continua
          funcionando por digitação, e ela já manda `noindex` e está no
          `Disallow` do robots.txt — não é o link que a expõe.
        */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 border border-dourado/50 px-5 py-2.5 font-display text-h6 uppercase tracking-luxo text-dourado transition-colors duration-300 ease-suave hover:border-dourado hover:bg-dourado hover:text-preto"
        >
          <Lock size={14} strokeWidth={1.5} aria-hidden />
          Painel da loja
          <span className="sr-only">(demonstração)</span>
        </Link>

        {/* Sem menção a registro de marca: não há registro no INPI conhecido
            desta marca. Se houver, é aqui que a linha entra. */}
        <p className="mt-2 text-xs tracking-wide text-branco/55">
          © {new Date().getFullYear()} {brand.subtitulo} {brand.nome}. Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  )
}
