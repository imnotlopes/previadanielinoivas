import { brand, linkInstagram } from '../lib/brand'
import { cn } from '../lib/utils'
import { IconeInstagram } from './icones'

/*
  `py-2.5` não é respiro: é alvo de toque. O texto tem 19px de altura, e no
  celular um link dessa espessura é erro de dedo garantido, o padding leva a
  área tocável para perto dos 44px sem mudar nada do que se vê.
*/
const classeContato =
  'eyebrow inline-flex items-center gap-3 py-2.5 transition-colors duration-300 ease-suave hover:text-preto'

interface RodapeProps {
  /**
   * Versão curta, para o fim de um catálogo.
   *
   * Só a linha de contato e o copyright, sem o selo e a frase. O rodapé
   * inteiro fica para quando ele fechar uma leitura mais longa.
   */
  compacto?: boolean
  /**
   * De quem é a peça em que este rodapé está.
   *
   * Muda a linha do que a loja faz. Numa peça de noiva ela diz só vestido de
   * noiva: a loja atende festa e 15 anos, mas anunciar isso no fim de uma
   * apresentação de noiva é dizer para a noiva que ela está numa loja de
   * roupa de festa que também tem vestido de casamento. Na peça de festa, o
   * mesmo raciocínio ao contrário.
   */
  publico?: 'noiva' | 'festa'
}

export default function Rodape({ compacto = false, publico = 'noiva' }: RodapeProps) {
  return (
    <footer className="bg-bege">
      <div
        className={cn(
          'container-luxo flex flex-col items-center text-center',
          compacto ? 'gap-8 py-16 md:py-20' : 'gap-10 py-16 md:py-20',
        )}
      >
        {/*
          A logo inteira, o vestido no arco e o nome, é o fecho da peça. Na
          capa só entra a assinatura (ver CapaApresentacao); aqui ela aparece
          uma vez inteira, como a última página das referências, que termina
          na marca e no contato.
        */}
        <img
          src="/logo/danielli-noivas.webp"
          alt={`${brand.subtitulo} ${brand.nome}`}
          width={834}
          height={774}
          loading="lazy"
          decoding="async"
          className="h-auto w-44 md:w-52"
        />

        {!compacto && (
          <>
            <span className="filete" />

            {/* ATENÇÃO: "ajuste incluso" não foi confirmado pela Danielli, ver
                data/selos.ts. Esta versão do rodapé não está em uso. */}
            <p className="max-w-sm text-sm leading-relaxed text-cinza">
              {publico === 'noiva'
                ? 'Aluguel de vestidos de noiva, com prova no showroom e ajuste incluso.'
                : 'Aluguel de vestidos de festa e 15 anos, com prova no showroom e ajuste incluso.'}
            </p>
          </>
        )}

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-12">
          <a
            href={linkInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className={classeContato}
          >
            <IconeInstagram width={18} height={18} />
            {brand.instagram}
          </a>
        </div>

        {/* Sem menção a registro de marca: não há registro no INPI conhecido
            desta marca. Se houver, é aqui que a linha entra. */}
        <p className="text-xs tracking-wide text-cinza">
          © {new Date().getFullYear()} {brand.subtitulo} {brand.nome}. Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  )
}
