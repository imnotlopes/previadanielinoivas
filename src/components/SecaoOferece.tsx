import { EDITORIAL, PARA_QUEM_ESTA_COM_VOCE, PARA_VOCE, type FotoOferece } from '../data/oferece'
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
    <section className="border-t border-borda-sutil bg-branco">
      <div className="container-luxo secao">
        <Revelar>
          <SecaoTitulo
            eyebrow="O que o ateliê oferece"
            titulo="Tudo para o seu casamento"
            descricao="Do vestido ao porta-aliança, tudo o que você vai precisar está aqui dentro."
            centralizado
          />
        </Revelar>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          <div className="max-w-lg space-y-10">
            <Revelar atraso={80}>
              <span className="eyebrow block">Para você</span>
              <span className="filete mt-5" />
              <p className="mt-5 text-preto/75">{maiuscula(listar(PARA_VOCE))}.</p>
            </Revelar>

            <Revelar atraso={160}>
              <span className="eyebrow block">Para quem vai estar do seu lado</span>
              <span className="filete mt-5" />
              <div className="mt-5 space-y-2 text-preto/75">
                {PARA_QUEM_ESTA_COM_VOCE.map((frase) => (
                  <p key={frase}>{frase}</p>
                ))}
              </div>
            </Revelar>

            <Revelar atraso={240}>
              <p className="t-italico text-preto">Dá para vestir o casamento inteiro com a gente.</p>
            </Revelar>
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
 * Três fotos em zigue-zague, numa grade de doze colunas que ninguém vê:
 *
 *   ┌──────────────┐
 *   │   espelho    │  colunas 1 a 8
 *   │         ┌────┴────┐
 *   └─────────┤ retrato │  colunas 7 a 12, descida, SOBRE a borda da primeira
 *             │         │
 *   ┌─────────┴───┐     │
 *   │    faixa    │ └───┘  colunas 1 a 9, e a legenda nas colunas 10 a 12
 *   └─────────────┘
 *
 * A sobreposição é o que faz a página parecer paginada e não montada: numa
 * grade, cada foto tem a sua caixa e nenhuma conversa com a outra. A moldura
 * branca do retrato é o que separa as duas onde elas se tocam, e é o
 * recurso mais velho de revista para isso.
 *
 * Cada foto revela com um atraso diferente, na ordem da leitura: primeiro a
 * noiva, depois o detalhe, depois o conjunto.
 */
function Composicao() {
  const { espelho, retrato, faixa } = EDITORIAL

  return (
    <div className="oferece_editorial">
      <Revelar distancia="curta" className="oferece_espelho">
        <Foto foto={espelho} />
      </Revelar>

      <Revelar distancia="curta" atraso={180} className="oferece_retrato">
        <div className="bg-branco p-2 md:p-3">
          <Foto foto={retrato} />
        </div>
      </Revelar>

      <Revelar distancia="curta" atraso={320} className="oferece_faixa">
        <Foto foto={faixa} />
      </Revelar>

      <Revelar atraso={420} className="oferece_legenda">
        <p className="t-italico text-sm leading-relaxed text-preto rebaixado">
          Tiaras, pulseiras e enfeites de cabelo: tudo aqui dentro do ateliê.
        </p>
      </Revelar>
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
