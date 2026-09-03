import { Expand } from 'lucide-react'
import { useState } from 'react'

import { cn } from '../lib/utils'
import Visor from './Visor'

interface GaleriaPecaProps {
  imagens: string[]
  nome: string
}

/**
 * Imagem principal + miniaturas, com tela cheia.
 *
 * A foto grande É UM BOTÃO. Numa ficha de vestido a primeira coisa que a
 * pessoa faz é tocar na foto, e a expectativa universal desse toque é
 * ampliar, não fazer nada é o comportamento que faz parecer que a página
 * travou. O ícone de expandir está lá só para quem não tenta.
 *
 * O visor é montado sob demanda: enquanto ninguém abre, ele não existe no
 * DOM, e a trava de rolagem que ele instala não roda à toa.
 *
 * Renderize com `key={peca.slug}` para que a miniatura ativa volte à primeira
 * ao navegar de uma peça para outra.
 */
export default function GaleriaPeca({ imagens, nome }: GaleriaPecaProps) {
  const [ativa, setAtiva] = useState(0)
  const [visorAberto, setVisorAberto] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setVisorAberto(true)}
        aria-label={`Ver ${nome} em tela cheia`}
        className="group relative block w-full overflow-hidden bg-borda-sutil"
      >
        <img
          src={imagens[ativa]}
          alt={nome}
          fetchPriority="high"
          decoding="async"
          className="aspect-[3/4] w-full object-cover"
        />

        <span
          aria-hidden
          className="absolute bottom-4 right-4 inline-flex size-11 items-center justify-center bg-preto/70 text-branco transition-colors duration-300 ease-suave group-hover:bg-preto"
        >
          <Expand size={18} strokeWidth={1.5} />
        </span>
      </button>

      {imagens.length > 1 && (
        <ul className="mt-4 grid grid-cols-4 gap-4">
          {imagens.map((imagem, indice) => (
            <li key={imagem}>
              <button
                type="button"
                onClick={() => setAtiva(indice)}
                aria-label={`Ver imagem ${indice + 1} de ${imagens.length}`}
                aria-current={indice === ativa}
                className={cn(
                  'block w-full overflow-hidden border-2 transition-colors duration-300 ease-suave',
                  indice === ativa
                    ? 'border-preto'
                    : 'border-transparent hover:border-borda',
                )}
              >
                <img
                  src={imagem}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {visorAberto && (
        <Visor
          imagens={imagens}
          indiceInicial={ativa}
          nome={nome}
          aoFechar={(indiceFinal) => {
            /* A galeria pequena continua de onde o visor parou. */
            setAtiva(indiceFinal)
            setVisorAberto(false)
          }}
        />
      )}
    </div>
  )
}
