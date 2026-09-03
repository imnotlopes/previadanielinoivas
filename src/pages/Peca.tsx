import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import BotaoProvar from '../components/BotaoProvar'
import BotaoWhatsapp from '../components/BotaoWhatsapp'
import CardPeca from '../components/CardPeca'
import GaleriaPeca from '../components/GaleriaPeca'
import Preco from '../components/Preco'
import Revelar from '../components/Revelar'
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

      {/* ------------------------------------------------------------------ */}
      {/* A hero — só nos vestidos que têm história                           */}
      {/* ------------------------------------------------------------------ */}
      {peca.hero && (
        <section className="relative flex min-h-[62svh] items-end overflow-hidden md:min-h-[70svh]">
          {/*
            `<picture media>` porque são DUAS fotos, e não uma redimensionada:
            no celular a hero é um retângulo em pé, no computador uma faixa
            deitada, e a mesma imagem não serve nos dois. Ao contrário do
            `<source media>` de vídeo, aqui o navegador respeita.
          */}
          <picture>
            <source media="(min-width: 768px)" srcSet={peca.hero.largo} />
            <img
              src={peca.hero.alto}
              alt={peca.nome}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 size-full object-cover object-center"
            />
          </picture>

          {/*
            Véu de baixo para cima, e não da esquerda como o da apresentação:
            aqui o texto fica ancorado no rodapé da hero, e o gradiente só
            precisa escurecer a faixa onde ele está. Assim a foto continua
            limpa em cima, que é onde está o vestido.
          */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-preto/85 via-preto/35 to-transparent"
          />

          <div className="container-luxo relative pb-12 pt-24 md:pb-16">
            <Revelar distancia="curta">
              <span className="font-display text-h6 uppercase tracking-luxo-lg text-branco/70">
                {rotulosCor[peca.cor]}
              </span>
              <h1 className="mt-4 texto-display text-branco">{peca.nome}</h1>
              <span className="filete-claro mt-6" />
            </Revelar>

            {peca.historia && (
              <Revelar atraso={140}>
                <p className="mt-7 max-w-xl font-display text-h4 font-light italic leading-snug text-branco/90">
                  {peca.historia}
                </p>
              </Revelar>
            )}
          </div>
        </section>
      )}

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
              {/*
                COM HERO, ESTE BLOCO NÃO REPETE O NOME.

                Nome e cor já foram ditos lá em cima em corpo de display, a
                dois dedos daqui. Repetir daria dois títulos de página e faria
                a ficha parecer que recomeçou. No lugar entra a DESCRIÇÃO, que
                é a informação que ainda não foi dada — e por isso o parágrafo
                solto de descrição também sai.
              */}
              {peca.hero ? (
                <>
                  <span className="eyebrow">A peça</span>
                  <h2 className="mt-4 font-display text-h3 font-light text-preto">
                    {peca.descricao}
                  </h2>
                  <span className="filete mt-6" />
                </>
              ) : (
                <>
                  <span className="eyebrow">{rotulosCor[peca.cor]}</span>
                  <h1 className="mt-4 uppercase tracking-luxo">{peca.nome}</h1>
                  <span className="filete mt-6" />

                  <p className="mt-8 font-display text-h4 font-light text-preto/75">
                    {peca.descricao}
                  </p>
                </>
              )}

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

              {/* A ficha serve aos dois catálogos: um selo fala em casamento,
                  e para a formanda a frase precisa ser a dela. */}
              <Selos publico={peca.categoria === 'festa' ? 'festa' : 'noiva'} />
            </div>
          </div>
        </div>
      </section>

      {relacionadas.length > 0 && (
        <section className="secao bg-branco">
          <div className="container-luxo">
            {/* "Provar junto" e não "você também pode gostar": aqui o convite
                é somar à lista, que é o que esta tela existe para produzir —
                e é assim que a noiva pensa, comparando modelos entre si. */}
            <SecaoTitulo eyebrow="Do mesmo acervo" titulo="Para provar junto" />

            <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relacionadas.map((outra) => (
                <li key={outra.slug}>
                  {/* Marcável daqui também: obrigar a abrir a ficha só para
                      somar à lista é um clique a mais em cada comparação. */}
                  <CardPeca peca={outra} base={base} comProvar />
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
