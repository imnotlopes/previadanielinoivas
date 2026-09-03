import { ArrowLeft } from 'lucide-react'

import { brand } from '../lib/brand'
import { useContato } from '../lib/loja'
import { CAMINHOS } from '../entradas/comum'
import { IconeInstagram } from './icones'

interface TopoMarcaProps {
  /**
   * Quando a peça tem uma anterior, o topo mostra o caminho de volta.
   * `null` (o padrão) deixa o topo só com a assinatura.
   */
  voltarPara?: 'apresentacao' | null
}

/**
 * Topo das peças de cliente.
 *
 * SEM MENU DE NAVEGAÇÃO, e isso é a mudança mais visível da reestruturação.
 * Antes havia quatro itens (Início, Catálogo, Como funciona, Sobre) porque o
 * projeto era um site e não se controlava por onde a visita entrava. Agora
 * cada link tem destino conhecido, a Danielli manda o link certo para a
 * pessoa certa, e um menu só ofereceria saídas de uma peça que a cliente
 * acabou de abrir.
 *
 * O link do Instagram fica porque é o único que leva para MAIS da marca, não
 * para menos da peça.
 */
export default function TopoMarca({ voltarPara = null }: TopoMarcaProps) {
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
        <a
          href={CAMINHOS.apresentacaoNoiva}
          className="group flex min-w-0 items-center gap-3 leading-none sm:gap-4"
          aria-label={`${brand.nome}, ${brand.subtitulo}, início`}
        >
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
        </a>

        <div className="flex shrink-0 items-center gap-5 sm:gap-7">
          {voltarPara === 'apresentacao' && (
            /*
              `<a>` e não `<Link>`: a apresentação é outra aplicação, com HTML
              próprio. Um `<Link>` renderizaria a rota de fallback DESTA peça e
              o erro seria silencioso. Ver o bloco CAMINHOS em entradas/comum.
            */
            <a
              href={CAMINHOS.apresentacaoNoiva}
              className="link-menu hidden items-center gap-2 sm:inline-flex"
            >
              <ArrowLeft size={15} strokeWidth={1.5} aria-hidden />
              Apresentação
            </a>
          )}

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
