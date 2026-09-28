import { cn } from '../lib/utils'

interface SecaoTituloProps {
  /** Rótulo pequeno em rosé escuro, acima de tudo. Opcional e raro. */
  eyebrow?: string
  /**
   * A palavra manuscrita da folha, de duas a quatro palavras: "O ateliê",
   * "Os detalhes". Ver `.t-script` em index.css para o porquê de ser curta.
   */
  script?: string
  /** A linha em versal que assina embaixo da manuscrita. */
  titulo: string
  /** Linha de apoio abaixo do filete. */
  descricao?: string
  /**
   * `'celular'` centraliza só abaixo de 1024px. É para o título que mora numa
   * coluna ao lado da foto no desktop e fica sozinho, empilhado, no celular.
   */
  centralizado?: boolean | 'celular'
  /** Use 1 apenas quando este for o título principal da página. */
  nivel?: 1 | 2 | 3
  className?: string
}

/**
 * Título de seção padronizado. Único lugar onde esse ritmo é definido.
 *
 * A MANUSCRITA POR CIMA, O VERSAL POR BAIXO
 * -----------------------------------------
 * É a composição da logo nova: o nome escrito à mão e, embaixo, a frase em
 * versalete pequeno e espaçado. As referências que a Danielli mandou fazem o
 * mesmo em cada página ("Sala da noiva", "Pacote Gold"). Antes o título era um
 * versal grande sozinho, e a página inteira lia como catálogo de loja.
 *
 * As duas linhas moram dentro do MESMO `<h2>`. Para quem lê com leitor de
 * tela o título é um só, "O ateliê, vestindo noivas desde 2004", e não uma
 * palavra solta seguida de um título que parece outro assunto.
 *
 * A DESCRIÇÃO É EM ITÁLICO, E NÃO EM CORPO
 * ----------------------------------------
 * A linha sob o título é onde a Danielli explica em uma frase o que aquele
 * bloco é, então é ali que a voz dela aparece: serifada em itálico, que soa
 * como alguém falando.
 */
export default function SecaoTitulo({
  eyebrow,
  script,
  titulo,
  descricao,
  centralizado = false,
  nivel = 2,
  className,
}: SecaoTituloProps) {
  const Titulo = `h${nivel}` as 'h1' | 'h2' | 'h3'
  const soCelular = centralizado === 'celular'
  const centro = soCelular ? 'mx-auto lg:mx-0' : centralizado ? 'mx-auto' : ''

  return (
    <div
      className={cn(
        centralizado && 'flex flex-col items-center text-center',
        soCelular && 'lg:items-start lg:text-left',
        className,
      )}
    >
      {eyebrow && <span className="eyebrow mb-4 block">{eyebrow}</span>}

      <Titulo className="font-normal">
        {script && <span className="t-script block">{script}</span>}
        <span className={cn('t-versal block', script && 'mt-4')}>{titulo}</span>
      </Titulo>

      <span className={cn('filete mt-6', centro)} />

      {descricao && (
        <p className={cn('t-italico mt-6 max-w-[38ch]', centro)}>
          {descricao}
        </p>
      )}
    </div>
  )
}
