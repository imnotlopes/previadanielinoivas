import { MapPin, Phone } from 'lucide-react'

import { avaliacoesGoogle, googleNegocio, inicialDe, type AvaliacaoGoogle } from '../data/google'
import { brand } from '../lib/brand'
import { cn } from '../lib/utils'
import Esteira from './Esteira'
import { Estrelas } from './IconeEstrela'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'

/* -------------------------------------------------------------------------- */
/* Avaliações                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Quanto tempo cada avaliação fica na tela antes de dar a vez.
 *
 * Seis segundos, o mesmo da Lennys: logotipo se reconhece num relance, relato
 * se lê, e em menos que isso ninguém termina o mais longo daqui.
 */
const MS_POR_AVALIACAO = 6000

/**
 * As avaliações do Google, no formato da seção da Lennys Ateliê.
 *
 * Copiada de lá em setembro de 2026, a pedido do Edson. Três partes:
 *
 *   CABEÇALHO   o título à esquerda e a nota em tamanho de título à direita.
 *               O número é o que carrega a seção: 4,8 com 172 avaliações é
 *               a única coisa aqui que a noiva confere sozinha em dez
 *               segundos. Os relatos vêm depois, como prova do número.
 *   ESTEIRA     um, dois ou três cartões conforme a tela, trocando um a cada
 *               seis segundos. Ver components/Esteira.tsx.
 *   CARTÃO      no formato do próprio Google. Ver `Cartao`, abaixo.
 *
 * O QUE FICOU DIFERENTE DA LENNYS
 * -------------------------------
 * Lá há um botão "Ver as avaliações no Google" no fim. Aqui não: os botões e
 * links que levavam a noiva para fora da apresentação saíram a pedido, e este
 * seria mais um. O endereço do perfil continua em data/google.ts.
 *
 * O mapa (`SecaoMapa`, abaixo) segue fora da apresentação: o endereço já
 * aparece no fecho, junto do convite, que é onde ele serve.
 */
export default function SecaoAvaliacoes() {
  // Sem avaliação transcrita não há prova social: a seção inteira sai do ar,
  // em vez de mostrar uma nota solta sem nenhum depoimento embaixo.
  if (avaliacoesGoogle.length === 0) return null

  const nota = googleNegocio.nota.toLocaleString('pt-BR', { minimumFractionDigits: 1 })

  return (
    <section className="secao border-t border-borda-sutil bg-off-white">
      <div className="container-luxo flex flex-col gap-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Revelar>
            <SecaoTitulo eyebrow="Avaliações no Google" titulo="Quem já passou por aqui" />
          </Revelar>

          <Revelar atraso={120}>
            <div className="flex items-center gap-5">
              <span className="texto-display-sm leading-none text-preto">{nota}</span>
              <div className="flex flex-col gap-2">
                <Estrelas nota={googleNegocio.nota} className="flex items-center" />
                <span className="text-sm text-preto/65">
                  {googleNegocio.totalAvaliacoes} avaliações no Google
                </span>
              </div>
            </div>
          </Revelar>
        </div>

        <Revelar distancia="curta" atraso={180}>
          <Esteira
            itens={avaliacoesGoogle.map((avaliacao) => ({
              chave: avaliacao.id,
              rotulo: `Ver a avaliação de ${avaliacao.autor}`,
              conteudo: <Cartao avaliacao={avaliacao} />,
            }))}
            lugares={{ base: 1, sm: 2, lg: 3 }}
            ms={MS_POR_AVALIACAO}
            classeFileira="gap-4 sm:grid-cols-2 lg:grid-cols-3"
          />
        </Revelar>
      </div>
    </section>
  )
}

/**
 * Um relato, no formato do Google.
 *
 * POR QUE ESTE CARTÃO NÃO SEGUE O RESTO DA APRESENTAÇÃO
 * -----------------------------------------------------
 * O argumento é o da Lennys, e vale igual aqui: o cartão reproduz um
 * componente que a noiva já viu dezenas de vezes fora daqui. Estrela
 * amarela, "G" colorido, selo azul e canto arredondado são o que faz o
 * cérebro dela ler "isto é do Google, não é o ateliê se elogiando". Repintado
 * no preto e off-white da marca, vira só mais um depoimento.
 *
 * Por isso as cores do Google são literais e ficam presas neste arquivo, sem
 * virar token: nada mais na apresentação deve usá-las.
 *
 * ALTURA TRAVADA. Os relatos variam de duas a sete linhas, e numa fileira que
 * troca de conteúdo sozinha isso faria a seção mudar de altura a cada ciclo,
 * empurrando a página enquanto a noiva lê. O mínimo, 25rem, foi medido e
 * não chutado: o relato da Nathália num cartão de 288px de largura, o mais
 * estreito que a esteira produz (duas colunas, logo acima de 640px de tela),
 * dá 398px. O corte em dez linhas é rede de segurança para um relato maior
 * que todos estes, e hoje não corta nenhum.
 */
function Cartao({ avaliacao }: { avaliacao: AvaliacaoGoogle }) {
  return (
    <div className="relative h-full pt-11">
      <figure className="flex h-full min-h-[25rem] flex-col items-center gap-3 rounded-[12px] border border-borda bg-branco px-6 pb-8 pt-14 text-center">
        <figcaption className="flex flex-col gap-1">
          <span className="text-sm font-bold text-preto">{avaliacao.autor}</span>
          <span className="text-xs text-cinza">{avaliacao.quando}</span>
        </figcaption>

        <div className="flex items-center gap-2">
          <EstrelasGoogle nota={avaliacao.nota} />
          <SeloVerificado />
        </div>

        {/* `my-auto`: com a altura travada, relato curto deixaria um vazio
            grande embaixo. Centrado na sobra, o vazio se divide e o cartão
            parece composto em vez de faltando conteúdo. */}
        <blockquote className="my-auto line-clamp-10 text-sm leading-relaxed text-preto/85">
          {avaliacao.texto}
        </blockquote>
      </figure>

      <Avatar nome={avaliacao.autor} />
    </div>
  )
}

/** Foto de perfil à maneira do Google: a inicial, com o "G" no canto. */
function Avatar({ nome }: { nome: string }) {
  return (
    <div className="absolute left-1/2 top-0 size-[5.5rem] -translate-x-1/2">
      <span
        aria-hidden="true"
        className="flex size-full items-center justify-center rounded-full border-4 border-branco bg-bege font-display text-h4 text-preto"
      >
        {inicialDe(nome)}
      </span>
      <span className="absolute -right-0.5 bottom-0.5 flex size-8 items-center justify-center rounded-full bg-branco">
        <LogoGoogle />
      </span>
    </div>
  )
}

/**
 * O "G" de quatro cores, em SVG e não carregado de servidor do Google: uma
 * requisição a menos e nenhuma dependência de rede de terceiro.
 */
function LogoGoogle() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-5">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  )
}

/** O selo azul que o Google põe ao lado da nota. */
function SeloVerificado() {
  return (
    <span role="img" aria-label="Avaliação verificada pelo Google" className="inline-flex">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
        <path
          fill="#1A73E8"
          d="M12 1.5l2.4 2 3.1-.3 1 3 2.7 1.6-1.2 2.9 1.2 2.9-2.7 1.6-1 3-3.1-.3-2.4 2-2.4-2-3.1.3-1-3L2.8 15l1.2-2.9L2.8 9.2l2.7-1.6 1-3 3.1.3z"
        />
        <path
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.2 12.2l2.6 2.6 5-5.2"
        />
      </svg>
    </span>
  )
}

/** Amarelo do Google. Vive só aqui: nada mais na apresentação usa esta cor. */
const DOURADO_GOOGLE = '#FBBC04'

const CAMINHO_ESTRELA =
  'M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.3l6.6-.9z'

/**
 * As estrelas amarelas do cartão.
 *
 * Uma imagem só, com a nota por extenso no rótulo: cinco elementos separados
 * fariam o leitor de tela anunciar "estrela" cinco vezes seguidas. As do
 * cabeçalho são as `Estrelas` da marca, fora do formato do Google.
 */
function EstrelasGoogle({ nota }: { nota: number }) {
  return (
    <span role="img" aria-label={`${nota} de 5 estrelas`} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const cheia = i <= Math.round(nota)
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={cn('size-4')}
            fill={cheia ? DOURADO_GOOGLE : 'none'}
            stroke={cheia ? 'none' : DOURADO_GOOGLE}
            strokeWidth={1.5}
          >
            <path d={CAMINHO_ESTRELA} />
          </svg>
        )
      })}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Mapa e informações                                                          */
/* -------------------------------------------------------------------------- */

export function SecaoMapa() {
  // Monta só com o que estiver preenchido, para nunca sobrar ", MG" solto.
  const local = [googleNegocio.cidade, googleNegocio.estado].filter(Boolean).join(', ')
  const enderecoCompleto = [googleNegocio.endereco, local, googleNegocio.cep]
    .filter(Boolean)
    .join(', ')

  // Sem endereço e sem telefone não sobra informação nenhuma para dar: a
  // seção some inteira, em vez de exibir um cartão vazio com um mapa do mundo.
  if (!enderecoCompleto && !brand.whatsappExibicao) return null

  return (
    /*
      Última seção antes do rodapé, então vai sem espaçamento embaixo: o
      rodapé já tem o seu (py-16/py-20). Com os dois, sobrava uma faixa de
      branco colada no rodapé preto, que variava com a largura da tela porque
      --espaco-secao é um clamp.
    */
    <section className="secao border-t border-borda-sutil bg-branco pb-0">
      <div className="container-luxo">
        <Revelar>
          <SecaoTitulo eyebrow="Onde estamos" titulo="Visite a loja" centralizado />
        </Revelar>

        <div className="mt-14 grid gap-px overflow-hidden border border-borda-sutil bg-borda-sutil lg:grid-cols-[1fr_1.4fr]">
          {/* Informações */}
          <div className="flex flex-col gap-8 bg-branco p-8 md:p-10">
            <div>
              <h3 className="font-display text-h5 uppercase tracking-luxo">
                {googleNegocio.nome}
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <Estrelas nota={googleNegocio.nota} className="flex items-center" />
                <span className="text-sm text-preto/65">
                  ({googleNegocio.totalAvaliacoes})
                </span>
              </div>
            </div>

            <dl className="flex flex-col gap-6">
              {enderecoCompleto && (
                <div className="flex gap-3">
                  <MapPin size={18} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0" />
                  <div>
                    <dt className="font-display text-h6 uppercase tracking-luxo text-preto/65">
                      Endereço
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed">{enderecoCompleto}</dd>
                  </div>
                </div>
              )}

              {brand.whatsappExibicao && (
                <div className="flex gap-3">
                  <Phone size={18} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0" />
                  <div>
                    <dt className="font-display text-h6 uppercase tracking-luxo text-preto/65">
                      Telefone
                    </dt>
                    <dd className="mt-1 text-sm">
                      <a
                        href={`tel:+${brand.whatsapp}`}
                        className="underline-offset-4 transition-colors duration-300 ease-suave hover:text-cinza hover:underline"
                      >
                        {brand.whatsappExibicao}
                      </a>
                    </dd>
                  </div>
                </div>
              )}
            </dl>

            {googleNegocio.horarios.length > 0 && (
              <div>
                <p className="font-display text-h6 uppercase tracking-luxo text-preto/65">
                  Atendimento
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {googleNegocio.horarios.map((h) => (
                    <li key={h.dias} className="flex justify-between gap-4 text-sm">
                      <span className="text-preto/65">{h.dias}</span>
                      <span>{h.horas}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {googleNegocio.url && (
              <a
                href={googleNegocio.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primario btn-sm mt-auto self-start"
              >
                Como chegar
              </a>
            )}
          </div>

          {/*
            Mapa.

            O invólucro leva `overflow-hidden` e o iframe vai com
            `w-px min-w-full` (largura de 1px, mínimo de 100%) em vez de
            `w-full`. Não é firula: o Safari do iOS ignora largura percentual
            em iframe e dimensiona o elemento pelo conteúdo, que aqui é um
            mapa bem mais largo que a tela. Sem essas duas travas, o iframe
            estoura a célula do grid e arrasta a página inteira de lado, o
            que só acontece no iPhone e não aparece em teste no desktop.
          */}
          {googleNegocio.mapaEmbed && (
            <div className="min-h-[320px] overflow-hidden bg-branco lg:min-h-[460px]">
              <iframe
                src={googleNegocio.mapaEmbed}
                title={`Mapa com a localização do ${googleNegocio.nome}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full min-h-[320px] w-px min-w-full border-0 grayscale lg:min-h-[460px]"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
