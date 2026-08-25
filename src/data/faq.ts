export interface Pergunta {
  id: string
  pergunta: string
  resposta: string
}

/**
 * Três perguntas — a FAQ aparece em todas as páginas, então precisa ser curta.
 *
 * ATENÇÃO — RESPOSTAS DE PRÉVIA
 * -----------------------------
 * As respostas abaixo são o que costuma valer numa loja de aluguel de
 * vestidos, escritas aqui para o site poder ser visto de pé. Prazo de reserva,
 * o que entra no valor e a política de devolução PRECISAM ser os da Danielli:
 * é exatamente isso que a cliente vem conferir, e errar aqui vira discussão no
 * balcão depois.
 */
export const perguntas: Pergunta[] = [
  {
    id: 'antecedencia',
    pergunta: 'Com quanto tempo de antecedência devo procurar a loja?',
    resposta:
      'De três a seis meses antes do evento é o ideal. Não é regra: dá para resolver em cima da hora, e acontece bastante. Mas quanto antes você provar, maior o número de modelos ainda livres para a sua data — em época de formatura e em dezembro o acervo esvazia rápido.',
  },
  {
    id: 'ajuste',
    pergunta: 'O ajuste está incluído no aluguel?',
    resposta:
      'Sim. O vestido é ajustado no seu corpo e fica pronto antes do dia do evento, sem custo à parte. Se o seu manequim mudar entre a reserva e a festa, é só avisar que a gente refaz o ajuste.',
  },
  {
    id: 'devolucao',
    pergunta: 'Como funciona a devolução?',
    resposta:
      'Você devolve nos dias combinados na reserva, e a lavagem fica por nossa conta — não precisa lavar nem passar antes de trazer. Mancha de festa é normal e está prevista; só pedimos cuidado com rasgo e queimadura, que são o que de fato tira uma peça do acervo.',
  },
]
