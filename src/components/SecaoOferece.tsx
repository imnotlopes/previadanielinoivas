import { EDITORIAL, PARA_QUEM_ESTA_COM_VOCE, PARA_VOCE, type FotoOferece } from '../data/oferece'
import Dupla from './Dupla'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'

/**
 * TUDO PARA O SEU CASAMENTO.
 *
 * O que o ateliê oferece além do vestido, que é a parte do áudio da Danielli
 * que a apresentação ainda não contava: véu, tiara, sapato, porta-aliança, e
 * os trajes de quem vai estar do lado da noiva. O conteúdo e o porquê estão
 * em data/oferece.ts.
 *
 * TEXTO QUE CONTA, FOTO QUE ILUSTRA
 * ---------------------------------
 * As fotos disponíveis são quase todas de tiara. Se a seção fosse um mosaico
 * de itens com legenda, ela diria "o ateliê tem tiaras", que é o contrário do
 * argumento. Então o texto carrega a lista inteira, em duas frases, e as fotos
 * ficam ao lado dando textura: o brilho de um cristal, uma noiva no espelho.
 *
 * AS FOTOS NUNCA PASSAM DO TAMANHO QUE TÊM
 * ----------------------------------------
 * Vieram do Perfil da Empresa no Google, pequenas. Cada uma tem `max-width`
 * igual à própria largura e fica na proporção original, sem recorte. Numa
 * tela grande sobra respiro em volta; é melhor que uma foto esticada e
 * borrada ao lado do nome da Danielli.
 */
export default function SecaoOferece() {
  return (
    <section className="bg-off-white">
      <div className="container-luxo secao">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
          <div className="text-center lg:text-left">
            <Revelar>
              <SecaoTitulo
                script="Para o seu dia"
                titulo="Tudo para o seu casamento"
                descricao="Do vestido ao porta-aliança, tudo o que você vai precisar está aqui dentro."
                centralizado="celular"
              />
            </Revelar>

            <div className="mx-auto mt-12 max-w-md space-y-10 lg:mx-0">
              <Revelar atraso={80}>
                <span className="eyebrow block">Para você</span>
                <p className="mt-4">{maiuscula(listar(PARA_VOCE))}.</p>
              </Revelar>

              <Revelar atraso={160}>
                <span className="eyebrow block">Para quem vai estar do seu lado</span>
                <div className="mt-4 space-y-2">
                  {PARA_QUEM_ESTA_COM_VOCE.map((frase) => (
                    <p key={frase}>{frase}</p>
                  ))}
                </div>
              </Revelar>

              <Revelar atraso={240}>
                <p className="t-italico">Dá para vestir o casamento inteiro com a gente.</p>
              </Revelar>
            </div>
          </div>

          <Composicao />
        </div>
      </div>
    </section>
  )
}

/**
 * A COMPOSIÇÃO EDITORIAL.
 *
 * A dupla das referências (ver Dupla): a tiara alta grande, a noiva no espelho
 * pequena e de moldura branca por cima da borda. Embaixo, a faixa com as três
 * tiaras, com a legenda ao lado.
 *
 * A noiva é a pequena, e não a grande, de propósito: ela está de costas e o
 * vestido aparece inteiro de longe. Pequena, ela conta o momento do provador
 * sem virar vitrine do vestido, que é a regra da Danielli.
 */
function Composicao() {
  const { espelho, retrato, faixa } = EDITORIAL

  return (
    <div className="mx-auto w-full max-w-md lg:max-w-lg">
      <Dupla
        grande={<Foto foto={retrato} />}
        pequena={<Foto foto={espelho} />}
      />

      <div className="mt-10 grid grid-cols-12 items-end gap-4">
        <Revelar distancia="curta" atraso={320} className="col-span-12 sm:col-span-9">
          <div className="moldura">
            <Foto foto={faixa} />
          </div>
        </Revelar>

        <Revelar atraso={420} className="col-span-12 sm:col-span-3">
          <p className="t-italico text-base leading-snug text-preto/80">
            Tiaras, pulseiras e enfeites de cabelo: tudo aqui dentro do ateliê.
          </p>
        </Revelar>
      </div>
    </div>
  )
}

function Foto({ foto }: { foto: FotoOferece }) {
  return (
    <img
      src={foto.src}
      alt={foto.alt}
      width={foto.largura}
      height={foto.altura}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full bg-bege"
      style={{ maxWidth: foto.largura }}
    />
  )
}

/** ['a', 'b', 'c'] vira "a, b e c". */
function listar(itens: readonly string[]): string {
  if (itens.length < 2) return itens[0] ?? ''
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}

function maiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
