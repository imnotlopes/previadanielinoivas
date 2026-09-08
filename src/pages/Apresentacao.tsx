import { useSearchParams } from 'react-router-dom'

import BarraSelecao from '../components/BarraSelecao'
import BotaoWhatsapp from '../components/BotaoWhatsapp'
import CapaApresentacao from '../components/CapaApresentacao'
import GradePecas from '../components/GradePecas'
import Revelar from '../components/Revelar'
import SecaoAutoridade from '../components/SecaoAutoridade'
import SecaoCasamentos from '../components/SecaoCasamentos'
import SecaoDepoimentos from '../components/SecaoDepoimentos'
import SecaoTitulo from '../components/SecaoTitulo'
import SecaoVestidosEmMovimento from '../components/SecaoVestidosEmMovimento'
import Selos from '../components/Selos'
import Seo from '../components/Seo'
import { apresentacaoDe, nomeSanitizado } from '../data/apresentacoes'
import { doPublico, visiveis, type Publico } from '../data/pecas'
import { useContato, useLoja } from '../lib/loja'
import { useSelecao } from '../lib/selecao'

interface ApresentacaoProps {
  publico: Publico
}

/**
 * OS QUATRO PASSOS.
 *
 * Encurtados em relação ao que estava na home: aqui é ferramenta de venda,
 * não landing longa. Cada um cabe numa linha lida de relance.
 *
 * ATENÇÃO, TEXTO DE PRÉVIA: descreve como um aluguel costuma funcionar, não
 * necessariamente como a Danielli trabalha. Confirmar antes de mandar.
 */
const PASSOS = [
  { titulo: 'Você agenda', texto: 'Manda a data e a gente combina um horário só seu.' },
  { titulo: 'Prova sem pressa', texto: 'Quantos modelos quiser, com alguém dizendo a verdade.' },
  { titulo: 'A data fica sua', texto: 'Escolhida a peça, ninguém mais leva ela no seu dia.' },
  { titulo: 'Ajustamos em você', texto: 'O ajuste está incluído e fica pronto antes.' },
]

/**
 * UMA APRESENTAÇÃO, TRÊS PÚBLICOS.
 * ================================
 *
 * O produto deixou de ser site e virou material de conversa: a Danielli cola
 * o link no WhatsApp depois que a cliente já a procurou. Ninguém chega aqui
 * pelo Google, e é por isso que estas rotas são `noindex`.
 *
 * A peça tem três trabalhos, nesta ordem: criar desejo, provar autoridade, e
 * devolver a pessoa para a conversa com a escolha feita. Não é explicar o que
 * é um ateliê, porque quem abriu já sabe.
 *
 * A META É DOIS MINUTOS NO POLEGAR
 * --------------------------------
 * Sete blocos, e cada um se sustenta sozinho, porque a leitora rola rápido e
 * para no que interessa. Não há navegação: quem chega aqui não veio de outra
 * página deste domínio, e não vai para nenhuma.
 *
 * O QUE NÃO EXISTE MAIS, E POR QUÊ
 * --------------------------------
 * Busca, filtros, ordenação, paginação e contagem de peças. Tudo isso serve a
 * quem procura num acervo grande; aqui a graça é ser uma amostra pequena e
 * escolhida, e dizer isso com todas as letras. Número fecha o acervo:
 * "diversos modelos" deixa a porta aberta para o que está na arara e não está
 * aqui, que é sempre a maior parte.
 */
export default function Apresentacao({ publico }: ApresentacaoProps) {
  const { pecas } = useLoja()
  const [params] = useSearchParams()

  const apresentacao = apresentacaoDe(publico)

  /*
    O nome vem de um link que a Danielli monta na mão. Chega como ela digitou,
    e vai direto para dentro do HTML: passa pelo saneamento antes.
  */
  const nome = nomeSanitizado(params.get('nome'))

  const daCasa = doPublico(visiveis(pecas), publico)
  const mensagemFinal = `Oi Danielli! Vi ${apresentacao.origem} e queria agendar uma prova.`

  return (
    <>
      <Seo
        titulo={apresentacao.titulo}
        descricao={apresentacao.descricao}
        imagem={apresentacao.ogImagem}
        /*
          Material de conversa comercial, não conteúdo de busca. A pessoa
          recebe o link pronto; nada aqui deve aparecer numa pesquisa, e a
          apresentação personalizada com `?nome=` muito menos.
        */
        naoIndexar
      />

      {/* 1 · Abertura */}
      <CapaApresentacao apresentacao={apresentacao} nome={nome} />

      {/* 2 · Autoridade */}
      <SecaoAutoridade />

      {/* 3 · O que o ateliê oferece */}
      <section className="border-t border-borda-sutil bg-off-white">
        <div className="container-luxo secao max-w-3xl">
          <Revelar>
            <SecaoTitulo
              eyebrow="Sem surpresa depois"
              titulo="O que está incluído"
              centralizado
            />
          </Revelar>
          <Revelar atraso={120}>
            <div className="text-left">
              <Selos publico={publico === 'noivas' ? 'noiva' : 'festa'} />
            </div>
          </Revelar>
        </div>
      </section>

      {/* 4 · Os modelos */}
      <section className="border-t border-borda-sutil bg-branco">
        <div className="container-luxo secao">
          {/*
            SEM PEÇA, SEM PROMESSA.

            O título e a frase de amostra só fazem sentido quando há grade
            embaixo. Na apresentação de noivos, que ainda não tem uma única
            foto, eles anunciavam modelos e entregavam um aviso de que não há
            modelos, que é pior do que só dar o aviso.
          */}
          {daCasa.length > 0 && (
            <Revelar>
              <SecaoTitulo
                eyebrow="Os modelos"
                titulo="Alguns do que temos hoje"
                /*
                  A frase é obrigatória, e é o contrário de uma ressalva: ela
                  diz que o que está na tela é uma amostra e que o acervo mora
                  no ateliê. Sem ela, a apresentação vira promessa de
                  exaustividade que a arara não cumpre.
                */
                descricao="Uma amostra do acervo. No ateliê tem muito mais, e é lá que dá para provar."
                centralizado
              />
            </Revelar>
          )}

          <div className={daCasa.length > 0 ? 'mt-12' : ''}>
            <GradePecas pecas={daCasa} vazio={apresentacao.semPecas} />
          </div>
        </div>
      </section>

      {/*
        Ainda o bloco 4: as peças em movimento.

        Só na apresentação de noivas, porque os três vídeos editoriais são de
        vestido de noiva. É o mesmo assunto da grade, dito do jeito que a foto
        não diz: como o bordado pega a luz, como o tule pesa, como a cauda
        anda. "Criar desejo" é o primeiro trabalho desta peça, e vídeo faz
        isso melhor que qualquer card.
      */}
      {publico === 'noivas' && <SecaoVestidosEmMovimento />}

      {/* 5 · Prova social */}
      {/* Some sozinha enquanto não houver depoimento com autorização. */}
      <SecaoDepoimentos />
      {publico === 'noivas' && <SecaoCasamentos />}

      {/* 6 · Como funciona */}
      <section className="border-t border-borda-sutil bg-preto text-branco">
        <div className="container-luxo secao">
          <Revelar>
            <div className="flex flex-col items-center text-center">
              <span className="font-display text-h6 uppercase tracking-luxo text-dourado">
                Como funciona
              </span>
              <h2 className="mt-4 texto-display-sm uppercase tracking-luxo text-branco">
                Alugar é simples assim
              </h2>
              <span className="filete-claro mt-7" />
            </div>
          </Revelar>

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS.map((passo, indice) => (
              <Revelar
                key={passo.titulo}
                como="li"
                atraso={indice * 90}
                className="border-t border-branco/30 pt-5"
              >
                <span className="font-display text-h4 leading-none text-dourado">
                  {String(indice + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-h5 uppercase tracking-luxo text-branco">
                  {passo.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-branco/70">
                  {passo.texto}
                </p>
              </Revelar>
            ))}
          </ol>
        </div>
      </section>

      {/* 7 · Encerramento */}
      <section className="border-t border-borda-sutil bg-off-white">
        <div className="container-luxo secao flex flex-col items-center text-center">
          <Revelar>
            <span className="eyebrow block">Próximo passo</span>
            <h2 className="mt-4 texto-display-sm uppercase tracking-luxo">
              Vem provar
            </h2>
            <span className="filete mx-auto mt-7" />
            <p className="mx-auto mt-7 max-w-md text-preto/70">
              Marque os modelos que quiser e me manda. A gente separa tudo
              antes de você chegar.
            </p>
          </Revelar>

          <Revelar atraso={140}>
            <div className="mt-9">
              <BotaoWhatsapp mensagem={mensagemFinal}>
                Falar no WhatsApp
              </BotaoWhatsapp>
            </div>
          </Revelar>

          <Endereco />
        </div>
      </section>

      {/* O motor: fixa no rodapé assim que a primeira peça é marcada. */}
      <BarraSelecao apresentacao={apresentacao} />

      {/* Espaço para a barra não cobrir o fim da página. */}
      <EspacoDaBarra />

    </>
  )
}

/** Endereço e cidade, quando preenchidos. Somem juntos quando não. */
function Endereco() {
  const { cidade, endereco } = useContato()
  if (!cidade && !endereco) return null

  return (
    <Revelar atraso={200}>
      <address className="mt-10 not-italic text-sm leading-relaxed text-preto/65">
        {endereco && <span className="block">{endereco}</span>}
        {cidade && <span className="block">{cidade}</span>}
      </address>
    </Revelar>
  )
}

/**
 * O vão embaixo da barra.
 *
 * Só existe quando há peça marcada, porque a barra também só existe aí. Sem
 * ele, a barra tapa o botão final de WhatsApp, que é justamente o que a
 * página inteira existe para produzir.
 */
function EspacoDaBarra() {
  const { codigos } = useSelecao()
  if (codigos.length === 0) return null
  return <div aria-hidden className="h-44 shrink-0 sm:h-36" />
}
