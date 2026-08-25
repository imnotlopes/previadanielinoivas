import { useState } from 'react'

import { useLoja, type ConfigLoja } from '../../lib/loja'

/**
 * Contatos da loja.
 *
 * São os quatro campos que aparecem em mais lugares do site: o número que
 * todo botão de WhatsApp usa, o @ do cabeçalho e do rodapé, e a cidade, que
 * entra nos títulos de busca de cada categoria.
 *
 * Como o resto do painel, o que é salvo aqui vale só neste navegador. Para o
 * site publicado, os mesmos valores precisam ir para `src/lib/brand.ts`.
 */
export default function PainelConfiguracoes() {
  const { config, salvarConfig } = useLoja()
  const [form, setForm] = useState<ConfigLoja>(config)
  const [salvo, setSalvo] = useState(false)
  const [erro, setErro] = useState('')

  function enviar(evento: React.FormEvent) {
    evento.preventDefault()
    setSalvo(false)

    /* O wa.me só aceita dígitos com DDI. Guardar o número já limpo evita que
       um parêntese digitado aqui derrube todos os botões do site. */
    const whatsapp = form.whatsapp.replace(/\D/g, '')
    if (whatsapp && whatsapp.length < 12) {
      return setErro(
        'O WhatsApp precisa do país e do DDD: 55 + DDD + número, só dígitos.',
      )
    }

    const instagram = form.instagram.trim().replace(/^@?/, '@')

    setErro('')
    salvarConfig({ ...form, whatsapp, instagram })
    setSalvo(true)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-h3 uppercase tracking-luxo">Configurações</h1>
      <span className="filete mt-5" />

      <form onSubmit={enviar} className="mt-10 flex flex-col gap-6">
        <div>
          <label className="label" htmlFor="whatsapp">WhatsApp</label>
          <input
            id="whatsapp"
            className="input"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="5531988843406"
            inputMode="numeric"
          />
          <p className="mt-2 text-sm text-preto/60">
            País, DDD e número, só dígitos. Enquanto estiver vazio, os botões do
            site levam ao Instagram em vez de a uma conversa quebrada.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="exibicao">WhatsApp como aparece na tela</label>
          <input
            id="exibicao"
            className="input"
            value={form.whatsappExibicao}
            onChange={(e) => setForm({ ...form, whatsappExibicao: e.target.value })}
            placeholder="(31) 98884-3406"
          />
          <p className="mt-2 text-sm text-preto/60">
            Só para leitura humana, no bloco de endereço. Vazio esconde a linha
            do telefone.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="instagram">Instagram</label>
          <input
            id="instagram"
            className="input"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            placeholder="@atelierdaniellinoivas"
          />
        </div>

        <div>
          <label className="label" htmlFor="cidade">Cidade</label>
          <input
            id="cidade"
            className="input"
            value={form.cidade}
            onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            placeholder="Timóteo, MG"
          />
          <p className="mt-2 text-sm text-preto/60">
            No formato "Cidade, UF". É o termo que mais traz cliente na busca —
            "aluguel de vestido de noiva em…".
          </p>
        </div>

        {erro && (
          <p role="alert" className="border-l-2 border-erro bg-branco p-4 text-sm text-preto">
            {erro}
          </p>
        )}

        {salvo && (
          <p role="status" className="border-l-2 border-sucesso bg-branco p-4 text-sm text-preto">
            Salvo neste navegador. Para valer no site publicado, os mesmos
            valores precisam ir para <code>src/lib/brand.ts</code> e um novo
            deploy precisa ser feito.
          </p>
        )}

        <div className="pt-2">
          <button type="submit" className="btn-primario">
            Salvar
          </button>
        </div>
      </form>
    </div>
  )
}
