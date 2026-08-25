import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import BotaoWhatsapp from '../components/BotaoWhatsapp'
import CardPeca from '../components/CardPeca'
import SecaoCasamentos from '../components/SecaoCasamentos'
import SecaoManifesto from '../components/SecaoManifesto'
import SecaoTitulo from '../components/SecaoTitulo'
import SecaoYoutube from '../components/SecaoYoutube'
import Seo from '../components/Seo'
import { IconeInstagram } from '../components/icones'
import { categoriasVitrine, pecasDestaque } from '../data/pecas'
import { brand } from '../lib/brand'
import { useContato, useLoja } from '../lib/loja'

const IMAGEM_HERO = '/pecas/aurora-renda-gola-alta.webp'

const PASSOS_ALUGUEL = [
  {
    titulo: 'Prova',
    texto: 'Você agenda, vem sem compromisso e prova quantos modelos quiser.',
  },
  {
    titulo: 'Reserva',
    texto: 'Escolhido o vestido, a data da sua festa fica bloqueada só para você.',
  },
  {
    titulo: 'Ajuste',
    texto: 'A peça é ajustada no seu corpo e fica pronta antes do dia do evento.',
  },
]

export default function Home() {
  /* A lista vem da loja, e não do import direto: é ela que já traz as edições
     feitas no painel administrativo por cima da semente de data/pecas.ts. */
  const { pecas } = useLoja()
  const { instagram, linkInstagram } = useContato()
  const vitrine = categoriasVitrine(pecas)
  const destaques = pecasDestaque(pecas)

  return (
    <>
      {/* Sem `titulo`: a home usa o título base puro, sem prefixo. É a página
          que disputa a busca pelo nome do atelier, e prefixo só atrapalharia. */}
      <Seo
        descricao={`Aluguel de vestidos de noiva, festa e 15 anos${
          brand.cidade ? ` em ${brand.cidade}` : ''
        }. Prova com hora marcada, ajuste incluso e reserva garantida para a data do seu evento.`}
      />

      {/* ------------------------------------------------------------------ */}
      {/* 1 · Hero                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative flex min-h-[82svh] items-center overflow-hidden">
        <img
          src={IMAGEM_HERO}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-center"
        />
        {/*
          Véu escuro. Calibrado para sustentar o contraste do texto mesmo com
          foto clara — vale conferir de novo ao trocar a imagem definitiva.
        */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-preto/85 via-preto/60 to-preto/25"
        />

        <div className="container-luxo relative py-24">
          <div className="max-w-xl">
            <span className="font-display text-h6 uppercase tracking-luxo-lg text-branco/70">
              {brand.subtitulo} {brand.nome}
            </span>

            <h1 className="mt-6 font-display text-branco">
              Vestidos de noiva e festa para alugar
            </h1>

            {/* O filete é dourado; sobre o véu escuro ele aparece de verdade. */}
            <span className="filete-claro mt-7" />

            <p className="mt-7 max-w-md text-branco/75">
              {brand.assinatura}. Prove quantos modelos quiser, reserve a data da sua
              festa e leve o vestido ajustado no seu corpo.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {/* Sobre a foto escura a hierarquia inverte: o cheio é o branco. */}
              <Link to="/catalogo" className="btn-secundario">
                Ver catálogo
              </Link>
              <BotaoWhatsapp
                variante="contorno-claro"
                mensagem={`Olá! Vim pelo site da ${brand.nome} e gostaria de agendar uma prova.`}
              >
                Agendar prova
              </BotaoWhatsapp>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2 · Manifesto                                                       */}
      {/* ------------------------------------------------------------------ */}
      <SecaoManifesto />

      {/* ------------------------------------------------------------------ */}
      {/* 3 · Categorias                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="secao bg-off-white">
        <div className="container-luxo">
          <SecaoTitulo
            eyebrow="O acervo"
            titulo="Categorias"
            descricao="Do vestido de noiva ao longo de festa, cada ocasião tem a sua arara."
            centralizado
          />

          {/* Três categorias: cabem em uma linha só a partir de sm, e em duas
              colunas no celular. A grade se ajusta sozinha se surgir uma nova
              categoria com peça cadastrada. */}
          <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:gap-x-6">
            {vitrine.map(({ categoria, rotulo, capa, quantidade }) => (
              <li key={categoria}>
                <Link to={`/catalogo?categoria=${categoria}`} className="group block">
                  <div className="overflow-hidden bg-borda-sutil">
                    <img
                      src={capa}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.05]"
                    />
                  </div>
                  <h3 className="mt-4 text-h5 uppercase tracking-luxo transition-colors duration-300 ease-suave group-hover:text-cinza">
                    {rotulo}
                  </h3>
                  <p className="mt-1 text-sm text-preto/65">
                    {quantidade} {quantidade === 1 ? 'vestido' : 'vestidos'}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4 · Peças em destaque                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="secao bg-branco">
        <div className="container-luxo">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SecaoTitulo eyebrow="Seleção" titulo="Vestidos em destaque" />

            <Link
              to="/catalogo"
              className="link-menu inline-flex items-center gap-2 pb-1"
            >
              Ver tudo
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>

          <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((peca, indice) => (
              <li key={peca.slug}>
                <CardPeca peca={peca} prioridade={indice < 2} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5 · Casamentos                                                      */}
      {/* ------------------------------------------------------------------ */}
      <SecaoCasamentos />

      {/* ------------------------------------------------------------------ */}
      {/* 6 · Faixa como funciona o aluguel                                   */}
      {/* ------------------------------------------------------------------ */}
      {/* Bloco invertido: é o pico de contraste da página, e o lugar onde a
          dúvida mais comum de quem aluga é respondida antes de ser feita. */}
      <section className="bg-preto text-branco">
        <div className="container-luxo secao">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <span className="font-display text-h6 uppercase tracking-luxo text-dourado">
                Como funciona
              </span>
              <h2 className="mt-3 uppercase tracking-luxo text-branco">
                Alugar é simples assim
              </h2>
              <span className="filete-claro mt-6" />
              <p className="mt-6 max-w-md text-branco/75">
                O ajuste no seu corpo está incluído no aluguel, e a reserva bloqueia
                o vestido na data da sua festa. Quanto antes você provar, maior o
                acervo disponível para o seu dia.
              </p>

              <BotaoWhatsapp
                variante="claro"
                className="mt-9"
                mensagem={`Olá! Vim pelo site da ${brand.nome} e gostaria de saber como funciona o aluguel.`}
              >
                Tirar uma dúvida
              </BotaoWhatsapp>
            </div>

            <ol className="grid gap-8 sm:grid-cols-3 lg:gap-6">
              {PASSOS_ALUGUEL.map((passo, indice) => (
                <li key={passo.titulo} className="border-t border-branco/30 pt-5">
                  <span className="font-display text-h3 text-branco/55">
                    {String(indice + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 text-h5 uppercase tracking-luxo text-branco">
                    {passo.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-branco/75">{passo.texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7 · YouTube (some sozinha enquanto não houver vídeo cadastrado)     */}
      {/* ------------------------------------------------------------------ */}
      <SecaoYoutube />

      {/* ------------------------------------------------------------------ */}
      {/* 8 · Instagram                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="secao bg-branco">
        <div className="container-luxo flex flex-col items-center text-center">
          <IconeInstagram width={28} height={28} className="text-preto" />

          <h2 className="mt-6 uppercase tracking-luxo">Acompanhe a loja</h2>
          <span className="filete mt-6" />

          <p className="mt-6 max-w-md text-preto/70">
            Modelos novos chegando, provas e noivas no grande dia. O que acontece
            aqui dentro está todo no Instagram.
          </p>

          <a
            href={linkInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contorno mt-10"
          >
            Seguir {instagram}
          </a>
        </div>
      </section>
    </>
  )
}
