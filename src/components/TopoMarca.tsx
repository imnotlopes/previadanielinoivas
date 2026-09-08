import { brand } from '../lib/brand'
import { useContato } from '../lib/loja'
import { IconeInstagram } from './icones'

/**
 * Topo das apresentações.
 *
 * SEM NAVEGAÇÃO NENHUMA, e isso é decisão de produto.
 *
 * Já teve menu de quatro itens, quando o projeto era site. Depois teve um
 * "voltar para a apresentação", quando eram catálogo e apresentação separados.
 * Agora não tem nada: a pessoa abriu um link que a Danielli mandou, vai rolar
 * dois minutos e voltar para a conversa. Cada saída oferecida é uma chance de
 * ela sair antes do fim.
 *
 * A marca também não é link, pelo mesmo motivo. Ela fica porque é o que diz de
 * quem é aquilo antes de a foto de capa carregar.
 *
 * O Instagram fica porque é o único endereço que leva a MAIS da marca, e não
 * a menos da apresentação.
 */
export default function TopoMarca() {
  const { instagram, linkInstagram } = useContato()

  return (
    <header className="sticky top-0 z-40 border-b border-borda-sutil bg-off-white/95 backdrop-blur">
      {/*
        ESTA ALTURA TEM UM ESPELHO.

        A barra de busca do catálogo gruda logo abaixo, com `top-20 md:top-24`
        (ver components/GradeAcervo.tsx). As duas medidas andam juntas: mudar
        `h-20 md:h-24` aqui sem mudar lá deixa a barra por baixo do cabeçalho
        ou com um vão aberto entre os dois.
      */}
      <div className="container-luxo flex h-20 items-center justify-between gap-4 md:h-24">
        {/*
          `min-w-0` em vez de `shrink-0`: o nome é `whitespace-nowrap`, e num
          aparelho bem estreito (Galaxy Fold, 280px) um lockup que não encolhe
          empurra o resto para fora e a página passa a rolar de lado.
        */}
        {/*
          A MARCA NÃO É LINK.

          Ela levava à home. A home institucional é fase 2 e não existe, e as
          apresentações não têm para onde ir de propósito: cada uma existe
          para devolver a pessoa ao WhatsApp, não para levá-la a outra página.
          Um logotipo clicável que recarrega a mesma tela é uma promessa falsa.
        */}
        <div className="flex min-w-0 items-center gap-3 leading-none sm:gap-4">
          <img
            src="/logo-simbolo.webp"
            alt=""
            width={150}
            height={150}
            className="h-9 w-auto shrink-0 md:h-11"
          />
          <span className="block min-w-0">
            <span className="block truncate font-display text-h4 uppercase tracking-luxo-lg text-preto transition-colors duration-300 ease-suave group-hover:text-cinza">
              {brand.nome}
            </span>
            <span className="mt-1.5 block font-display text-[0.6875rem] uppercase tracking-luxo-lg text-cinza">
              {brand.subtitulo}
            </span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-5 sm:gap-7">

          <a
            href={linkInstagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram da loja (${instagram})`}
            /* `-mr-3 p-3`: o ícone tem 20px e o alvo precisa de 44. O padding
               cria a área de toque e a margem negativa a devolve ao layout,
               para o ícone continuar alinhado com a borda do container. */
            className="-mr-3 inline-flex items-center justify-center p-3 text-preto
                       transition-colors duration-300 ease-suave hover:text-cinza"
          >
            <IconeInstagram />
          </a>
        </div>
      </div>
    </header>
  )
}
