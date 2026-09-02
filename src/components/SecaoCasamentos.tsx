import { fotosCasamentos } from '../data/casamentos'
import { CAMINHOS } from '../entradas/comum'
import { cn } from '../lib/utils'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'

/**
 * Vitrine dos casamentos atendidos.
 *
 * Grade em mosaico: as fotos em retrato ocupam duas linhas, as quadradas
 * uma só. Assim o bloco respira sem precisar recortar todas no mesmo
 * formato, que é o que costuma decapitar noiva em foto de casamento.
 *
 * As fotos chegam escalonadas, e o escalonamento é POR COLUNA e não por foto:
 * com 90 ms cada, um mosaico de doze fotos levaria mais de um segundo para
 * terminar e a última chegaria depois de a pessoa já ter olhado o bloco todo.
 */
export default function SecaoCasamentos() {
  if (fotosCasamentos.length === 0) return null

  return (
    <section className="border-t border-borda-sutil bg-branco">
      <div className="container-luxo folha">
        <Revelar>
          <SecaoTitulo
            eyebrow="Casamentos"
            titulo="No dia delas"
            descricao="Vestidos que saíram do nosso acervo e foram para o altar."
            centralizado
          />
        </Revelar>

        <ul className="mt-14 grid auto-rows-[minmax(0,180px)] grid-cols-2 gap-4 sm:auto-rows-[minmax(0,220px)] lg:grid-cols-4 lg:gap-5">
          {fotosCasamentos.map((foto, indice) => (
            <Revelar
              key={foto.src}
              como="li"
              distancia="curta"
              atraso={(indice % 4) * 90}
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
            </Revelar>
          ))}
        </ul>

        <Revelar atraso={160}>
          <div className="mt-14 flex flex-col items-center gap-5 text-center">
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
