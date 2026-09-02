import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

import { publicadas, type Peca } from '../data/pecas'
import { SITE_URL } from '../lib/brand'
import { useContato, useLoja } from '../lib/loja'
import { useSelecao } from '../lib/selecao'
import { IconeWhatsapp } from './icones'

interface BarraSelecaoProps {
  /** Prefixo do catálogo em que estamos: `/catalogo` ou `/festa`. */
  base: string
}

/**
 * A barra da lista de prova.
 *
 * O FECHAMENTO DO CATÁLOGO
 * ------------------------
 * Todo o resto do catálogo existe para chegar aqui. A noiva marcou cinco
 * vestidos; esta barra transforma isso em UMA mensagem com os nomes e um link
 * que reabre a mesma seleção do lado da Danielli.
 *
 * A MENSAGEM É O PRODUTO
 * ----------------------
 * Ela é escrita na primeira pessoa da noiva, porque é a noiva que aperta
 * enviar — texto em terceira pessoa ("a cliente selecionou") entrega que foi
 * um sistema que escreveu, e a conversa começa com cara de formulário.
 *
 * Os nomes vão por extenso, um por linha. Só o link não bastaria: no WhatsApp
 * o link vira um cartão, e se a Danielli estiver sem internet ou o link
 * expirar, a mensagem ainda precisa dizer quais vestidos são.
 */
export default function BarraSelecao({ base }: BarraSelecaoProps) {
  const { pecas } = useLoja()
  const { linkWhatsApp } = useContato()
  const { slugs, quantidade, limpar, remover } = useSelecao()

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

  const mensagem = montarMensagem(escolhidos, base)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5">
      <div className="pointer-events-auto mx-auto flex w-full max-w-conteudo flex-col gap-4 bg-preto p-4 text-branco shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="font-display text-h6 uppercase tracking-luxo text-dourado">
            Sua lista de prova · {quantidade}
          </p>

          {/*
            Os nomes ficam visíveis, e cada um com o seu X. Uma barra que diz
            só "5 vestidos" obriga a noiva a lembrar quais são — e o momento
            de tirar um da lista é exatamente este, antes de mandar.
          */}
          <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">
            {escolhidos.map((peca) => (
              <li key={peca.slug}>
                <span className="inline-flex items-center gap-1.5 border border-branco/25 py-1 pl-2.5 pr-1 text-sm text-branco/85">
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
                    className="inline-flex size-5 items-center justify-center text-branco/60 transition-colors duration-300 ease-suave hover:text-branco"
                  >
                    <X size={13} strokeWidth={2} aria-hidden />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={limpar}
            className="order-2 py-2 text-sm text-branco/60 underline-offset-4 transition-colors duration-300 ease-suave hover:text-branco hover:underline sm:order-1 sm:px-2"
          >
            Limpar
          </button>

          <a
            href={linkWhatsApp(mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secundario btn-sm order-1 sm:order-2"
          >
            <IconeWhatsapp className="size-[1.15em] shrink-0" strokeWidth={1.75} />
            Quero provar esses
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * Monta o texto que vai para o WhatsApp.
 *
 * O link no fim é o que fecha o ciclo: `?provar=` reabre a seleção exata do
 * outro lado (ver lib/selecao.ts), então a Danielli separa os vestidos antes
 * de a noiva chegar em vez de reconstituir a lista pela conversa.
 */
function montarMensagem(escolhidos: Peca[], base: string): string {
  const linhas = escolhidos.map((peca) => `• ${peca.nome} — ${peca.descricao}`)
  const link = `${SITE_URL}${base}?provar=${escolhidos.map((p) => p.slug).join(',')}`

  return [
    'Olá! Separei estes vestidos no catálogo e queria provar:',
    '',
    ...linhas,
    '',
    `Minha seleção: ${link}`,
  ].join('\n')
}
