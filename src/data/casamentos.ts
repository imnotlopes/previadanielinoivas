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

export const casamentos: Casamento[] = [
  {
    id: 'joao-natalia',
    /* TODO: confirmar os nomes e a autorização antes de preencher. */
    casal: '',
    descricao:
      'Sequência do dia do casamento: a noiva se arrumando, o vestido de renda com gola alta sendo fechado pela mãe, o pai na porta do quarto, o véu, a cerimônia na igreja e o brinde na festa.',
    fotos: [
      '/casamentos/joao-natalia-01.webp',
      '/casamentos/joao-natalia-02.webp',
      '/casamentos/joao-natalia-03.webp',
      '/casamentos/joao-natalia-04.webp',
      '/casamentos/joao-natalia-05.webp',
      '/casamentos/joao-natalia-06.webp',
      '/casamentos/joao-natalia-07.webp',
      '/casamentos/joao-natalia-08.webp',
      '/casamentos/joao-natalia-09.webp',
      '/casamentos/joao-natalia-10.webp',
      '/casamentos/joao-natalia-11.webp',
      '/casamentos/joao-natalia-12.webp',
      '/casamentos/joao-natalia-13.webp',
      '/casamentos/joao-natalia-14.webp',
      '/casamentos/joao-natalia-15.webp',
      '/casamentos/joao-natalia-16.webp',
      '/casamentos/joao-natalia-17.webp',
      '/casamentos/joao-natalia-18.webp',
      '/casamentos/joao-natalia-19.webp',
      '/casamentos/joao-natalia-20.webp',
      '/casamentos/joao-natalia-21.webp',
      '/casamentos/joao-natalia-22.webp',
      '/casamentos/joao-natalia-23.webp',
      '/casamentos/joao-natalia-24.webp',
      '/casamentos/joao-natalia-25.webp',
      '/casamentos/joao-natalia-26.webp',
      '/casamentos/joao-natalia-27.webp',
      '/casamentos/joao-natalia-28.webp',
      '/casamentos/joao-natalia-29.webp',
      '/casamentos/joao-natalia-30.webp',
      '/casamentos/joao-natalia-31.webp',
      '/casamentos/joao-natalia-32.webp',
    ],
  },
  {
    id: 'thamiris-rodrigo',
    /* TODO: confirmar os nomes e a autorização antes de preencher. */
    casal: '',
    descricao:
      'Sequência do dia do casamento: os detalhes da manhã, o vestido de renda com decote V pendurado, a noiva se arrumando, o véu sendo preso, os retratos no campo e a cerimônia.',
    fotos: [
      '/casamentos/thamiris-rodrigo-01.webp',
      '/casamentos/thamiris-rodrigo-02.webp',
      '/casamentos/thamiris-rodrigo-03.webp',
      '/casamentos/thamiris-rodrigo-04.webp',
      '/casamentos/thamiris-rodrigo-05.webp',
      '/casamentos/thamiris-rodrigo-06.webp',
      '/casamentos/thamiris-rodrigo-07.webp',
      '/casamentos/thamiris-rodrigo-08.webp',
      '/casamentos/thamiris-rodrigo-09.webp',
      '/casamentos/thamiris-rodrigo-10.webp',
      '/casamentos/thamiris-rodrigo-11.webp',
      '/casamentos/thamiris-rodrigo-12.webp',
      '/casamentos/thamiris-rodrigo-13.webp',
      '/casamentos/thamiris-rodrigo-14.webp',
      '/casamentos/thamiris-rodrigo-15.webp',
      '/casamentos/thamiris-rodrigo-16.webp',
      '/casamentos/thamiris-rodrigo-17.webp',
      '/casamentos/thamiris-rodrigo-18.webp',
      '/casamentos/thamiris-rodrigo-19.webp',
      '/casamentos/thamiris-rodrigo-20.webp',
      '/casamentos/thamiris-rodrigo-21.webp',
      '/casamentos/thamiris-rodrigo-22.webp',
      '/casamentos/thamiris-rodrigo-23.webp',
      '/casamentos/thamiris-rodrigo-24.webp',
      '/casamentos/thamiris-rodrigo-25.webp',
      '/casamentos/thamiris-rodrigo-26.webp',
      '/casamentos/thamiris-rodrigo-27.webp',
      '/casamentos/thamiris-rodrigo-28.webp',
      '/casamentos/thamiris-rodrigo-29.webp',
    ],
  },
]
