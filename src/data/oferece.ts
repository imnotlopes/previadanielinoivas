/**
 * TUDO PARA O CASAMENTO DELA.
 * ===========================
 *
 * O conteúdo desta seção é da Danielli, no áudio de setembro de 2026, quando
 * ela explicou o que o ateliê trabalha: "a gente tem tudo pro casamento da
 * pessoa, terno pro pai, pro noivo, pros padrinhos, crianças, tem as damas,
 * convidadas", e "tudo que a noiva vai precisar pro casamento, o
 * porta-aliança, a tiara, o véu, o acessório do cabelo, tudo ela vai ter aqui
 * dentro do nosso ateliê". Clutch, sapato e gravata vêm da mesma fala.
 *
 * PRIMEIRA LOCAÇÃO, E COMO ESCREVER
 * ---------------------------------
 * No primeiro áudio ela disse que isso não era para escrever. No de 28 de
 * setembro de 2026 liberou, com a redação dela: vestidos de primeira locação,
 * com ou sem exclusividade. E avisou do cuidado que vale para a página
 * inteira: o vestido só é exclusivo da noiva quando ela paga a primeira
 * locação, e nenhuma frase pode dar a entender outra coisa. A linha mora na
 * abertura dos modelos, ver SecaoModelos.
 *
 * Preço, não: "lá não vai ter valor".
 */

/**
 * A linha da primeira locação, na redação da própria Danielli (ver o bloco
 * acima). Aparece na abertura dos modelos, debaixo da frase que diz que o
 * vestido inteiro só se vê no provador: é a resposta honesta à pergunta que
 * aquela frase levanta, se o vestido pode ser só dela, e como.
 */
export const PRIMEIRA_LOCACAO =
  'Trabalhamos com vestidos de primeira locação, com ou sem exclusividade.'

/** O que a noiva encontra para ela mesma. A ordem é a de quem se veste. */
export const PARA_VOCE = [
  'o vestido',
  'o véu',
  'a tiara',
  'o enfeite do cabelo',
  'o sapato',
  'a clutch',
  'o porta-aliança',
] as const

/**
 * Quem mais do casamento dela se veste aqui.
 *
 * SEM "SEU PAI" E "SUA MÃE". A primeira versão contava do ponto de vista da
 * noiva ("o seu pai", "a sua mãe"), e a Danielli corrigiu no áudio de 28 de
 * setembro de 2026: é terno para pais e padrinhos, e não para o pai dela. O
 * ateliê veste os papéis do casamento, e o possessivo prometia uma coisa
 * pessoal que a frase não precisa prometer.
 *
 * DAMAS E PAJENS, E NÃO "CRIANÇAS". Palavra dela: "eu não tenho roupa pra
 * criança que não é dama e pajem". Escrever "crianças" promete um infantil
 * que o ateliê não tem.
 */
export const PARA_QUEM_ESTA_COM_VOCE = [
  'Vestidos para madrinhas, mães e convidadas.',
  'Ternos para noivos, pais, padrinhos e convidados.',
  'E trajes para damas e pajens.',
] as const

export interface FotoOferece {
  src: string
  alt: string
  /** Tamanho real do arquivo. A seção nunca desenha a foto maior que isto. */
  largura: number
  altura: number
}

/**
 * AS TRÊS FOTOS DA COMPOSIÇÃO, CADA UMA COM O SEU PAPEL.
 *
 * Eram seis, num mosaico de colunas, e o mosaico lia como mural de produto:
 * seis fotos pequenas do mesmo assunto, todas com o mesmo peso. Virou uma
 * composição editorial de três, em escalas diferentes, e o papel de cada uma
 * está no nome do campo porque a composição depende dele (ver SecaoOferece).
 *
 * São as três maiores do lote, e não por acaso: a seção nunca amplia uma
 * foto, e a composição precisa de uma delas grande.
 *
 * Ficaram de fora a tiara de cristais, a tiara delicada e os enfeites de
 * cabelo: repetiam o assunto da tiara alta em tamanho menor. Também saíram
 * do public/; scripts/oferece.mjs regenera se um dia voltarem.
 *
 * Todas vêm do Perfil da Empresa no Google. Quase só há tiara e enfeite ali,
 * por isso o que o ateliê oferece é contado em texto, e as fotos dão o tom.
 */
export const EDITORIAL: Record<'nela' | 'retrato' | 'faixa', FotoOferece> = {
  /**
   * A única com gente: a tiara no coque da filha da Danielli, de perto.
   *
   * Era uma noiva de costas no espelho do provador, com o vestido inteiro de
   * longe. Saiu no áudio de 28 de setembro de 2026, quando a Danielli pediu
   * menos fotos de cliente e mais da filha. Sai de scripts/recortes.mjs.
   */
  nela: {
    src: '/oferece/filha-tiara.webp',
    alt: 'Tiara de cristais presa no coque de uma noiva, com o véu.',
    largura: 347,
    altura: 433,
  },
  /** O contraponto em retrato, que desce e se sobrepõe à borda da primeira. */
  retrato: {
    src: '/oferece/tiara-alta.webp',
    alt: 'Tiara alta de cristais, com o cartão do ateliê.',
    largura: 508,
    altura: 677,
  },
  /** A panorâmica que fecha a composição, com a legenda ao lado. */
  faixa: {
    src: '/oferece/tiaras-e-pulseira.webp',
    alt: 'Três tiaras de cristais e uma pulseira, lado a lado.',
    largura: 705,
    altura: 290,
  },
}
