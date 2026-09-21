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
 * O QUE NÃO ESTÁ AQUI, DE PROPÓSITO
 * ---------------------------------
 * Primeira locação e exclusividade. Ela explicou como funciona e disse, com
 * todas as letras, "não é isso que você vai escrever lá, eu só tô explicando
 * pra você". Se um dia ela quiser na peça, entra; até lá, é conversa de
 * provador.
 *
 * Preço, também não: "lá não vai ter valor".
 */

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
 * Contado do ponto de vista da noiva ("a sua mãe", "o seu pai"), e não como
 * a lista de públicos da loja. A loja atende madrinha e formanda por conta
 * própria, e isso é assunto da apresentação de trajes femininos; aqui a
 * pergunta é outra: o que mais do casamento DELA dá para resolver no mesmo
 * lugar.
 */
export const PARA_QUEM_ESTA_COM_VOCE = [
  'Vestidos para as madrinhas, a sua mãe e as convidadas.',
  'Ternos para o noivo, o seu pai e os padrinhos, com gravata.',
  'E trajes para as crianças e as damas.',
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
export const EDITORIAL: Record<'espelho' | 'retrato' | 'faixa', FotoOferece> = {
  /** A abertura, e a única com gente: a noiva de costas, sem entregar o vestido. */
  espelho: {
    src: '/oferece/noiva-no-espelho.webp',
    alt: 'Noiva de costas diante do espelho do provador, com vestido de ombros de fora.',
    largura: 406,
    altura: 406,
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
