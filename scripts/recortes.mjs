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
 * ver o resto: o bordado, o véu, as costas.
 *
 * A CAIXA
 * =======
 * `caixa` é [esquerda, topo, largura, altura], em fração da foto original, e
 * foi escolhida olhando cada foto com uma grade de 10% por cima. Fração, e
 * não pixel, para a caixa continuar certa se a foto de origem for trocada
 * por uma versão maior do mesmo arquivo.
 *
 * NÃO AMPLIA. O recorte sai no tamanho que a caixa tem na foto original.
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RAIZ = path.resolve(import.meta.dirname, '..')
const PUBLICO = path.join(RAIZ, 'public')

const RECORTES = [
  /*
    A CAPA. Desde 28 de setembro de 2026 é a filha da Danielli, de olhos
    baixos, com a tiara no coque, o véu e o bordado nos ombros. Pedido do
    Edson, com a foto na mão.

    UMA FOTO SÓ, VERTICAL, PARA AS DUAS TELAS. A capa anterior tinha uma
    versão deitada para o desktop, e esta foto não aceita: o rosto ocupa do
    alto até o meio, e uma faixa deitada ou corta o queixo ou joga o rosto
    no pé da tela, onde a foto se desmancha no papel. No desktop a capa virou
    duas colunas, e a foto fica em pé na da direita. Ver CapaApresentacao.

    A caixa corta 3% da direita: a original é print de celular e tem a sobra
    da barra de rolagem na borda, na altura do queixo. E corta o alto, que é
    parede, para o rosto subir na tela do celular.
  */
  {
    origem: 'pecas/mariana-bordado-manga-longa.webp',
    destino: 'capa/filha.webp',
    caixa: [0, 0.07, 0.97, 0.91],
  },

  /*
    AS FOLHAS DO DESLIZE, TODAS DA FILHA DA DANIELLI.

    Eram cinco noivas diferentes, cada uma numa folha. No áudio de 28 de
    setembro de 2026 a Danielli pediu mais fotos da filha e menos fotos no
    geral: "não posso mostrar muita coisa". Ficaram três folhas, e as três
    são dela, das três fotos que sobram depois da capa.

    Cada folha tem a grande e a de perto (a pequena de moldura branca, em
    4:5). As duas primeiras fotos de origem são print de celular, com a sobra
    da barra de rolagem na borda direita: nenhuma caixa passa de 97% da
    largura.

    NÃO AMPLIA, e as fotos da filha são pequenas (uns 960 de largura). A
    menor de perto fica com uns 350 pixels, o bastante para a moldura
    pequena.
  */
  {
    // De frente: o rosto e o bordado do corpete, até a ponta do buquê.
    origem: 'pecas/mariana-bordado-manga-longa-2.webp',
    destino: 'recortes/filha-bordado.webp',
    caixa: [0.1, 0.06, 0.75, 0.748],
  },
  {
    // As pedras do corpete, de perto.
    origem: 'pecas/mariana-bordado-manga-longa-2.webp',
    destino: 'recortes/filha-bordado-perto.webp',
    caixa: [0.02, 0.5, 0.36, 0.336],
  },
  {
    // De perfil, o coque, o véu caindo e as pedras do ombro.
    origem: 'pecas/mariana-bordado-manga-longa-3.webp',
    destino: 'recortes/filha-veu.webp',
    caixa: [0.12, 0.04, 0.8, 0.8],
  },
  {
    // O véu sobre o bordado do ombro.
    origem: 'pecas/mariana-bordado-manga-longa-3.webp',
    destino: 'recortes/filha-veu-perto.webp',
    caixa: [0.55, 0.45, 0.4, 0.375],
  },
  {
    // De costas: o coque com a tiara, o perfil e as pedras das costas.
    origem: 'pecas/mariana-bordado-manga-longa-4.webp',
    destino: 'recortes/filha-costas.webp',
    caixa: [0.05, 0.08, 0.8, 0.75],
  },
  {
    // As pedras das costas, de perto.
    origem: 'pecas/mariana-bordado-manga-longa-4.webp',
    destino: 'recortes/filha-costas-perto.webp',
    caixa: [0.33, 0.64, 0.38, 0.356],
  },
  {
    // A tiara no coque dela. Vai para "Tudo para o seu casamento", no lugar
    // da noiva de costas no espelho do provador: acessório mostrado nela, e
    // não um vestido inteiro de outra cliente.
    origem: 'pecas/mariana-bordado-manga-longa-3.webp',
    destino: 'oferece/filha-tiara.webp',
    caixa: [0.38, 0.05, 0.36, 0.337],
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
