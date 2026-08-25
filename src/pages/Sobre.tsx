import BotaoWhatsapp from '../components/BotaoWhatsapp'
import SecaoTitulo from '../components/SecaoTitulo'
import Seo from '../components/Seo'
import { brand } from '../lib/brand'

const FOTO_PROVADOR = '/atelier/provador.webp'
const FOTO_ACESSORIOS = '/atelier/acessorios.webp'

/**
 * ATENÇÃO — TEXTO DE PRÉVIA
 * -------------------------
 * As quatro etapas abaixo descrevem como um aluguel de vestido costuma
 * funcionar, não necessariamente como a Danielli trabalha. Prazos, número de
 * provas e o que entra ou não no valor precisam ser confirmados com ela antes
 * de publicar — é justamente isso que a cliente vem conferir nesta página.
 */
const PROCESSO = [
  {
    titulo: 'Agendamento',
    texto:
      'Você chama no WhatsApp com a data do evento e a ocasião. A prova é com hora marcada, para que o provador seja seu e de mais ninguém naquele horário.',
  },
  {
    titulo: 'Prova',
    texto:
      'Sem compromisso e sem limite de modelos. A gente separa o que combina com o seu corpo e com o tipo de festa, e você experimenta até aparecer aquele que você não quer mais tirar.',
  },
  {
    titulo: 'Reserva',
    texto:
      'Escolhido o vestido, a data da sua festa fica bloqueada no nome dele. Ninguém mais aluga aquele modelo para o mesmo fim de semana.',
  },
  {
    titulo: 'Ajuste e retirada',
    texto:
      'O vestido é ajustado no seu corpo e fica pronto antes do dia. Você retira já passado e embalado, e devolve depois da festa sem se preocupar com a lavagem.',
  },
]

export default function Sobre() {
  return (
    <>
      <Seo
        titulo="Sobre a loja"
        descricao={`Conheça a ${brand.nome}${
          brand.cidade ? `, em ${brand.cidade}` : ''
        }: acervo de vestidos de noiva, festa e 15 anos para alugar, com prova sem compromisso, hora marcada e ajuste incluso.`}
        imagem={FOTO_PROVADOR}
      />

      {/* Abertura */}
      <section className="secao bg-off-white">
        <div className="container-luxo grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SecaoTitulo eyebrow="Sobre" titulo="A loja" nivel={1} />

            <div className="mt-8 space-y-5 text-preto/75">
              <p>
                A {brand.nome} existe para resolver um problema simples: o
                vestido dos sonhos costuma custar o preço de uma festa inteira, e
                é usado uma única vez. Alugar devolve esse dinheiro para o lugar
                onde ele faz falta e não tira nada da noiva.
              </p>
              <p>
                O acervo é escolhido peça por peça, e renovado a cada coleção que
                chega. Tem princesa com cauda longa, tem sereia bordado, tem o
                minimalista de manga fluida — e tem quem chegue procurando um e
                saia levando o outro, o que acontece quase sempre.
              </p>
              <p>
                Atendemos noivas, madrinhas, formandas e debutantes. O
                atendimento é individual e com hora marcada, porque provar
                vestido com alguém esperando atrás da porta não é provar
                vestido.
              </p>
            </div>
          </div>

          {/* O provador, e não um retrato: é o lugar onde a decisão acontece,
              e é ele que a cliente quer ver antes de marcar a prova. */}
          <figure>
            <div className="overflow-hidden bg-borda-sutil">
              <img
                src={FOTO_PROVADOR}
                alt="Noiva de vestido rendado com cauda longa em frente ao espelho do provador, com o vestido inteiro aparecendo no reflexo."
                width={1365}
                height={1706}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover"
              />
            </div>
            <figcaption className="mt-4 text-sm text-preto/65">
              O provador da loja, onde a prova acontece com hora marcada.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Processo */}
      <section className="secao bg-branco">
        <div className="container-luxo">
          <SecaoTitulo
            eyebrow="Como funciona"
            titulo="Do primeiro contato à festa"
            descricao="O ideal é procurar a loja com três a seis meses de antecedência: quanto antes, maior o acervo livre para a sua data."
            centralizado
          />

          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {PROCESSO.map((etapa, indice) => (
              <li key={etapa.titulo} className="border-t border-borda pt-6">
                {/* Numeral grande sobre branco: 3:1 basta para texto grande. */}
                <span className="font-display text-h2 leading-none text-preto/50">
                  {String(indice + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-h5 uppercase tracking-luxo">{etapa.titulo}</h3>
                <p className="mt-3 text-sm leading-relaxed text-preto/70">{etapa.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Acessórios */}
      <section className="secao bg-off-white">
        <div className="container-luxo grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <figure className="overflow-hidden bg-borda-sutil">
            <img
              src={FOTO_ACESSORIOS}
              alt="Par de sapatos brancos de bico fino ao lado de um par de brincos de pedras, sobre uma mesa de madeira clara."
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </figure>

          <div>
            <SecaoTitulo eyebrow="Além do vestido" titulo="O que vai junto" />

            <div className="mt-8 space-y-5 text-preto/75">
              <p>
                Véu, tiara, sapato e bolero: a loja também tem os acessórios que
                fecham o visual, e eles são provados junto com o vestido. Ver
                tudo montado de uma vez evita a surpresa de descobrir na véspera
                que o véu briga com o penteado.
              </p>
              {/* TODO: confirmar se acessório entra no valor do aluguel ou é
                  cobrado à parte, e trocar a frase abaixo pela regra real. */}
              <p>
                Na prova a gente combina o que entra no aluguel e o que é à
                parte, sem letra miúda. E se você já tem o seu véu de família, ele
                é bem-vindo: dá para montar o conjunto em volta dele.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-preto text-branco">
        <div className="container-luxo secao flex flex-col items-center text-center">
          <span className="font-display text-h6 uppercase tracking-luxo text-dourado">
            Vamos marcar
          </span>

          <h2 className="mt-4 uppercase tracking-luxo text-branco">
            Venha provar sem compromisso
          </h2>
          <span className="filete-claro mt-6" />

          <p className="mt-6 max-w-md text-branco/70">
            Mande uma mensagem com a data do evento e a ocasião. Respondemos com
            os horários livres e já separamos alguns modelos para você ver.
          </p>

          <BotaoWhatsapp
            variante="claro"
            className="mt-10"
            mensagem={`Olá! Vim pelo site da ${brand.nome} e gostaria de agendar uma prova.`}
          >
            Agendar prova
          </BotaoWhatsapp>
        </div>
      </section>
    </>
  )
}
