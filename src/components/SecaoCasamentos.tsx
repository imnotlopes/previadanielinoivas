import { casamentos } from '../data/casamentos'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'
import MuralCasamentos from './MuralCasamentos'

/**
 * "No dia delas", uma sequência por casamento.
 *
 * O QUE MUDOU, E POR QUÊ
 * ----------------------
 * Era um mosaico de doze fotos soltas. Um mosaico diz "temos fotos bonitas", e
 * a noiva já viu mil no Instagram. Uma sequência cronológica diz outra coisa:
 * que um vestido daqui atravessou o dia inteiro de alguém, do roupão ao
 * brinde. É a diferença entre mostrar o produto e mostrar a consequência, e
 * nesta página é a consequência que faz marcar a prova.
 *
 * OITO QUADROS, NÃO DOIS
 * ----------------------
 * Com duas fotos grandes ocupando a seção, a parede quase não se movia: uma
 * troca a cada três segundos e meio, em dois lugares, lê-se como imagem
 * parada. Com oito quadros em rodízio há sempre alguma coisa mudando, e o que
 * se vê é o acervo passando, que é o assunto.
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

        {/*
          O botão que havia aqui levava ao catálogo, e o catálogo não existe
          mais. Não foi substituído por outro: este bloco agora vive DENTRO da
          apresentação de noivas, e mandar a pessoa para outro lugar no meio
          dela é o oposto do que a peça existe para fazer. A frase fica, o
          desvio sai.
        */}
        <Revelar atraso={160}>
          <p className="mt-14 text-center text-preto/70">
            Noivas vestidas por nós. O próximo altar pode ser o seu.
          </p>
        </Revelar>
      </div>
    </section>
  )
}
