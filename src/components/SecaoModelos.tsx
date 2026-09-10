import type { Peca } from '../data/pecas'
import { movimentoReduzido, useTelaLarga } from '../lib/movimento'
import DeslizeModelos from './DeslizeModelos'
import GradePecas from './GradePecas'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'
import Selos from './Selos'

interface SecaoModelosProps {
  pecas: Peca[]
  /** Some quando não há peça. Ex.: a Danielli ocultou o acervo inteiro. */
  vazio?: string
}

/** A frase de amostra. Uma só, porque as duas montagens dizem o mesmo. */
const AMOSTRA = 'Uma amostra do acervo. No ateliê tem muito mais, e é lá que dá para provar.'

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
export default function SecaoModelos({ pecas, vazio }: SecaoModelosProps) {
  const telaLarga = useTelaLarga()

  if (!movimentoReduzido() && pecas.length > 0) {
    return <DeslizeModelos pecas={pecas} amostra={AMOSTRA} estreita={!telaLarga} />
  }

  return (
    <section className="border-t border-borda-sutil bg-branco">
      <div className="container-luxo secao">
        {pecas.length > 0 && (
          <>
            <Revelar>
              <SecaoTitulo
                eyebrow="Os modelos"
                titulo="Alguns do que temos hoje"
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
            <Revelar atraso={120}>
              <div className="mx-auto mt-12 max-w-3xl">
                <Selos publico="noiva" />
              </div>
            </Revelar>
          </>
        )}

        <div className={pecas.length > 0 ? 'mt-16' : ''}>
          <GradePecas pecas={pecas} vazio={vazio} />
        </div>
      </div>
    </section>
  )
}
