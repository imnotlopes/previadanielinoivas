import BotaoWhatsapp from '../components/BotaoWhatsapp'
import CapaCatalogo from '../components/CapaCatalogo'
import GradeAcervo from '../components/GradeAcervo'
import SecaoTitulo from '../components/SecaoTitulo'
import Selos from '../components/Selos'
import Seo from '../components/Seo'
import { CAMINHOS } from '../entradas/comum'
import { pecasPorCategoria, publicadas } from '../data/pecas'
import { brand } from '../lib/brand'
import { useLoja } from '../lib/loja'
import { useSelecao } from '../lib/selecao'

/**
 * PEÇA 2: Catálogo Noiva.
 *
 * É o que a Danielli manda depois que a noiva demonstra interesse. Casca de
 * ferramenta: sem FAQ, sem mapa, sem avaliações embaixo da grade, quem está
 * escolhendo vestido não quer institucional, quer filtrar.
 *
 * SÓ NOIVA. NADA ALÉM DISSO.
 * --------------------------
 * Este catálogo não é uma loja com uma seção de noiva: é um catálogo de
 * noiva. A diferença aparece em decisões que uma vitrine genérica não tomaria, a data que se pergunta é a do CASAMENTO, o próximo passo é a prova e não
 * a compra, e não existe nenhum caminho daqui para festa ou debutante. Quem
 * está escolhendo vestido de casamento não quer ser oferecida outra coisa.
 *
 * Só entra o que está `publicado`. A curadoria é dela: o acervo interno é
 * maior que este catálogo, e o critério é ter foto profissional.
 *
 * VOCABULÁRIO: sempre **noiva**, nunca "cliente".
 */
export default function CatalogoNoiva() {
  const { pecas } = useLoja()
  const { quantidade } = useSelecao()
  const acervo = pecasPorCategoria(publicadas(pecas), 'noiva')

  /*
    A capa é o vestido que TEM história cadastrada, hoje só a Aurora, a peça
    que a filha da Danielli usou. Achar pelo campo, e não pelo slug, é o que
    permite trocar a capa no painel um dia sem mexer em componente.

    Se a Danielli ocultar esse vestido, a capa some sozinha e a página abre
    direto na grade. É o comportamento certo: capa apontando para uma ficha
    que responde "este vestido saiu do acervo" seria pior que capa nenhuma.
  */
  const capa = acervo.find((peca) => peca.hero && peca.historia)

  return (
    <>
      <Seo
        titulo="Vestidos de noiva"
        descricao="Acervo de vestidos de noiva para alugar, com cor e numeração de cada modelo. Prova com hora marcada e ajuste incluso."
        /* A capa do catálogo é também o cartão que aparece no WhatsApp. */
        imagem={capa?.hero?.largo ?? acervo[0]?.imagens[0]}
      />

      {capa && (
        <CapaCatalogo peca={capa} base={CAMINHOS.catalogoNoiva} total={acervo.length} />
      )}

      <section className="secao bg-off-white">
        <div className="container-luxo">
          {/* Sem capa, este vira o título principal da página; com ela, o h1
              já foi usado lá e aqui desce para h2. */}
          {capa ? (
            <SecaoTitulo
              eyebrow="Todo o acervo"
              titulo="Os vestidos"
              descricao="Filtre, busque pelo nome ou marque os que você quer provar."
              centralizado
            />
          ) : (
            <SecaoTitulo
              eyebrow="Acervo de noiva"
              titulo="Escolha os que você quer provar"
              descricao="Marque quantos quiser com o + na foto. No fim, sai uma mensagem só com a sua lista, e a gente separa antes de você chegar."
              nivel={1}
              centralizado
            />
          )}

          <GradeAcervo
            acervo={acervo}
            base={CAMINHOS.catalogoNoiva}
            vazio={
              <>
                <h2 className="text-h4 uppercase tracking-luxo">
                  Nenhum vestido com esses filtros
                </h2>
                <p className="mt-4 text-preto/65">
                  O acervo é renovado com frequência, e nem tudo que chega já
                  está aqui. Tire um filtro ou chame no WhatsApp para saber o
                  que entrou.
                </p>
              </>
            }
          />
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* O fim da grade não pode ser o fim do assunto                        */}
      {/* ------------------------------------------------------------------ */}
      {/*
        Quem rolou 40 vestidos e não marcou nenhum estava saindo sem caminho:
        a grade acabava e embaixo vinha o rodapé. E essa é justamente a noiva
        que mais precisa de resposta, a que não achou o que imaginava.

        O bloco muda conforme ela marcou ou não. Oferecer "não achou o seu?"
        para quem acabou de montar uma lista de cinco seria não estar
        prestando atenção.
      */}
      <section className="border-t border-borda-sutil bg-branco">
        <div className="container-luxo secao max-w-2xl text-center">
          {quantidade > 0 ? (
            <>
              <span className="eyebrow block">Já tem {quantidade} na sua lista</span>
              <h2 className="mt-4 uppercase tracking-luxo">
                Manda que a gente separa
              </h2>
              <span className="filete mx-auto mt-6" />
              <p className="mx-auto mt-6 max-w-md text-preto/70">
                É só apertar o botão aqui embaixo. Se colocar a data do
                casamento junto, a resposta já vem dizendo quais desses estão
                livres para o seu dia.
              </p>
            </>
          ) : (
            <>
              <span className="eyebrow block">Não achou o seu?</span>
              <h2 className="mt-4 uppercase tracking-luxo">
                Conta como você imagina
              </h2>
              <span className="filete mx-auto mt-6" />
              <p className="mx-auto mt-6 max-w-md text-preto/70">
                Nem tudo que chega já está no catálogo, e nem todo vestido cai
                na foto como cai no corpo. Descreve o que você tem na cabeça:
                pode ser que exista aqui, ou que esteja para chegar.
              </p>

              <div className="mt-9 flex justify-center">
                <BotaoWhatsapp
                  mensagem={`Olá! Vi o catálogo de noiva da ${brand.nome} e queria saber se tem algo parecido com o que eu imaginei.`}
                >
                  Contar no WhatsApp
                </BotaoWhatsapp>
              </div>
            </>
          )}

          {/*
            Os selos fecham a página respondendo, sem que ninguém pergunte, as
            dúvidas que fazem a noiva adiar a prova: precisa agendar? o ajuste
            é cobrado à parte? o vestido fica preso na minha data?
          */}
          {/* `text-left`: os selos são ícone + duas linhas de texto, e
              centralizados dentro do bloco centralizado viram uma coluna
              serrilhada, sem margem em que o olho se apoie. */}
          <div className="text-left">
            <Selos />
          </div>
        </div>
      </section>
    </>
  )
}
