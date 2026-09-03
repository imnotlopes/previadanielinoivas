import { depoimentos, mostrarEspacoReservado, type Depoimento } from '../data/depoimentos'
import { cn } from '../lib/utils'
import Revelar from './Revelar'
import SecaoTitulo from './SecaoTitulo'

/**
 * Depoimentos, foto da noiva ao lado da fala dela.
 *
 * O FORMATO É O ARGUMENTO. Uma frase elogiosa solta é indistinguível de texto
 * inventado, e este projeto já teve depoimento inventado uma vez. Com o rosto
 * ao lado, deixa de ser "alguém disse isso" e passa a ser "esta noiva disse
 * isso", que é a diferença entre enfeite e prova.
 *
 * Por isso não é card em grade: cada depoimento ocupa a largura toda, com a
 * foto grande e a fala em corpo de display. Grade de quatro cartõezinhos
 * transformaria o rosto em miniatura e a fala em legenda.
 *
 * Os lados alternam a cada depoimento. Sem isso, três blocos iguais empilhados
 * viram lista, e lista não se lê.
 */
export default function SecaoDepoimentos() {
  const temConteudo = depoimentos.length > 0

  if (!temConteudo && !mostrarEspacoReservado) return null

  return (
    <section className="border-t border-borda-sutil bg-off-white">
      <div className="container-luxo folha">
        <Revelar>
          <SecaoTitulo
            eyebrow="Quem já vestiu"
            titulo="O que elas contam"
            centralizado
          />
        </Revelar>

        <div className="mt-16 flex flex-col gap-16 md:gap-24">
          {temConteudo
            ? depoimentos.map((depoimento, indice) => (
                <Bloco
                  key={depoimento.id}
                  depoimento={depoimento}
                  invertido={indice % 2 === 1}
                />
              ))
            : <EspacoReservado />}
        </div>
      </div>
    </section>
  )
}

function Bloco({
  depoimento,
  invertido,
}: {
  depoimento: Depoimento
  invertido: boolean
}) {
  return (
    <figure className="grid items-center gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-14">
      <Revelar
        distancia="nenhuma"
        className={cn('overflow-hidden bg-bege', invertido && 'md:order-last')}
      >
        <img
          src={depoimento.foto}
          alt={depoimento.alt}
          loading="lazy"
          decoding="async"
          className="aspect-[3/4] w-full object-cover"
        />
      </Revelar>

      <Revelar como="blockquote" atraso={120}>
        <span className="filete" />

        {/*
          A fala em corpo de display, não em corpo de texto: é a única frase
          da página que veio de uma cliente, e o tamanho é o que diz isso.
        */}
        <p className="mt-7 font-display text-h3 font-light italic leading-snug text-preto">
          “{depoimento.fala}”
        </p>

        <figcaption className="mt-8 font-display text-h6 uppercase tracking-luxo text-preto">
          {depoimento.autora}
          {depoimento.contexto && (
            <span className="mt-1 block normal-case tracking-normal text-cinza">
              {depoimento.contexto}
            </span>
          )}
        </figcaption>
      </Revelar>
    </figure>
  )
}

/**
 * O espaço, desenhado e vazio.
 *
 * Moldura tracejada e texto dizendo o que entra ali: ninguém olha e confunde
 * com depoimento de verdade. Some sozinho no instante em que o primeiro
 * depoimento for cadastrado.
 */
function EspacoReservado() {
  return (
    <figure className="grid items-center gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-14">
      <div className="flex aspect-[3/4] items-center justify-center border border-dashed border-borda bg-branco p-6 text-center">
        <span className="text-sm text-cinza">Foto da noiva</span>
      </div>

      <div className="border border-dashed border-borda bg-branco p-8">
        <span className="filete" />
        <p className="mt-7 font-display text-h3 font-light italic leading-snug text-cinza">
          “Aqui entra a fala dela, do jeito que ela escreveu.”
        </p>
        <p className="mt-8 font-display text-h6 uppercase tracking-luxo text-cinza">
          Nome da noiva
        </p>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-preto/60">
          Espaço reservado. Cada depoimento é a <strong>foto dela</strong> mais a{' '}
          <strong>fala dela</strong>. Print de conversa no WhatsApp serve de
          fonte para o texto, e a foto sai do material dos fotógrafos. Precisa
          de autorização das duas coisas: uma pessoa pode topar a fala e não
          querer o rosto.
        </p>
      </div>
    </figure>
  )
}
