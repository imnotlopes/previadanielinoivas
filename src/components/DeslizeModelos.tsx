import { FRASE_DA_MARCA } from '../data/autoridade'
import { depoimentos, type Depoimento, type ImagemDoDepoimento } from '../data/depoimentos'
import { identificacao, type Peca } from '../data/pecas'
import { selosConfirmados } from '../data/selos'
import { brand } from '../lib/brand'
import { montarFluxo } from '../lib/fluxo'
import { useDeslizeHorizontal } from '../lib/movimento'
import Selos from './Selos'

interface DeslizeModelosProps {
  pecas: Peca[]
  /** As cinco fotos escolhidas, ver `destaques` em data/apresentacoes.ts. */
  destaques: readonly string[]
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
 * Numa grade, os vestidos são itens de uma lista e a pessoa varre a página
 * com o olho procurando o que gosta. Aqui cada foto ocupa dois terços da tela
 * sozinha, uma de cada vez, e a rolagem é o que passa a peça.
 *
 * E entre uma foto e outra entra a fala de uma noiva. Foram doze vestidos em
 * sequência até setembro de 2026; a Danielli pediu menos foto e mais
 * história, e a sequência virou cinco pares de foto e depoimento. Ver
 * lib/fluxo.ts.
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
export default function DeslizeModelos({
  pecas,
  destaques,
  amostra,
  estreita,
}: DeslizeModelosProps) {
  const { externo, trilho } = useDeslizeHorizontal<HTMLElement, HTMLDivElement>(
    true,
    estreita ? RITMO_ESTREITO : RITMO_LARGO,
  )

  /*
    `import.meta.env.DEV` literal, e não numa constante: é o que deixa o Vite
    descartar o painel reservado inteiro do build de produção. Ver o mesmo
    raciocínio em lib/fluxo.ts.
  */
  const itens = montarFluxo(pecas, destaques, depoimentos, import.meta.env.DEV)
  if (itens.length === 0) return null

  let fotos = 0

  return (
    <section ref={externo} className="deslize">
      <div className="deslize_janela">
        <div ref={trilho} className="deslize_trilho">
          <Abertura amostra={amostra} estreita={estreita} />

          {itens.map((item) => {
            if (item.tipo === 'peca') {
              fotos++
              return (
                <div key={item.chave} className="deslize_painel deslize_painel--peca">
                  {/* As duas primeiras já estão na tela quando a seção prende;
                      o resto só existe depois de a pessoa rolar. */}
                  <Cartao peca={item.peca} adiantada={fotos <= 2} />
                </div>
              )
            }
            if (item.tipo === 'detalhe') {
              fotos++
              return <PainelDetalhe key={item.chave} imagem={item.imagem} />
            }
            if (item.tipo === 'depoimento') {
              return <PainelDepoimento key={item.chave} depoimento={item.depoimento} />
            }
            return import.meta.env.DEV ? <PainelReservado key={item.chave} /> : null
          })}

          <Fecho />
        </div>
      </div>
    </section>
  )
}

/**
 * O painel de abertura: o título e as garantias na mesma tela.
 *
 * A frase de amostra é obrigatória e não é ressalva: ela diz que o que passa
 * na tela é uma parte, e que o acervo mora no ateliê. Sem ela, os vestidos
 * que passam viram promessa de que são esses e mais nenhum, e a arara não
 * cumpre isso.
 */
function Abertura({ amostra, estreita }: { amostra: string; estreita: boolean }) {
  const titulo = (
    <>
      <span className="eyebrow block text-branco rebaixado">Os vestidos</span>
      <h2 className="mt-5 texto-display text-branco">Um pouco do que te espera</h2>
      <span className="filete-claro mt-8" />
      <p className="t-italico mt-8 max-w-[34ch] text-branco">{amostra}</p>
    </>
  )

  /*
    Sem nenhuma garantia confirmada, a coluna (e no celular o painel inteiro)
    sai da abertura. Um bloco "O que está incluído" vazio, ou com promessas
    que ninguém confirmou, é pior que nenhum. Ver data/selos.ts.
  */
  const temGarantias = selosConfirmados.length > 0

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
        {temGarantias && (
          <div className="deslize_painel deslize_painel--cheio">
            <div className="deslize_abertura container-luxo">{garantias}</div>
          </div>
        )}
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
          {temGarantias && <div className="col-4 deslocar-7">{garantias}</div>}
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
 * do ateliê, e ela cai exatamente onde precisa: depois de os vestidos
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
 *
 * NÃO ABRE NADA. Até setembro de 2026 o cartão inteiro era um botão que abria
 * a ficha da peça com todas as fotos, e tinha um "+" para marcar e mandar a
 * lista pelo WhatsApp. As duas coisas saíram: é apresentação, não catálogo, e
 * a ficha fazia exatamente o que a Danielli pediu para não fazer, mostrar o
 * vestido por todos os ângulos para quem ainda não foi ao ateliê.
 */
function Cartao({ peca, adiantada }: { peca: Peca; adiantada: boolean }) {
  return (
    <div className="deslize_cartao">
      <img
        src={peca.fotos[0]}
        alt={identificacao(peca)}
        loading={adiantada ? 'eager' : 'lazy'}
        decoding="async"
      />

      <div className="deslize_conteudo">
        <div>
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
    </div>
  )
}

/**
 * A fala de uma noiva, entre duas fotos.
 *
 * Mesmo fundo preto, mesma altura de tela, e nenhuma moldura: o depoimento não
 * é um cartão encaixado na sequência, é o intervalo entre duas fotos, a voz
 * que conta o que a foto não conta.
 *
 * O corpo da fala diminui quando ela é longa. Em itálico grande, uma fala de
 * quatro linhas de WhatsApp estoura a altura do painel no celular, e cortar a
 * fala para caber seria mudar o que ela disse.
 */
function PainelDepoimento({ depoimento }: { depoimento: Depoimento }) {
  const longa = depoimento.fala.length > 140
  const print = depoimento.imagem?.tipo === 'print' ? depoimento.imagem : null

  return (
    <div className="deslize_painel deslize_painel--depoimento">
      <figure className="deslize_depoimento">
        {print && <ImagemPrint imagem={print} />}
        <span className="filete-claro" />
        <blockquote
          className={longa ? 't-italico mt-7 text-branco' : 't-italico-g mt-7 text-branco'}
        >
          “{depoimento.fala}”
        </blockquote>
        <figcaption className="mt-7 font-display text-h6 uppercase tracking-luxo text-branco">
          {depoimento.autora}
          {depoimento.contexto && (
            <span className="mt-1 block normal-case tracking-normal text-branco rebaixado">
              {depoimento.contexto}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  )
}

/**
 * O print da conversa, quando é ele que veio no lugar da foto.
 *
 * Inteiro e pequeno, nunca recortado: a primeira linha da mensagem é onde a
 * noiva diz o que sentiu, e um recorte em retrato a cortaria.
 */
function ImagemPrint({ imagem }: { imagem: ImagemDoDepoimento }) {
  return (
    <img
      src={imagem.src}
      alt={imagem.alt}
      loading="lazy"
      decoding="async"
      className="deslize_print"
    />
  )
}

/**
 * O recorte de detalhe que veio com o depoimento, no lugar de uma foto do
 * acervo.
 *
 * Sem nome, descrição nem código por cima: é a foto dela, não uma peça da
 * vitrine, e legenda de peça sobre ela transformaria lembrança em anúncio.
 */
function PainelDetalhe({ imagem }: { imagem: ImagemDoDepoimento }) {
  return (
    <div className="deslize_painel deslize_painel--peca">
      <div className="deslize_cartao">
        <img src={imagem.src} alt={imagem.alt} loading="lazy" decoding="async" />
      </div>
    </div>
  )
}

/**
 * O lugar de um depoimento que ainda não chegou. Só existe em `npm run dev`.
 *
 * Tracejado e dizendo o que é, para ninguém confundir com conteúdo. Some
 * sozinho a cada depoimento cadastrado em data/depoimentos.ts.
 */
function PainelReservado() {
  return (
    <div className="deslize_painel deslize_painel--depoimento">
      <figure className="deslize_depoimento border border-dashed border-branco/40 p-8">
        <span className="filete-claro" />
        <p className="t-italico mt-7 text-branco rebaixado">
          “Aqui entra a fala de uma noiva, do jeito que ela escreveu.”
        </p>
        <p className="mt-7 font-display text-h6 uppercase tracking-luxo text-branco rebaixado">
          Depoimento
        </p>
        <p className="mt-5 text-sm leading-relaxed text-branco rebaixado">
          Espaço reservado, só aparece em desenvolvimento. Preencha em
          src/data/depoimentos.ts: a fala, o nome, e se quiser o print da
          conversa ou um recorte de detalhe do vestido dela.
        </p>
      </figure>
    </div>
  )
}
