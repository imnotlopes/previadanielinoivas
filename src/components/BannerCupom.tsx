import { X } from 'lucide-react'

import { descontoLegivel } from '../data/cupons'
import { useLoja } from '../lib/loja'

/**
 * Faixa do cupom ativo, acima do cabeçalho.
 *
 * Fica no topo do fluxo e NÃO é fixa: faixa grudada come altura de tela no
 * celular, que é justamente por onde chega a cliente que veio pelo link da
 * parceira.
 *
 * O botão de remover existe porque cupom que não sai é anúncio. Quem chegou
 * por outro caminho e não quer aquele desconto consegue tirar a faixa.
 */
export default function BannerCupom() {
  const { cupomAtivo, limparCupom } = useLoja()

  if (!cupomAtivo) return null

  return (
    <div className="bg-bege text-preto">
      <div className="container-luxo flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2.5 text-center">
        <p className="text-sm">
          Cupom <strong className="font-semibold">{cupomAtivo.codigo}</strong>
          {cupomAtivo.parceira ? ` de ${cupomAtivo.parceira}` : ''} aplicado:{' '}
          {descontoLegivel(cupomAtivo)} de desconto. Ele vai junto na sua mensagem.
        </p>

        <button
          type="button"
          onClick={limparCupom}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-luxo text-preto/70 underline-offset-4 transition-colors duration-300 ease-suave hover:text-preto hover:underline"
        >
          <X size={13} strokeWidth={1.75} aria-hidden />
          Remover
        </button>
      </div>
    </div>
  )
}
