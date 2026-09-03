import { CalendarHeart, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { publicadas, type Peca } from '../data/pecas'
import { SITE_URL } from '../lib/brand'
import { useContato, useLoja } from '../lib/loja'
import { formatarData, useSelecao } from '../lib/selecao'
import { IconeWhatsapp } from './icones'

interface BarraSelecaoProps {
  /** Prefixo do catálogo em que estamos: `/catalogo` ou `/festa`. */
  base: string
  /**
   * Em `noiva` o texto fala de casamento e de noiva. Em festa, de evento.
   *
   * Não é firula de redação: a peça de noiva tem a regra da casa de nunca
   * dizer "cliente", e uma formanda que lesse "seu casamento" saberia na hora
   * que o material não foi escrito para ela.
   */
  publico: 'noiva' | 'festa'
}

/**
 * A barra da lista de prova.
 *
 * O FECHAMENTO DO CATÁLOGO
 * ------------------------
 * Todo o resto do catálogo existe para chegar aqui. A noiva marcou cinco
 * vestidos; esta barra transforma isso em UMA mensagem com os nomes, a data do
 * casamento e um link que reabre a mesma seleção do lado da Danielli.
 *
 * A MENSAGEM É O PRODUTO
 * ----------------------
 * Ela é escrita na primeira pessoa da noiva, porque é a noiva que aperta
 * enviar, texto em terceira pessoa ("a cliente selecionou") entrega que foi
 * um sistema que escreveu, e a conversa começa com cara de formulário.
 *
 * Os nomes vão por extenso, um por linha. Só o link não bastaria: no WhatsApp
 * o link vira um cartão, e se a Danielli estiver sem internet ou o link
 * expirar, a mensagem ainda precisa dizer quais vestidos são.
 *
 * A DATA É O QUE MUDA A RESPOSTA
 * ------------------------------
 * Sem ela, a primeira resposta da loja é obrigatoriamente uma pergunta,
 * disponibilidade de vestido de aluguel só existe em relação a um dia. Com
 * ela, a resposta já pode ser "esses três estão livres, vem quinta?".
 * Por isso o campo fica aberto assim que o primeiro vestido é marcado, em vez
 * de escondido atrás de um botão.
 */
export default function BarraSelecao({ base, publico }: BarraSelecaoProps) {
  const { pecas } = useLoja()
  const { linkWhatsApp } = useContato()
  const {
    slugs,
    quantidade,
    data,
    manequim,
    limpar,
    remover,
    definirData,
    definirManequim,
  } = useSelecao()

  /*
    NASCE RECOLHIDA.

    Com os dois campos abertos a barra ocupa 500px de uma tela de 812, ou
    seja, tapa o catálogo que ela está usando para escolher. Fechada são
    ~200px, e o convite para a data continua visível numa linha só.
  */
  const [aberta, setAberta] = useState(false)

  /*
    Resolve slug → vestido a partir do acervo PUBLICADO. Um vestido que a
    Danielli ocultou depois de a noiva marcar simplesmente some da lista: é a
    mesma regra da ficha, e mandar para ela o nome de uma peça que saiu do
    acervo criaria uma conversa sobre um vestido que não existe mais.
  */
  const visiveis = publicadas(pecas)
  const escolhidos = slugs
    .map((slug) => visiveis.find((peca) => peca.slug === slug))
    .filter((peca): peca is Peca => peca !== undefined)

  if (escolhidos.length === 0) return null

  const noiva = publico === 'noiva'
  const mensagem = montarMensagem(escolhidos, base, data, manequim, noiva)

  /* Data mínima é hoje: casamento no passado é erro de digitação. */
  const hoje = new Date().toISOString().slice(0, 10)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5">
      <div className="pointer-events-auto mx-auto w-full max-w-conteudo bg-preto p-4 text-branco shadow-md sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-h6 uppercase tracking-luxo text-dourado">
              Vestidos que você quer provar · {quantidade}
            </p>

            {/*
              Os nomes ficam visíveis, e cada um com o seu X. Uma barra que diz
              só "5 vestidos" obriga a noiva a lembrar quais são, e o momento
              de tirar um da lista é exatamente este, antes de mandar.
            */}
            <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">
              {escolhidos.map((peca) => (
                <li key={peca.slug}>
                  <span className="inline-flex items-center gap-1 border border-branco/25 py-0.5 pl-3 pr-0.5 text-sm text-branco/85">
                    <Link
                      to={`${base}/${peca.slug}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {peca.nome}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remover(peca.slug)}
                      aria-label={`Tirar ${peca.nome} da lista`}
                      /* 36px de alvo: o X mora dentro de uma etiqueta pequena e
                       não dá para chegar a 44 sem inchar a barra, mas 20px era
                       erro de toque garantido. */
                    className="inline-flex size-9 items-center justify-center text-branco/60 transition-colors duration-300 ease-suave hover:text-branco"
                    >
                      <X size={13} strokeWidth={2} aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/*
          O GATILHO É A PRÓPRIA DATA, e não um "abrir" genérico.

          Fechada, esta linha é o único texto da barra além dos nomes, e ela
          diz exatamente o que a loja precisa e por quê. Um botão "abrir" no
          lugar dela esconderia o campo mais importante atrás de uma palavra
          que não promete nada.

          Preenchida, vira o resumo: a noiva confere o dia sem reabrir nada.
        */}
        {!aberta && (
          <button
            type="button"
            onClick={() => setAberta(true)}
            aria-expanded={false}
            className="mt-3 inline-flex items-center gap-2 text-sm text-branco/70 underline-offset-4 transition-colors duration-300 ease-suave hover:text-branco hover:underline"
          >
            <CalendarHeart size={15} strokeWidth={1.5} aria-hidden className="shrink-0" />
            {data ? (
              <span>
                {noiva ? 'Casamento' : 'Evento'} em {formatarData(data)}
                {manequim && ` · manequim ${manequim}`}
                <span className="text-branco/45"> · alterar</span>
              </span>
            ) : (
              <span>
                {noiva
                  ? 'Colocar a data do casamento: a gente já diz quais estão livres'
                  : 'Colocar a data do evento: a gente já diz quais estão livres'}
              </span>
            )}
          </button>
        )}

        {aberta && (
          <>
            {/*
              DOIS CAMPOS, E NENHUM OBRIGATÓRIO.

              São exatamente o que a loja precisa saber para responder alguma
              coisa útil, e nada além disso. Nome, telefone e e-mail não entram:
              a conversa acontece no WhatsApp, que já traz os três.
            */}
            <div className="mt-5 grid gap-4 border-t border-branco/20 pt-5 sm:grid-cols-2">
              <div>
                <label
                  className="mb-2 block font-display text-h6 uppercase tracking-luxo text-branco/75"
                  htmlFor="selecao-data"
                >
                  {noiva ? 'Data do casamento' : 'Data do evento'}{' '}
                  <span className="text-branco/45">(opcional)</span>
                </label>
                <input
                  id="selecao-data"
                  type="date"
                  className="input border-branco/30 bg-transparent text-branco focus:border-branco"
                  value={data}
                  min={hoje}
                  onChange={(e) => definirData(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="mb-2 block font-display text-h6 uppercase tracking-luxo text-branco/75"
                  htmlFor="selecao-manequim"
                >
                  Seu manequim <span className="text-branco/45">(opcional)</span>
                </label>
                <input
                  id="selecao-manequim"
                  className="input border-branco/30 bg-transparent text-branco placeholder:text-branco/35 focus:border-branco"
                  value={manequim}
                  onChange={(e) => definirManequim(e.target.value)}
                  placeholder="38, 42, M…"
                  autoComplete="off"
                  maxLength={20}
                />
              </div>
            </div>

            {/*
              A razão de existir do campo de data, dita em uma linha. Sem isto
              ele parece burocracia de formulário; com isto, é a diferença
              entre a loja responder uma pergunta ou fazer uma.
            */}
            <div className="mt-3 flex items-start justify-between gap-4">
              {noiva && !data ? (
                <p className="flex items-start gap-2 text-sm leading-relaxed text-branco/60">
                  <CalendarHeart
                    size={15}
                    strokeWidth={1.5}
                    aria-hidden
                    className="mt-0.5 shrink-0"
                  />
                  Com a data, a gente já responde quais desses estão livres para
                  o seu dia.
                </p>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={() => setAberta(false)}
                aria-expanded
                className="shrink-0 text-sm text-branco/60 underline-offset-4 transition-colors duration-300 ease-suave hover:text-branco hover:underline"
              >
                Recolher
              </button>
            </div>
          </>
        )}

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={limpar}
            className="py-2 text-sm text-branco/60 underline-offset-4 transition-colors duration-300 ease-suave hover:text-branco hover:underline sm:px-1"
          >
            Limpar a lista
          </button>

          <a
            href={linkWhatsApp(mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secundario w-full sm:w-auto"
          >
            <IconeWhatsapp className="size-[1.15em] shrink-0" strokeWidth={1.75} />
            Quero provar esses {quantidade}
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * Monta o texto que vai para o WhatsApp.
 *
 * A ORDEM DAS LINHAS É A ORDEM EM QUE A LOJA PRECISA LER: quais vestidos,
 * quando é o dia, qual o manequim. O link vem por último porque é o que menos
 * muda a resposta, e é o que fecha o ciclo: `?provar=` reabre a seleção
 * exata do outro lado, então a Danielli separa os vestidos antes de a noiva
 * chegar em vez de reconstituir a lista pela conversa.
 */
function montarMensagem(
  escolhidos: Peca[],
  base: string,
  data: string,
  manequim: string,
  noiva: boolean,
): string {
  const parametros = new URLSearchParams({ provar: escolhidos.map((p) => p.slug).join(',') })
  if (data) parametros.set('data', data)

  const partes: string[] = [
    noiva
      ? 'Olá! Separei estes vestidos no catálogo de noiva e queria provar:'
      : 'Olá! Separei estes vestidos no catálogo e queria provar:',
    '',
    /* A descrição entra entre parênteses, com inicial minúscula: numa lista
       de WhatsApp ela é aposto do nome, não uma segunda frase. */
    ...escolhidos.map(
      (peca) => `• ${peca.nome} (${minuscula(peca.descricao)})`,
    ),
  ]

  /* Bloco dela, só quando existe. Um parágrafo em branco entre a lista e os
     dados é o que faz a mensagem ser lida em blocos no WhatsApp. */
  if (data || manequim) {
    partes.push('')
    if (data) {
      partes.push(
        noiva ? `Meu casamento é ${formatarData(data)}.` : `Meu evento é ${formatarData(data)}.`,
      )
    }
    if (manequim) partes.push(`Meu manequim: ${manequim}.`)
  }

  partes.push('', `Minha seleção: ${SITE_URL}${base}?${parametros.toString()}`)

  return partes.join('\n')
}

/** "Renda com gola alta" → "renda com gola alta". */
function minuscula(texto: string): string {
  return texto.charAt(0).toLowerCase() + texto.slice(1)
}
