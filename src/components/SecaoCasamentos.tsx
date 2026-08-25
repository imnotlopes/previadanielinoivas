import { Link } from 'react-router-dom'

import { fotosCasamentos } from '../data/casamentos'
import { cn } from '../lib/utils'
import SecaoTitulo from './SecaoTitulo'

/**
 * Vitrine dos casamentos atendidos.
 *
 * Grade em mosaico: as fotos em retrato ocupam duas linhas, as quadradas
 * uma só. Assim o bloco respira sem precisar recortar todas no mesmo
 * formato, que é o que costuma decapitar noiva em foto de casamento.
 */
export default function SecaoCasamentos() {
  return (
    <section className="secao bg-off-white">
      <div className="container-luxo">
        <SecaoTitulo
          eyebrow="Casamentos"
          titulo="No dia delas"
          descricao="Vestidos que saíram do nosso acervo e foram para o altar."
          centralizado
        />

        <ul className="mt-14 grid auto-rows-[minmax(0,180px)] grid-cols-2 gap-4 sm:auto-rows-[minmax(0,220px)] lg:grid-cols-4 lg:gap-5">
          {fotosCasamentos.map((foto) => (
            <li
              key={foto.src}
              className={cn(
                'group relative overflow-hidden bg-borda-sutil',
                foto.formato === 'retrato' ? 'row-span-2' : 'row-span-1',
              )}
            >
              <img
                src={foto.src}
                alt={foto.alt}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
              />

              {foto.casal && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-preto/80 to-transparent p-4 pt-10 font-display text-h6 uppercase tracking-luxo text-branco">
                  {foto.casal}
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="text-preto/70">
            Noivas vestidas por nós. O próximo altar pode ser o seu.
          </p>
          <Link to="/catalogo?categoria=noiva" className="btn-primario">
            Ver vestidos de noiva
          </Link>
        </div>
      </div>
    </section>
  )
}
