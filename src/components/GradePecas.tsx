import { Images } from 'lucide-react'
import { useState } from 'react'

import { PECAS_POR_APRESENTACAO } from '../data/apresentacoes'
import { identificacao, ordenadas, type Peca } from '../data/pecas'
import BotaoProvar from './BotaoProvar'
import OverlayPeca from './OverlayPeca'
import Revelar from './Revelar'

interface GradePecasProps {
  pecas: Peca[]
  /** Some quando não há peça. Ex.: a Danielli ocultou o acervo inteiro. */
  vazio?: string
}

/**
 * Bloco 4, os modelos.
 *
 * O QUE SAIU, E POR QUE ISSO É O PONTO
 * ------------------------------------
 * Esta grade substituiu um catálogo com busca, filtro por cor, silhueta,
 * decote e manga, ordenação, paginação, alternância de densidade e contador.
 * Tudo foi construído com cuidado, e tudo estava errado para este produto.
 *
 * Catálogo é para quem procura. Apresentação é para quem já está conversando
 * com a Danielli e vai rolar o polegar por dois minutos. Filtro pressupõe
 * acervo grande demais para olhar; aqui a graça é justamente ser uma amostra
 * pequena e escolhida. Busca pressupõe que a pessoa sabe o nome do que quer;
 * ela não sabe, e os nomes nem existem.
 *
 * DOZE, E NÃO QUARENTA
 * --------------------
 * O acervo de noiva tem quarenta peças. Mostrar as quarenta traria o catálogo
 * de volta pela porta dos fundos: sem filtro e sem busca, quarenta cards não
 * são amostra, são lista. O teto está em `PECAS_POR_APRESENTACAO`, e quem
 * escolhe quais é a Danielli, pelo destaque.
 *
 * SEM CONTAGEM, EM LUGAR NENHUM
 * -----------------------------
 * Nem "40 vestidos", nem "mostrando 12 de 40", nem "carregar mais". A
 * Danielli pediu linguagem sem número, e a razão é boa: número fecha o
 * acervo. "Alguns dos modelos" deixa a porta aberta para o que está na arara
 * e não está aqui, que é sempre a maior parte.
 */
export default function GradePecas({ pecas, vazio }: GradePecasProps) {
  const [aberta, setAberta] = useState<Peca | null>(null)

  /*
    Corta no teto DEPOIS de ordenar: assim as destacadas pela Danielli entram
    primeiro, e o corte tira do fim. Se ela quer outra peça na apresentação, é
    só marcá-la como destaque no painel.
  */
  const lista = ordenadas(pecas).slice(0, PECAS_POR_APRESENTACAO)

  if (lista.length === 0) {
    return vazio ? (
      <Revelar>
        <p className="mx-auto max-w-md text-center text-preto/70">{vazio}</p>
      </Revelar>
    ) : null
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
        {lista.map((peca, indice) => (
          <Revelar
            key={peca.codigo}
            como="li"
            distancia="curta"
            /* Escalonado por coluna, e com teto: doze peças a 90 ms cada
               levariam mais de um segundo, e a última chegaria depois de a
               pessoa já ter passado por ela. */
            atraso={(indice % 3) * 90}
          >
            <div className="group relative">
              <button
                type="button"
                onClick={() => setAberta(peca)}
                className="block w-full text-left"
              >
                <div className="relative overflow-hidden bg-borda-sutil">
                  <img
                    src={peca.fotos[0]}
                    alt={identificacao(peca)}
                    /* As duas primeiras fileiras adiantadas: são as que estão
                       na tela quando a pessoa chega neste bloco. */
                    loading={indice < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
                  />

                  {/* Quantas fotos existem: com a noiva do lado, é o que diz
                      à Danielli qual peça rende mais para mostrar. */}
                  {peca.fotos.length >= 3 && (
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 bg-preto/85 px-2 py-1 font-display text-[0.6875rem] uppercase tracking-luxo text-branco">
                      <Images size={11} strokeWidth={2} aria-hidden />
                      {peca.fotos.length}
                    </span>
                  )}
                </div>

                <div className="pt-4">
                  <span className="eyebrow block">{peca.codigo}</span>
                  {peca.nome && (
                    <span className="mt-2 block font-display text-h5 uppercase tracking-luxo text-preto">
                      {peca.nome}
                    </span>
                  )}
                  <span className="mt-1.5 block text-sm text-preto/65">
                    {peca.descricao}
                  </span>

                  {peca.cores.length > 0 && (
                    <span className="mt-1.5 block text-sm text-preto/65">
                      {peca.cores.join(' · ')}
                    </span>
                  )}
                  {peca.tamanhos.length > 0 && (
                    <span className="mt-1 block font-display text-h6 uppercase tracking-luxo text-preto/70">
                      {peca.tamanhos.join(' · ')}
                    </span>
                  )}
                </div>
              </button>

              {/* Irmão do botão, e não filho: botão dentro de botão é HTML
                  inválido, e na prática o toque abriria o overlay em vez de
                  marcar a peça. */}
              <BotaoProvar
                codigo={peca.codigo}
                nome={identificacao(peca)}
                className="absolute right-2 top-2 z-10"
              />
            </div>
          </Revelar>
        ))}
      </ul>

      {aberta && <OverlayPeca peca={aberta} aoFechar={() => setAberta(null)} />}
    </>
  )
}
