import type { Apresentacao } from '../data/apresentacoes'
import { brand } from '../lib/brand'
import Revelar from './Revelar'

interface CapaApresentacaoProps {
  apresentacao: Apresentacao
  /** Já sanitizado. Vazio mostra a versão neutra. */
  nome: string
}

/**
 * Bloco 1, a abertura. E o único lugar, além do fecho, onde a marca aparece.
 *
 * A CAPA DAS REFERÊNCIAS
 * ======================
 * As duas apresentações que a Danielli mandou como referência abrem igual: uma
 * foto de noiva ocupando a página, e por cima dela UMA palavra manuscrita
 * grande ("Noivas", no Studio Rodrigues) com uma linha pequena em versal. É o
 * que esta capa passou a ser.
 *
 * Antes era uma foto sob véu preto, com texto branco e "NOIVAS" em versal
 * gigante. Funcionava, e era o contrário do que ela pediu agora: escuro,
 * gráfico, de site. A capa nova é clara, de papel:
 *
 *   1. ALTO      a assinatura da logo nova, em branco, sobre o alto da foto.
 *   2. MEIO      a foto limpa, onde está o rosto.
 *   3. BAIXO     a foto se desmancha no papel, e ali nascem a palavra
 *                manuscrita, a saudação e o parágrafo, em escuro sobre claro.
 *
 * NO DESKTOP SÃO DUAS COLUNAS
 * ---------------------------
 * A foto da capa é a filha da Danielli, e é vertical: o rosto vai do alto até
 * o meio dela. Esticada numa tela deitada, o rosto cairia no pé da tela, bem
 * onde a foto se desmancha no papel. Então, a partir de 768px, a foto fica em
 * pé na coluna da direita, desmanchando para a esquerda, e o texto mora no
 * papel da esquerda, com a assinatura da logo em rosé no alto dele. É também a
 * página das referências: foto de um lado, papel e palavra do outro.
 *
 * Só a ASSINATURA da logo (o nome e a frase), sem o vestido desenhado. Um
 * vestido de traço fino por cima da foto de um vestido de verdade brigaria
 * com ela; o desenho inteiro fica para o fecho, no rodapé.
 *
 * NÃO EXISTE CABEÇALHO
 * --------------------
 * Barra fixa é chrome de site, e este material não é site: apresentação
 * nenhuma repete o logotipo em cima de cada página. Ver CascaApresentacaoVenda.
 *
 * A PALAVRA É O H1, A SAUDAÇÃO NÃO
 * --------------------------------
 * "Que bom que você chegou até aqui" é gentileza, não assunto; "Noivas" é o
 * assunto. Quem lê com leitor de tela ouve primeiro do que a página trata.
 */
export default function CapaApresentacao({ apresentacao, nome }: CapaApresentacaoProps) {
  const { capa, palavra, saudacao, posicionamento } = apresentacao
  const abertura = nome ? `${nome}, ${saudacao.toLowerCase()}` : saudacao

  /*
    SEM FOTO, A ABERTURA É SÓ PAPEL.

    Estado previsto, não erro: é o que segura uma apresentação nova no dia em
    que ela existir antes das fotos dela. A logo inteira no alto, no lugar da
    foto, e o resto igual.
  */
  if (!capa) {
    return (
      <section className="flex min-h-svh flex-col items-center justify-center bg-off-white px-6 py-16 text-center">
        <Revelar distancia="curta">
          <img
            src="/logo/danielli-noivas.webp"
            alt={`${brand.subtitulo} ${brand.nome}`}
            width={834}
            height={774}
            className="mx-auto h-auto w-48 md:w-60"
          />
        </Revelar>
        <Texto palavra={palavra} abertura={abertura} posicionamento={posicionamento} />
      </section>
    )
  }

  return (
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-off-white">
      {/*
        A foto sai do fluxo. Ela é filha direta de um flex container, e um
        item no meio de um `justify-between` empurraria a marca para o meio da
        tela em vez do alto.

        No celular ela cobre a folha; no desktop, só a coluna da direita.
      */}
      <img
        src={capa.foto}
        alt={capa.alt}
        /* Primeira imagem da página: é ela que define o tempo até a pessoa
           ver alguma coisa, e essa é a métrica que importa num link aberto
           no meio de uma conversa. */
        fetchPriority="high"
        decoding="async"
        className="absolute inset-y-0 right-0 size-full object-cover object-top md:w-[56%]"
      />

      {/* A foto se desmancha no papel. As paradas e o porquê em `.veu-capa`. */}
      <div aria-hidden className="veu-capa" />

      {/*
        A assinatura, pequena. Numa folha de rosto quem manda é a foto; a marca
        só precisa dizer de quem é aquilo. Não é link: a apresentação não tem
        para onde ir.
      */}
      <div className="relative flex justify-center px-6 pt-8 md:hidden">
        <Revelar distancia="curta" naPrimeiraTela>
          <img
            src="/logo/assinatura-claro.webp"
            alt={`${brand.subtitulo} ${brand.nome}`}
            width={834}
            height={191}
            className="h-auto w-44 drop-shadow-[0_1px_6px_rgb(0_0_0/0.25)] md:w-56"
          />
        </Revelar>
      </div>

      <div className="relative px-6 pb-12 text-center md:my-auto md:w-[48%] md:px-10 md:py-16 lg:px-16">
        {/* No desktop a assinatura vem em rosé, sobre o papel da coluna. */}
        <Revelar distancia="curta" naPrimeiraTela className="hidden md:block">
          <img
            src="/logo/assinatura.webp"
            alt={`${brand.subtitulo} ${brand.nome}`}
            width={834}
            height={191}
            className="mx-auto mb-14 h-auto w-60"
          />
        </Revelar>
        <Texto palavra={palavra} abertura={abertura} posicionamento={posicionamento} />
      </div>
    </section>
  )
}

/**
 * A palavra manuscrita, a saudação e o parágrafo.
 *
 * A palavra vem primeiro e maior, meio dentro da foto: é ela que faz da capa
 * uma folha diagramada. A saudação em itálico e o parágrafo em corpo ficam
 * inteiros sobre o papel, onde o contraste é o do resto da página.
 */
function Texto({
  palavra,
  abertura,
  posicionamento,
}: {
  palavra: string
  abertura: string
  posicionamento: string
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center">
      <Revelar distancia="curta" atraso={200} naPrimeiraTela>
        <h1 className="t-script-g font-normal">{palavra}</h1>
      </Revelar>

      <Revelar distancia="curta" atraso={320} naPrimeiraTela>
        <p className="t-italico mt-5 text-preto">{abertura}</p>
        <span className="filete mx-auto mt-6" />
        <p className="mx-auto mt-6 max-w-[34ch] text-preto/80">{posicionamento}</p>
      </Revelar>
    </div>
  )
}
