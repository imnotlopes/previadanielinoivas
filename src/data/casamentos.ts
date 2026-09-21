/**
 * OS CASAMENTOS, uma sequência por casal, não um mosaico de fotos soltas.
 * =======================================================================
 *
 * Antes isto era uma lista plana de doze fotos numa grade. Virou uma lista de
 * CASAMENTOS, cada um com dezenas de fotos em ordem cronológica, porque o que
 * a seção precisa mostrar não é "temos fotos bonitas": é que um vestido daqui
 * atravessou o dia inteiro de alguém. Isso só se vê em sequência, a noiva de
 * roupão, a mãe fechando o botão, o pai na porta, a igreja, o brinde.
 *
 * A ORDEM DAS FOTOS É O ROTEIRO. Elas foram escolhidas e ordenadas à mão em
 * `scripts/casamentos.mjs`, e é lá que se mexe: os números da folha de contato
 * são a fonte, este arquivo é o resultado colado.
 *
 * ⚠️ BLOQUEADOR: AUTORIZAÇÃO DOS NOIVOS
 * ======================================
 * São pessoas reais, identificáveis, no dia do casamento delas, e o link é
 * mandado para desconhecidas por WhatsApp. **Cada casal precisa autorizar por
 * escrito antes de isto ir ao ar**, e a autorização é de duas coisas
 * separadas: as fotos e o nome.
 *
 * Enquanto `casal` estiver vazio, a sequência aparece sem nome nenhum, que é
 * o estado seguro. Preencher o nome é dizer publicamente quem são.
 */

export interface Casamento {
  /** Identificador estável, usado como chave e prefixo dos arquivos. */
  id: string
  /**
   * "João Pedro e Natália". Vazio enquanto não houver autorização do NOME,
   * que é separada da autorização das fotos. Ver o bloqueador acima.
   */
  casal: string
  /** Uma linha de contexto: "Igreja Matriz, agosto de 2026". Opcional. */
  contexto?: string
  /**
   * Descrição da sequência inteira, para leitor de tela.
   *
   * É UMA por casamento, e não uma por foto, de propósito: sessenta textos
   * alternativos descrevendo variações da mesma cena não ajudam ninguém a
   * navegar, atrapalham. Quem lê com leitor de tela precisa saber que ali há
   * uma sequência de fotos daquele casamento, e seguir em frente.
   */
  descricao: string
  /** Caminhos a partir de /public, NA ORDEM DA SEQUÊNCIA. */
  fotos: string[]
}

/*
  UM CASAMENTO SÓ, POR ENQUANTO.

  Havia dois aqui. O segundo (`thamiris-rodrigo`) saiu inteiro, arquivos
  inclusive: a cliente autorizou a imagem da Natália, e não a da segunda
  noiva. Foto de pessoa identificável no dia do casamento dela num link que
  circula por WhatsApp não espera autorização, sai primeiro e volta depois.

  Para trazer de volta: a seleção continua em `scripts/casamentos.mjs`,
  comentada, e basta rodar o script de novo quando a autorização escrita
  chegar.
*/
export const casamentos: Casamento[] = [
  {
    id: 'joao-natalia',
    /* TODO: confirmar os nomes e a autorização antes de preencher. */
    casal: '',
    descricao:
      'Momentos do dia do casamento: a noiva se arrumando, as mãos da mãe fechando o vestido, o beijo do pai, o véu, o noivo e o brinde na festa.',
    /*
      23 das 32, na ordem do dia.

      A regra da Danielli vale aqui também: "se eu mostrar muita coisa do
      vestido, tem noiva que vai falar: mas eu já vi aquele vestido". Numa
      cidade pequena isso vale em dobro para foto de casamento de verdade.

      Então ficaram os momentos, e saiu o vestido inteiro. As de
      /casamentos/recortes/ são recortes do gesto (as mãos da mãe, o beijo do
      pai, o abraço), ver scripts/recortes.mjs. Saíram as nove que não se
      salvam com recorte: 08, 19, 21 a 25, 28 e 32, o altar visto de longe,
      o casal de corpo inteiro e a saída de costas com a cauda aberta. Os
      arquivos continuam em public/casamentos/, fora da lista.
    */
    fotos: [
      '/casamentos/joao-natalia-01.webp',
      '/casamentos/joao-natalia-02.webp',
      '/casamentos/joao-natalia-03.webp',
      '/casamentos/joao-natalia-04.webp',
      '/casamentos/joao-natalia-05.webp',
      '/casamentos/joao-natalia-06.webp',
      '/casamentos/recortes/joao-natalia-07.webp',
      '/casamentos/joao-natalia-09.webp',
      '/casamentos/joao-natalia-10.webp',
      '/casamentos/joao-natalia-11.webp',
      '/casamentos/recortes/joao-natalia-12.webp',
      '/casamentos/recortes/joao-natalia-13.webp',
      '/casamentos/recortes/joao-natalia-14.webp',
      '/casamentos/joao-natalia-15.webp',
      '/casamentos/joao-natalia-16.webp',
      '/casamentos/joao-natalia-17.webp',
      '/casamentos/joao-natalia-18.webp',
      '/casamentos/recortes/joao-natalia-20.webp',
      '/casamentos/joao-natalia-26.webp',
      '/casamentos/recortes/joao-natalia-27.webp',
      '/casamentos/joao-natalia-29.webp',
      '/casamentos/joao-natalia-30.webp',
      '/casamentos/recortes/joao-natalia-31.webp',
    ],
  },
]
