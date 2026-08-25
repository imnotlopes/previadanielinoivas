import { Link } from 'react-router-dom'

import BotaoWhatsapp from '../components/BotaoWhatsapp'
import SecaoTitulo from '../components/SecaoTitulo'
import Selos from '../components/Selos'
import Seo from '../components/Seo'
import { perguntas } from '../data/faq'
import { brand } from '../lib/brand'

/**
 * ATENÇÃO — TEXTO DE PRÉVIA
 * -------------------------
 * Esta página inteira descreve como um aluguel de vestido costuma funcionar,
 * não necessariamente como a Danielli trabalha. É a página que a cliente lê
 * antes de decidir se vale a viagem até a loja: cada prazo, valor de caução e
 * regra de devolução precisa ser confirmado antes de publicar.
 */
const ETAPAS = [
  {
    titulo: 'Você chama no WhatsApp',
    texto:
      'Diga a ocasião e a data do evento. A gente responde com os horários livres e já separa alguns modelos dentro do que você descreveu — assim a prova começa com o provador montado, e não com você olhando arara.',
  },
  {
    titulo: 'Vem provar, com hora marcada',
    texto:
      'O atendimento é individual: naquele horário o provador é seu. Não há limite de modelos nem compromisso nenhum de fechar no mesmo dia. Traga quem você quiser junto — mãe, irmã, madrinha.',
  },
  {
    titulo: 'Reserva a data',
    texto:
      'Escolhido o vestido, a data da sua festa fica bloqueada no nome dele: ninguém mais aluga aquele modelo para o mesmo fim de semana. É esse bloqueio que você está garantindo ao reservar.',
  },
  {
    titulo: 'A gente ajusta em você',
    texto:
      'O ajuste está incluído no aluguel. O vestido vai para a costureira depois da prova e fica pronto antes do dia. Se o seu manequim mudar entre a reserva e a festa, avise que refazemos.',
  },
  {
    titulo: 'Retira e usa',
    texto:
      'Você retira nos dias combinados, com o vestido já passado e embalado para transportar sem amassar.',
  },
  {
    titulo: 'Devolve sem lavar',
    texto:
      'Traga como está: a higienização é por nossa conta. Marca de festa é normal e está prevista. O cuidado que pedimos é com rasgo e queimadura, que são o que de fato tira uma peça do acervo.',
  },
]

export default function ComoFunciona() {
  return (
    <>
      <Seo
        titulo="Como funciona o aluguel"
        descricao={`Como alugar um vestido na ${brand.nome}: prova com hora marcada e sem compromisso, reserva da data do evento, ajuste incluso e devolução sem precisar lavar.`}
      />

      {/* Abertura */}
      <section className="secao bg-off-white">
        <div className="container-luxo max-w-3xl text-center">
          <SecaoTitulo
            eyebrow="Passo a passo"
            titulo="Como funciona o aluguel"
            descricao="Do primeiro WhatsApp à devolução, sem letra miúda."
            nivel={1}
            centralizado
          />

          <p className="mt-8 text-preto/75">
            O ideal é procurar a loja com três a seis meses de antecedência. Não é
            regra — dá para resolver em cima da hora, e acontece bastante. Mas
            quanto antes você provar, maior o número de modelos ainda livres para
            a sua data. Em época de formatura e em dezembro o acervo esvazia
            rápido.
          </p>
        </div>
      </section>

      {/* Etapas */}
      <section className="secao bg-branco">
        <div className="container-luxo">
          <ol className="mx-auto max-w-3xl">
            {ETAPAS.map((etapa, indice) => (
              <li
                key={etapa.titulo}
                className="grid gap-x-8 gap-y-3 border-t border-borda py-8 sm:grid-cols-[auto_1fr]"
              >
                {/* Numeral grande sobre branco: 3:1 basta para texto grande. */}
                <span className="font-display text-h2 leading-none text-preto/50">
                  {String(indice + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="text-h4 uppercase tracking-luxo">{etapa.titulo}</h2>
                  <p className="mt-3 leading-relaxed text-preto/75">{etapa.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Selos: as mesmas quatro promessas que aparecem na página do vestido */}
      <section className="secao bg-off-white">
        <div className="container-luxo max-w-3xl">
          <SecaoTitulo eyebrow="O que está incluído" titulo="Sem surpresa depois" centralizado />
          <Selos />
        </div>
      </section>

      {/* Dúvidas — as mesmas do rodapé de todas as páginas, aqui abertas */}
      <section className="secao bg-branco">
        <div className="container-luxo max-w-3xl">
          <SecaoTitulo eyebrow="Ainda em dúvida" titulo="Perguntas frequentes" centralizado />

          <dl className="mt-14">
            {perguntas.map((pergunta) => (
              <div key={pergunta.id} className="border-t border-borda py-8">
                <dt className="text-h5 uppercase tracking-luxo">{pergunta.pergunta}</dt>
                <dd className="mt-3 leading-relaxed text-preto/75">{pergunta.resposta}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-preto text-branco">
        <div className="container-luxo secao flex flex-col items-center text-center">
          <span className="font-display text-h6 uppercase tracking-luxo text-dourado">
            Próximo passo
          </span>

          <h2 className="mt-4 uppercase tracking-luxo text-branco">
            Veja o acervo e escolha o que provar
          </h2>
          <span className="filete-claro mt-6" />

          <p className="mt-6 max-w-md text-branco/70">
            Dá para chegar com dois ou três modelos em mente. A gente separa
            outros parecidos e você decide no espelho.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/catalogo" className="btn-secundario">
              Ver o catálogo
            </Link>
            <BotaoWhatsapp
              variante="contorno-claro"
              mensagem={`Olá! Vim pelo site da ${brand.nome} e gostaria de agendar uma prova.`}
            >
              Agendar prova
            </BotaoWhatsapp>
          </div>
        </div>
      </section>
    </>
  )
}
