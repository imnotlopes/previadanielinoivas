import { useState } from 'react'

import type { Peca } from '../data/pecas'
import { rotulosCategoria } from '../data/pecas'
import { useContato, useLoja } from '../lib/loja'
import { calcularPreco, precoBRL } from '../lib/preco'
import { IconeWhatsapp } from './icones'

interface ReservaProps {
  peca: Peca
}

/**
 * Bloco de reserva: tamanho, data do evento e o botão do WhatsApp.
 *
 * Os dois campos existem para qualificar a conversa. Sem eles a loja recebe
 * "oi, tenho interesse" e gasta três mensagens perguntando manequim e data —
 * com eles, a primeira mensagem já traz as duas coisas e a resposta pode ser
 * "esse está livre no seu dia, vem provar quinta?".
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
  const [tamanho, setTamanho] = useState('')
  const [data, setData] = useState('')

  const { cupomAtivo } = useLoja()
  const { linkWhatsApp } = useContato()
  const { final } = calcularPreco(peca, cupomAtivo)

  /*
    A mensagem é montada aqui e em nenhum outro lugar desta página. A ordem
    das linhas segue o que a loja precisa ler primeiro: qual vestido, depois
    os dados dela, e o cupom por último, porque é o que menos muda a resposta.
  */
  const linhas = [
    `Olá! Vi no site o vestido ${peca.nome} (${rotulosCategoria[peca.categoria]}, ${peca.descricao}).`,
    final !== null ? `Valor no site: ${precoBRL(final)}.` : null,
    tamanho ? `Meu manequim: ${tamanho}.` : null,
    data ? `Data do evento: ${formatarData(data)}.` : null,
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
            value={tamanho}
            onChange={(e) => setTamanho(e.target.value)}
            placeholder="38, 42, M…"
            autoComplete="off"
            maxLength={20}
          />
        </div>

        <div>
          <label className="label" htmlFor="reserva-data">
            Data do evento <span className="text-cinza">(opcional)</span>
          </label>
          <input
            id="reserva-data"
            type="date"
            className="input"
            value={data}
            min={hoje}
            onChange={(e) => setData(e.target.value)}
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
        Agendar prova no WhatsApp
      </a>

      <p className="mt-4 text-sm leading-relaxed text-preto/65">
        A prova é sem compromisso. Nada é reservado até você confirmar na
        conversa.
      </p>
    </div>
  )
}

/** "2026-10-12" → "12/10/2026", sem depender de fuso. */
function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : iso
}
