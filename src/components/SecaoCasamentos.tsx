import { casamentos } from '../data/casamentos'
import { CAMINHOS } from '../entradas/comum'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'
import MuralCasamentos from './MuralCasamentos'

/**
 * "No dia delas" — uma sequência por casamento.
 *
 * O QUE MUDOU, E POR QUÊ
 * ----------------------
 * Era um mosaico de doze fotos soltas. Um mosaico diz "temos fotos bonitas", e
 * a noiva já viu mil no Instagram. Uma sequência cronológica diz outra coisa:
 * que um vestido daqui atravessou o dia inteiro de alguém, do roupão ao
 * brinde. É a diferença entre mostrar o produto e mostrar a consequência — e
 * nesta página é a consequência que faz marcar a prova.
 *
 * OITO QUADROS, NÃO DOIS
 * ----------------------
 * Com duas fotos grandes ocupando a seção, a parede quase não se movia: uma
 * troca a cada três segundos e meio, em dois lugares, lê-se como imagem
 * parada. Com oito quadros em rodízio há sempre alguma coisa mudando, e o que
 * se vê é o acervo passando — que é o assunto.
 *
 * A mecânica está em MuralCasamentos; aqui fica só o enquadramento da seção.
 */
export default function SecaoCasamentos() {
  const comFotos = casamentos.filter((c) => c.fotos.length > 0)
  if (comFotos.length === 0) return null

  return (
    <section className="border-t border-borda-sutil bg-branco">
      <div className="container-luxo secao">
        <Revelar>
          <SecaoTitulo
            eyebrow="Casamentos"
            titulo="No dia delas"
            descricao="Vestidos que saíram do nosso acervo e foram para o altar."
            centralizado
          />
        </Revelar>

        <Revelar distancia="curta">
          <div className="mt-14">
            <MuralCasamentos casamentos={comFotos} />
          </div>
        </Revelar>

        <Revelar atraso={160}>
          <div className="mt-16 flex flex-col items-center gap-5 text-center">
            <p className="text-preto/70">
              Noivas vestidas por nós. O próximo altar pode ser o seu.
            </p>
            {/*
              `<a href>`, não `<Link>`: o catálogo é outra aplicação, com HTML
              próprio, e um `<Link>` daqui renderia a rota "não encontrada"
              DESTA peça, em silêncio. Ver o bloco CAMINHOS em entradas/comum.
            */}
            <a href={CAMINHOS.catalogoNoiva} className="btn-primario">
              Ver vestidos de noiva
            </a>
          </div>
        </Revelar>
      </div>
    </section>
  )
}
