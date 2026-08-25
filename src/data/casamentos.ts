export interface FotoCasamento {
  src: string
  /** Descreve o vestido, não a cena: é ele que interessa a quem procura. */
  alt: string
  /** Retrato ocupa duas linhas na grade; quadrado ocupa uma. */
  formato: 'retrato' | 'quadrado'
}

export interface Casamento {
  id: string
  /** Nome do casal. Vazio quando não sabemos — não invente. */
  casal: string
  fotos: FotoCasamento[]
}

/**
 * Casamentos de clientes da loja, exibidos na home.
 *
 * Para acrescentar: mapeie as fotos em scripts/importar-instagram.mjs, rode o
 * script e adicione o casal abaixo. Peça autorização aos noivos antes de
 * publicar — são fotos de pessoas identificáveis, no dia do casamento delas.
 *
 * ATENÇÃO — NOMES DE PRÉVIA
 * -------------------------
 * As fotos são reais, tiradas do Instagram da loja, mas os nomes dos casais
 * abaixo foram INVENTADOS para o site poder ser visto de pé. Antes de
 * publicar: confirme quem é cada casal com a Danielli e, principalmente,
 * confirme que cada um autorizou o uso da foto no site. Enquanto não souber o
 * nome, deixe `casal: ''` — o rótulo some sozinho da imagem.
 */
export const casamentos: Casamento[] = [
  {
    id: 'nathalia-e-joao',
    casal: 'Nathália e João',
    fotos: [
      {
        src: '/casamentos/nathalia-e-joao-1.webp',
        alt: 'Noiva em vestido princesa com saia ampla em camadas, inclinada para trás nos braços do noivo, diante da mesa do bolo.',
        formato: 'quadrado',
      },
      {
        src: '/casamentos/nathalia-e-joao-2.webp',
        alt: 'Mesmo casal na decoração de flores brancas; a cauda do vestido se abre no chão.',
        formato: 'quadrado',
      },
    ],
  },
  {
    id: 'camila-e-rodrigo',
    casal: 'Camila e Rodrigo',
    fotos: [
      {
        src: '/casamentos/camila-e-rodrigo-1.webp',
        alt: 'Noivos na escadaria da igreja ao lado de um carro antigo; o vestido tem manga longa em renda e cauda no chão.',
        formato: 'quadrado',
      },
      {
        src: '/casamentos/camila-e-rodrigo-2.webp',
        alt: 'Casal descendo a escadaria da igreja com a cauda do vestido estendida nos degraus.',
        formato: 'retrato',
      },
      {
        src: '/casamentos/camila-e-rodrigo-3.webp',
        alt: 'Noivos no altar de madeira da capela; o vestido rendado abre em saia ampla.',
        formato: 'retrato',
      },
    ],
  },
  {
    id: 'priscila-e-marcos',
    casal: 'Priscila e Marcos',
    fotos: [
      {
        src: '/casamentos/priscila-e-marcos-1.webp',
        alt: 'Noivos sob um arco de flores iluminado; o vestido tem manga longa rendada e saia estruturada.',
        formato: 'retrato',
      },
      {
        src: '/casamentos/priscila-e-marcos-2.webp',
        alt: 'Casal abraçado com o buquê de rosas; detalhe do bordado brilhante do corpo do vestido.',
        formato: 'quadrado',
      },
      {
        src: '/casamentos/priscila-e-marcos-3.webp',
        alt: 'Noivos de mãos dadas na decoração de flores; o vestido de manga longa aparece por inteiro.',
        formato: 'quadrado',
      },
    ],
  },
  {
    id: 'leticia-e-bruno',
    casal: 'Letícia e Bruno',
    fotos: [
      {
        src: '/casamentos/leticia-e-bruno-1.webp',
        alt: 'Noiva de decote V com brilho, andando pelo gramado de mãos dadas com o noivo, com o véu ao vento.',
        formato: 'retrato',
      },
      {
        src: '/casamentos/leticia-e-bruno-2.webp',
        alt: 'Saída dos noivos da igreja em preto e branco, sob os aplausos dos convidados.',
        formato: 'quadrado',
      },
      {
        src: '/casamentos/leticia-e-bruno-3.webp',
        alt: 'Noivos posando na festa; o vestido tem manga transparente e saia lisa em cetim.',
        formato: 'quadrado',
      },
    ],
  },
]

/** Lista plana das fotos, na ordem em que aparecem na home. */
export const fotosCasamentos = casamentos.flatMap((c) =>
  c.fotos.map((foto) => ({ ...foto, casal: c.casal, casamentoId: c.id })),
)
