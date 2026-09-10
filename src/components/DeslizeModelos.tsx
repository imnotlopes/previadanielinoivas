import { useState } from 'react'

import { PECAS_POR_APRESENTACAO } from '../data/apresentacoes'
import { FRASE_DA_MARCA } from '../data/autoridade'
import { identificacao, ordenadas, type Peca } from '../data/pecas'
import { brand } from '../lib/brand'
import { useDeslizeHorizontal } from '../lib/movimento'
import BotaoProvar from './BotaoProvar'
import OverlayPeca from './OverlayPeca'
import Selos from './Selos'

interface DeslizeModelosProps {
  pecas: Peca[]
  /** Frase de amostra. Obrigatória: ver o comentário no painel de abertura. */
  amostra: string
  /** Tela estreita. Muda a abertura, a medida do cartão e o ritmo. */
  estreita: boolean
}

/**
 * QUANTO O CONTEÚDO ANDA PARA CADA PIXEL ROLADO.
 *
 * Menor que 1 significa que o trilho anda mais rápido que o dedo, encurtando
 * a seção sem tirar vestido nenhum da tela.
 *
 * No desktop o cartão ocupa uns 30% da largura, então dá para acelerar sem a
 * peça borrar. No celular ele ocupa a tela inteira: no mesmo ritmo, cada
 * vestido passaria em um quarto de tela de rolagem, rápido demais para olhar.
 * 0,8 põe um vestido a cada dedada curta, que é o gesto natural ali.
 */
const RITMO_LARGO = 0.62
const RITMO_ESTREITO = 0.8

/**
 * OS MODELOS, DESLIZANDO.
 * =======================
 *
 * A seção prende na tela e os vestidos atravessam de lado enquanto a pessoa
 * rola normalmente. É a estrutura da seção "Our Camps" da referência,
 * refeita com vestido no lugar de acampamento.
 *
 * O QUE A ESTRUTURA FAZ QUE UMA GRADE NÃO FAZ
 * -------------------------------------------
 * Numa grade, doze vestidos são doze itens de uma lista e a pessoa varre a
 * página com o olho procurando o que gosta. Aqui cada vestido ocupa dois
 * terços da tela sozinho, um de cada vez, e a rolagem é o que passa a peça.
 * É a diferença entre folhear uma vitrine e ver uma arara sendo mostrada.
 *
 * DUAS SEÇÕES VIRARAM UMA
 * -----------------------
 * "O que está incluído" era um bloco separado, antes dos modelos, e virava
 * uma parada burocrática entre a promessa e o desejo. Aqui ele mora no painel
 * de abertura, ao lado do título: a pessoa lê as quatro garantias enquanto o
 * primeiro vestido já está entrando pela direita.
 *
 * É o que a referência faz com "Polar Comfort", que é o texto de garantia
 * dela, encaixado na mesma tela do título "Our Camps".
 *
 * NO CELULAR TAMBÉM, E ELE MUDA DE FORMA
 * --------------------------------------
 * A primeira versão caía para a grade de duas colunas abaixo de 1024px, por
 * medo do custo de rolagem. A conta que eu fiz estava errada: como cada
 * painel passa a ter a largura de UMA tela, e não a de um cartão, o percurso
 * inteiro dá umas cinco telas de rolagem, não doze.
 *
 * O que muda no estreito:
 *
 *   ABERTURA   vira DOIS painéis. O título com a frase de amostra não divide
 *              uma tela de 812px com quatro garantias, tentar isso estoura.
 *   CARTÃO     medido pela largura, e mais alongado. Ver o bloco de celular
 *              em `.deslize_cartao`.
 *   RITMO      mais lento, para um vestido durar uma dedada.
 */
export default function DeslizeModelos({ pecas, amostra, estreita }: DeslizeModelosProps) {
  const [aberta, setAberta] = useState<Peca | null>(null)
  const { externo, trilho } = useDeslizeHorizontal<HTMLElement, HTMLDivElement>(
    true,
    estreita ? RITMO_ESTREITO : RITMO_LARGO,
  )

  const lista = ordenadas(pecas).slice(0, PECAS_POR_APRESENTACAO)
  if (lista.length === 0) return null

  return (
    <>
      <section ref={externo} className="deslize">
        <div className="deslize_janela">
          <div ref={trilho} className="deslize_trilho">
            <Abertura amostra={amostra} estreita={estreita} />

            {lista.map((peca, indice) => (
              <div key={peca.codigo} className="deslize_painel deslize_painel--peca">
                <Cartao
                  peca={peca}
                  /* As duas primeiras já estão na tela quando a seção prende;
                     o resto só existe depois de a pessoa rolar. */
                  adiantada={indice < 2}
                  aoAbrir={() => setAberta(peca)}
                />
              </div>
            ))}

            <Fecho />
          </div>
        </div>
      </section>

      {aberta && <OverlayPeca peca={aberta} aoFechar={() => setAberta(null)} />}
    </>
  )
}

/**
 * O painel de abertura: o título e as garantias na mesma tela.
 *
 * A frase de amostra é obrigatória e não é ressalva: ela diz que o que passa
 * na tela é uma parte, e que o acervo mora no ateliê. Sem ela, doze vestidos
 * desfilando viram promessa de que são esses e mais nenhum, e a arara não
 * cumpre isso.
 */
function Abertura({ amostra, estreita }: { amostra: string; estreita: boolean }) {
  const titulo = (
    <>
      <span className="eyebrow block text-branco rebaixado">Os modelos</span>
      <h2 className="mt-5 texto-display text-branco">Alguns do que temos hoje</h2>
      <span className="filete-claro mt-8" />
      <p className="t-italico mt-8 max-w-[34ch] text-branco">{amostra}</p>
    </>
  )

  const garantias = (
    <>
      <span className="eyebrow block text-branco rebaixado">Sem surpresa depois</span>
      <p className="mt-4 font-display text-h4 uppercase tracking-luxo text-branco">
        O que está incluído
      </p>
      <Selos publico="noiva" claro />
    </>
  )

  /*
    NO ESTREITO SÃO DOIS PAINÉIS, E NÃO DUAS COLUNAS.

    Título em corpo de display, filete, frase em itálico e mais quatro
    garantias com ícone não cabem numa tela de 812px. Empilhados, ou estouram
    o painel ou obrigam a encolher tudo até virar letra miúda, e aí a abertura
    deixa de ser abertura.

    Dois painéis custam meia tela de rolagem a mais e resolvem: a pessoa lê o
    título, desliza, lê as garantias, e o primeiro vestido já vem entrando.
  */
  if (estreita) {
    return (
      <>
        <div className="deslize_painel deslize_painel--cheio">
          <div className="deslize_abertura container-luxo">{titulo}</div>
        </div>
        <div className="deslize_painel deslize_painel--cheio">
          <div className="deslize_abertura container-luxo">{garantias}</div>
        </div>
      </>
    )
  }

  return (
    <div className="deslize_painel deslize_painel--cheio">
      <div className="deslize_abertura container-luxo">
        <div className="u-grid items-end">
          <div className="col-6">{titulo}</div>

          {/*
            A coluna das garantias, encostada à direita.

            Quatro de doze colunas, deslocada em sete: é a mesma proporção da
            coluna de texto da referência, e é estreita de propósito. Garantia
            é texto de apoio, e apoio que ocupa meia tela deixa de apoiar.
          */}
          <div className="col-4 deslocar-7">{garantias}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * O painel de fecho: a frase da Danielli.
 *
 * A referência termina a faixa com uma citação de jornalista sobre a
 * Antártida. O equivalente aqui não é uma citação de fora, é a frase da dona
 * do ateliê, e ela cai exatamente onde precisa: depois de doze vestidos
 * passarem na tela, a leitora acabou de fazer o que a frase descreve, olhar
 * foto e achar que está escolhendo.
 *
 * A assinatura embaixo importa. Sem ela a frase lê como legenda de banco de
 * imagem; com ela, lê como alguém que vive disso há vinte e dois anos.
 */
function Fecho() {
  return (
    <div className="deslize_painel deslize_painel--cheio">
      <figure className="container-luxo flex flex-col items-center text-center">
        <span className="filete-claro" />
        <blockquote className="t-italico-g mt-9 max-w-[22ch] text-branco">
          {FRASE_DA_MARCA}
        </blockquote>
        <figcaption className="mt-9 font-display text-h6 uppercase tracking-luxo text-branco rebaixado">
          {brand.subtitulo} {brand.nome}
        </figcaption>
      </figure>
    </div>
  )
}

/**
 * Um vestido.
 *
 * A composição é a do cartão da referência: a foto preenche tudo, o texto fica
 * por cima em duas pontas, e o dado seco desce para o rodapé. Lá o dado é a
 * coordenada do acampamento; aqui é o código da peça, e a analogia é honesta,
 * nos dois casos é o que a pessoa copia para pedir.
 */
function Cartao({
  peca,
  adiantada,
  aoAbrir,
}: {
  peca: Peca
  adiantada: boolean
  aoAbrir: () => void
}) {
  return (
    <div className="deslize_cartao">
      <img
        src={peca.fotos[0]}
        alt={identificacao(peca)}
        loading={adiantada ? 'eager' : 'lazy'}
        decoding="async"
      />

      <div className="deslize_conteudo">
        <div className="deslize_topo">
          {peca.nome ? (
            <p className="font-display text-h4 uppercase tracking-luxo text-branco">
              {peca.nome}
            </p>
          ) : null}
          <p
            className={peca.nome ? 'mt-3 text-sm text-branco rebaixado' : 'text-sm text-branco'}
          >
            {peca.descricao}
          </p>
        </div>

        <p className="deslize_codigo text-branco">[ {peca.codigo} ]</p>
      </div>

      {/*
        O botão que abre a ficha cobre o cartão inteiro e fica ATRÁS do texto,
        que é `pointer-events: none` por não ter nada clicável. Assim o alvo é
        o cartão todo, como na referência, sem envolver o texto num botão e
        sem botão dentro de botão.
      */}
      <button
        type="button"
        onClick={aoAbrir}
        className="absolute inset-0 z-[1] cursor-pointer"
        aria-label={`Ver ${identificacao(peca)}`}
      />

      <BotaoProvar
        codigo={peca.codigo}
        nome={identificacao(peca)}
        className="absolute right-3 top-3 z-10"
      />
    </div>
  )
}
