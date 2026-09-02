import BotaoWhatsapp from '../components/BotaoWhatsapp'
import GradeAcervo from '../components/GradeAcervo'
import Revelar from '../components/Revelar'
import SecaoTitulo from '../components/SecaoTitulo'
import Seo from '../components/Seo'
import { CAMINHOS } from '../entradas/comum'
import { pecasPorCategoria, publicadas, rotulosOcasiao } from '../data/pecas'
import { brand } from '../lib/brand'
import { useLoja } from '../lib/loja'

/**
 * PEÇA 3 — Festa e formatura.
 *
 * APRESENTAÇÃO E CATÁLOGO NO MESMO LINK, e isso é decisão de negócio, não
 * economia de arquivo. A cliente de festa não passa pelo primeiro contato de
 * apresentação como a noiva: ela já chega procurando vestido, muitas vezes com
 * a data em cima. Mandar dois links para quem quer ver vestido agora é atrito
 * à toa.
 *
 * Por que é peça separada da noiva: são dois públicos com sazonalidade
 * diferente — época de formanda não é época de noiva. Dentro de festa, a loja
 * ainda distingue formanda de alto padrão, formatura, madrinha e mãe, e é isso
 * que o filtro de ocasião atende.
 *
 * VOCABULÁRIO: aqui "cliente" vale. A regra do "sempre noiva" é da peça de
 * noiva; formanda, madrinha e mãe não são noivas.
 */
export default function FestaFormatura() {
  const { pecas } = useLoja()
  const acervo = pecasPorCategoria(publicadas(pecas), 'festa')

  return (
    <>
      <Seo
        titulo="Vestidos de festa e formatura"
        descricao="Vestidos de festa e formatura para alugar: formanda, madrinha e mãe. Prova com hora marcada, ajuste incluso e reserva para a data do evento."
        imagem={acervo[0]?.imagens[0]}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Apresentação curta                                                  */}
      {/* ------------------------------------------------------------------ */}
      {/*
        `folha-curta`, e não `folha`.

        Aqui a apresentação é só a antessala do acervo: quem abre este link já
        está procurando vestido, muitas vezes com a data em cima. Uma folha de
        tela cheia atrasaria em uma rolagem inteira o que a pessoa veio ver, e
        na peça de festa isso é atrito, não ritmo.
      */}
      <section className="bg-branco">
        <div className="container-luxo folha-curta max-w-3xl text-center">
          <Revelar>
            <SecaoTitulo
              eyebrow={brand.nome}
              titulo="Vestidos de festas e formatura"
              nivel={1}
              centralizado
            />
          </Revelar>

          <Revelar atraso={110}>
            <p className="mt-8 text-preto/75">
              Acervo para alugar, com prova sem compromisso e ajuste incluído no
              valor. Você reserva a data do evento e leva o vestido pronto, no
              seu corpo — sem gastar o preço de uma festa inteira numa roupa que
              se usa uma vez.
            </p>

            <p className="mt-5 text-preto/75">
              Atendemos formanda, madrinha e mãe. Cada ocasião pede uma coisa
              diferente, e é por isso que dá para filtrar por ela aqui embaixo.
            </p>
          </Revelar>

          <Revelar atraso={200}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <BotaoWhatsapp
                mensagem={`Olá! Vim pelo catálogo de festa da ${brand.nome} e gostaria de agendar uma prova.`}
              >
                Agendar prova
              </BotaoWhatsapp>
              {/* `<a>`, não `<Link>`: a peça de noiva é outra aplicação. */}
              <a href={CAMINHOS.apresentacaoNoiva} className="btn-contorno">
                Vou casar, quero ver noiva
              </a>
            </div>
          </Revelar>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* O acervo                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="secao border-t border-borda-sutil bg-off-white">
        <div className="container-luxo">
          <Revelar>
            <SecaoTitulo eyebrow="Acervo" titulo="Os vestidos" centralizado />
          </Revelar>

          <GradeAcervo
            acervo={acervo}
            base={CAMINHOS.festa}
            comOcasiao
            vazio={
              <>
                <h2 className="text-h4 uppercase tracking-luxo">
                  Nenhum vestido com esses filtros
                </h2>
                <p className="mt-4 text-preto/65">
                  A coleção de festa é renovada a cada temporada. Tire um filtro
                  ou chame no WhatsApp para saber o que entrou —{' '}
                  {Object.values(rotulosOcasiao).join(', ').toLowerCase()}, tem
                  para todas.
                </p>
              </>
            }
          />
        </div>
      </section>
    </>
  )
}
