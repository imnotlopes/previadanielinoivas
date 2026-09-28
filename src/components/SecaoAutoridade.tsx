import { IMPORTADOS, anosDeCasa } from '../data/autoridade'
import { videoAtelier } from '../data/videos'
import Dupla from './Dupla'
import FaixaMarcas from './FaixaMarcas'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'
import VideoVertical from './VideoVertical'

/**
 * Bloco 2, a autoridade.
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
 *
 * E AGORA ELE VEM EM DUPLA
 * ------------------------
 * O vídeo ganhou uma foto pequena sobreposta, uma noiva de roupão ao lado do
 * vestido no manequim: é a página típica das referências que a Danielli
 * mandou (foto grande, foto pequena com moldura branca). O vídeo mostra o
 * lugar; a foto mostra alguém sendo atendida nele. Ver Dupla.
 */
export default function SecaoAutoridade() {
  const anos = anosDeCasa()

  return (
    <section className="bg-bege">
      <div className="container-luxo secao">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <Dupla
              grande={
                <VideoVertical
                  src={videoAtelier.src}
                  poster={videoAtelier.poster}
                  alt={videoAtelier.alt}
                />
              }
              pequena={
                <img
                  src="/atelier/atendimento.webp"
                  alt="Noiva de roupão ao lado do vestido no manequim, dentro do ateliê."
                  width={1200}
                  height={1600}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[4/5] w-full object-cover object-top"
                />
              }
            />
          </div>

          <div className="text-center lg:text-left">
            <Revelar atraso={80}>
              <SecaoTitulo
                script="O ateliê"
                titulo="Vestindo noivas desde 2004"
                centralizado="celular"
              />
            </Revelar>

            {/*
              Uma frase só. O "tudo para o casamento" chegou a morar aqui, em
              mais dois parágrafos, e saiu para uma seção própria com fotos,
              ver SecaoOferece. Aqui fica quem é o ateliê; lá, o que ele tem.
            */}
            <Revelar atraso={160}>
              <p className="mx-auto mt-8 max-w-md lg:mx-0">
                São {anos} anos atendendo noivas daqui e da região.
              </p>
            </Revelar>

            <Revelar atraso={230}>
              <p className="t-italico mx-auto mt-6 max-w-md text-preto/80 lg:mx-0">
                E algumas peças chegam direto da {IMPORTADOS}.
              </p>
            </Revelar>
          </div>
        </div>

        {/*
          AS MARCAS SAEM DA COLUNA E ATRAVESSAM A SEÇÃO.

          Numa faixa que atravessa a largura inteira, elas viram um bloco com
          peso próprio, que é o que merecem: representar marca é o argumento
          mais forte deste trecho, e o menos óbvio para quem lê. Quem destaca a
          faixa é o TAMANHO dos logotipos, não uma mudança de fundo atrás
          deles. Ver a escala em `.faixa-marcas_logo`.
        */}
        <Revelar distancia="curta" className="mt-24 md:mt-32">
          <p className="eyebrow mb-12 text-center">Marcas representadas</p>
          <FaixaMarcas />
        </Revelar>
      </div>
    </section>
  )
}
