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
 * Bloco 1, a abertura. E o único lugar onde a marca aparece no alto.
 *
 * NÃO EXISTE MAIS CABEÇALHO
 * -------------------------
 * Havia uma barra fixa aqui: logo à esquerda, ícone à direita, borda embaixo,
 * grudada no topo em toda rolagem. Isso é chrome de site, e este material não
 * é site. Apresentação nenhuma repete o logotipo em cima de cada página: a
 * marca aparece UMA vez, na folha de rosto, e depois sai da frente.
 *
 * O que a barra custava era pior que o que ela dava. Oitenta pixels de tela
 * de celular, permanentes, para repetir um nome que a pessoa acabou de ler no
 * WhatsApp da própria Danielli antes de tocar no link. E ela competia com a
 * foto de capa justamente no instante em que a foto tem de ganhar.
 *
 * O Instagram, que morava lá, já estava no rodapé. Nada se perdeu.
 *
 * A COMPOSIÇÃO É DE FOLHA DE ROSTO
 * --------------------------------
 * Marca no alto, mensagem embaixo, foto entre as duas. É como uma capa de
 * lookbook se organiza, e é o oposto de "cabeçalho, conteúdo, rodapé".
 */
export default function CapaApresentacao({ apresentacao, nome }: CapaApresentacaoProps) {
  const { capa, saudacao, posicionamento, origem } = apresentacao
  const mensagem = `Oi Danielli! Vi ${origem} e queria conversar.`

  /*
    SEM FOTO, A ABERTURA É TIPOGRÁFICA.

    Estado previsto, não erro: a apresentação de noivos não tem uma única foto
    de traje masculino, e pôr foto de noiva ali seria pior que abrir sem foto.
  */
  if (!capa) {
    return (
      <section className="border-b border-borda-sutil bg-branco">
        <div className="container-luxo folha-curta">
          <Revelar>
            <Marca />
          </Revelar>

          <Revelar atraso={90}>
            <h1 className="mt-12 texto-display-sm uppercase tracking-luxo">
              {nome ? `${nome}, ${saudacao.toLowerCase()}` : saudacao}
            </h1>
            <span className="filete mt-7" />
            <p className="mt-7 max-w-md text-preto/75">{posicionamento}</p>
          </Revelar>

          <Revelar atraso={160}>
            <div className="mt-9">
              <BotaoWhatsapp mensagem={mensagem}>Falar no WhatsApp</BotaoWhatsapp>
            </div>
          </Revelar>
        </div>
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

      {/*
        Véu nas DUAS pontas, e não só embaixo.

        A marca agora fica no alto, em branco, e uma foto de noiva é clara
        justamente ali. Sem escurecer o topo, o logotipo some no vestido.
        No meio o véu abre, para a foto respirar.
      */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-preto/55 via-preto/10 to-preto/85"
      />

      <div className="container-luxo relative pt-7 md:pt-9">
        <Revelar distancia="curta">
          <Marca claro />
        </Revelar>
      </div>

      <div className="container-luxo relative pb-12 pt-20 md:pb-16">
        <Revelar distancia="curta" atraso={120}>
          <h1 className="texto-display text-branco">
            {nome ? `${nome}, ${saudacao.toLowerCase()}` : saudacao}
          </h1>
          <span className="filete-claro mt-6" />
        </Revelar>

        <Revelar atraso={220}>
          <p className="mt-7 max-w-lg text-branco/85">{posicionamento}</p>

          <div className="mt-9">
            <BotaoWhatsapp variante="claro" mensagem={mensagem}>
              Falar no WhatsApp
            </BotaoWhatsapp>
          </div>
        </Revelar>
      </div>
    </section>
  )
}

/**
 * O lockup da marca, do tamanho de assinatura.
 *
 * Pequeno de propósito. Numa folha de rosto quem manda é a foto; a marca só
 * precisa dizer de quem é aquilo, e some do caminho depois. Grande, ela vira
 * o cabeçalho que acabou de sair daqui.
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
            claro ? 'text-branco/70' : 'text-cinza',
          )}
        >
          {brand.subtitulo}
        </span>
      </span>
    </div>
  )
}
