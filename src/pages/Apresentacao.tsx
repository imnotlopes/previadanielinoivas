import { useSearchParams } from 'react-router-dom'

import CapaApresentacao from '../components/CapaApresentacao'
import Revelar from '../components/Revelar'
import SecaoAutoridade from '../components/SecaoAutoridade'
import SecaoCasamentos from '../components/SecaoCasamentos'
import SecaoAvaliacoes from '../components/SecaoGoogle'
import SecaoOferece from '../components/SecaoOferece'
import SecaoModelos from '../components/SecaoModelos'
import SecaoVestidosEmMovimento from '../components/SecaoVestidosEmMovimento'
import Seo from '../components/Seo'
import { apresentacaoDe, nomeSanitizado } from '../data/apresentacoes'
import { googleNegocio } from '../data/google'
import { doPublico, pecas, visiveis, type Publico } from '../data/pecas'

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
 * necessariamente como a Danielli trabalha. Cada passo repete uma das
 * garantias de data/selos.ts, e nenhuma delas foi confirmada.
 *
 * Por isso cada passo tem `confirmado`, todos em `false`, e a seção inteira
 * some enquanto nenhum estiver confirmado. Mesma regra dos selos: confirmou,
 * vira `true`; não é verdade, apaga.
 */
const PASSOS = [
  { titulo: 'Você marca o dia', texto: 'Responde na nossa conversa e a gente reserva um horário só seu.', confirmado: false },
  { titulo: 'Prova sem pressa', texto: 'Quantos modelos quiser, com alguém dizendo a verdade.', confirmado: false },
  { titulo: 'A data fica sua', texto: 'Escolhida a peça, ninguém mais leva ela no seu dia.', confirmado: false },
  { titulo: 'Ajustamos em você', texto: 'O ajuste está incluído e fica pronto antes.', confirmado: false },
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
 * devolver a pessoa para a conversa querendo marcar a visita. Não é mostrar
 * tudo: a Danielli pediu que ela saia curiosa, e o que ela não viu aqui é o
 * motivo de ir até o ateliê.
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
  const [params] = useSearchParams()

  const apresentacao = apresentacaoDe(publico)

  /*
    O nome vem de um link que a Danielli monta na mão. Chega como ela digitou,
    e vai direto para dentro do HTML: passa pelo saneamento antes.
  */
  const nome = nomeSanitizado(params.get('nome'))
  const passos = PASSOS.filter((passo) => passo.confirmado)

  const daCasa = doPublico(visiveis(pecas), publico)

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

      {/*
        3 e 4 · As garantias E os modelos, numa seção só.

        Eram dois blocos: "O que está incluído" e depois "Os modelos". A ordem
        parecia certa (tranquilizar, depois mostrar) e na leitura era o
        contrário: a pessoa chegava embalada pela autoridade e batia numa
        lista de garantias antes de ver um vestido.

        Agora eles convivem, e a montagem muda com a tela. Ver SecaoModelos.
      */}
      <SecaoModelos
        pecas={daCasa}
        destaques={apresentacao.destaques}
        vazio={apresentacao.semPecas}
      />

      {/*
        Ainda o bloco 4: as peças em movimento.

        Os três vídeos editoriais são de vestido de noiva. É o mesmo assunto
        da grade, dito do jeito que a foto
        não diz: como o bordado pega a luz, como o tule pesa, como a cauda
        anda. "Criar desejo" é o primeiro trabalho desta peça, e vídeo faz
        isso melhor que qualquer card.
      */}
      <SecaoVestidosEmMovimento />

      {/*
        5 · Prova social.

        Os depoimentos moravam aqui, numa seção própria. Foram para dentro da
        sequência de modelos, intercalados com as fotos, ver lib/fluxo.ts. Fica
        o mural dos casamentos, que a Danielli aprovou do jeito que está.

        Antes da prova social, o que o ateliê oferece além do vestido: é a
        parte do áudio dela que a peça ainda não contava. E, entre a oferta e o
        mural, as avaliações do Google, que são a única voz de fora que a
        página tem enquanto os depoimentos não chegam.
      */}
      <SecaoOferece />
      <SecaoAvaliacoes />
      <SecaoCasamentos />

      {/* 6 · Como funciona. Some enquanto nenhum passo estiver confirmado. */}
      {passos.length > 0 && (
        <section className="border-t border-borda-sutil bg-preto text-branco">
          <div className="container-luxo secao">
            <Revelar>
              <div className="flex flex-col items-center text-center">
                <span className="font-display text-h6 uppercase tracking-luxo text-dourado">
                  Como funciona
                </span>
                <h2 className="mt-4 texto-display-sm uppercase tracking-luxo text-branco">
                  Do provador ao altar
                </h2>
                <span className="filete-claro mt-7" />
              </div>
            </Revelar>

            <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {passos.map((passo, indice) => (
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
      )}

      {/*
        7 · O convite.

        Era "Vem provar" com um botão de WhatsApp. Saiu o botão, e com ele a
        ideia de que a página termina numa ação: a noiva abriu este link de
        dentro da conversa com a Danielli, e é para lá que ela volta sozinha
        quando fechar a aba. O fim da página não precisa levá-la a lugar
        nenhum, precisa deixar uma pergunta na cabeça dela.

        A pergunta é da Danielli, quase palavra por palavra: "quando seria o
        melhor horário pra você conhecer o nosso trabalho pessoalmente". Ela
        não pede "agende já", pede uma data, e responder com uma data é o
        passo mais curto entre curiosidade e visita.
      */}
      <section className="border-t border-borda-sutil bg-off-white">
        <div className="container-luxo secao flex flex-col items-center text-center">
          <Revelar>
            <span className="eyebrow block">Próximo passo</span>
            <h2 className="mt-4 texto-display-sm uppercase tracking-luxo">
              Vem conhecer o ateliê
            </h2>
            <span className="filete mx-auto mt-7" />
          </Revelar>

          <Revelar atraso={140}>
            <p className="t-italico-g mx-auto mt-9 max-w-[26ch] text-preto">
              <Convite nome={nome} />
            </p>
            <p className="mx-auto mt-7 max-w-md text-preto/70">
              É só responder na nossa conversa, e a gente combina o melhor
              horário para você vir provar com calma.
            </p>
          </Revelar>

          <Endereco />
        </div>
      </section>

    </>
  )
}

/**
 * A pergunta do fecho, com o nome dela quando o link trouxer `?nome=`.
 *
 * A capa já abre com o nome; fechar com ele de novo é o que faz a página
 * inteira parecer escrita para uma pessoa, e não enviada para uma lista.
 */
function Convite({ nome }: { nome: string }) {
  const pergunta = 'quando seria o melhor dia para você vir conhecer o nosso trabalho pessoalmente?'
  return <>{nome ? `${nome}, ${pergunta}` : pergunta.charAt(0).toUpperCase() + pergunta.slice(1)}</>
}

/**
 * Onde fica o ateliê. Some inteiro enquanto não estiver preenchido.
 *
 * Lê de data/google.ts, que já é o lugar onde o endereço e os horários do
 * Perfil da Empresa esperam para ser copiados. Um lugar só: endereço digitado
 * em dois arquivos acaba diferente nos dois.
 *
 * Convite para visitar sem dizer onde é convite pela metade, então este bloco
 * é o próximo dado a pedir para a Danielli. ATENÇÃO: o endereço que aparece no
 * histórico do git (R. Santa Catarina, Timóteo) é do Simone Sá Atelier, o
 * projeto de onde este repositório foi copiado. Não é dela.
 */
function Endereco() {
  const { endereco, cidade, estado, horarios } = googleNegocio
  if (!endereco && !cidade) return null

  const local = [cidade, estado].filter(Boolean).join(', ')

  return (
    <Revelar atraso={200}>
      <address className="mt-12 not-italic">
        <span className="eyebrow block">Onde estamos</span>
        <span className="mt-4 block text-sm leading-relaxed text-preto/70">
          {endereco && <span className="block">{endereco}</span>}
          {local && <span className="block">{local}</span>}
        </span>
        {horarios.length > 0 && (
          <span className="mt-4 block text-sm leading-relaxed text-preto/60">
            {horarios.map((h) => (
              <span key={h.dias} className="block">
                {h.dias}: {h.horas}
              </span>
            ))}
          </span>
        )}
      </address>
    </Revelar>
  )
}
