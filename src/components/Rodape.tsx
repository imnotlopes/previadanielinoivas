import { Lock } from 'lucide-react'

import { CAMINHOS } from '../entradas/comum'
import { brand } from '../lib/brand'
import { useContato } from '../lib/loja'
import { cn } from '../lib/utils'
import { IconeInstagram, IconeWhatsapp } from './icones'

const MENSAGEM_RODAPE = `Olá! Vim pelo link da ${brand.nome} e gostaria de conversar.`

const classeContato =
  'inline-flex items-center gap-3 font-display text-h6 uppercase tracking-luxo text-branco/80 transition-colors duration-300 ease-suave hover:text-branco'

interface RodapeProps {
  /**
   * Versão curta, para o fim de um catálogo.
   *
   * Quem chegou ao fim de uma grade de vestidos rolando o polegar não precisa
   * de bloco institucional; precisa do WhatsApp. O rodapé inteiro fica para as
   * apresentações, onde ele fecha a leitura.
   */
  compacto?: boolean
}

export default function Rodape({ compacto = false }: RodapeProps) {
  const { instagram, linkInstagram, linkWhatsApp } = useContato()

  return (
    <footer className="bg-preto text-branco">
      <div
        className={cn(
          'container-luxo flex flex-col items-center text-center',
          compacto ? 'gap-6 py-12' : 'gap-10 py-16 md:py-20',
        )}
      >
        {!compacto && (
          <>
            {/*
              O selo da marca. A arte disponível é a foto de perfil do
              Instagram, quadrada e com 150px de lado — em ~160px ela ainda se
              segura, mas é o limite. Quando chegar o vetorial, troque
              public/logo.png e rode o script de importação.
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
              Aluguel de vestidos de noiva, festa e 15 anos, com prova no
              showroom e ajuste incluso.
            </p>
          </>
        )}

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-12">
          <a
            href={linkInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className={classeContato}
          >
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
          decorar o endereço. SAI ANTES DE QUALQUER LINK IR PARA UMA CLIENTE:
          noiva nenhuma precisa de um botão de administração no rodapé.

          Para tirar, apague este bloco. O endereço /admin continua funcionando
          por digitação, e já manda `noindex` e está no `Disallow` do robots.
        */}
        <a
          href={CAMINHOS.painel}
          className="inline-flex items-center gap-2 border border-dourado/50 px-5 py-2.5 font-display text-h6 uppercase tracking-luxo text-dourado transition-colors duration-300 ease-suave hover:border-dourado hover:bg-dourado hover:text-preto"
        >
          <Lock size={14} strokeWidth={1.5} aria-hidden />
          Painel da loja
          <span className="sr-only">(demonstração)</span>
        </a>

        {/* Sem menção a registro de marca: não há registro no INPI conhecido
            desta marca. Se houver, é aqui que a linha entra. */}
        <p className="text-xs tracking-wide text-branco/55">
          © {new Date().getFullYear()} {brand.subtitulo} {brand.nome}. Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  )
}
