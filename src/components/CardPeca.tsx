import { Images, Play } from 'lucide-react'
import { Link, useHref } from 'react-router-dom'

import {
  rotulosCor,
  rotulosDecote,
  rotulosManga,
  rotulosSilhueta,
  type Peca,
} from '../data/pecas'
import { cn } from '../lib/utils'
import BotaoProvar from './BotaoProvar'
import Preco from './Preco'

interface CardPecaProps {
  peca: Peca
  /**
   * Prefixo da ficha: `/catalogo` ou `/festa`.
   *
   * A ficha do vestido mora dentro do catálogo de onde a cliente veio, e não
   * numa rota global, cada peça é uma aplicação separada e não conhece as
   * rotas das outras.
   */
  base: string
  /** A primeira fileira carrega adiantada; o resto é lazy. */
  prioridade?: boolean
  /**
   * Mostra o marcador "quero provar" sobre a foto.
   *
   * Ligado no catálogo, desligado na amostra da apresentação: lá a noiva
   * ainda está decidindo se quer ver o acervo, e oferecer uma lista de prova
   * antes disso é pedir compromisso de quem ainda não olhou nada.
   */
  comProvar?: boolean
  /**
   * `denso` é a folha de contato: só foto e nome, em coluna estreita.
   *
   * Existe para o balcão. Quando a Danielli vira a tela para a noiva, o que
   * serve é ver MUITO vestido de uma vez e ela apontar, descrição, cor e
   * preço em cada card só afastam as fotos uma da outra.
   */
  variante?: 'padrao' | 'denso'
  className?: string
}

/** Card de vitrine, usado nas grades de acervo e na amostra da apresentação. */
export default function CardPeca({
  peca,
  base,
  prioridade = false,
  comProvar = false,
  variante = 'padrao',
  className,
}: CardPecaProps) {
  const denso = variante === 'denso'

  /* Só o que foi classificado. `filter(Boolean)` é o que faz a linha sumir
     inteira em vez de virar "· · ·" quando nada está preenchido. */
  const ficha = [
    peca.silhueta && rotulosSilhueta[peca.silhueta],
    peca.decote && rotulosDecote[peca.decote],
    peca.manga && rotulosManga[peca.manga],
  ].filter(Boolean)
  const destino = `${base}/${peca.slug}`

  /*
    Dentro da própria peça o `<Link>` do router é o certo (navegação sem
    recarregar). Entre peças diferentes ele não funciona, porque o roteador de
    uma não conhece as rotas da outra, e o erro é silencioso. `useHref`
    resolve o caminho e a comparação abaixo decide qual usar.
  */
  const href = useHref(destino)
  const mesmaPeca = typeof window === 'undefined' || location.pathname.startsWith(base)

  const conteudo = (
    <>
      <div className="relative overflow-hidden bg-borda-sutil">
        <img
          src={peca.imagens[0]}
          alt={peca.nome}
          loading={prioridade ? 'eager' : 'lazy'}
          decoding="async"
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
        />

        {/* Selo de vídeo: "tem vestido andando aqui dentro" é informação que
            muda o clique, e por isso aparece já na grade. */}
        {/*
          QUANTO MATERIAL EXISTE PARA MOSTRAR.

          É informação de quem VENDE, não de quem compra: com a noiva do lado,
          saber que um vestido tem seis fotos e outro tem uma decide qual ela
          abre primeiro. Só aparece a partir de três: "1 foto" é ruído, e
          dizer que falta material não ajuda ninguém.
        */}
        <div
          className={cn(
            'absolute flex items-center gap-1.5',
            denso ? 'bottom-1.5 right-1.5' : 'bottom-3 right-3',
          )}
        >
          {peca.imagens.length >= 3 && !denso && (
            <span className="inline-flex items-center gap-1.5 bg-preto/85 px-2.5 py-1.5 font-display text-[0.6875rem] uppercase tracking-luxo text-branco">
              <Images size={11} strokeWidth={2} aria-hidden />
              {peca.imagens.length}
            </span>
          )}

          {/* Selo de vídeo: "tem vestido andando aqui dentro" é informação que
              muda o clique, e por isso aparece já na grade. */}
          {peca.video && (
            <span
              className={cn(
                'inline-flex items-center gap-1.5 bg-preto/85 font-display text-[0.6875rem] uppercase tracking-luxo text-branco',
                denso ? 'p-1.5' : 'px-2.5 py-1.5',
              )}
            >
              <Play size={11} strokeWidth={2} aria-hidden />
              {!denso && 'Vídeo'}
            </span>
          )}
        </div>
      </div>

      {denso ? (
        /* Só o nome. É por ele que a noiva pede o vestido, e é o mínimo que
           permite dizer "esse aí" em voz alta. */
        <div className="pt-2.5">
          <h3 className="truncate font-display text-h6 uppercase tracking-luxo transition-colors duration-300 ease-suave group-hover:text-cinza">
            {peca.nome}
          </h3>
        </div>
      ) : (
        <div className="pt-5">
          <span className="eyebrow block">{rotulosCor[peca.cor]}</span>
          <h3 className="mt-2 text-h4 uppercase tracking-luxo transition-colors duration-300 ease-suave group-hover:text-cinza">
            {peca.nome}
          </h3>
          <p className="mt-1 text-sm text-preto/65">{peca.descricao}</p>

          {/*
            A FICHA DA ARARA, NO CARD.

            Silhueta, decote e manga são o vocabulário com que a escolha
            acontece de pé na loja. Estavam só dentro da ficha, o que obrigava
            a abrir vestido por vestido para responder "esse é sereia?". Aqui
            a resposta está na grade.

            Some inteira enquanto ninguém classificou nada, que é o estado de
            hoje. Ver a ficha técnica em data/pecas.ts.
          */}
          {ficha.length > 0 && (
            <p className="mt-1.5 text-sm text-preto/65">{ficha.join(' · ')}</p>
          )}

          {/* Numeração é a segunda pergunta de toda cliente: quando existe, ela
              aparece antes de a pessoa precisar abrir a ficha. */}
          {peca.numeracao.length > 0 && (
            <p className="mt-1.5 font-display text-h6 uppercase tracking-luxo text-preto/70">
              Numeração {peca.numeracao.join(' · ')}
            </p>
          )}

          <Preco peca={peca} className="mt-2.5" />
        </div>
      )}
    </>
  )

  /*
    O marcador é IRMÃO do link, e não filho.

    Botão dentro de âncora é HTML inválido, e na prática o clique acaba
    navegando junto: a noiva marcaria o vestido e cairia na ficha dele.
    Por isso o `group` mora no invólucro, assim o hover da foto continua
    valendo para o card inteiro.
  */
  const classe = 'block'

  return (
    <div className={cn('group relative', className)}>
      {mesmaPeca ? (
        <Link to={destino} className={classe}>
          {conteudo}
        </Link>
      ) : (
        <a href={href} className={classe}>
          {conteudo}
        </a>
      )}

      {comProvar && (
        <BotaoProvar
          slug={peca.slug}
          nome={peca.nome}
          className={cn('absolute z-10', denso ? 'right-1.5 top-1.5' : 'right-3 top-3')}
        />
      )}
    </div>
  )
}
