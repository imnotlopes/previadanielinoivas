import type { Peca } from '../data/pecas'
import { useContato, useLoja } from '../lib/loja'
import { calcularPreco, precoBRL } from '../lib/preco'
import { formatarData, useSelecao } from '../lib/selecao'
import { IconeWhatsapp } from './icones'

interface ReservaProps {
  peca: Peca
}

/**
 * Bloco de agendamento da ficha: manequim, data e o botão do WhatsApp.
 *
 * OS CAMPOS SÃO OS MESMOS DA LISTA DE PROVA — literalmente.
 * ---------------------------------------------------------
 * Antes eram estado local desta tela, e o resultado é que uma noiva que
 * abrisse cinco fichas digitava a data do casamento cinco vezes. Ela tem um
 * casamento só; agora os dois campos leem e escrevem em `lib/selecao.ts`,
 * então preencher aqui preenche na barra da lista, e vice-versa.
 *
 * Os dois existem para qualificar a conversa. Sem eles a loja recebe "oi,
 * tenho interesse" e gasta duas mensagens perguntando manequim e data — com
 * eles, a resposta já pode ser "esse está livre no seu dia, vem quinta?".
 *
 * NENHUM CAMPO É OBRIGATÓRIO, de propósito. Exigir preenchimento antes de
 * falar com alguém é a forma mais rápida de perder quem só queria tirar uma
 * dúvida. Quem preenche, ajuda; quem não preenche, conversa do mesmo jeito.
 *
 * Cor não se pergunta: cada vestido tem a sua, e um campo aberto só convida
 * a pedir o que o acervo não tem.
 *
 * O link é remontado a cada tecla e o elemento continua sendo um `<a>` de
 * verdade — o WhatsApp abre pela navegação nativa, e não por `window.open`,
 * que bloqueador de pop-up derruba no celular.
 */
export default function Reserva({ peca }: ReservaProps) {
  const { data, manequim, definirData, definirManequim } = useSelecao()

  const { cupomAtivo } = useLoja()
  const { linkWhatsApp } = useContato()
  const { final } = calcularPreco(peca, cupomAtivo)

  /* Em vestido de noiva a data é a do casamento, e dizer isso na etiqueta é o
     que faz o campo parecer conversa e não formulário. */
  const noiva = peca.categoria === 'noiva'

  /*
    A mensagem é montada aqui e em nenhum outro lugar desta página. A ordem
    das linhas segue o que a loja precisa ler primeiro: qual vestido, depois
    os dados dela, e o cupom por último, porque é o que menos muda a resposta.

    A categoria NÃO entra na frase: quem está na ficha de um vestido de noiva
    já sabe que é de noiva, e "(Noiva)" no meio da mensagem só denuncia texto
    montado por máquina.
  */
  const linhas = [
    `Olá! Vi no catálogo o vestido ${peca.nome} (${peca.descricao}).`,
    /* A numeração cadastrada entra na mensagem para a loja não precisar
       conferir a arara antes de responder se serve. */
    peca.numeracao.length > 0 ? `Numeração no catálogo: ${peca.numeracao.join(', ')}.` : null,
    final !== null ? `Valor no catálogo: ${precoBRL(final)}.` : null,
    manequim ? `Meu manequim: ${manequim}.` : null,
    data ? `${noiva ? 'Meu casamento é' : 'Meu evento é'} ${formatarData(data)}.` : null,
    cupomAtivo ? `Cupom: ${cupomAtivo.codigo}.` : null,
    'Gostaria de agendar uma prova.',
  ].filter(Boolean)

  const hoje = new Date().toISOString().slice(0, 10)

  return (
    <div className="mt-8 border-t border-borda pt-7">
      <p className="eyebrow">Agendar a prova</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="reserva-tamanho">
            Seu manequim <span className="text-cinza">(opcional)</span>
          </label>
          <input
            id="reserva-tamanho"
            className="input"
            value={manequim}
            onChange={(e) => definirManequim(e.target.value)}
            placeholder="38, 42, M…"
            autoComplete="off"
            maxLength={20}
          />
        </div>

        <div>
          <label className="label" htmlFor="reserva-data">
            {noiva ? 'Data do casamento' : 'Data do evento'}{' '}
            <span className="text-cinza">(opcional)</span>
          </label>
          <input
            id="reserva-data"
            type="date"
            className="input"
            value={data}
            min={hoje}
            onChange={(e) => definirData(e.target.value)}
          />
        </div>
      </div>

      <a
        href={linkWhatsApp(linhas.join(' '))}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primario mt-6 w-full sm:w-auto"
      >
        <IconeWhatsapp className="size-[1.15em] shrink-0" strokeWidth={1.75} />
        Perguntar sobre este vestido
      </a>

      <p className="mt-4 text-sm leading-relaxed text-preto/65">
        A prova é sem compromisso. Nada é reservado até você confirmar na
        conversa.
      </p>
    </div>
  )
}
