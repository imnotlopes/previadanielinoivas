import { CalendarHeart, X } from 'lucide-react'
import { useState } from 'react'

import type { Apresentacao } from '../data/apresentacoes'
import { doPublico, identificacao, visiveis, type Peca } from '../data/pecas'
import { useContato, useLoja } from '../lib/loja'
import { formatarData, useSelecao } from '../lib/selecao'
import { IconeWhatsapp } from './icones'

interface BarraSelecaoProps {
  apresentacao: Apresentacao
}

/**
 * O motor da apresentação: a lista de prova e a volta para o WhatsApp.
 *
 * Sem isto, a peça é um PDF em HTML. Com isto, ela devolve a pessoa para a
 * conversa com a escolha feita, que é o único desfecho que interessa.
 *
 * A MENSAGEM CARREGA A ORIGEM
 * ---------------------------
 * "Vi a apresentação de noivas" abre a mensagem. É o item menos vistoso do
 * produto: hoje, com uma apresentação só, ele não separa nada. É também o que
 * eu não tiraria, porque no dia da segunda a Danielli passa a saber de qual
 * link veio cada contato sem instalar ferramenta nenhuma de análise, e sem
 * nenhuma migração.
 *
 * E ela é escrita na primeira pessoa da cliente, porque é a cliente que
 * aperta enviar. Texto em terceira pessoa entrega que foi um sistema que
 * escreveu, e a conversa começa com cara de formulário.
 *
 * NASCE RECOLHIDA
 * ---------------
 * Com os dois campos abertos, a barra ocupa metade de uma tela de celular e
 * tapa justamente a grade que a pessoa está usando para escolher. Fechada, o
 * convite para a data continua visível numa linha.
 */
export default function BarraSelecao({ apresentacao }: BarraSelecaoProps) {
  const { pecas } = useLoja()
  const { linkWhatsApp } = useContato()
  const {
    codigos,
    quantidade,
    data,
    manequim,
    limpar,
    remover,
    definirData,
    definirManequim,
  } = useSelecao()

  const [aberta, setAberta] = useState(false)

  /*
    Resolve código para peça a partir do que está VISÍVEL E É DESTA
    APRESENTAÇÃO.

    Visível, porque uma peça que a Danielli tirou do ar depois de a cliente
    marcar não pode voltar na mensagem: criaria conversa sobre algo que não
    existe mais.

    Desta apresentação, e o filtro fica mesmo havendo uma só. A seleção mora
    no navegador e não sabe em qual página foi feita: quando existiam três, a
    barra da apresentação de madrinhas mostrava códigos de vestido de noiva
    marcados na outra, e mandava para a Danielli uma mensagem dizendo "vi a
    apresentação de madrinhas" com peça de noiva na lista.

    Hoje o filtro não recorta nada. Tirá-lo devolveria o defeito de graça na
    primeira vez que uma segunda apresentação nascer, e esse defeito não dá
    erro nenhum: ele só manda a mensagem errada.
  */
  const noAr = doPublico(visiveis(pecas), apresentacao.publico)
  const escolhidas = codigos
    .map((codigo) => noAr.find((peca) => peca.codigo === codigo))
    .filter((peca): peca is Peca => peca !== undefined)

  if (escolhidas.length === 0) return null

  const noivas = apresentacao.publico === 'noivas'
  const hoje = new Date().toISOString().slice(0, 10)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5">
      <div className="pointer-events-auto mx-auto w-full max-w-conteudo bg-preto p-4 text-branco shadow-md sm:p-5">
        <p className="font-display text-h6 uppercase tracking-luxo text-dourado">
          Você quer provar · {quantidade}
        </p>

        {/* Os códigos ficam à vista, com o X de cada um. Uma barra que diz só
            "5 peças" obriga a cliente a lembrar quais são, e o momento de
            tirar uma da lista é este, antes de mandar. */}
        <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">
          {escolhidas.map((peca) => (
            <li key={peca.codigo}>
              <span className="inline-flex items-center gap-1 border border-branco/25 py-0.5 pl-3 pr-0.5 text-sm text-branco/85">
                {identificacao(peca)}
                <button
                  type="button"
                  onClick={() => remover(peca.codigo)}
                  aria-label={`Tirar ${identificacao(peca)} da lista`}
                  className="inline-flex size-9 items-center justify-center text-branco/60 transition-colors duration-300 ease-suave hover:text-branco"
                >
                  <X size={13} strokeWidth={2} aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>

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
                {noivas ? 'Casamento' : 'Evento'} em {formatarData(data)}
                {manequim && ` · manequim ${manequim}`}
                <span className="text-branco/45"> · alterar</span>
              </span>
            ) : (
              <span>
                {noivas
                  ? 'Colocar a data do casamento: a gente já diz o que está livre'
                  : 'Colocar a data do evento: a gente já diz o que está livre'}
              </span>
            )}
          </button>
        )}

        {aberta && (
          <>
            {/*
              Dois campos, e nenhum obrigatório. São exatamente o que a loja
              precisa para responder alguma coisa útil, e nada além. Nome e
              telefone não entram: a conversa acontece no WhatsApp, que já
              traz os dois.
            */}
            <div className="mt-5 grid gap-4 border-t border-branco/20 pt-5 sm:grid-cols-2">
              <div>
                <label
                  className="mb-2 block font-display text-h6 uppercase tracking-luxo text-branco/75"
                  htmlFor="selecao-data"
                >
                  {noivas ? 'Data do casamento' : 'Data do evento'}{' '}
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

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setAberta(false)}
                aria-expanded
                className="text-sm text-branco/60 underline-offset-4 transition-colors duration-300 ease-suave hover:text-branco hover:underline"
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
            href={linkWhatsApp(montarMensagem(escolhidas, apresentacao, data, manequim))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secundario w-full sm:w-auto"
          >
            <IconeWhatsapp className="size-[1.15em] shrink-0" strokeWidth={1.75} />
            Quero provar
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * O texto que vai para o WhatsApp.
 *
 * Formato fechado no brief. A ordem é a que a Danielli precisa ler: de onde
 * veio, o que a cliente quer provar, e quando é o dia.
 */
function montarMensagem(
  escolhidas: Peca[],
  apresentacao: Apresentacao,
  data: string,
  manequim: string,
): string {
  const partes = [
    `Oi Danielli! Vi ${apresentacao.origem} e queria provar estes modelos:`,
    ...escolhidas.map((peca) => `- ${identificacao(peca)}`),
  ]

  /* O bloco dela só existe se ela preencheu, e vem depois de uma linha em
     branco: é o que faz a mensagem ser lida em dois blocos no WhatsApp. */
  if (data || manequim) {
    partes.push('')
    if (data) {
      partes.push(
        apresentacao.publico === 'noivas'
          ? `Meu casamento é em ${formatarData(data)}.`
          : `Meu evento é em ${formatarData(data)}.`,
      )
    }
    if (manequim) partes.push(`Meu manequim: ${manequim}.`)
  }

  return partes.join('\n')
}
