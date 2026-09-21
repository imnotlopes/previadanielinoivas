/**
 * Dados do perfil da loja no Google.
 *
 * Nada é inventado, e nada deve voltar a ser: este arquivo alimenta um bloco
 * que diz à noiva o que outras pessoas acharam da loja, e é a última coisa do
 * projeto que pode ser suposição.
 *
 * TRANSCRITO EM 21 DE SETEMBRO DE 2026 do perfil público, a partir do link que
 * o Edson mandou. O endereço que aparece no histórico do git (Timóteo) é de
 * outro ateliê, o Simone Sá, de onde este repositório foi copiado.
 */
export const googleNegocio = {
  nome: 'Atelier Danielli Noivas',

  /** Como consta no Perfil da Empresa. Alimenta o "Onde estamos" do fecho. */
  endereco: 'Av. Damião Junqueira de Souza, 35, Federal',
  cidade: 'São Lourenço',
  estado: 'MG',
  cep: '37470-000',

  /**
   * Nota e total como o Google mostrava no dia da transcrição. Mudam com o
   * tempo: vale conferir de vez em quando e atualizar aqui.
   */
  nota: 4.8,
  totalAvaliacoes: 172,

  /**
   * Link estável do perfil, pelo `cid`, e não pela URL comprida do navegador:
   * aquela carrega posição do mapa, filtros e parâmetros de sessão.
   */
  url: 'https://maps.google.com/?cid=14797901586669727094',

  /**
   * Busca pelo endereço completo, e não pelo nome, para o pin cair no lugar
   * certo mesmo que o perfil mude de nome. Fica vazio enquanto não houver
   * endereço, e nesse caso o mapa não é renderizado.
   */
  get mapaEmbed() {
    const completo = [this.endereco, this.cidade, this.estado, this.cep]
      .filter(Boolean)
      .join(', ')
    return completo
      ? `https://www.google.com/maps?q=${encodeURIComponent(completo)}&output=embed`
      : ''
  },

  /**
   * VAZIO: a tabela de horários não aparece na visualização do Google sem
   * login, só o horário do dia ("Fecha 18:00"). Horário não se deduz de um
   * dia só; está na lista de perguntas para a Danielli. Vazio oculta o bloco.
   */
  horarios: [] as Array<{ dias: string; horas: string }>,
}

export interface AvaliacaoGoogle {
  id: string
  autor: string
  /** Nota de 1 a 5, como consta no Google. */
  nota: number
  /** Texto integral, transcrito do perfil. Não edite o conteúdo alheio. */
  texto: string
  /**
   * Como o Google exibia no dia da transcrição, 21/09/2026: "6 meses atrás".
   *
   * Aparece no cartão, como no da Lennys, porque nome e data juntos são o que
   * faz o cartão ler como do Google. O preço é que data relativa escrita no
   * código envelhece: vale retranscrever de tempos em tempos, junto com a
   * nota e o total.
   */
  quando: string
  /** Selo de Local Guide, quando o autor tiver. */
  localGuide?: boolean
}

/**
 * Avaliações reais, transcritas do perfil público no Google em 21/09/2026.
 *
 * ERA UMA LISTA INVENTADA. Este arquivo já teve 12 avaliações escritas para o
 * site parecer de pé, com nota e total que o Google nunca deu. Foram apagadas
 * quando as peças viraram links mandados a noivas de verdade. O que está
 * abaixo é outra coisa: texto integral de quem avaliou, sem edição, erros de
 * digitação incluídos.
 *
 * POR QUE ESTAS CINCO
 * -------------------
 * Sem login, o Google mostra só 10 das 172. Destas, ficaram as que falam com
 * uma noiva: vestido, véu, ser acolhida, e o pai que "alugou tudo lá", que é
 * o argumento do "tudo para o casamento" dito por um cliente. Ficaram de fora
 * as curtas demais para dizer alguma coisa ("Achei ótimo").
 *
 * Com uma conta do Google aberta dá para ler as 172 e trocar por outras.
 */
export const avaliacoesGoogle: AvaliacaoGoogle[] = [
  {
    id: 'nathalia-terto',
    autor: 'Nathália Terto',
    nota: 5,
    quando: 'um ano atrás',
    texto:
      'Fui muito bem atendida! A Dani juntamente com todas as funcionárias foram extremamente simpáticas, amorosas e compreensivas e tudo, mostrei o vestido que eu queria e fui surpreendida, todos elogiaram meu vestido e véu, tenho só que agradecer, recomendo muito!',
  },
  {
    id: 'debora-silva',
    autor: 'Debora Silva',
    nota: 5,
    quando: 'editado 10 meses atrás',
    texto:
      'Atendimento excelente, muitas dicas sobre tudo que precisei, vestidos para todos os gostos! Fui atendida pela proprietária e de cara ela já acertou o meu vestido dos sonhos, mais lindo do que um dia imaginei! Maravilhosa, super indico!',
  },
  {
    id: 'alcione-paulino',
    autor: 'Alcione Paulino',
    nota: 5,
    quando: '6 meses atrás',
    texto:
      'Atendimento nota 10!!! Precisei de vestido pluszise e ela me ajudou a encontrar um vestido maravilhoso. Me senti muito acolhida.',
  },
  {
    id: 'genice-faria-ribeiro',
    autor: 'Genice Faria ribeiro',
    nota: 5,
    quando: '10 meses atrás',
    texto:
      'Aluguei meu vestido com a Dani e ameiiiii!!!! As meninas são muito atenciosas, atendimento nota 1000 Recomendo ❤️',
  },
  {
    id: 'adalberto-pinotti',
    autor: 'Adalberto Pinotti',
    nota: 5,
    quando: 'editado 11 meses atrás',
    texto:
      'Super indico, a melhor loja da região, alugamos tudo lá, o terno do meu filho foi de primeira locação e a Dani trouxe exatamente o que ele queria. As meninas são ótimas!',
  },
]

/**
 * A inicial do nome, para o avatar.
 *
 * O cartão não usa a foto de perfil real: ela vem de servidor do Google,
 * quebra quando a pessoa troca a dela, e carregaria imagem de terceiro em
 * toda visita. O círculo com a inicial é o mesmo recurso que o próprio Google
 * usa para quem não tem foto.
 */
export function inicialDe(nome: string): string {
  return nome.trim().charAt(0).toLocaleUpperCase('pt-BR')
}
