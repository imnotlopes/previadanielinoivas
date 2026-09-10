import type { CSSProperties } from 'react'

import type { Apresentacao } from '../data/apresentacoes'
import { brand } from '../lib/brand'
import { cn } from '../lib/utils'
import BotaoWhatsapp from './BotaoWhatsapp'
import Revelar from './Revelar'

interface CapaApresentacaoProps {
  apresentacao: Apresentacao
  /** Já sanitizado. Vazio mostra a versão neutra. */
  nome: string
}

/**
 * Bloco 1, a abertura. E o único lugar onde a marca aparece.
 *
 * A COMPOSIÇÃO É DE FOLHA DE ROSTO
 * ================================
 * Três faixas, e cada uma tem um trabalho:
 *
 *   1. ALTO      a marca, do tamanho de assinatura. Diz de quem é.
 *   2. MEIO      a frase em itálico, numa coluna estreita. Diz o que é.
 *   3. RODAPÉ    a palavra colossal. Diz para quem é.
 *
 * Entre elas, a foto. É o inverso de "cabeçalho, conteúdo, rodapé", e é como
 * uma capa de revista se organiza: a imagem manda, o texto se encosta nas
 * bordas, e nada disputa o centro.
 *
 * NÃO EXISTE CABEÇALHO
 * --------------------
 * Havia uma barra fixa aqui, com logo à esquerda e ícone à direita. Barra fixa
 * é chrome de site, e este material não é site: apresentação nenhuma repete o
 * logotipo em cima de cada página. Ver a casca, em CascaApresentacaoVenda.
 *
 * A PALAVRA É O H1, A SAUDAÇÃO NÃO
 * --------------------------------
 * Trocado de propósito. "Que bom que você chegou até aqui" é gentileza, não
 * assunto; "NOIVAS" é o assunto. Quem lê com leitor de tela ouve primeiro do
 * que a página trata, e quem lê com os olhos vê a mesma hierarquia desenhada.
 */
export default function CapaApresentacao({ apresentacao, nome }: CapaApresentacaoProps) {
  const { capa, palavra, saudacao, posicionamento, origem } = apresentacao
  const mensagem = `Oi Danielli! Vi ${origem} e queria conversar.`
  const abertura = nome ? `${nome}, ${saudacao.toLowerCase()}` : saudacao

  /*
    SEM FOTO, A ABERTURA É TIPOGRÁFICA.

    Estado previsto, não erro. Nasceu para a apresentação de noivos, que não
    tinha uma única foto de traje masculino e onde pôr foto de noiva seria
    pior que abrir sem foto. Aquela apresentação saiu do produto e este ramo
    fica: é o que segura uma apresentação nova no dia em que ela existir antes
    das fotos dela. A estrutura é a mesma, só que em preto sobre claro.
  */
  if (!capa) {
    return (
      <section className="flex min-h-svh flex-col justify-between border-b border-borda-sutil bg-branco">
        <div className="container-luxo pt-7 md:pt-9">
          <Revelar distancia="curta">
            <Marca />
          </Revelar>
        </div>

        <div className="container-luxo u-grid py-16">
          <div className="col-6">
            <Revelar atraso={90}>
              <p className="t-italico-g">{abertura}</p>
              <span className="filete mt-7" />
              <p className="mt-7 max-w-md text-preto rebaixado">{posicionamento}</p>
              <div className="mt-9">
                <BotaoWhatsapp mensagem={mensagem}>Falar no WhatsApp</BotaoWhatsapp>
              </div>
            </Revelar>
          </div>
        </div>

        <PalavraColossal palavra={palavra} />
      </section>
    )
  }

  return (
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden">
      {/*
        A `<picture>` sai do fluxo junto com a imagem.

        Ela é filha direta de um flex container, e um elemento de altura zero
        no meio de um `justify-between` é um item como outro qualquer: era ele
        que empurrava a marca para o meio da tela em vez do alto.
      */}
      <picture className="absolute inset-0">
        <source media="(min-width: 768px)" srcSet={capa.largo} />
        <img
          src={capa.alto}
          alt={capa.alt}
          /* Primeira imagem da página: é ela que define o tempo até a pessoa
             ver alguma coisa, e essa é a métrica que importa num link aberto
             no meio de uma conversa. */
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-center"
        />
      </picture>

      {/* Véu calibrado por faixa. A tabela do porquê está em `.veu-capa`. */}
      <div aria-hidden className="veu-capa" />

      {/*
        FAIXA DE CIMA: quem assina e quem fala.

        A saudação em itálico mora aqui, e não no meio da foto, porque aqui o
        véu está em 70% e ali estaria em 14%. Não é composição, é contraste.
      */}
      <div className="container-luxo relative pt-7 md:pt-9">
        <Revelar distancia="curta">
          <Marca claro />
        </Revelar>

        {/*
          Coluna estreita, e é o gesto editorial da capa. Cinco colunas de
          doze: texto que atravessa a largura inteira sobre uma foto lê como
          legenda; texto numa coluna curta lê como diagramação.
        */}
        <div className="u-grid mt-10 md:mt-14">
          <div className="col-5">
            <Revelar distancia="curta" atraso={120}>
              <p className="t-italico-g text-branco">{abertura}</p>
              <span className="filete-claro mt-6" />
            </Revelar>
          </div>
        </div>
      </div>

      {/*
        FAIXA DE BAIXO: o que fazer, e para quem é.

        O parágrafo e o botão descem para cá pelo mesmo motivo do texto de
        cima: o véu chega a 92% no rodapé. E a palavra fica por último, colada
        na borda, porque é ela que ancora a folha.
      */}
      <div className="relative">
        <div className="container-luxo u-grid">
          <div className="col-5">
            <Revelar atraso={220}>
              <p className="text-branco rebaixado">{posicionamento}</p>

              <div className="mt-7">
                <BotaoWhatsapp variante="claro" mensagem={mensagem}>
                  Falar no WhatsApp
                </BotaoWhatsapp>
              </div>
            </Revelar>
          </div>
        </div>

        <PalavraColossal palavra={palavra} clara />
      </div>
    </section>
  )
}

/**
 * A palavra que encosta no rodapé da capa.
 *
 * `--letras` é o número de caracteres, e é ele que a folha de estilo usa para
 * dividir a largura da linha. Sem isso a palavra teria de ter um tamanho
 * escolhido a dedo por apresentação, e "Madrinhas" estouraria onde "Noivas"
 * sobrava. Ver `.texto-colosso` em index.css.
 */
function PalavraColossal({ palavra, clara = false }: { palavra: string; clara?: boolean }) {
  return (
    <div className="container-luxo caixa-colosso relative mt-12 pb-5 md:mt-16 md:pb-7">
      <Revelar distancia="curta" atraso={320} naPrimeiraTela>
        <h1
          className={cn('texto-colosso', clara ? 'text-branco' : 'text-preto')}
          style={{ '--letras': palavra.length } as CSSProperties}
        >
          {palavra}
        </h1>
      </Revelar>
    </div>
  )
}

/**
 * O lockup da marca, do tamanho de assinatura.
 *
 * Pequeno de propósito. Numa folha de rosto quem manda é a foto; a marca só
 * precisa dizer de quem é aquilo, e some do caminho depois. Grande, ela vira
 * o cabeçalho que já saiu daqui.
 *
 * Não é link: as apresentações não têm para onde ir, e um logotipo clicável
 * que recarrega a mesma tela é promessa falsa.
 */
function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <div className="flex items-center gap-3 leading-none sm:gap-4">
      <img
        src={claro ? '/logo-simbolo-claro.webp' : '/logo-simbolo.webp'}
        alt=""
        width={150}
        height={150}
        className="h-9 w-auto shrink-0 md:h-10"
      />
      <span className="block min-w-0">
        <span
          className={cn(
            'block truncate font-display text-h5 uppercase tracking-luxo-lg',
            claro ? 'text-branco' : 'text-preto',
          )}
        >
          {brand.nome}
        </span>
        <span
          className={cn(
            'mt-1 block font-display text-[0.625rem] uppercase tracking-luxo-lg',
            claro ? 'text-branco rebaixado' : 'text-cinza',
          )}
        >
          {brand.subtitulo}
        </span>
      </span>
    </div>
  )
}
