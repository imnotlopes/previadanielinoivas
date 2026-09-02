import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Onde a página abre a cada navegação.
 *
 * VOLTAR PRECISA VOLTAR PARA ONDE ESTAVA
 * --------------------------------------
 * O comportamento anterior era simples demais: topo a cada troca de rota,
 * inclusive no botão voltar. Num catálogo de 40 vestidos isso custa caro — a
 * noiva rola até o vigésimo oitavo, abre a ficha, volta, e cai no primeiro.
 * Com a Danielli atendendo de pé, é ela quem tem de refazer a rolagem na
 * frente da cliente.
 *
 * Então: navegação nova abre no topo; **voltar e avançar restauram a posição
 * guardada**. É o que o navegador faria sozinho num site de páginas de
 * verdade, e que uma aplicação de página única precisa reimplementar.
 *
 * A altura da lista é estável mesmo com as fotos ainda carregando, porque
 * todo card reserva o espaço em `aspect-[3/4]`. Sem isso a restauração cairia
 * curta e a página pularia quando as imagens chegassem.
 */

/**
 * Posição por entrada do histórico.
 *
 * Fora do componente de propósito: precisa sobreviver à desmontagem, que é
 * exatamente o que acontece quando se sai do catálogo para a ficha.
 * `location.key` é estável por entrada — o React Router devolve a mesma chave
 * ao voltar para ela.
 */
const posicoes = new Map<string, number>()

export default function ScrollToTop() {
  const { pathname, key } = useLocation()
  const tipo = useNavigationType()

  /* Qual caminho estava na tela antes. Ver o early return abaixo. */
  const anterior = useRef<string | null>(null)

  /* Anota a posição desta entrada enquanto ela está na tela. */
  useEffect(() => {
    function guardar() {
      posicoes.set(key, window.scrollY)
    }
    window.addEventListener('scroll', guardar, { passive: true })
    return () => {
      /* Uma última anotação na saída: o `scroll` não dispara quando a
         navegação parte de um clique sem rolagem nenhuma. */
      guardar()
      window.removeEventListener('scroll', guardar)
    }
  }, [key])

  useEffect(() => {
    /*
      Só o caminho conta. Trocar filtro ou digitar na busca também cria
      entrada no histórico, e sem esta guarda a página saltaria para o topo a
      cada letra digitada — com o campo de busca fixo no topo, o texto ficaria
      parado e a lista pulando embaixo dele.
    */
    if (anterior.current === pathname) return
    anterior.current = pathname

    if (tipo === 'POP') {
      const guardada = posicoes.get(key)
      if (guardada !== undefined) {
        /* Um quadro de folga para o layout assentar antes de posicionar. */
        requestAnimationFrame(() => window.scrollTo({ top: guardada, behavior: 'instant' }))
        return
      }
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, key, tipo])

  return null
}
