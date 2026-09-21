import { brand, linkInstagram } from '../lib/brand'
import { cn } from '../lib/utils'
import { IconeInstagram } from './icones'

/*
  `py-2.5` não é respiro: é alvo de toque. O texto tem 19px de altura, e no
  celular um link dessa espessura é erro de dedo garantido, o padding leva a
  área tocável para perto dos 44px sem mudar nada do que se vê.
*/
const classeContato =
  'inline-flex items-center gap-3 py-2.5 font-display text-h6 uppercase tracking-luxo text-branco/80 transition-colors duration-300 ease-suave hover:text-branco'

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
    <footer className="bg-preto text-branco">
      <div
        className={cn(
          'container-luxo flex flex-col items-center text-center',
          compacto ? 'gap-6 py-12' : 'gap-10 py-16 md:py-20',
        )}
      >
        {!compacto && (
          <>
            {/*
              O selo da marca. A arte disponível é a foto de perfil do
              Instagram, quadrada e com 150px de lado, em ~160px ela ainda se
              segura, mas é o limite. Quando chegar o vetorial, troque
              public/logo.png e rode o script de importação.
            */}
            <img
              src="/logo-completo-claro.webp"
              alt={`${brand.subtitulo} ${brand.nome}`}
              width={150}
              height={150}
              loading="lazy"
              decoding="async"
              className="h-auto w-32 md:w-40"
            />

            <span className="filete-claro" />

            <p className="max-w-sm text-sm leading-relaxed text-branco/60">
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
        <p className="text-xs tracking-wide text-branco/55">
          © {new Date().getFullYear()} {brand.subtitulo} {brand.nome}. Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  )
}
