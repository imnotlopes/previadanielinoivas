import { noivasNoAltar } from '../data/casamentos'
import { cn } from '../lib/utils'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'

/**
 * "No dia delas": quatro noivas, uma foto de cada.
 *
 * Era um mural de oito quadros trocando sozinhos, com 23 fotos de uma noiva
 * só. A Danielli pediu quatro, de noivas diferentes (ver data/casamentos.ts),
 * e com quatro fotos o mural perde o sentido: quadro que troca existe para
 * passar muita foto num espaço pequeno. Ficou uma fileira parada.
 *
 * A FILEIRA É DESENCONTRADA
 * -------------------------
 * As fotos de posição par descem um pouco. No celular são duas colunas, e a
 * da direita fica abaixo da da esquerda; no desktop são quatro numa linha, em
 * zigue-zague. É o mesmo gesto das duplas sobrepostas do resto da página, sem
 * sobreposição: fotos de mesma altura alinhadas certinho leem como grade de
 * loja, e um degrau entre elas lê como página montada à mão.
 */
export default function SecaoCasamentos() {
  if (noivasNoAltar.length === 0) return null

  return (
    <section className="bg-off-white">
      <div className="container-luxo secao">
        <Revelar>
          <SecaoTitulo
            script="No dia delas"
            titulo="Casamentos"
            descricao="Vestidos que saíram do nosso acervo e foram para o altar."
            centralizado
          />
        </Revelar>

        <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {noivasNoAltar.map((noiva, indice) => (
            <Revelar
              key={noiva.id}
              como="li"
              distancia="curta"
              atraso={indice * 120}
              className={cn(indice % 2 === 1 && 'mt-10 lg:mt-16')}
            >
              <div className="moldura">
                <img
                  src={noiva.foto}
                  alt={noiva.alt}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[3/4] w-full bg-bege object-cover"
                />
              </div>
            </Revelar>
          ))}
        </ul>

        {/*
          O botão que havia aqui levava ao catálogo, e o catálogo não existe
          mais. A frase fica, o desvio sai: mandar a pessoa para outro lugar no
          meio da apresentação é o oposto do que a peça existe para fazer.
        */}
        <Revelar atraso={160}>
          <p className="t-italico mt-14 text-center">
            Noivas vestidas por nós. O próximo altar pode ser o seu.
          </p>
        </Revelar>
      </div>
    </section>
  )
}
