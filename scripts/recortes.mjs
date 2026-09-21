/**
 * Os recortes de detalhe da apresentação de noivas.
 *
 *   node scripts/recortes.mjs
 *
 * POR QUE RECORTAR
 * ================
 * A Danielli, no áudio de setembro de 2026: "mostrando detalhes, não
 * necessariamente tudo do vestido, porque senão não chama atenção". Cidade
 * pequena, ela atende a região, e a noiva que já viu o vestido inteiro chega
 * dizendo "esse eu já vi".
 *
 * As fotos do acervo são do vestido inteiro, ou quase, porque foram feitas
 * para catálogo. Estes recortes tiram de cada uma o detalhe que faz querer
 * ver o resto: o bordado, a renda da manga, a coroa e o decote, o ombro, o
 * laço das costas.
 *
 * A CAIXA
 * =======
 * `caixa` é [esquerda, topo, largura, altura], em fração da foto original, e
 * foi escolhida olhando cada foto com uma grade de 10% por cima. Fração, e
 * não pixel, para a caixa continuar certa se a foto de origem for trocada
 * por uma versão maior do mesmo arquivo.
 *
 * NÃO AMPLIA. O recorte sai no tamanho que a caixa tem na foto original. Os
 * menores (Rafaela e Antonia) ficam perto de 700 pixels de altura, o bastante
 * para o cartão do deslize, que tem dois terços da altura da tela.
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const PUBLICO = path.join(RAIZ, 'public')

const RECORTES = [
  /*
    A CAPA. Antes era a Aurora sentada com o vestido inteiro aberto, do colo
    à barra, e era a primeira imagem da página. Agora é o close dela de
    costas, com a gola de renda e o buquê: a foto já é um detalhe, e o
    recorte só ajusta a proporção.
  */
  {
    origem: 'pecas/aurora-renda-gola-alta.webp',
    destino: 'capa/aurora-alto.webp',
    caixa: [0, 0.02, 1, 0.94],
  },
  /*
    A capa larga, do desktop: uma faixa com o rosto e a gola. A foto de
    origem tem 1200 de largura, então no desktop a faixa aparece levemente
    ampliada; sob o véu escuro da capa, não se nota.
  */
  {
    origem: 'pecas/aurora-renda-gola-alta.webp',
    destino: 'capa/aurora-largo.webp',
    caixa: [0, 0.14, 1, 0.42],
  },

  /* As cinco do deslize, na ordem em que aparecem. */
  {
    origem: 'pecas/mariana-bordado-manga-longa.webp',
    destino: 'recortes/mariana-bordado.webp',
    caixa: [0.08, 0.14, 0.84, 0.84],
  },
  {
    origem: 'pecas/lorena-manga-longa-em-renda.webp',
    destino: 'recortes/lorena-renda-da-manga.webp',
    caixa: [0.2, 0.12, 0.8, 0.8],
  },
  {
    // A que mais entregava: o vestido quase inteiro, de frente. Fica a coroa,
    // o decote bordado e a mão de quem está vestindo ela.
    origem: 'pecas/rafaela-decote-profundo-bordado.webp',
    destino: 'recortes/rafaela-coroa-e-decote.webp',
    caixa: [0.14, 0.02, 0.6, 0.6],
  },
  {
    origem: 'pecas/helena-ombros-bordados.webp',
    destino: 'recortes/helena-ombro-bordado.webp',
    caixa: [0, 0, 0.94, 1],
  },
  {
    // De costas e de longe na original; o recorte chega no laço.
    origem: 'pecas/antonia-princesa-ombro-a-ombro.webp',
    destino: 'recortes/antonia-laco-nas-costas.webp',
    caixa: [0.25, 0.32, 0.6, 0.45],
  },

  /*
    O MURAL "NO DIA DELAS", o casamento da Natália.

    Das 32 fotos, 16 já eram momento ou detalhe e ficam como estão; 9 eram
    de corpo inteiro sem salvação (o altar visto de longe, o casal inteiro ao
    ar livre, a saída de costas com a cauda aberta) e saíram da lista em
    data/casamentos.ts. Estas 7 mostravam o vestido inteiro em volta de um
    gesto bom, e o recorte fica com o gesto.

    `pequena: 400` gera também a versão de 400px ao lado (`-400.webp`). O
    mural monta o `srcset` de toda foto com essa versão, e o celular carrega
    ela; sem o arquivo, o quadro fica vazio. Foi o que aconteceu na primeira
    rodada destes recortes: sete quadros em branco no mural.

    O mural declara a versão grande como "900w", e estes recortes têm 540 ou
    585. Não faz diferença aqui: são só duas opções no `srcset`, e o mural
    desenha a foto preenchendo o quadro, então o número declarado não muda
    qual arquivo o navegador escolhe nem como ele aparece.
  */
  {
    // As mãos da mãe na manga, fechando o vestido.
    origem: 'casamentos/joao-natalia-07.webp',
    destino: 'casamentos/recortes/joao-natalia-07.webp',
    caixa: [0.4, 0.3, 0.6, 0.6],
    pequena: 400,
  },
  {
    // O beijo do pai na testa.
    origem: 'casamentos/joao-natalia-12.webp',
    destino: 'casamentos/recortes/joao-natalia-12.webp',
    caixa: [0.25, 0.03, 0.6, 0.6],
    pequena: 400,
  },
  {
    // Sentada, do rosto à cintura.
    origem: 'casamentos/joao-natalia-13.webp',
    destino: 'casamentos/recortes/joao-natalia-13.webp',
    caixa: [0.2, 0.05, 0.6, 0.6],
    pequena: 400,
  },
  {
    // Olhando para o colo, as mãos juntas.
    origem: 'casamentos/joao-natalia-14.webp',
    destino: 'casamentos/recortes/joao-natalia-14.webp',
    caixa: [0.05, 0.1, 0.65, 0.65],
    pequena: 400,
  },
  {
    // O olhar para trás, por cima do ombro.
    origem: 'casamentos/joao-natalia-20.webp',
    destino: 'casamentos/recortes/joao-natalia-20.webp',
    caixa: [0.35, 0, 0.65, 0.65],
    pequena: 400,
  },
  {
    // O casal, dos rostos ao buquê.
    origem: 'casamentos/joao-natalia-27.webp',
    destino: 'casamentos/recortes/joao-natalia-27.webp',
    caixa: [0.15, 0, 0.6, 0.6],
    pequena: 400,
  },
  {
    // O abraço, ela rindo.
    origem: 'casamentos/joao-natalia-31.webp',
    destino: 'casamentos/recortes/joao-natalia-31.webp',
    caixa: [0.2, 0.1, 0.6, 0.6],
    pequena: 400,
  },
]

for (const { origem, destino, caixa, pequena } of RECORTES) {
  const entrada = sharp(path.join(PUBLICO, origem))
  const { width, height } = await entrada.metadata()
  const [e, t, l, a] = caixa

  const regiao = {
    left: Math.round(e * width),
    top: Math.round(t * height),
    width: Math.min(Math.round(l * width), width - Math.round(e * width)),
    height: Math.min(Math.round(a * height), height - Math.round(t * height)),
  }

  const saida = path.join(PUBLICO, destino)
  await mkdir(path.dirname(saida), { recursive: true })
  const info = await sharp(path.join(PUBLICO, origem))
    .extract(regiao)
    .webp({ quality: 84 })
    .toFile(saida)

  console.log(`${destino}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)

  if (pequena) {
    const destinoPequena = saida.replace(/\.webp$/, `-${pequena}.webp`)
    const infoPequena = await sharp(saida)
      .resize({ width: pequena, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destinoPequena)
    console.log(`  + -${pequena}  ${infoPequena.width}x${infoPequena.height}`)
  }
}
