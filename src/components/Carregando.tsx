/**
 * Espera do chunk da rota.
 *
 * Reserva 60svh de altura para o rodapé não saltar quando o conteúdo chega.
 * O filete é o único elemento que pisca, sem spinner, que numa peça de marca
 * parece erro de carregamento.
 */
export default function Carregando() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center" role="status">
      <span className="sr-only">Carregando…</span>
      <span aria-hidden className="filete animate-pulse" />
    </div>
  )
}
