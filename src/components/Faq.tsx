import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

import { perguntas } from '../data/faq'
import BotaoWhatsapp from './BotaoWhatsapp'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'
import { brand } from '../lib/brand'

/**
 * Acordeão em <details>/<summary>: abre e fecha sem JavaScript, já vem com
 * a semântica certa para leitor de tela e é localizável pelo Ctrl+F do
 * navegador mesmo fechado.
 *
 * NÃO É `.folha`, e isso é decisão. A lista já é alta, e travar altura mínima
 * numa seção que passa da tela só cria vão vazio no topo. Folha é para bloco
 * que precisa de espaço para respirar, não para bloco que já tem demais.
 */
export default function Faq() {
  if (perguntas.length === 0) return null

  return (
    <section className="secao border-t border-borda-sutil bg-off-white">
      <div className="container-luxo">
        <Revelar>
          <SecaoTitulo eyebrow="Dúvidas" titulo="Perguntas frequentes" centralizado />
        </Revelar>

        <ul className="mx-auto mt-14 flex max-w-3xl flex-col border-t border-borda-sutil">
          {perguntas.map((item, indice) => (
            <Revelar
              key={item.id}
              como="li"
              distancia="curta"
              /* Teto no escalonamento: com 10 perguntas, 60 ms cada já daria
                 meio segundo até a última, e ninguém espera um FAQ chegar. */
              atraso={Math.min(indice, 5) * 60}
              className="border-b border-borda-sutil"
            >
              <ItemFaq pergunta={item.pergunta} resposta={item.resposta} />
            </Revelar>
          ))}
        </ul>

        <Revelar atraso={120}>
          <div className="mt-14 flex flex-col items-center gap-5 text-center">
            <p className="text-preto/70">Ficou com outra dúvida?</p>
            <BotaoWhatsapp
              mensagem={`Olá! Vim pelo site do Atelier ${brand.nome} e fiquei com uma dúvida.`}
            >
              Perguntar no WhatsApp
            </BotaoWhatsapp>
          </div>
        </Revelar>
      </div>
    </section>
  )
}

function ItemFaq({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [aberto, setAberto] = useState(false)

  return (
    <details
      open={aberto}
      onToggle={(e) => setAberto((e.currentTarget as HTMLDetailsElement).open)}
      className="group"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
        <h3 className="font-display text-h5 uppercase tracking-luxo transition-colors duration-300 ease-suave group-hover:text-cinza">
          {pergunta}
        </h3>
        <span aria-hidden className="shrink-0 text-preto">
          {aberto ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
        </span>
      </summary>

      <p className="max-w-2xl pb-7 leading-relaxed text-preto/75">{resposta}</p>
    </details>
  )
}
