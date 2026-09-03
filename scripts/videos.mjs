import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

/**
 * PREPARA OS VÍDEOS DA APRESENTAÇÃO.
 * ==================================
 *
 * Lê `videos-originais/` (fora do Git) e escreve em `public/videos/`.
 *
 * POR QUE ISTO EXISTE
 * -------------------
 * Os quatro vídeos chegaram somando 35 MB. Numa apresentação que a Danielli
 * manda por WhatsApp, isso é o mesmo que não ter vídeo nenhum: a noiva está no
 * 4G, e o bloco fica um retângulo preto até desistir.
 *
 * Os três editoriais vinham com trilha de áudio de 317 kbps que nunca vai ser
 * ouvida — vídeo em autoplay só toca mudo, por regra do navegador. Jogar a
 * faixa fora sozinho já corta mais de 1 MB de cada um.
 *
 * O ALVO
 * ------
 * CRF 31 nos editoriais foi calibrado olhando quadro a quadro contra o
 * original: a renda, a pedraria e o brilho do bordado sobrevivem, que é o que
 * esse material tem para vender. Abaixo disso o arquivo cresce sem ninguém
 * ver diferença; acima, o bordado vira mancha.
 *
 * O vídeo do atelier vem em 480x864, metade da resolução dos outros. Nele o
 * CRF é mais conservador porque não há pixel sobrando para perder.
 *
 * O PÔSTER NÃO É ENFEITE
 * ----------------------
 * É o primeiro quadro salvo como WebP, e ele é o que aparece enquanto o vídeo
 * não carregou — e o que aparece PARA SEMPRE para quem pediu
 * `prefers-reduced-motion`. Sem pôster, cada bloco de vídeo é um buraco preto
 * no meio da leitura.
 *
 * Uso:  node scripts/videos.mjs
 */

const ENTRADA = 'videos-originais'
const SAIDA = 'public/videos'

/**
 * O plano de cada vídeo.
 *
 * `posterEm` é o segundo de onde sai o pôster. Escolhido à mão: o primeiro
 * quadro de um vídeo editorial costuma ser o meio de uma transição, e um
 * pôster borrado é pior que nenhum.
 */
const PLANO = [
  { arquivo: 'atelier.mp4', crf: 28, posterEm: 2 },
  { arquivo: 'editorial-1.mp4', crf: 31, posterEm: 8 },
  { arquivo: 'editorial-2.mp4', crf: 31, posterEm: 6 },
  { arquivo: 'editorial-3.mp4', crf: 31, posterEm: 6 },
]

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' })
}

function mb(caminho) {
  return (statSync(caminho).size / 1024 / 1024).toFixed(2)
}

mkdirSync(SAIDA, { recursive: true })

const disponiveis = new Set(readdirSync(ENTRADA))
let antes = 0
let depois = 0

for (const { arquivo, crf, posterEm } of PLANO) {
  if (!disponiveis.has(arquivo)) {
    console.log(`· ${arquivo} não está em ${ENTRADA}/, pulando`)
    continue
  }

  const origem = join(ENTRADA, arquivo)
  const destino = join(SAIDA, arquivo)
  const poster = join(SAIDA, arquivo.replace(/\.mp4$/, '.webp'))

  ffmpeg([
    '-i', origem,
    /* Sem áudio: autoplay só existe mudo, então a faixa é peso puro. */
    '-an',
    '-c:v', 'libx264',
    '-crf', String(crf),
    '-preset', 'slow',
    /* `high` + yuv420p é a combinação que toca em todo lugar, iOS incluído. */
    '-profile:v', 'high',
    '-pix_fmt', 'yuv420p',
    /* Manda o índice para o começo do arquivo: sem isto o navegador precisa
       baixar o vídeo inteiro antes de mostrar o primeiro quadro. */
    '-movflags', '+faststart',
    destino,
  ])

  /* O pôster sai do arquivo JÁ COMPRIMIDO, e não do original: assim ele é
     exatamente o quadro que o vídeo vai mostrar, sem um degrau de nitidez
     visível no instante em que o vídeo começa. */
  const temporario = join(SAIDA, '.poster-temp.png')
  ffmpeg(['-ss', String(posterEm), '-i', destino, '-frames:v', '1', temporario])
  await sharp(temporario).webp({ quality: 78 }).toFile(poster)
  execFileSync('node', ['-e', `require('fs').unlinkSync(${JSON.stringify(temporario)})`])

  antes += statSync(origem).size
  depois += statSync(destino).size + statSync(poster).size

  console.log(
    `✓ ${arquivo}  ${mb(origem)} MB → ${mb(destino)} MB  (+ pôster ${mb(poster)} MB)`,
  )
}

console.log(
  `\n${(antes / 1024 / 1024).toFixed(1)} MB → ${(depois / 1024 / 1024).toFixed(1)} MB`,
)
