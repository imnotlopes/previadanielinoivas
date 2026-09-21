/**
 * As fotos da seção "Tudo para o seu casamento".
 *
 * ORIGEM: fotos do Perfil da Empresa da Danielli no Google, salvas pelo Edson
 * em setembro de 2026 na pasta "Atelier Danielli Noivas - Google Maps", na
 * raiz do projeto e fora do Git (o `imgi_*.webp` do .gitignore já cobre).
 *
 * O script só recodifica e dá nome. NÃO AMPLIA: as fotos do Google chegam
 * pequenas (de 290 a 677 pixels no lado maior), e esticar uma foto pequena
 * não cria detalhe, só borra. A seção desenha cada uma no máximo no tamanho
 * que ela tem. Ver `.oferece_foto` no CSS.
 *
 * Duas da pasta ficaram de fora por tamanho: o letreiro neon (202x270) e uma
 * tiara (203x193). O letreiro faz falta; em tamanho original ele entra.
 *
 * Os nomes originais passam de 160 caracteres e estouram o limite de caminho
 * do Windows no sharp, por isso o arquivo é lido para um buffer primeiro.
 *
 * Uso: node scripts/oferece.mjs
 */
import { mkdir, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const ORIGEM = path.join(RAIZ, 'Atelier Danielli Noivas - Google Maps')
const DESTINO = path.join(RAIZ, 'public/oferece')

/** Número do `imgi_` no nome original, e o nome que ele ganha. */
const FOTOS = {
  33: 'noiva-no-espelho',
  65: 'tiara-alta',
  77: 'tiaras-e-pulseira',
  /*
    Fora da composição editorial, que usa três. Descomente para gerar de novo:
    39: 'tiara-de-cristais',
    57: 'enfeites-de-cabelo',
    93: 'tiara-delicada',
  */
}

await mkdir(DESTINO, { recursive: true })
const arquivos = await readdir(ORIGEM)

for (const [numero, nome] of Object.entries(FOTOS)) {
  const original = arquivos.find((a) => a.startsWith(`imgi_${numero}_`))
  if (!original) {
    console.warn(`imgi_${numero}: não encontrado em ${ORIGEM}`)
    continue
  }

  const entrada = await readFile(path.join(ORIGEM, original))
  const saida = path.join(DESTINO, `${nome}.webp`)
  const info = await sharp(entrada).rotate().webp({ quality: 86 }).toFile(saida)
  console.log(`${nome}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}
