import { MapPin, Phone } from 'lucide-react'

import { avaliacoesGoogle, googleNegocio } from '../data/google'
import { brand } from '../lib/brand'
import { Estrelas } from './IconeEstrela'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'

/* -------------------------------------------------------------------------- */
/* Avaliações                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Avaliações e mapa são exportados separados porque não ficam lado a lado:
 * a FAQ entra entre os dois. Ver a ordem em components/Layout.tsx.
 */
export default function SecaoAvaliacoes() {
  // Sem avaliação transcrita não há prova social: a seção inteira sai do ar,
  // em vez de mostrar uma nota solta sem nenhum depoimento embaixo.
  if (avaliacoesGoogle.length === 0) return null

  return (
    <section className="secao border-t border-borda-sutil bg-branco">
      <div className="container-luxo">
        <Revelar>
          <SecaoTitulo
            eyebrow="Avaliações no Google"
            titulo="O que dizem sobre a loja"
            centralizado
          />
        </Revelar>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Estrelas nota={googleNegocio.nota} className="flex items-center" />
          <p className="text-sm text-preto/65">
            {googleNegocio.nota.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} de 5
            {' · '}
            {googleNegocio.totalAvaliacoes}{' '}
            {googleNegocio.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
          </p>
        </div>

        {/*
          Carrossel horizontal com scroll nativo: arrasta no touch, roda o
          shift+scroll no desktop e o teclado navega pelos cards porque cada
          um é focável. Sem biblioteca e sem autoplay, quem lê avaliação
          quer controlar o próprio ritmo.

          O `snap` prende cada card na borda esquerda. Os cards têm altura
          igual (`items-stretch`) e o texto empurra o autor para o rodapé do
          card, então avaliação curta e longa ficam alinhadas.
        */}
        {/*
          Invólucro com `overflow-hidden`: é ele que impede a rolagem do
          carrossel de virar rolagem da página inteira. Sem essa barreira, o
          overflow do carrossel propaga até o elemento raiz e o site ganha a
          borda infinita.

          Fica aqui, e não no html ou no body, por dois motivos: `clip` na
          raiz desloca elementos `position: fixed` (levou o botão do WhatsApp
          para fora da tela) e o Safari anterior à 16 ignora `clip`. Um
          `overflow-hidden` local funciona em todo navegador e não interfere
          no sticky do cabeçalho, que está fora daqui.
        */}
        <div className="mt-14 max-w-full overflow-hidden">
        <ul
          className="flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-6
                     [scrollbar-color:rgb(var(--borda-rgb))_transparent] [scrollbar-width:thin]
                     md:gap-6"
          tabIndex={0}
          role="region"
          aria-label="Avaliações do Google, rolagem horizontal"
        >
          {avaliacoesGoogle.map((avaliacao) => (
            <li
              key={avaliacao.id}
              /*
                Largura em rem, não em vw: `vw` conta a barra de rolagem
                vertical, então 80vw é mais largo que a área útil e empurra a
                página para fora em algumas telas. Em rem o card nunca passa
                do container.
              */
              className="flex w-64 shrink-0 snap-start flex-col border border-borda-sutil
                         bg-off-white p-7 sm:w-[21rem] md:p-8 lg:w-[24rem]"
            >
              <figure className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <Estrelas nota={avaliacao.nota} className="flex items-center" />
                  <span className="text-sm text-preto/65">{avaliacao.quando}</span>
                </div>

                <blockquote className="mt-5 flex-1">
                  <p className="leading-relaxed text-preto/80">{avaliacao.texto}</p>
                </blockquote>

                <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-display text-h6 uppercase tracking-luxo text-preto">
                    {avaliacao.autor}
                  </span>
                  {avaliacao.localGuide && (
                    <span className="text-xs uppercase tracking-luxo text-preto/65">
                      Local Guide
                    </span>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        </div>

        {googleNegocio.url && (
          <div className="mt-14 flex justify-center">
            <a
              href={googleNegocio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-contorno"
            >
              Ver no Google
            </a>
          </div>
        )}
      </div>
    </section>
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
