import type { Destaque } from '../data/apresentacoes'
import { depoimentos } from '../data/depoimentos'
import { identificacao, type Peca } from '../data/pecas'
import { selosConfirmados } from '../data/selos'
import { montarFluxo, type ItemDoFluxo } from '../lib/fluxo'
import { movimentoReduzido, useTelaLarga } from '../lib/movimento'
import DeslizeModelos from './DeslizeModelos'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'
import Selos from './Selos'

interface SecaoModelosProps {
  pecas: Peca[]
  /** As cinco fotos escolhidas, ver `destaques` em data/apresentacoes.ts. */
  destaques: readonly Destaque[]
  /** Some quando não há peça. Ex.: a Danielli ocultou o acervo inteiro. */
  vazio?: string
}

/** A frase de amostra. Uma só, porque as duas montagens dizem o mesmo. */
/*
  A RESTRIÇÃO VIRANDO PROMESSA.

  A página mostra pouco de propósito: é o pedido da Danielli, por causa da
  cidade pequena. Mas mostrar pouco sem dizer por quê pode parecer que o
  ateliê tem pouco. O motivo dela, dito do lado da noiva, vira cuidado com a
  noiva e explica por que o resto só existe no provador.

  VALIDAR COM A DANIELLI: fala em nome dela. Mostrado ao Edson em setembro
  de 2026 para levar até ela.
*/
const AMOSTRA =
  'Aqui você vê só os detalhes. O vestido inteiro, só no provador: o do seu casamento não deveria ser visto por ninguém antes do seu dia.'

/**
 * OS MODELOS E AS GARANTIAS, EM DUAS MONTAGENS.
 * =============================================
 *
 * O mesmo conteúdo, montado de dois jeitos que não têm nada em comum além dos
 * dados:
 *
 *   DESLIZE   a seção prende e os vestidos atravessam de lado, com as
 *             garantias no painel de abertura. É a montagem padrão, em
 *             qualquer largura. Ver DeslizeModelos.
 *   GRADE     título, garantias e grade de duas colunas, empilhados. Só
 *             aparece quando o deslize não pode existir.
 *
 * O DESLIZE VALE NO CELULAR TAMBÉM
 * --------------------------------
 * A primeira versão caía para a grade abaixo de 1024px, e eu justifiquei com
 * uma conta errada: disse que seriam doze telas de rolagem presa. Não são.
 * Como no estreito cada painel passa a ter a largura de UMA tela, e não a de
 * um cartão, o percurso inteiro dá umas cinco telas, com a vantagem de que
 * cada vestido ocupa o aparelho sozinho, que é justamente o que a estrutura
 * existe para fazer.
 *
 * O que muda no estreito é a forma, não a existência: abertura em dois
 * painéis, cartão medido pela largura, ritmo mais lento. Está em
 * DeslizeModelos.
 *
 * QUANDO A GRADE AINDA APARECE
 * ----------------------------
 * Só com `prefers-reduced-motion`. E não é excesso de zelo: a seção presa é o
 * movimento mais forte da apresentação inteira, e quem pede menos movimento
 * no sistema costuma pedir por enjoo. Deixar a tela travada com o conteúdo
 * parado seria o pior dos dois mundos.
 *
 * A troca é em JavaScript e não em media query porque as duas montagens
 * ficariam no HTML e o navegador baixaria as fotos das duas.
 */
export default function SecaoModelos({ pecas, destaques, vazio }: SecaoModelosProps) {
  const telaLarga = useTelaLarga()

  if (!movimentoReduzido() && pecas.length > 0) {
    return (
      <DeslizeModelos
        pecas={pecas}
        destaques={destaques}
        amostra={AMOSTRA}
        estreita={!telaLarga}
      />
    )
  }

  const itens = montarFluxo(pecas, destaques, depoimentos, import.meta.env.DEV)

  return (
    <section className="border-t border-borda-sutil bg-branco">
      <div className="container-luxo secao">
        {pecas.length > 0 && (
          <>
            <Revelar>
              <SecaoTitulo
                eyebrow="Os vestidos"
                titulo="Um pouco do que te espera"
                descricao={AMOSTRA}
                centralizado
              />
            </Revelar>

            {/*
              As garantias entram AQUI, e não numa seção antes.

              Elas eram um bloco separado, com título próprio, entre a
              autoridade e os modelos. Ali viravam uma parada burocrática
              exatamente no ponto em que a leitura ia ganhar desejo. Encostadas
              na grade, elas respondem as quatro dúvidas no instante em que a
              pessoa começa a olhar vestido, que é quando as dúvidas nascem.
            */}
            {selosConfirmados.length > 0 && (
              <Revelar atraso={120}>
                <div className="mx-auto mt-12 max-w-3xl">
                  <Selos publico="noiva" />
                </div>
              </Revelar>
            )}
          </>
        )}

        <div className={pecas.length > 0 ? 'mt-16' : ''}>
          {itens.length > 0 ? (
            <FluxoEmpilhado itens={itens} />
          ) : (
            vazio && <p className="mx-auto max-w-md text-center text-preto/60">{vazio}</p>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * A mesma sequência do deslize, uma coisa embaixo da outra.
 *
 * É a montagem de quem pediu menos movimento no sistema. Já foi uma grade de
 * doze cartões; virou o mesmo fluxo de foto e depoimento, porque a regra da
 * Danielli (menos foto, mais história) não depende de como a página se move.
 */
function FluxoEmpilhado({ itens }: { itens: ItemDoFluxo[] }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-14">
      {itens.map((item) => {
        if (item.tipo === 'peca' || item.tipo === 'detalhe') {
          const src = item.tipo === 'peca' ? (item.recorte ?? item.peca.fotos[0]) : item.imagem.src
          const alt = item.tipo === 'peca' ? identificacao(item.peca) : item.imagem.alt
          return (
            <Revelar key={item.chave} distancia="curta">
              <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="mx-auto aspect-[3/4] w-full max-w-sm object-cover"
              />
            </Revelar>
          )
        }

        if (item.tipo === 'depoimento') {
          const { depoimento } = item
          const print = depoimento.imagem?.tipo === 'print' ? depoimento.imagem : null
          return (
            <Revelar key={item.chave} como="blockquote" className="text-center">
              {print && (
                <img
                  src={print.src}
                  alt={print.alt}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto mb-8 max-h-96 w-auto max-w-[13rem] object-contain"
                />
              )}
              <span className="filete mx-auto" />
              <p className="t-italico mt-7 text-preto">“{depoimento.fala}”</p>
              <p className="mt-6 font-display text-h6 uppercase tracking-luxo text-preto">
                {depoimento.autora}
              </p>
            </Revelar>
          )
        }

        return import.meta.env.DEV ? (
          <div
            key={item.chave}
            className="border border-dashed border-borda p-8 text-center text-sm text-cinza"
          >
            Depoimento: espaço reservado, só em desenvolvimento.
          </div>
        ) : null
      })}
    </div>
  )
}
