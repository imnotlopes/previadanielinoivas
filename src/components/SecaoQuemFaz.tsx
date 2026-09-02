import { marcos, mostrarEspacoReservado, retrato, retratoAlt } from '../data/atelier'
import { brand } from '../lib/brand'
import Revelar from './Revelar'

interface SecaoQuemFazProps {
  /**
   * Quantos vestidos de noiva estão publicados agora.
   *
   * Vem calculado do catálogo pela página, e não escrito à mão, porque é o
   * ÚNICO número desta seção que é verdade hoje — e continua sendo verdade
   * sozinho quando a Danielli publicar ou ocultar vestido no painel.
   */
  vestidosNoAcervo: number
}

/**
 * Quem atende — o bloco de autoridade.
 *
 * A noiva não está escolhendo um vestido, está escolhendo a quem entregar o
 * dia do casamento. Uma apresentação de atelier sem rosto e sem número passa
 * a impressão de revenda; com os dois, passa a de casa que responde pelo que
 * faz.
 *
 * O acervo é o número real. O retrato e os marcos ainda são espaço reservado
 * — ver data/atelier.ts, que também traz as perguntas que preenchem isso.
 */
export default function SecaoQuemFaz({ vestidosNoAcervo }: SecaoQuemFazProps) {
  const temRetrato = retrato !== null
  const temMarcos = marcos.length > 0

  /* Nada real e nada reservado: a seção some inteira. */
  if (!temRetrato && !temMarcos && !mostrarEspacoReservado) return null

  return (
    <section className="bg-branco">
      <div className="container-luxo folha">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <Revelar distancia="nenhuma" como="figure">
            {retrato !== null ? (
              <div className="overflow-hidden bg-bege">
                <img
                  src={retrato}
                  alt={retratoAlt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3 border border-dashed border-borda bg-off-white p-8 text-center">
                <span className="font-display text-h5 uppercase tracking-luxo text-cinza">
                  Foto da Danielli
                </span>
                <span className="max-w-[16rem] text-sm leading-relaxed text-preto/55">
                  Ela na loja, entre as araras ou atendendo. Não é foto de
                  vestido — o assunto deste bloco é quem atende.
                </span>
              </div>
            )}
          </Revelar>

          <div>
            <Revelar atraso={80}>
              <span className="eyebrow block">Quem atende</span>
              <h2 className="mt-4 texto-display-sm uppercase tracking-luxo">
                Você é atendida pela Danielli
              </h2>
              <span className="filete mt-7" />
            </Revelar>

            {/*
              TEXTO DE PRÉVIA — confirmar com ela.
              Descreve o que um atelier de aluguel costuma prometer, e não
              necessariamente como esta casa trabalha. A frase sobre atender
              pessoalmente é a que mais precisa de confirmação: se em algum
              dia da semana quem atende é outra pessoa, ela está errada.
            */}
            <Revelar atraso={160}>
              <div className="mt-8 max-w-lg space-y-5 text-preto/75">
                <p>
                  Quem responde no WhatsApp é quem te recebe na loja e quem
                  acompanha o ajuste. Você não é passada de mão em mão até o
                  dia da prova.
                </p>
                <p>
                  O acervo é escolhido peça por peça, e nem tudo que chega
                  entra: vestido que não cai bem em ninguém não fica na arara
                  só para engrossar o catálogo.
                </p>
              </div>
            </Revelar>

            <Revelar atraso={240}>
              <dl className="mt-12 flex flex-wrap gap-x-14 gap-y-8 border-t border-borda pt-8">
                {/* O número real. */}
                <Marco valor={String(vestidosNoAcervo)} rotulo="vestidos de noiva no acervo" />

                {marcos.map((marco) => (
                  <Marco key={marco.rotulo} valor={marco.valor} rotulo={marco.rotulo} />
                ))}

                {!temMarcos && mostrarEspacoReservado && (
                  <div className="border border-dashed border-borda px-5 py-4">
                    <span className="font-display text-h6 uppercase tracking-luxo text-cinza">
                      Espaço reservado
                    </span>
                    <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-preto/55">
                      Aqui entram os anos de atelier e quantas noivas já
                      saíram daqui vestidas. Só números que ela consiga
                      confirmar.
                    </p>
                  </div>
                )}
              </dl>
            </Revelar>

            <Revelar atraso={300}>
              <p className="mt-10 font-display text-h5 font-light italic text-preto/70">
                {brand.assinatura}
              </p>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  )
}

function Marco({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <div>
      <dt className="sr-only">{rotulo}</dt>
      <dd>
        <span className="block font-display text-h1 font-light leading-none text-preto">
          {valor}
        </span>
        <span className="mt-2 block max-w-[11rem] font-display text-h6 uppercase leading-snug tracking-luxo text-cinza">
          {rotulo}
        </span>
      </dd>
    </div>
  )
}
