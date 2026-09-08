# Danielli Noivas: três apresentações de WhatsApp

O produto **não é um site**. São três apresentações de venda que a Danielli
cola numa conversa de WhatsApp já em andamento, depois que a cliente já a
procurou. Ninguém chega por busca: o link chega pronto pela mão dela.

| Rota | Público |
| --- | --- |
| `/noivas` | Noivas |
| `/madrinhas` | Madrinhas, formandas e mães |
| `/noivos` | Noivos e padrinhos (esqueleto, sem material) |
| `/admin` | Painel, demonstração em `localStorage` |

`/` redireciona para `/noivas`: a home institucional é fase 2 e ainda não
existe. `/catalogo` e `/festa` redirecionam para as apresentações
equivalentes, porque aqueles links circularam em conversas e link colado não
se apaga.

## O que a apresentação faz, e o que ela não faz

Três trabalhos, nesta ordem: **criar desejo, provar autoridade, e devolver a
pessoa para a conversa com a escolha feita**. Não explica o que é um ateliê,
porque quem abriu já sabe.

Oito blocos, meta de dois minutos no polegar. Sem navegação: não há menu, não
há link entre apresentações, e a marca no topo nem é clicável. Cada saída
oferecida é uma chance de sair antes do fim.

**O motor** é a seleção: a cliente marca as peças, e o botão monta uma
mensagem única de WhatsApp com os códigos, a data e o manequim. A primeira
linha carrega a origem ("Vi a apresentação de madrinhas e formandas"), e é
assim que a Danielli sabe de qual link veio cada contato, sem instalar
ferramenta nenhuma.

**Link personalizado:** `/noivas?nome=Camila` troca a saudação. Nome com
qualquer caractere fora de letra, espaço, hífen e apóstrofo é recusado inteiro
e cai na saudação neutra, porque nome estropiado é pior que nome nenhum.

## Regras que o produto não quebra

| Regra | Onde ela vive |
| --- | --- |
| Nenhum valor, nem "sob consulta" | `Peca.preco` existe e é sempre `null`; `Config.mostrarPrecos` é a chave da fase seguinte |
| Nenhuma contagem de peças | não há contador, "carregar mais" nem "40 vestidos" em lugar nenhum |
| A palavra "catálogo" não aparece | nem no texto nem nas URLs |
| Nada de exaustividade | a grade mostra até `PECAS_POR_APRESENTACAO` peças e diz que é amostra |
| `noindex, nofollow` nas três | material de conversa, não conteúdo de busca |
| Nenhuma foto sem autorização | ver o bloqueador abaixo |

## ⚠️ Antes de mandar qualquer link

**Bloqueadores.** Não pode ir ao ar:

| onde | o que falta |
| --- | --- |
| `src/lib/brand.ts` | `whatsapp`. Sem número, todo botão cai no Instagram e a seleção não vira mensagem |
| `src/data/casamentos.ts` | autorização por escrito do casal das fotos, das imagens **e** do nome, que são coisas separadas |

**Pendências.** O produto funciona, e sai mais fraco:

| onde | o que falta |
| --- | --- |
| `src/data/pecas.ts` | `cores` e `tamanhos` de cada peça. Estão vazios em todas: entraram no lugar do preço, e sem eles o card mostra só foto e descrição |
| `src/data/pecas.ts` | `nome` das peças. Os da prévia eram inventados e saíram; até a confirmação, a peça é o código |
| `src/data/depoimentos.ts` | depoimentos reais, com autorização de fala e de imagem separadas |
| `src/data/apresentacoes.ts` | capa própria de `/madrinhas` (hoje é uma foto de peça) e de `/noivos` (hoje é o cartão da marca) |
| `src/lib/brand.ts` | `cidade`, e `endereco` no painel |
| `src/data/selos.ts` | as quatro promessas. Selo é promessa |
| os HTML da raiz | URLs absolutas, se o domínio mudar |

## O que saiu, e por quê

O catálogo tinha busca, filtro por cor, silhueta, decote e manga, ordenação,
paginação, alternância de densidade, contador e 46 rotas de peça. Tudo isso
serve a quem **procura** num acervo grande.

Aqui a pessoa não procura: ela já está conversando com a Danielli e vai rolar
o polegar por dois minutos. A peça abre em **overlay**, e não em página
própria, porque mandá-la para outra rota no meio da apresentação é o jeito
mais rápido de perdê-la, e a seleção que ela estava montando parece sumir.

## Rodar localmente

```bash
npm install
```

```bash
npm run dev
```

| comando | o que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | gera `dist/` para produção |
| `npm run preview` | serve o `dist/` para conferir antes do deploy |
| `npm run lint` | roda o oxlint |

> Ao alterar `tailwind.config.ts`, **reinicie o `npm run dev`**: esse arquivo
> não recarrega a quente.

---

## Por que quatro arquivos HTML

Quando a Danielli cola um link no WhatsApp, aparece um cartão com foto e
título. **Esse cartão é a primeira impressão, antes de qualquer clique.**

O robô que monta o cartão **não executa JavaScript**. Numa aplicação de página
única os três links devolveriam o mesmo `index.html` e portanto o mesmo cartão:
a noiva e a formanda receberiam previews idênticos.

Por isso cada peça é um HTML de verdade: `index.html`, `catalogo.html`,
`festa.html`, `admin.html`, com as próprias tags Open Graph escritas no
arquivo, e a própria imagem de preview (`og-noiva.jpg`, `og-catalogo.jpg`,
`og-festa.jpg`, geradas por `node scripts/og.mjs`).

**O preço disso:** navegar entre peças é `<a href>`, não `<Link>`. O React
Router de uma peça não conhece as rotas da outra, e um `<Link>` entre peças
renderiza a rota de fallback **em silêncio**, sem erro no console. Ver o bloco
`CAMINHOS` em `src/entradas/comum.tsx`.

Duas tabelas precisam andar juntas ao acrescentar uma peça: `PECAS` em
`vite.config.ts` (build e roteamento em desenvolvimento) e os `rewrites` do
`vercel.json` (roteamento em produção).

---

## Adicionar ou editar vestidos

Tudo em **`src/data/pecas.ts`**:

```ts
{
  slug: 'noiva-aurora',            // vira /catalogo/noiva-aurora
  nome: 'Aurora',                  // o nome do VESTIDO, não da cliente
  categoria: 'noiva',              // noiva | festa | debutante
  descricao: 'Renda com gola alta e manga longa',
  cor: 'marfim',                   // alimenta o filtro de cor
  numeracao: ['38', '40'],         // vazio esconde a linha
  precoAluguel: null,              // null = "valor sob consulta"
  ocasiao: 'madrinha',             // só em festa
  video: undefined,                // link do YouTube ou arquivo em /public
  publicado: true,                 // a curadoria. Ver abaixo
  imagens: ['/pecas/aurora-renda-gola-alta.webp'],
  destaque: true,                  // aparece na amostra da apresentação
}
```

**O título é o nome do vestido, não o da cliente.** O mesmo vestido veste
várias noivas ao longo dos anos e não pertence a nenhuma delas. Também protege:
nenhuma cliente aparece identificada sem ter autorizado.

**A descrição é o vestido, não o estilo.** Quem lê está comparando modelos:
diga silhueta e o detalhe que identifica ("Um ombro só, com babado
estruturado"), nunca adjetivo de personalidade. E não chute tecido.

### `publicado`: a curadoria

Nem todo vestido do acervo entra no catálogo que a cliente recebe: a regra da
Danielli é que só entra o que tem foto profissional. O acervo interno pode (e
deve) ser maior que o catálogo publicado.

Quem enxerga o quê:

- **tela de cliente** chama `publicadas()` antes de qualquer outra coisa,
  catálogo, apresentação, ficha, "vistos recentemente" e sitemap;
- **tela de painel** usa a lista crua, porque lá o ponto é ver e mexer no que
  está oculto.

Link direto para um vestido oculto responde "saiu do acervo". Não vaza.

### Preço

Todo o acervo está `null`, e o site mostra "Valor sob consulta". Isso é
decisão, não pendência de código: ninguém informou a tabela da loja, e inventar
valor de aluguel é erro que a cliente só descobre dentro da loja.

A máquina inteira já existe em volta do vazio. Preencher um número acende o
valor no card, na ficha, no cálculo do cupom e a ordenação por preço no
catálogo, que hoje fica escondida.

---

## Celular primeiro

É onde a maioria abre, o link vai colado numa conversa de WhatsApp. O peso da
apresentação saiu de **7,9 MB para 1,9 MB** no celular, sem tirar conteúdo:

| o que | como |
| --- | --- |
| vídeos: 7,4 → 1,9 MB | versão de 540px para tela estreita (`-540.mp4`), e carrossel horizontal no lugar dos três empilhados. Só o primeiro entra na tela, os outros dois só baixam se ela arrastar |
| fotos dos casamentos: 854 → 434 KB | duas larguras (400 e 900) com `srcset` e um `sizes` por tamanho de quadro. Antes, um quadro de 160px recebia a foto de 900 |
| alvos de toque | 44px no marcador "quero provar", no ícone do Instagram do topo e na pausa dos vídeos; 36–40px nos links de texto |
| a pausa dos vídeos | era `opacity-0 group-hover`: **não existia no toque**, e ela é exigência de acessibilidade. Agora é visível no celular e escondida no computador |

O limiar do observador dos vídeos é 0,4 e não 0,25 por causa do carrossel: o
vídeo seguinte fica com 22% à mostra, e um limiar menor disparava o download de
1,2 MB que ninguém pediu.

## Os casamentos

61 fotos de dois casamentos, escolhidas e ordenadas à mão a partir de 337.

```bash
node scripts/casamentos.mjs --folhas   # folhas de contato numeradas
node scripts/casamentos.mjs            # processa a tabela SELECAO
```

A seção virou um **mural de oito quadros**: um relógio só troca UM quadro a
cada 900 ms e passa a vez adiante. Se cada quadro tivesse cronômetro próprio,
mais cedo ou mais tarde cairiam em sincronia e a parede piscaria inteira.
Quadros pares são de um casamento, ímpares do outro.

A ordem dos números em `SELECAO` é a ordem que aparece: preparação, o vestido,
os pais, a igreja, a festa. Mexer lá muda a sequência na tela.

**Ficou de fora:** mesa de doces, bar, decoração e retratos de convidados (o
conjunto "Fornecedores" existe porque o mesmo pacote vai para o buffet e o
decorador), e **qualquer foto com o nome do casal legível**: bastidor
bordado, placa, cardápio. O campo `casal` está vazio esperando autorização do
nome; deixar o nome aparecer dentro da foto publicaria o que aquele campo
vazio está segurando.

⚠️ **Bloqueador:** autorização por escrito de cada casal, das fotos **e** do
nome, que são coisas separadas.

## Vídeos

Quatro verticais (9:16), mudos e em laço. Os originais somavam **33 MB**; o
que é servido soma **7,4 MB**, incluindo os pôsteres.

```bash
node scripts/videos.mjs   # lê videos-originais/ → escreve public/videos/
```

Os originais ficam em `videos-originais/`, **fora do Git**: 33 MB que nunca
são servidos, guardados só para permitir reencodar com outro alvo sem pedir os
arquivos de novo.

O script tira a faixa de áudio (autoplay só existe mudo, então ela era peso
puro), comprime em CRF 31. Calibrado quadro a quadro contra o original, a
pedraria e a renda sobrevivem, e gera um pôster `.webp` de cada um.

**Onde cada um está:**

| arquivo | onde | por quê |
| --- | --- | --- |
| `atelier.mp4` | folha "Quem atende" | panorâmica pelos manequins: prova que existe loja e acervo de verdade. **A Danielli não aparece nele**: o retrato dela continua faltando |
| `editorial-1/2/3.mp4` | folha "De perto, e em movimento" | tríptico sobre preto, entre "O que está incluído" e a amostra do acervo |

**Vertical não vai para a abertura.** 9:16 numa tela larga é cortar dois terços
do quadro ou deixar tarja. Por isso os vídeos moram nos blocos de duas colunas
e no tríptico, onde a coluna já é retrato.

Nada baixa antes de entrar na tela, e o vídeo pausa ao sair. Com
`prefers-reduced-motion` o vídeo nem é montado: fica o pôster.

## Ingestão das fotos

Dois caminhos, os dois com tabela versionada no Git:

**Instagram** (`scripts/importar-instagram.mjs`): a tabela `MAPA` traduz o
número da foto no dump para o caminho que o site usa.

**Fotógrafos** (`scripts/importar-fotografos.mjs`): três passos, e o do meio é
humano:

```bash
node scripts/importar-fotografos.mjs --folhas   # monta folhas de contato numeradas
# escolher os números junto com a Danielli, preencher a tabela SELECAO
node scripts/importar-fotografos.mjs            # processa só o escolhido
```

O passo humano existe porque os fotógrafos entregam a cobertura inteira do
casamento, não um catálogo. No conjunto "Fornecedores - Thamiris e Rodrigo" são
185 fotos e a maioria é maquiagem, sapato do noivo, decoração e mesa de doces,
o pacote vai para todos os fornecedores da festa. Um import cego jogaria
bandeja de frios no catálogo de noiva.

A tabela `SELECAO` já está preenchida com **24 vestidos de noiva** (48 fotos)
tirados do conjunto de vestidos. Ficaram de fora, e é decisão a levar para a
Danielli:

- **20 fotos com marca d'água de outra loja**: VIASPOSA, RAINHA, IDEAL noivas
  e CENTER NOIVAS. São fotos de catálogo dos fornecedores e estão entre as
  melhores do lote, mas a marca de outra loja dentro do catálogo dela derruba
  justamente a autoridade que ele existe para construir. Pedir a versão limpa
  ao fornecedor resolve; fotografar as peças dela resolve melhor.
- **4 prints de tela** e as fotos de noivo, casal e festa, que não são
  material de catálogo de noiva.

O script gira pelo EXIF, corta em **3:4** e converte para WebP com no máximo
1600px. Foto muito fora de 3:4 perderia mais de 25% no corte, nesse caso ela
ganha fundo desfocado nas laterais em vez de ser cortada, para o vestido
aparecer inteiro.

**A pasta `Fotográfos/` está no `.gitignore` e precisa continuar.** São noivas
reais, identificáveis, e o repositório é público. Só o WebP derivado, aprovado
e autorizado entra no Git.

---

## Cupons de parceira

Cada cupom em `src/data/cupons.ts` vira um link:

```
https://previadanielinoivas.vercel.app/?cupom=NOIVA10
```

Quem abre vê uma faixa no topo, guardada no navegador por 30 dias, e o código
entra na mensagem do WhatsApp. **Não há checkout**: o cupom é um recado para a
loja saber por onde a cliente chegou.

O código é revalidado a cada carregamento, cupom vencido ou desativado para de
valer sozinho.

---

## O painel não congela mais o catálogo

A edição do painel é mesclada **campo a campo** sobre o código, e não substitui
a lista inteira. Antes, quem mexesse no painel em março ficava com o catálogo
congelado em março: vestido novo no código não chegava, e campo novo em
vestido antigo também não, foi assim que a capa sumiu num teste, porque a
Aurora salva no painel não tinha o campo `hero`.

Agora o código é a base e a edição dela é a camada de cima. O que ela editou
vence; o que ela nunca tocou continua vindo do código. Vestidos apagados no
painel ficam numa lista `removidos`, senão voltariam da semente a cada
carregamento.

## O painel (`/admin`)

Feito para o **celular**: a Danielli não tem computador. Navegação fixa no
rodapé, cartões em vez de tabela, e o interruptor de publicar em primeiro
plano, é a ação que ela mais vai repetir.

O que ele **ainda não** é:

- **não tem banco.** Grava no `localStorage` de quem está mexendo. Não aparece
  para a cliente, não aparece em outro aparelho, some ao limpar o navegador;
- **não tem autenticação.** A entrada é um botão e `/admin` é endereço público;
- **não envia foto.** O cadastro pede um caminho de arquivo que já exista em
  `public/`.

**Os três buracos são o mesmo trabalho**, e é o próximo passo do projeto: banco
+ storage de imagem + login. A camada `src/lib/loja.ts` é onde isso se costura
as telas não mudam, porque nenhuma delas importa os dados direto.

Enquanto isso, o painel serve para decidir o que vale construir, e avisa isso
na própria tela.

---

## Estrutura

```
index.html · catalogo.html · festa.html · admin.html   as quatro peças
public/                fotos, logo, ícones e as 3 imagens de preview
scripts/
  importar-instagram.mjs   dump do Instagram → public/
  importar-fotografos.mjs  material dos fotógrafos → public/
  og.mjs                   imagens de preview de link
  webp.mjs                 conversão avulsa
  seo.ts                   sitemap, robots e JSON-LD no build
src/
  entradas/            uma por peça + comum.tsx (CAMINHOS, montagem)
  components/          Casca* · TopoMarca · Rodape · GradeAcervo · CardPeca…
  data/                pecas · casamentos · google · depoimentos · cupons ·
                       selos · faq  ← conteúdo
  lib/                 brand.ts · loja.ts (estado) · preco.ts · historico.ts
  pages/               ApresentacaoNoiva · CatalogoNoiva · FestaFormatura ·
                       Peca · admin/
  index.css            design system (tokens + componentes)
```

### As três camadas

| camada | onde | o que faz |
| --- | --- | --- |
| **conteúdo** | `src/data/*.ts` | a semente, versionada no Git |
| **estado** | `src/lib/loja.ts` + `components/LojaProvider.tsx` | semente + edições do painel + cupom da visitante |
| **telas** | `src/pages/`, `src/components/` | leem `useLoja()`, **nunca** importam os dados direto |

A camada do meio é o ponto de costura para um backend: nenhum componente sabe
de onde vem a lista de vestidos.

### Cores

Trios de canais RGB, não hex. É o único formato em que o Tailwind injeta
transparência. Com hex, `text-preto/70` falha em silêncio.

| cor | hex | uso | fatia |
| --- | --- | --- | --- |
| Off-white | `#FAF9F6` | fundo principal | ~70% |
| Preto suave | `#242321` | textos e faixas invertidas | ~20% |
| Bege champagne | `#D8D0C2` | divisores e superfícies | ~8% |
| Dourado | `#C9B56B` | só detalhe | ~2% |

**Dourado é filete em fundo claro; só pode ser palavra em fundo escuro.** Sobre
o off-white rende 1,94:1, ilegível, e nenhum tamanho de fonte conserta; sobre o
preto suave sobe para 7,71:1. Por isso o botão principal é preto.

Tipografia: **Cormorant Garamond** nos títulos, **Montserrat** no corpo.

---

## Deploy

Estático na Vercel. Build `npm run build`, saída `dist/`.

O `vercel.json` mapeia cada peça ao seu HTML. Sem ele, `/catalogo` cairia no
`index.html` e a cliente veria a apresentação de noiva no lugar do catálogo.
