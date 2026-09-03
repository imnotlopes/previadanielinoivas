import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Peca } from '../data/pecas'
import Revelar from './Revelar'

interface CapaCatalogoProps {
  /** O vestido da capa. A foto e a história saem dele. */
  peca: Peca
  /** Prefixo da ficha, para o link. */
  base: string
  /** Quantos vestidos o catálogo tem agora. */
  total: number
}

/** A foto da capa, em duas larguras. */
const FOTO = '/casamentos/capa-natalia.webp'
const FOTO_MENOR = '/casamentos/capa-natalia-800.webp'

/**
 * A CAPA DO CATÁLOGO.
 *
 * Pedido da Danielli: a filha dela, Natália, é a capa. Não é escolha de banco
 * de imagem, é o argumento de autoridade mais forte que a loja tem, e ele se
 * conta em uma frase: quando a filha da dona casou, casou com uma peça do
 * acervo da casa. Nenhum depoimento contratado chega perto disso.
 *
 * DUAS COLUNAS, E NÃO FOTO SANGRADA
 * ---------------------------------
 * A foto é retrato 3:4. Sangrada na tela inteira, ela é perfeita no celular e
 * vira uma faixa do meio da noiva no computador, e resolver isso pediria uma
 * segunda foto, com outro recorte, só para a capa.
 *
 * Em duas colunas ela aparece inteira em qualquer largura, o texto nunca fica
 * sobre a imagem (portanto nunca precisa de véu escuro para ser legível) e no
 * celular a foto ainda ocupa a tela quase toda. Menos arquivo, menos regra,
 * mesmo efeito.
 *
 * O TAMANHO É CONTIDO DE PROPÓSITO
 * --------------------------------
 * Este catálogo é a ferramenta que a Danielli usa de pé, com a noiva do lado.
 * Uma capa de tela cheia poria uma rolagem inteira entre ela e a grade, o
 * atrito que o resto desta peça foi desenhado para eliminar. A capa vale uma
 * abertura, não um pedágio.
 */
export default function CapaCatalogo({ peca, base, total }: CapaCatalogoProps) {
  return (
    <section className="border-b border-borda-sutil bg-branco">
      <div className="container-luxo py-12 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <Revelar distancia="nenhuma">
            <div className="overflow-hidden bg-bege">
              <img
                src={FOTO}
                srcSet={`${FOTO_MENOR} 800w, ${FOTO} 1400w`}
                /* Metade da largura do conteúdo no computador, a tela inteira
                   no celular. Sem isto o navegador baixa a de 1400 para um
                   quadro de 380. */
                sizes="(min-width: 768px) 46vw, 100vw"
                alt="Natália, filha da Danielli, sentada com o vestido de renda de gola alta no dia do casamento."
                /* A capa é a primeira coisa da página: carrega adiantada e
                   com prioridade, porque é ela que define o tempo até a
                   primeira imagem aparecer. */
                fetchPriority="high"
                decoding="async"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </Revelar>

          <div>
            <Revelar atraso={90}>
              <span className="eyebrow block">Acervo de noiva</span>
              <h1 className="mt-4 texto-display-sm uppercase tracking-luxo">
                {total} vestidos para provar
              </h1>
              <span className="filete mt-7" />
            </Revelar>

            {peca.historia && (
              <Revelar atraso={170}>
                <p className="mt-8 font-display text-h4 font-light italic leading-snug text-preto/80">
                  {peca.historia}
                </p>
              </Revelar>
            )}

            <Revelar atraso={240}>
              <p className="mt-7 max-w-md text-preto/70">
                Marque com o <strong className="font-semibold">+</strong> os que
                você quer provar. No fim sai uma mensagem só com a sua lista, e
                a gente separa antes de você chegar.
              </p>

              {/*
                `<Link>` e não `<a href>`: a ficha do vestido mora DENTRO desta
                mesma aplicação. Ver o bloco CAMINHOS em entradas/comum.
              */}
              <Link
                to={`${base}/${peca.slug}`}
                className="btn-primario mt-9 w-full sm:w-auto"
              >
                Ver o vestido da capa
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
              </Link>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  )
}
