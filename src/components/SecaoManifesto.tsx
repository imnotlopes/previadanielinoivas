import { brand } from '../lib/brand'

/**
 * Manifesto da Danielli, em primeira pessoa.
 *
 * Fica logo depois do hero, antes de qualquer vitrine: quem chega lê a voz de
 * quem atende e só então vê os vestidos. É o texto que responde "por que aqui
 * e não em outro lugar", e por isso vem antes do catálogo.
 *
 * Sem foto de propósito: o provador e o atendimento vivem na página Sobre.
 * Aqui o peso é todo da tipografia, com a coluna estreita para a leitura não
 * se perder na largura da tela.
 *
 * Marcado como <blockquote> com <cite>: são palavras de uma pessoa real, não
 * texto institucional.
 *
 * ATENÇÃO — TEXTO DE PRÉVIA
 * -------------------------
 * As frases abaixo foram escritas para o site poder ser visto de pé; elas NÃO
 * são da Danielli. Este é o bloco mais pessoal da página inteira e o que mais
 * pesa na decisão de quem lê — grave o depoimento dela e substitua palavra por
 * palavra antes de publicar.
 */
export default function SecaoManifesto() {
  return (
    <section className="secao bg-branco">
      <div className="container-luxo">
        <blockquote className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="font-display text-h2 font-light uppercase leading-tight tracking-luxo text-preto">
            Nenhuma noiva sai daqui com o primeiro vestido que ela pediu para ver.
          </p>

          <span className="filete mt-10" />

          <div className="mt-10 max-w-xl space-y-5 text-preto/75">
            <p>
              Quase sempre a cliente chega com uma foto salva no celular e sai
              levando outro modelo. Não é que ela mudou de ideia: é que vestido
              bonito na foto e vestido bonito nela são coisas diferentes, e isso
              só o espelho do provador conta.
            </p>
            <p>
              Por isso a prova aqui não tem hora para acabar e não tem
              compromisso nenhum. Você experimenta quantos quiser, com alguém do
              lado dizendo a verdade sobre o caimento, e decide sem pressa.
            </p>
          </div>

          {/* A frase de fechamento é a promessa da marca: ganha peso próprio. */}
          <p className="mt-10 max-w-2xl font-display text-h3 font-light italic leading-snug text-preto">
            {brand.assinatura}. O meu trabalho é achar, no meio do acervo, o
            vestido que já era seu.
          </p>

          <cite className="mt-10 block font-display text-h6 uppercase not-italic tracking-luxo text-cinza">
            {brand.subtitulo} {brand.nome}
          </cite>
        </blockquote>
      </div>
    </section>
  )
}
