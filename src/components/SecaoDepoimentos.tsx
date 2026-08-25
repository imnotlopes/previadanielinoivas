import { depoimentos } from '../data/depoimentos'
import SecaoTitulo from './SecaoTitulo'

/**
 * Depoimentos escolhidos pela loja.
 *
 * Ficam em grade e não em carrossel — são quatro e cabem na tela. O
 * carrossel existe na seção do Google porque lá são vinte; aqui ele só
 * esconderia metade do conteúdo atrás de um gesto.
 *
 * Marcados como <blockquote> com <cite>: são palavras de pessoas, não texto
 * institucional. Some sozinha se a lista estiver vazia.
 */
export default function SecaoDepoimentos() {
  if (depoimentos.length === 0) return null

  return (
    <section className="secao bg-off-white">
      <div className="container-luxo">
        <SecaoTitulo
          eyebrow="Quem já alugou"
          titulo="Palavras de clientes"
          centralizado
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {depoimentos.map((depoimento) => (
            <li key={depoimento.id}>
              <blockquote className="flex h-full flex-col border border-borda-sutil bg-branco p-8">
                <span className="filete" />
                <p className="mt-6 flex-1 text-preto/75">{depoimento.texto}</p>
                <cite className="mt-7 block font-display text-h6 uppercase not-italic tracking-luxo text-preto">
                  {depoimento.autora}
                  {depoimento.contexto && (
                    <span className="block normal-case tracking-normal text-cinza">
                      {depoimento.contexto}
                    </span>
                  )}
                </cite>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
