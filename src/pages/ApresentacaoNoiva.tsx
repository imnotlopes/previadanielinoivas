import BotaoWhatsapp from '../components/BotaoWhatsapp'
import CardPeca from '../components/CardPeca'
import Faq from '../components/Faq'
import Revelar, { FraseRevelada } from '../components/Revelar'
import SecaoCasamentos from '../components/SecaoCasamentos'
import SecaoDepoimentos from '../components/SecaoDepoimentos'
import SecaoAvaliacoes, { SecaoMapa } from '../components/SecaoGoogle'
import SecaoQuemFaz from '../components/SecaoQuemFaz'
import SecaoTitulo from '../components/SecaoTitulo'
import SecaoVestidosEmMovimento from '../components/SecaoVestidosEmMovimento'
import Selos from '../components/Selos'
import Seo from '../components/Seo'
import { CAMINHOS } from '../entradas/comum'
import { pecasDestaque, publicadas, pecasPorCategoria } from '../data/pecas'
import { brand } from '../lib/brand'
import { useLoja } from '../lib/loja'
import { useParallax } from '../lib/movimento'

const IMAGEM_HERO = '/pecas/aurora-renda-gola-alta.webp'
const FOTO_PROVADOR = '/atelier/provador.webp'

/**
 * A FRASE DA MARCA.
 *
 * Veio da própria Danielli e é o eixo desta página inteira — não é um slogan
 * decorativo que dá para trocar por outro. Ela responde à objeção que trava
 * toda noiva: "já vi um vestido no Instagram, por que eu iria até a loja?".
 *
 * O contexto abaixo dela é o argumento, e também é dela: a noiva chega com um
 * print salvo no celular, mas a escolha só se resolve no corpo, no espelho.
 */
const FRASE_DA_MARCA =
  'A noiva vem pra escolher o vestido, e o vestido acaba escolhendo ela.'

/**
 * ATENÇÃO — TEXTO DE PRÉVIA
 * -------------------------
 * As etapas descrevem como um aluguel costuma funcionar, não necessariamente
 * como a Danielli trabalha. Confirmar antes de mandar para uma noiva.
 */
const PASSOS = [
  {
    titulo: 'Você agenda',
    texto:
      'Manda a data do casamento e a gente combina um horário. O provador é seu naquele horário, sem fila.',
  },
  {
    titulo: 'Prova sem compromisso',
    texto:
      'Quantos modelos você quiser, com alguém do lado dizendo a verdade sobre o caimento.',
  },
  {
    titulo: 'A data fica reservada',
    texto:
      'Escolhido o vestido, ninguém mais aluga aquele modelo para o seu fim de semana.',
  },
  {
    titulo: 'Ajustamos em você',
    texto:
      'O ajuste está incluído. O vestido fica pronto antes do dia, passado e embalado.',
  },
]

/**
 * PEÇA 1 — Apresentação Noiva.
 *
 * É o que a Danielli manda no primeiro "bom dia, vou te mandar nossa
 * apresentação". Enxuta de propósito: quem está do outro lado ainda não pediu
 * para ver vestido, pediu para entender a loja. O catálogo vem depois, quando
 * ela demonstra interesse — e é para lá que aponta o botão do fim.
 *
 * NÃO É UMA PÁGINA QUE ROLA, SÃO FOLHAS
 * -------------------------------------
 * Cada bloco daqui ocupa quase a tela inteira (`.folha`) e o conteúdo chega
 * quando a pessoa alcança ele (`<Revelar>`). Isso é o que separa "site de
 * loja" de "material que ela manda no WhatsApp e a noiva folheia": num site a
 * pessoa varre a página atrás de um link, aqui ela lê um assunto por vez.
 *
 * O ritmo depende de as folhas ALTERNAREM fundo — off-white, branco, preto.
 * Duas folhas claras seguidas se fundem numa só e o efeito se perde.
 *
 * VOCABULÁRIO: aqui é sempre **noiva**, nunca "cliente". Regra da casa, e ela
 * insistiu nisso — "sempre vamos enfatizar que ela é a noiva".
 */
export default function ApresentacaoNoiva() {
  const { pecas } = useLoja()

  /* Só vestido publicado e só de noiva: esta peça não mostra festa. */
  const doAcervo = pecasPorCategoria(publicadas(pecas), 'noiva')
  const amostra = (pecasDestaque(doAcervo).length > 0 ? pecasDestaque(doAcervo) : doAcervo).slice(0, 3)

  const fundoHero = useParallax<HTMLDivElement>(0.1)
  const fotoProvador = useParallax<HTMLDivElement>(0.07)

  return (
    <>
      {/* O título casa com o do index.html de propósito: o robô do WhatsApp lê
          o estático, o Google lê este, e os dois precisam dizer a mesma coisa. */}
      <Seo
        titulo="Vestidos de noiva para alugar"
        descricao="Vestidos de noiva para alugar. Prova com hora marcada e sem compromisso, ajuste incluso e a data do seu casamento reservada."
      />

      {/* ------------------------------------------------------------------ */}
      {/* 1 · Abertura                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative flex min-h-[88svh] items-center overflow-hidden">
        {/*
          A moldura do parallax é separada da imagem: quem recebe o
          deslocamento é o `<img>` (regra `.parallax > img`), que vem 12%
          maior justamente para o movimento não descobrir a borda.
        */}
        <div ref={fundoHero} aria-hidden className="parallax absolute inset-0 overflow-hidden">
          <img
            src={IMAGEM_HERO}
            alt=""
            fetchPriority="high"
            className="size-full object-cover object-center"
          />
        </div>

        {/*
          Véu escuro, calibrado para sustentar o texto branco mesmo com foto
          clara. Reconferir sempre que a imagem de abertura mudar.

          O véu é MAIS FORTE NO CELULAR de propósito. No desktop o texto ocupa
          o terço esquerdo, onde o gradiente já está quase opaco; no celular
          ele atravessa a largura toda e a última palavra cai sobre o rosto da
          noiva, que é a área mais clara da foto.
        */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-preto/85 via-preto/72 to-preto/55
                     md:via-preto/60 md:to-preto/25"
        />

        <div className="container-luxo relative py-24">
          <div className="max-w-xl">
            <Revelar distancia="curta">
              <span className="font-display text-h6 uppercase tracking-luxo-lg text-branco/70">
                {brand.subtitulo} {brand.nome}
              </span>
            </Revelar>

            <Revelar atraso={120}>
              <h1 className="mt-6 texto-display text-branco">
                O seu vestido de noiva está aqui
              </h1>
            </Revelar>

            <Revelar atraso={240}>
              <span className="filete-claro mt-7" />
              <p className="mt-7 max-w-md text-branco/75">
                Acervo para alugar, prova com hora marcada e ajuste incluso.
                Você escolhe no espelho, sem pressa e sem compromisso.
              </p>
            </Revelar>

            <Revelar atraso={340}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                {/* `<a>`, não `<Link>`: o catálogo é outra aplicação, com HTML
                    próprio. Ver o bloco CAMINHOS em entradas/comum. */}
                <a href={CAMINHOS.catalogoNoiva} className="btn-secundario">
                  Ver os vestidos
                </a>
                <BotaoWhatsapp
                  variante="contorno-claro"
                  mensagem={`Olá! Vim pela apresentação da ${brand.nome} e gostaria de agendar uma prova.`}
                >
                  Agendar prova
                </BotaoWhatsapp>
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2 · A frase da marca                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-off-white">
        <div className="container-luxo folha">
          <blockquote className="mx-auto flex max-w-4xl flex-col items-center text-center">
            {/*
              A ÚNICA frase da peça revelada palavra por palavra.

              É o eixo da página e ganha o tratamento mais forte que existe
              aqui. Usar isto numa segunda frase mataria o efeito nas duas:
              vira maneirismo, e maneirismo repetido é o que faz uma
              apresentação parecer template.
            */}
            {/*
              Um degrau ABAIXO do tipo da abertura, e com o espacejamento
              apertado.

              A frase tem doze palavras. No tamanho da abertura ela ocupa seis
              linhas no celular e vira parede; e `tracking-luxo` (0,18em) é
              medida de rótulo pequeno — aplicada a corpo grande, afasta tanto
              as letras que a palavra deixa de ser lida de uma vez.
            */}
            <FraseRevelada
              texto={FRASE_DA_MARCA}
              className="texto-display-sm uppercase tracking-[0.06em]"
            />

            <Revelar atraso={200}>
              <span className="filete mx-auto mt-12" />

              <div className="mx-auto mt-12 max-w-xl space-y-5 text-preto/75">
                <p>
                  Toda noiva chega com um vestido salvo no celular. Um print,
                  uma foto de outra pessoa, uma referência que ela guardou
                  meses.
                </p>
                <p>
                  E quase nunca é esse o vestido que ela leva. Não porque mudou
                  de ideia — é que vestido bonito na foto e vestido bonito nela
                  são coisas diferentes, e isso só o espelho do provador
                  resolve.
                </p>
              </div>

              <cite className="mt-12 block font-display text-h6 uppercase not-italic tracking-luxo text-cinza">
                {brand.subtitulo} {brand.nome}
              </cite>
            </Revelar>
          </blockquote>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3 · Quem atende                                                     */}
      {/* ------------------------------------------------------------------ */}
      <SecaoQuemFaz vestidosNoAcervo={doAcervo.length} />

      {/* ------------------------------------------------------------------ */}
      {/* 4 · Como funciona                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-preto text-branco">
        <div className="container-luxo folha">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div>
              <Revelar>
                <span className="font-display text-h6 uppercase tracking-luxo text-dourado">
                  Como funciona
                </span>
                <h2 className="mt-4 texto-display-sm uppercase tracking-luxo text-branco">
                  Alugar é simples assim
                </h2>
                <span className="filete-claro mt-7" />
                <p className="mt-7 max-w-md text-branco/75">
                  Quanto antes você provar, maior o número de modelos ainda
                  livres para a data do seu casamento.
                </p>
              </Revelar>
            </div>

            <ol className="grid gap-8 sm:grid-cols-2">
              {PASSOS.map((passo, indice) => (
                /* O escalonamento faz a lista ser LIDA em ordem; sem ele os
                   quatro passos chegam juntos e viram um bloco de texto. */
                <Revelar
                  key={passo.titulo}
                  como="li"
                  atraso={100 + indice * 90}
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
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 5 · O provador                                                      */}
      {/* ------------------------------------------------------------------ */}
      {/*
        O que sobrou da antiga página /sobre, reduzido ao que convence: o
        lugar onde a decisão acontece. A rota separada foi aposentada — numa
        peça que a noiva lê de uma vez, mandar ela a outra página é perdê-la.
      */}
      <section className="bg-off-white">
        <div className="container-luxo folha">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Revelar distancia="nenhuma" como="figure">
              <div ref={fotoProvador} className="parallax overflow-hidden bg-bege">
                <img
                  src={FOTO_PROVADOR}
                  alt="Noiva de vestido rendado com cauda longa em frente ao espelho do provador, com o vestido inteiro aparecendo no reflexo."
                  width={1365}
                  height={1706}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </Revelar>

            <div>
              <Revelar atraso={80}>
                <span className="eyebrow block">Onde acontece</span>
                <h2 className="mt-4 texto-display-sm uppercase tracking-luxo">
                  O provador
                </h2>
                <span className="filete mt-7" />
              </Revelar>

              <Revelar atraso={180}>
                <div className="mt-8 max-w-lg space-y-5 text-preto/75">
                  <p>
                    O atendimento é individual e com hora marcada. Naquele
                    horário o provador é seu — provar vestido com alguém
                    esperando atrás da porta não é provar vestido.
                  </p>
                  <p>
                    Traga quem você quiser junto. Mãe, irmã, madrinha: quem vai
                    dizer a verdade sobre o espelho é bem-vinda.
                  </p>
                </div>
              </Revelar>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 6 · O que está incluído                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-branco">
        <div className="container-luxo folha-curta max-w-3xl">
          <Revelar>
            <SecaoTitulo
              eyebrow="Sem surpresa depois"
              titulo="O que está incluído"
              centralizado
            />
          </Revelar>
          <Revelar atraso={120}>
            <Selos />
          </Revelar>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 7 · Os vestidos em movimento                                        */}
      {/* ------------------------------------------------------------------ */}
      {/*
        Vem ANTES da amostra, e isso é ordem de argumento: primeiro o desejo
        (o bordado pegando luz, a cauda andando), depois os vestidos concretos
        com nome, e só então o botão para o catálogo. Invertido, a noiva veria
        três cards, clicaria no botão e nunca chegaria aos vídeos.
      */}
      <SecaoVestidosEmMovimento />

      {/* ------------------------------------------------------------------ */}
      {/* 8 · Uma amostra do acervo                                           */}
      {/* ------------------------------------------------------------------ */}
      {amostra.length > 0 && (
        <section className="bg-off-white">
          <div className="container-luxo folha">
            <Revelar>
              <SecaoTitulo
                eyebrow="Uma amostra"
                titulo="Alguns dos nossos vestidos"
                descricao="O acervo completo, com cor e numeração, está no catálogo."
                centralizado
              />
            </Revelar>

            <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {amostra.map((peca, indice) => (
                <Revelar key={peca.slug} como="li" atraso={indice * 110} distancia="curta">
                  {/* Os cards levam ao catálogo, não a uma ficha: nesta peça a
                      noiva ainda está decidindo se quer ver o acervo. */}
                  <CardPeca peca={peca} base={CAMINHOS.catalogoNoiva} prioridade={indice < 2} />
                </Revelar>
              ))}
            </ul>

            <Revelar atraso={200}>
              <div className="mt-14 flex justify-center">
                <a href={CAMINHOS.catalogoNoiva} className="btn-contorno">
                  Ver os {doAcervo.length} vestidos
                </a>
              </div>
            </Revelar>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 9 · Prova social                                                    */}
      {/* ------------------------------------------------------------------ */}
      {/*
        As três seções abaixo saíram do Layout, onde ficavam grudadas no fim de
        TODA rota, e passaram a ser conteúdo desta peça. A regra antiga
        ("qualquer página precisa fechar sozinha, porque não se controla por
        onde a visita entra") deixou de valer: cada link agora tem destino
        conhecido, e no catálogo esse material era só ruído embaixo da grade.

        Todas somem sozinhas enquanto não houver dado real cadastrado — que é
        o estado de hoje para depoimentos e avaliações.

        E é por SUMIREM que cada uma leva um fio de 1px no topo. Com três
        seções que podem faltar, nenhuma alternância fixa de fundo se sustenta:
        hoje as avaliações estão vazias, e sem o fio os depoimentos encostariam
        direto na FAQ, no mesmo off-white, virando um bloco só. A linha resolve
        em qualquer combinação, inclusive nas que ainda não existem.
      */}
      <SecaoCasamentos />
      <SecaoDepoimentos />
      <SecaoAvaliacoes />
      <Faq />

      {/* ------------------------------------------------------------------ */}
      {/* 10 · O próximo passo                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-preto text-branco">
        <div className="container-luxo folha-curta items-center text-center">
          <Revelar>
            <span className="font-display text-h6 uppercase tracking-luxo text-dourado">
              Próximo passo
            </span>

            <h2 className="mt-4 texto-display-sm uppercase tracking-luxo text-branco">
              Veja os vestidos
            </h2>
            <span className="filete-claro mx-auto mt-7" />

            <p className="mx-auto mt-7 max-w-md text-branco/70">
              O acervo completo, com cor e numeração de cada modelo. Anote os
              que você quer provar e a gente separa antes de você chegar.
            </p>
          </Revelar>

          <Revelar atraso={140}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a href={CAMINHOS.catalogoNoiva} className="btn-secundario">
                Abrir o catálogo
              </a>
              <BotaoWhatsapp
                variante="contorno-claro"
                mensagem={`Olá! Vim pela apresentação da ${brand.nome} e gostaria de agendar uma prova.`}
              >
                Falar no WhatsApp
              </BotaoWhatsapp>
            </div>
          </Revelar>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 11 · Onde fica                                                      */}
      {/* ------------------------------------------------------------------ */}
      {/* Some sozinha enquanto não houver endereço nem telefone cadastrados. */}
      <SecaoMapa />
    </>
  )
}
