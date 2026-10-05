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
  totalAvaliacoes: 174,

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
 * Avaliações reais, transcritas do perfil público no Google em 5/10/2026.
 *
 * ERA UMA LISTA INVENTADA. Este arquivo já teve 12 avaliações escritas para o
 * site parecer de pé, com nota e total que o Google nunca deu. Foram apagadas
 * quando as peças viraram links mandados a noivas de verdade. O que está
 * abaixo é outra coisa: texto integral de quem avaliou, sem edição, erros de
 * digitação incluídos. Todas com 5 estrelas, conferidas no perfil.
 *
 * POR QUE ESTAS OITO
 * ------------------
 * Pedido da Danielli no áudio de 5 de outubro de 2026: pessoas diferentes, de
 * tempos diferentes ("de dois anos atrás, de um ano atrás, uma recente"), e
 * avaliação de mãe. Ficaram uma de seis dias, uma de um mês, e daí até três
 * anos atrás; quatro noivas, duas mães, um pai e quem diz que "vale muito a
 * pena ir conhecer", que é o convite da página dito por uma cliente.
 *
 * A ordem alterna tempo e voz, para a faixa não passar três noivas de
 * seguida nem só avaliação recente.
 *
 * QUEM NÃO PODE ENTRAR: FAMÍLIA. O Leandro Pinotti é genro da Danielli, e a
 * avaliação do Adalberto Pinotti (que estava aqui, sobre o terno "do meu
 * filho") é da mesma família. Saíram as duas a pedido dela: elogio de
 * parente desmonta a prova social no dia em que alguém descobrir.
 *
 * Com o painel de avaliações aberto no Google dá para ler as 174 e trocar.
 */
export const avaliacoesGoogle: AvaliacaoGoogle[] = [
  {
    id: 'daniela-batista',
    autor: 'Daniela Batista',
    nota: 5,
    quando: '6 dias atrás',
    texto:
      'Tive a oportunidade de voltar ao Atelier Danielli Noivas depois de um ano, e foi muito especial reviver esse momento. O atendimento continua surreal, sempre com muito carinho, atenção e cuidado. Me sinto sempre muito acolhida e bem recebida por vocês! Sou muito grata por todo carinho e por terem feito parte de um momento tão importante da minha vida. 🤍✨',
  },
  {
    id: 'lucas-henrique-miranda-azevedo',
    autor: 'Lucas Henrique Miranda Azevedo',
    nota: 5,
    quando: '2 anos atrás',
    texto:
      'Equipe muito bem capacitada, reflexo dos donos que são um amor de pessoa. Minha filha ficou uma verdadeira princesa. Local muito agradável e atendimento impecável.',
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
    id: 'luziabnmateus',
    autor: 'luziabnmateus',
    nota: 5,
    quando: 'um mês atrás',
    texto:
      'Amei a experiência que tive no atelier, mandei fazer um vestido com uma costureira e qdo ficou pronto não gostei, fui na Dani e ela arrumou um maravilhoso para a renovação de votos da minha filha. Super recomendo 😍',
  },
  {
    id: 'janaina-mira',
    autor: 'Janaina Mira',
    nota: 5,
    quando: '3 anos atrás',
    texto:
      'Incrível, equipe acolhedora ,da dicas maravilhosas, trabalho deles vem com amor e carinho , vc sai de lá realizada nas roupas e com a recepção das meninas , o carinho respeito e amor delas completa seu sonho de um dia lindo ,vale muito a pena ir conhecer .',
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
    id: 'nathalia-terto',
    autor: 'Nathália Terto',
    nota: 5,
    quando: 'um ano atrás',
    texto:
      'Fui muito bem atendida! A Dani juntamente com todas as funcionárias foram extremamente simpáticas, amorosas e compreensivas e tudo, mostrei o vestido que eu queria e fui surpreendida, todos elogiaram meu vestido e véu, tenho só que agradecer, recomendo muito!',
  },
  {
    id: 'ivanete-mendes-pinto',
    autor: 'Ivanete Mendes Pinto',
    nota: 5,
    quando: 'um ano atrás',
    texto: 'Minha filha vai arrasar com o vestido que ela escolheu. Atendimento nota 10',
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
