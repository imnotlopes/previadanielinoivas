import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import BotaoWhatsapp from '../components/BotaoWhatsapp'
import CardPeca from '../components/CardPeca'
import GaleriaPeca from '../components/GaleriaPeca'
import Preco from '../components/Preco'
import Reserva from '../components/Reserva'
import SecaoTitulo from '../components/SecaoTitulo'
import Selos from '../components/Selos'
import Seo from '../components/Seo'
import VistosRecentemente from '../components/VistosRecentemente'
import {
  buscarPeca,
  pecasPorCategoria,
  rotulosCategoria,
  rotulosCor,
  type Peca as TipoPeca,
} from '../data/pecas'
import { brand, SITE_URL } from '../lib/brand'
import { registrarVisto } from '../lib/historico'
import { useLoja } from '../lib/loja'

/**
 * Trilha em JSON-LD: início, categoria, vestido.
 *
 * É o que permite o Google trocar a URL crua por "Danielli Noivas › Noiva ›
 * Aurora" no resultado de busca. O degrau do meio aponta para o catálogo já
 * filtrado, que é o mesmo endereço declarado como canônico daquela categoria.
 */
function trilhaDaPeca(peca: TipoPeca) {
  const degraus = [
    { nome: 'Início', caminho: '/' },
    {
      nome: rotulosCategoria[peca.categoria],
      caminho: `/catalogo?categoria=${peca.categoria}`,
    },
    { nome: peca.nome, caminho: `/peca/${peca.slug}` },
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: degraus.map((degrau, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: degrau.nome,
      item: `${SITE_URL}${degrau.caminho}`,
    })),
  }
}

export default function Peca() {
  const { slug } = useParams<{ slug: string }>()
  const { pecas } = useLoja()
  const peca = slug ? buscarPeca(pecas, slug) : undefined

  /* Registra a visita no histórico do navegador dela, para alimentar o
     "vistos recentemente". Roda depois da renderização e nunca no servidor. */
  useEffect(() => {
    if (peca) registrarVisto(peca.slug)
  }, [peca])

  if (!peca) return <PecaNaoEncontrada />

  const relacionadas = pecasPorCategoria(pecas, peca.categoria)
    .filter((outra) => outra.slug !== peca.slug)
    .slice(0, 3)

  return (
    <>
      <Seo
        titulo={`${peca.nome} | ${rotulosCategoria[peca.categoria]}`}
        /* A descrição da peça é uma linha só, curta demais para meta tag.
           Aqui ela entra numa frase que dá contexto ao buscador. */
        descricao={`${peca.descricao}. Vestido de ${rotulosCategoria[
          peca.categoria
        ].toLowerCase()} para alugar na Danielli Noivas${
          brand.cidade ? `, em ${brand.cidade}` : ''
        }, com prova no showroom e ajuste incluso.`}
        imagem={peca.imagens[0]}
        dadosEstruturados={trilhaDaPeca(peca)}
      />

      <section className="secao bg-off-white">
        <div className="container-luxo">
          <Link to="/catalogo" className="link-menu inline-flex items-center gap-2">
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
            Voltar ao catálogo
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* key: reinicia a miniatura ativa ao trocar de peça */}
            <GaleriaPeca key={peca.slug} imagens={peca.imagens} nome={peca.nome} />

            <div className="lg:pt-4">
              <Link
                to={`/catalogo?categoria=${peca.categoria}`}
                className="eyebrow transition-colors duration-300 ease-suave hover:text-preto"
              >
                {rotulosCategoria[peca.categoria]}
              </Link>

              <h1 className="mt-4 uppercase tracking-luxo">{peca.nome}</h1>
              <span className="filete mt-6" />

              {/* A descrição é o vestido em uma linha. Ganha peso de destaque
                  porque é a única informação escrita sobre a peça. */}
              <p className="mt-8 font-display text-h4 font-light text-preto/75">
                {peca.descricao}
              </p>

              <p className="mt-3 text-sm text-preto/65">Cor: {rotulosCor[peca.cor]}</p>

              <Preco peca={peca} variante="pagina" className="mt-7" />

              <Reserva peca={peca} />

              <Selos />
            </div>
          </div>
        </div>
      </section>

      {relacionadas.length > 0 && (
        <section className="secao bg-branco">
          <div className="container-luxo">
            <SecaoTitulo eyebrow="Na mesma categoria" titulo="Você também pode gostar" />

            <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relacionadas.map((outra) => (
                <li key={outra.slug}>
                  <CardPeca peca={outra} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <VistosRecentemente exceto={peca.slug} />
    </>
  )
}

/** Slug inexistente: mantém a URL e oferece saída, em vez de redirecionar seco. */
function PecaNaoEncontrada() {
  return (
    <section className="secao bg-off-white">
      <Seo
        titulo="Vestido não encontrado"
        descricao="Este vestido não está mais no acervo da Danielli Noivas."
        naoIndexar
      />

      <div className="container-luxo flex flex-col items-center py-16 text-center">
        <span className="eyebrow">Vestido não encontrado</span>

        <h1 className="mt-4 uppercase tracking-luxo">
          Este vestido saiu do acervo
        </h1>
        <span className="filete mt-6" />

        <p className="mt-6 max-w-md text-preto/70">
          O endereço pode ter mudado ou o modelo já não está disponível. Veja o
          catálogo completo ou chame no WhatsApp: pode ser que exista algo
          parecido no acervo.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link to="/catalogo" className="btn-primario">
            Ver o catálogo
          </Link>
          <BotaoWhatsapp
            variante="contorno"
            mensagem="Olá! Estava vendo um vestido no site e gostaria de mais informações."
          >
            Falar com a loja
          </BotaoWhatsapp>
        </div>
      </div>
    </section>
  )
}
