import type { Apresentacao } from '../data/apresentacoes'
import BotaoWhatsapp from './BotaoWhatsapp'
import Revelar from './Revelar'

interface CapaApresentacaoProps {
  apresentacao: Apresentacao
  /** Já sanitizado. Vazio mostra a versão neutra. */
  nome: string
}

/**
 * Bloco 1, a abertura.
 *
 * É o que a pessoa vê no primeiro segundo depois de tocar num link dentro de
 * uma conversa. Ela já falou com a Danielli e já sabe o que é o ateliê: o
 * trabalho aqui não é explicar, é fazer ela querer rolar.
 *
 * O NOME MUDA O QUE A PEÇA É
 * --------------------------
 * Com `?nome=Camila`, isto deixa de parecer material encaminhado e passa a
 * parecer material montado para aquela cliente. É a diferença entre um
 * folheto e uma resposta.
 *
 * Sem o parâmetro, a saudação neutra. Nunca um "Olá, {nome}" com o campo
 * vazio no meio, que é o defeito clássico de mala direta.
 *
 * A CAPA É `<picture>`, E PODE NÃO EXISTIR
 * ----------------------------------------
 * Duas fotos, uma por formato de tela: em pé no celular, deitada no
 * computador. A mesma imagem não serve nos dois.
 *
 * E `capa: null` é estado previsto, não erro: a apresentação de noivos não
 * tem uma única foto de traje masculino, e pôr foto de noiva lá seria pior
 * que abrir sem foto.
 */
export default function CapaApresentacao({ apresentacao, nome }: CapaApresentacaoProps) {
  const { capa, saudacao, posicionamento, origem } = apresentacao
  const mensagem = `Oi Danielli! Vi ${origem} e queria conversar.`

  if (!capa) {
    return (
      <section className="border-b border-borda-sutil bg-branco">
        <div className="container-luxo folha-curta">
          <Revelar>
            <span className="eyebrow block">Atelier Danielli Noivas</span>
            <h1 className="mt-4 texto-display-sm uppercase tracking-luxo">
              {nome ? `${nome}, ${saudacao.toLowerCase()}` : saudacao}
            </h1>
            <span className="filete mt-7" />
            <p className="mt-7 max-w-md text-preto/75">{posicionamento}</p>
          </Revelar>

          <Revelar atraso={140}>
            <div className="mt-9">
              <BotaoWhatsapp mensagem={mensagem}>Falar no WhatsApp</BotaoWhatsapp>
            </div>
          </Revelar>
        </div>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-[80svh] items-end overflow-hidden">
      <picture>
        <source media="(min-width: 768px)" srcSet={capa.largo} />
        <img
          src={capa.alto}
          alt={capa.alt}
          /* Primeira imagem da página: é ela que define o tempo até a pessoa
             ver alguma coisa, e essa é a métrica que importa num link aberto
             no meio de uma conversa. */
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-center"
        />
      </picture>

      {/* Véu de baixo para cima: o texto mora no rodapé da capa, então só a
          faixa dele precisa escurecer. Em cima a foto fica limpa. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-preto/85 via-preto/40 to-transparent"
      />

      <div className="container-luxo relative pb-12 pt-28 md:pb-16">
        <Revelar distancia="curta">
          <span className="font-display text-h6 uppercase tracking-luxo-lg text-branco/70">
            Atelier Danielli Noivas
          </span>
          <h1 className="mt-4 texto-display text-branco">
            {nome ? `${nome}, ${saudacao.toLowerCase()}` : saudacao}
          </h1>
          <span className="filete-claro mt-6" />
        </Revelar>

        <Revelar atraso={140}>
          <p className="mt-7 max-w-lg text-branco/85">{posicionamento}</p>

          <div className="mt-9">
            <BotaoWhatsapp variante="claro" mensagem={mensagem}>
              Falar no WhatsApp
            </BotaoWhatsapp>
          </div>
        </Revelar>
      </div>
    </section>
  )
}
