import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import BotaoProvar from '../components/BotaoProvar'
import BotaoWhatsapp from '../components/BotaoWhatsapp'
import CardPeca from '../components/CardPeca'
import GaleriaPeca from '../components/GaleriaPeca'
import Preco from '../components/Preco'
import Reserva from '../components/Reserva'
import SecaoTitulo from '../components/SecaoTitulo'
import Selos from '../components/Selos'
import Seo from '../components/Seo'
import VideoPeca from '../components/VideoPeca'
import VistosRecentemente from '../components/VistosRecentemente'
import {
  buscarPeca,
  pecasPorCategoria,
  publicadas,
  rotulosCauda,
  rotulosCor,
  rotulosDecote,
  rotulosManga,
  rotulosOcasiao,
  rotulosSilhueta,
} from '../data/pecas'
import { registrarVisto } from '../lib/historico'
import { useLoja } from '../lib/loja'

interface PecaProps {
  /** Prefixo da peça a que esta ficha pertence: `/catalogo` ou `/festa`. */
  base: string
}

/**
 * Ficha do vestido. Serve aos dois catálogos.
 *
 * O `base` é o que diz de onde a cliente veio: ele monta o link de voltar, os
 * relacionados e a URL do próprio endereço. Sem ele a ficha não saberia se
 * está dentro da peça de noiva ou da de festa — e cada peça é uma aplicação
 * separada, com rotas próprias.
 */
export default function Peca({ base }: PecaProps) {
  const { slug } = useParams<{ slug: string }>()
  const { pecas } = useLoja()

  /*
    `publicadas()` antes de buscar: um vestido que a Danielli ocultou no painel
    não pode continuar acessível por link direto. Quem tiver o endereço antigo
    cai na tela de "saiu do acervo", que é a verdade.
  */
  const visiveis = publicadas(pecas)
  const peca = slug ? buscarPeca(visiveis, slug) : undefined

  /* Registra a visita no navegador dela, para o "vistos recentemente". */
  useEffect(() => {
    if (peca) registrarVisto(peca.slug)
  }, [peca])

  if (!peca) return <NaoEncontrada base={base} />

  const relacionadas = pecasPorCategoria(visiveis, peca.categoria)
    .filter((outra) => outra.slug !== peca.slug)
    .slice(0, 3)

  return (
    <>
      <Seo
        titulo={peca.nome}
        descricao={`${peca.descricao}. Vestido para alugar na Danielli Noivas, com prova no showroom e ajuste incluso.`}
        imagem={peca.imagens[0]}
      />

      <section className="secao bg-off-white">
        <div className="container-luxo">
          <Link to={base} className="link-menu inline-flex items-center gap-2">
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
            Voltar ao catálogo
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* key: reinicia a miniatura ativa ao trocar de vestido */}
            <div>
              <GaleriaPeca key={peca.slug} imagens={peca.imagens} nome={peca.nome} />
              {peca.video && <VideoPeca src={peca.video} nome={peca.nome} />}
            </div>

            <div className="lg:pt-4">
              <span className="eyebrow">{rotulosCor[peca.cor]}</span>

              <h1 className="mt-4 uppercase tracking-luxo">{peca.nome}</h1>
              <span className="filete mt-6" />

              <p className="mt-8 font-display text-h4 font-light text-preto/75">
                {peca.descricao}
              </p>

              {/*
                Ficha técnica curta. Cada linha só aparece quando tem valor —
                rótulo com traço no lugar do dado é ruído, e nesta ficha o
                espaço é do vestido.
              */}
              {/*
                A ORDEM AQUI É A ORDEM DA CONVERSA NA LOJA.

                Silhueta primeiro, porque é o que a noiva aceita ou descarta
                antes de olhar o resto ("sereia eu não visto"). Depois decote e
                manga, que são as duas perguntas seguintes. Cor e numeração
                fecham. Preço vem embaixo, fora desta lista, porque é resposta
                e não característica.
              */}
              <dl className="mt-7 flex flex-col gap-2 text-sm">
                {peca.silhueta && (
                  <Linha rotulo="Silhueta" valor={rotulosSilhueta[peca.silhueta]} />
                )}
                {peca.decote && (
                  <Linha rotulo="Decote" valor={rotulosDecote[peca.decote]} />
                )}
                {peca.manga && <Linha rotulo="Manga" valor={rotulosManga[peca.manga]} />}
                {peca.cauda && <Linha rotulo="Cauda" valor={rotulosCauda[peca.cauda]} />}
                <Linha rotulo="Cor" valor={rotulosCor[peca.cor]} />
                {peca.numeracao.length > 0 && (
                  <Linha rotulo="Numeração" valor={peca.numeracao.join(' · ')} />
                )}
                {peca.ocasiao && (
                  <Linha rotulo="Ocasião" valor={rotulosOcasiao[peca.ocasiao]} />
                )}
              </dl>

              <Preco peca={peca} variante="pagina" className="mt-7" />

              {/*
                Marcar vem ANTES de falar no WhatsApp, de propósito: quem está
                na ficha do primeiro vestido ainda vai ver outros, e mandar
                mensagem por vestido é o comportamento que esta lista existe
                para substituir.
              */}
              <div className="mt-8">
                <BotaoProvar slug={peca.slug} nome={peca.nome} variante="inteiro" />
              </div>

              <Reserva peca={peca} />

              <Selos />
            </div>
          </div>
        </div>
      </section>

      {relacionadas.length > 0 && (
        <section className="secao bg-branco">
          <div className="container-luxo">
            <SecaoTitulo eyebrow="Do mesmo acervo" titulo="Você também pode gostar" />

            <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relacionadas.map((outra) => (
                <li key={outra.slug}>
                  <CardPeca peca={outra} base={base} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <VistosRecentemente base={base} exceto={peca.slug} />
    </>
  )
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex gap-3">
      <dt className="min-w-24 font-display uppercase tracking-luxo text-preto/60">
        {rotulo}
      </dt>
      <dd className="text-preto/80">{valor}</dd>
    </div>
  )
}

/** Slug inexistente ou vestido ocultado: mantém a URL e oferece saída. */
function NaoEncontrada({ base }: { base: string }) {
  return (
    <section className="secao bg-off-white">
      <Seo
        titulo="Vestido não encontrado"
        descricao="Este vestido não está mais no acervo da Danielli Noivas."
        naoIndexar
      />

      <div className="container-luxo flex flex-col items-center py-16 text-center">
        <span className="eyebrow">Vestido não encontrado</span>

        <h1 className="mt-4 uppercase tracking-luxo">Este vestido saiu do acervo</h1>
        <span className="filete mt-6" />

        <p className="mt-6 max-w-md text-preto/70">
          O endereço pode ter mudado ou o modelo já não está disponível. Veja o
          catálogo completo ou chame no WhatsApp: pode ser que exista algo
          parecido.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link to={base} className="btn-primario">
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
