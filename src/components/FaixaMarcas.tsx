import { Pause, Play } from 'lucide-react'
import { useState, type CSSProperties } from 'react'

import { MARCAS, type Marca } from '../data/autoridade'
import { movimentoReduzido } from '../lib/movimento'
import { cn } from '../lib/utils'

/**
 * A FAIXA DE MARCAS REPRESENTADAS.
 * ================================
 *
 * Os logotipos passando devagar, sem começo nem fim visíveis, esmaecendo nas
 * duas pontas.
 *
 * POR QUE ISTO SUBSTITUIU AS CAIXINHAS DE TEXTO
 * ---------------------------------------------
 * Havia aqui quatro nomes em caixas com borda. Nome em caixa diz que alguém
 * escreveu uma lista. Logotipo diz que existe relação comercial, que é o
 * argumento de verdade: representar marca é o que separa ateliê de loja que
 * compra vestido pronto de fornecedor.
 *
 * E o movimento não é enfeite. Parado, cinco logotipos numa linha leem como
 * rodapé de patrocinador. Em movimento lento, leem como "tem mais de onde
 * vieram esses", que é exatamente a impressão que interessa.
 *
 * COMO O LAÇO FECHA
 * -----------------
 * A lista é renderizada DUAS vezes e o trilho anda até -50%. Nesse ponto a
 * segunda cópia está exatamente onde a primeira começou, e o salto de volta
 * ao zero é invisível.
 *
 * O detalhe que quebra isso é o espaçamento: com `gap` entre os itens, metade
 * do trilho não é uma cópia inteira, é uma cópia menos meio vão, e a faixa dá
 * um tranco a cada volta. Por isso o respiro é `padding` DENTRO de cada item,
 * ver `.faixa-marcas_item` em index.css.
 *
 * PARAR É EXIGÊNCIA, NÃO CORTESIA
 * -------------------------------
 * Conteúdo que se move sozinho por mais de cinco segundos precisa ter como
 * parar (WCAG 2.2.2). Aqui o controle existe e não aparece: some no hover do
 * mouse, surge no foco do teclado, e quem pediu menos movimento no sistema
 * não vê faixa nenhuma, recebe os cinco parados em linha quebrada. O porquê
 * de ele ser invisível está no comentário do botão, mais abaixo.
 */
export default function FaixaMarcas() {
  const [parado, setParado] = useState(false)

  /*
    Quem pediu menos movimento não recebe faixa, recebe os cinco parados.

    E é a saída ANTES do estado importar: não existe animação para pausar, nem
    botão de pausa, porque um botão que oferece parar o que já está parado é
    ruído. A preferência é lida na renderização e não observada, porque quem a
    muda no meio de uma leitura de dois minutos é ninguém.
  */
  if (movimentoReduzido()) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {MARCAS.map((marca) => (
          <li key={marca.nome}>
            <Logotipo marca={marca} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <div className="faixa-marcas">
        <div className={cn('faixa-marcas_trilho', parado && 'esta-parada')}>
          <Fileira />
          {/*
            A segunda cópia é só desenho. Sem `aria-hidden`, quem usa leitor de
            tela ouve as cinco marcas duas vezes seguidas e conclui que são
            dez.
          */}
          <Fileira aria-hidden />
        </div>
      </div>

      {/*
        O CONTROLE EXISTE E NÃO APARECE.

        Havia aqui um botão "Pausar" visível, embaixo da faixa, e ele saiu a
        pedido: numa faixa discreta de logotipos, um controle escrito puxa mais
        atenção que a própria faixa.

        O mecanismo não podia sair junto. Conteúdo que se move sozinho por mais
        de cinco segundos precisa ter como parar (WCAG 2.2.2), e aqui há três
        caminhos, nenhum deles ocupando pixel:

          1. Quem pediu menos movimento no sistema nunca vê a faixa andar. É a
             porta que atende a maior parte de quem precisa disto, e ela já
             estava aberta.
          2. Quem usa o mouse para na hora que passa por cima.
          3. Quem navega por teclado chega aqui com Tab, e AÍ o botão aparece.
             É o mesmo padrão do link de "pular para o conteúdo": invisível na
             leitura normal, presente quando alguém procura.

        O que se perde: um leitor com sensibilidade a movimento, usando toque,
        sem a preferência do sistema ligada, fica sem saída. É uma faixa de
        logotipos discreta e lenta, e a preferência do sistema existe
        exatamente para essa pessoa, mas o buraco é real e fica registrado.
      */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setParado((estava) => !estava)}
          aria-pressed={parado}
          className="sr-only mt-5 focus:not-sr-only focus:inline-flex focus:min-h-11
                     focus:items-center focus:gap-2 focus:px-3 focus:font-display
                     focus:text-h6 focus:uppercase focus:tracking-luxo focus:text-preto"
        >
          {parado ? (
            <Play size={13} strokeWidth={1.75} aria-hidden />
          ) : (
            <Pause size={13} strokeWidth={1.75} aria-hidden />
          )}
          {parado ? 'Retomar o movimento' : 'Pausar o movimento'}
        </button>
      </div>
    </div>
  )
}

function Fileira(props: { 'aria-hidden'?: boolean }) {
  return (
    <ul className="faixa-marcas_fileira" {...props}>
      {MARCAS.map((marca) => (
        <li key={marca.nome} className="faixa-marcas_item">
          <Logotipo marca={marca} />
        </li>
      ))}
    </ul>
  )
}

/**
 * Um logotipo, pintado pelo CSS.
 *
 * O arquivo é MÁSCARA DE ALFA, não imagem: não tem cor nenhuma, só o desenho
 * da tinta. Quem dá cor é `background: currentColor` atravessando a máscara.
 *
 * Isso existe porque os cinco arquivos originais chegaram com fundo branco ou
 * bege opaco, e um deles em laranja. Como máscara, os fundos deixaram de
 * existir e os cinco entram no mesmo tom. De quebra, o dia em que esta faixa
 * for para fundo escuro, muda o `color` do pai e os cinco acompanham.
 *
 * `role="img"` com `aria-label`: é um span, então sem isso ele não teria nome
 * acessível nenhum, e a faixa seria uma lista de cinco itens vazios.
 */
function Logotipo({ marca }: { marca: Marca }) {
  return (
    <span
      role="img"
      aria-label={marca.nome}
      className="faixa-marcas_logo"
      style={
        {
          '--mascara': `url(${marca.logo})`,
          '--largura': `${marca.largura}px`,
          '--proporcao': marca.proporcao,
        } as CSSProperties
      }
    />
  )
}
