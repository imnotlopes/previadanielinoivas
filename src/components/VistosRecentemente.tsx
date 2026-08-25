import { useEffect, useState } from 'react'

import { buscarPeca } from '../data/pecas'
import { lerHistorico } from '../lib/historico'
import { useLoja } from '../lib/loja'
import CardPeca from './CardPeca'
import SecaoTitulo from './SecaoTitulo'

interface VistosRecentementeProps {
  /** Slug da página atual, para o vestido aberto não aparecer na própria lista. */
  exceto?: string
}

/**
 * Vestidos que a visitante já abriu, lidos do navegador dela.
 *
 * Só aparece a partir de dois itens: com um só, a seção seria um lembrete de
 * que ela clicou uma vez, o que não ajuda ninguém a decidir.
 *
 * A leitura acontece em `useEffect` porque o histórico está no
 * `localStorage`, que não existe fora do navegador — ler durante a
 * renderização quebraria qualquer pré-render.
 */
export default function VistosRecentemente({ exceto }: VistosRecentementeProps) {
  const { pecas } = useLoja()
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    setSlugs(lerHistorico())
  }, [exceto])

  const listadas = slugs
    .filter((slug) => slug !== exceto)
    .map((slug) => buscarPeca(pecas, slug))
    .filter((peca): peca is NonNullable<typeof peca> => peca !== undefined)
    .slice(0, 4)

  if (listadas.length < 2) return null

  return (
    <section className="secao bg-off-white">
      <div className="container-luxo">
        <SecaoTitulo eyebrow="De volta para você" titulo="Vistos recentemente" />

        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {listadas.map((peca) => (
            <li key={peca.slug}>
              <CardPeca peca={peca} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
