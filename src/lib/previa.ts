/**
 * O LINK DE PRÉVIA.
 *
 * `/noivas?previa` mostra os espaços reservados dos depoimentos, com moldura
 * tracejada, entre as fotos. É o link para a Danielli ver o ritmo da página
 * (foto, depoimento, foto, depoimento) antes de os depoimentos chegarem.
 *
 * O LINK NORMAL NÃO MOSTRA. É ele que vai para as noivas, e este site já
 * mandou texto de exemplo para noiva de verdade uma vez (ver o commit
 * 0f98841). Espaço reservado aparecendo para quem veio conversar sobre o
 * casamento dela diz "a página não está pronta", e nenhuma frase depois
 * conserta isso.
 *
 * Em `npm run dev` os espaços aparecem sempre, como antes.
 *
 * Lido na hora de desenhar, e não guardado: quem abre com `?previa` e
 * navega sem ele deixa de ver, e é esse o comportamento certo.
 */
export function mostrarReservados(): boolean {
  if (import.meta.env.DEV) return true
  try {
    return new URLSearchParams(window.location.search).has('previa')
  } catch {
    return false
  }
}
