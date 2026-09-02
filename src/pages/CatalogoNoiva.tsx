import GradeAcervo from '../components/GradeAcervo'
import SecaoTitulo from '../components/SecaoTitulo'
import Seo from '../components/Seo'
import { CAMINHOS } from '../entradas/comum'
import { pecasPorCategoria, publicadas } from '../data/pecas'
import { useLoja } from '../lib/loja'

/**
 * PEÇA 2 — Catálogo Noiva.
 *
 * É o que a Danielli manda depois que a noiva demonstra interesse. Casca de
 * ferramenta: sem FAQ, sem mapa, sem avaliações embaixo da grade — quem está
 * escolhendo vestido não quer institucional, quer filtrar.
 *
 * Só entra o que está `publicado`. A curadoria é dela: o acervo interno é
 * maior que este catálogo, e o critério é ter foto profissional.
 *
 * VOCABULÁRIO: sempre **noiva**, nunca "cliente".
 */
export default function CatalogoNoiva() {
  const { pecas } = useLoja()
  const acervo = pecasPorCategoria(publicadas(pecas), 'noiva')

  return (
    <section className="secao bg-off-white">
      <Seo
        titulo="Vestidos de noiva"
        descricao="Acervo de vestidos de noiva para alugar, com cor e numeração de cada modelo. Prova com hora marcada e ajuste incluso."
        imagem={acervo[0]?.imagens[0]}
      />

      <div className="container-luxo">
        <SecaoTitulo
          eyebrow="Acervo"
          titulo="Vestidos de noiva"
          descricao="Anote os que você quer provar. A gente separa antes de você chegar."
          nivel={1}
          centralizado
        />

        <GradeAcervo
          acervo={acervo}
          base={CAMINHOS.catalogoNoiva}
          vazio={
            <>
              <h2 className="text-h4 uppercase tracking-luxo">
                Nenhum vestido com esses filtros
              </h2>
              <p className="mt-4 text-preto/65">
                O acervo é renovado com frequência, e nem tudo que chega já está
                aqui. Tire um filtro ou chame no WhatsApp para saber o que
                entrou.
              </p>
            </>
          }
        />
      </div>
    </section>
  )
}
