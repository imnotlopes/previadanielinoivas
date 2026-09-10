import { ATENDE, IMPORTADOS, anosDeCasa } from '../data/autoridade'
import { videoAtelier } from '../data/videos'
import FaixaMarcas from './FaixaMarcas'
import Revelar from './Revelar'
import VideoVertical from './VideoVertical'

/**
 * Bloco 2, a autoridade.
 *
 * O bloco que estava faltando no site inteiro. Antes havia aqui um espaço
 * reservado pedindo "anos de atelier e quantas noivas já saíram daqui
 * vestidas", porque ninguém tinha o número. Agora tem, e é melhor do que o
 * que eu teria inventado.
 *
 * A ORDEM É DELIBERADA: TEMPO, DEPOIS MARCAS
 * ------------------------------------------
 * Anos de casa qualquer loja tem. Marca representada é o que separa ateliê
 * sério de loja que compra vestido pronto de fornecedor, e é o argumento que
 * a noiva não sabe que deveria procurar. Por isso as marcas ganham o peso
 * visual maior, e não os anos: elas fecham a seção numa faixa que atravessa
 * a largura toda, com os logotipos em movimento. Ver FaixaMarcas.
 *
 * O VÍDEO PROVA QUE O LUGAR EXISTE
 * --------------------------------
 * Uma panorâmica pelos manequins. Num link que chega por WhatsApp, a primeira
 * dúvida silenciosa é se existe loja de verdade atrás daquilo ou se é um
 * perfil revendendo foto. Trinta segundos de arara resolvem isso sem uma
 * palavra.
 */
export default function SecaoAutoridade() {
  const anos = anosDeCasa()

  return (
    <section className="border-t border-borda-sutil bg-branco">
      <div className="container-luxo secao">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
          <Revelar distancia="nenhuma">
            <VideoVertical
              src={videoAtelier.src}
              poster={videoAtelier.poster}
              alt={videoAtelier.alt}
            />
          </Revelar>

          <div>
            <Revelar atraso={80}>
              <span className="eyebrow block">O ateliê</span>
              <h2 className="mt-4 texto-display-sm uppercase tracking-luxo">
                No mercado desde 2004
              </h2>
              <span className="filete mt-7" />
            </Revelar>

            <Revelar atraso={160}>
              <p className="mt-8 max-w-lg text-preto/75">
                São {anos} anos vestindo {listar(ATENDE)}, incluindo formatura
                de alto padrão.
              </p>
            </Revelar>

            <Revelar atraso={230}>
              <p className="mt-8 text-sm text-preto rebaixado">
                Além de peças importadas da {IMPORTADOS}.
              </p>
            </Revelar>
          </div>
        </div>

        {/*
          AS MARCAS SAEM DA COLUNA E ATRAVESSAM A SEÇÃO.

          Elas moravam numa lista de caixinhas dentro da coluna de texto, ao
          lado do vídeo. Ali eram um detalhe do parágrafo. Numa faixa que
          atravessa a largura inteira, viram um bloco com peso próprio, que é o
          que elas merecem: representar marca é o argumento mais forte deste
          trecho, e o menos óbvio para quem lê.
        */}
        {/*
          Nada de banda, nada de borda: a seção é branca de ponta a ponta.

          Cheguei a pôr a faixa numa banda de off-white para destacá-la, e era
          a resposta errada para o problema certo. Quem destaca a faixa é o
          TAMANHO dos logotipos, não uma mudança de fundo atrás deles: fundo
          diferente quebra a seção em duas e faz a faixa parecer um encaixe de
          outra página. Ver a escala em `.faixa-marcas_logo`.
        */}
        <Revelar distancia="curta" className="mt-24 md:mt-32">
          <p className="eyebrow mb-12 text-center">Marcas representadas</p>
          <FaixaMarcas />
        </Revelar>
      </div>
    </section>
  )
}

/** ['a', 'b', 'c'] vira "a, b e c". */
function listar(itens: readonly string[]): string {
  if (itens.length < 2) return itens[0] ?? ''
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`
}
