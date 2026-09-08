import { ATENDE, IMPORTADOS, MARCAS, anosDeCasa } from '../data/autoridade'
import { videoAtelier } from '../data/videos'
import Revelar from './Revelar'
import VideoVertical from './VideoVertical'

/**
 * Bloco 2, a autoridade.
 *
 * O bloco que estava faltando no site inteiro. Antes havia aqui um espaço
 * reservado pedindo "anos de atelier e quantas noivas já saíram daqui
 * vestidas", porque ninguém tinha o número. Agora tem, e é melhor do que o
 * que eu teria inventado.
 *
 * A ORDEM É DELIBERADA: TEMPO, DEPOIS MARCAS
 * ------------------------------------------
 * Anos de casa qualquer loja tem. Marca representada é o que separa ateliê
 * sério de loja que compra vestido pronto de fornecedor, e é o argumento que
 * a noiva não sabe que deveria procurar. Por isso as marcas ganham o peso
 * visual maior, e não os anos.
 *
 * O VÍDEO PROVA QUE O LUGAR EXISTE
 * --------------------------------
 * Uma panorâmica pelos manequins. Num link que chega por WhatsApp, a primeira
 * dúvida silenciosa é se existe loja de verdade atrás daquilo ou se é um
 * perfil revendendo foto. Trinta segundos de arara resolvem isso sem uma
 * palavra.
 */
export default function SecaoAutoridade() {
  const anos = anosDeCasa()

  return (
    <section className="border-t border-borda-sutil bg-branco">
      <div className="container-luxo secao">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
          <Revelar distancia="nenhuma">
            <VideoVertical
              src={videoAtelier.src}
              poster={videoAtelier.poster}
              alt={videoAtelier.alt}
            />
          </Revelar>

          <div>
            <Revelar atraso={80}>
              <span className="eyebrow block">O ateliê</span>
              <h2 className="mt-4 texto-display-sm uppercase tracking-luxo">
                No mercado desde 2004
              </h2>
              <span className="filete mt-7" />
            </Revelar>

            <Revelar atraso={160}>
              <p className="mt-8 max-w-lg text-preto/75">
                São {anos} anos vestindo {listar(ATENDE)}, incluindo formatura
                de alto padrão.
              </p>
            </Revelar>

            <Revelar atraso={230}>
              {/*
                As marcas em lista de definição, e não num parágrafo: elas são
                o argumento mais forte do bloco, e num parágrafo corrido
                passariam como enfeite.
              */}
              <dl className="mt-10 border-t border-borda pt-8">
                <dt className="font-display text-h6 uppercase tracking-luxo text-cinza">
                  Marcas representadas
                </dt>
                <dd className="mt-4">
                  <ul className="flex flex-wrap gap-x-3 gap-y-2">
                    {MARCAS.map((marca) => (
                      <li
                        key={marca}
                        className="border border-borda px-4 py-2 font-display text-h6 uppercase tracking-luxo text-preto"
                      >
                        {marca}
                      </li>
                    ))}
                  </ul>
                </dd>

                <dd className="mt-5 text-sm text-preto/70">
                  Além de peças importadas da {IMPORTADOS}.
                </dd>
              </dl>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  )
}

/** ['a', 'b', 'c'] vira "a, b e c". */
function listar(itens: readonly string[]): string {
  if (itens.length < 2) return itens[0] ?? ''
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}
