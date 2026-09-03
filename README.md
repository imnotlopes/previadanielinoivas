# Danielli Noivas — quatro peças de WhatsApp

Não é um site. São **links que a Danielli cola na conversa do WhatsApp**, no
meio do atendimento. Sem carrinho, sem checkout, sem estoque: o vestido é
exibido e a conversa continua com ela.

```
/            Apresentação Noiva     o que ela manda quando a noiva chama
/catalogo    Catálogo Noiva         o que ela manda depois do interesse
/festa       Festa e formatura      apresentação curta + acervo, num link só
/admin       Painel                 a loja, operada do celular dela
```

React + Vite + TypeScript + Tailwind. Sem backend.

---

## ⚠️ Antes de mandar qualquer link para uma cliente

O material vai direto para o WhatsApp de uma pessoa real. Isso muda o que é
aceitável: o que passava numa prévia interna vira problema aqui.

**Bloqueadores — não pode ir ao ar:**

| onde | o que falta |
| --- | --- |
| `src/data/casamentos.ts` | **autorização por escrito de cada casal.** São fotos de pessoas identificáveis no dia do casamento delas. Sem o "pode usar", esvazie a lista |
| `src/lib/brand.ts` | `whatsapp` — sem número, **todo botão do site cai no Instagram**, e a lista de prova do catálogo se perde junto (a mensagem montada é descartada) |

**Pendências — o site funciona, mas sai mais fraco:**

| onde | o que falta |
| --- | --- |
| `src/data/pecas.ts` | `numeracao` de cada vestido (a Danielli tem) — é a segunda pergunta de toda cliente |
| `src/data/pecas.ts` | **ficha técnica**: `silhueta`, `decote`, `manga`, `cauda`. Vazios em todo o acervo. Cada um vira filtro no catálogo assim que dois vestidos estiverem classificados — ver abaixo |
| `src/data/atelier.ts` | **retrato da Danielli e os marcos** (anos de atelier, noivas vestidas). É o bloco de autoridade da apresentação |
| `src/data/pecas.ts` | `precoAluguel` — está tudo `null`, ou seja, "valor sob consulta" |
| `src/data/pecas.ts` | nomes e descrições foram escritos aqui, a partir das fotos. Confirmar como a loja chama cada modelo |
| `src/data/google.ts` | avaliações, nota, endereço e horários — **vazios de propósito**, ver abaixo |
| `src/data/depoimentos.ts` | depoimentos reais — **foto da noiva + a fala dela** (ver abaixo) |
| `src/data/faq.ts` | prazos e regra de devolução |
| `src/data/selos.ts` | as quatro promessas — selo é promessa |
| `src/lib/brand.ts` | `cidade` e `assinatura` |
| os quatro `.html` da raiz | URLs absolutas, se o domínio mudar |

### A capa do catálogo é a filha da casa

Pedido da Danielli: a Natália, filha dela, é a capa — e a **Aurora** é o
vestido que a Natália usou no próprio casamento. É o argumento de autoridade
mais forte que a loja tem, e ele se conta numa frase.

A capa não é decorativa: leva para a ficha da Aurora, que é a única do acervo
com **hero** (duas fotos, uma para tela em pé e outra para tela deitada,
servidas por `<picture media>`) e com **`historia`** — a linha que diz de onde
o vestido veio.

Só ganha hero quem tem história. Um acervo em que todo vestido abre com foto
de tela cheia não destaca ninguém.

⚠️ Confirmar com a Danielli a frase da história, e com a Natália a autorização
de aparecer nomeada.

### O card mostra o que ela precisa para vender

- **Ficha técnica em linha** (silhueta · decote · manga) — some enquanto
  ninguém classificou nada, que é o estado de hoje
- **Quantas fotos o vestido tem**, a partir de três. É informação de quem
  VENDE: com a noiva do lado, saber que um vestido tem seis fotos e outro tem
  uma decide qual ela abre primeiro
- Numeração em destaque quando existe

### A ficha técnica é o vocabulário da arara

`silhueta`, `decote`, `manga` e `cauda` não são adjetivos de catálogo: são
como a escolha acontece de pé na loja. A noiva chega dizendo "nada tomara que
caia" e isso corta metade do acervo antes de ela olhar foto.

Por isso são campo, e não texto na descrição — campo vira filtro. Estão todos
vazios, e a Danielli preenche pelo painel, em **Vestidos → Ficha técnica**.

Duas regras que valem a pena saber antes de preencher:

- **um grupo de filtro só aparece com dois ou mais valores diferentes.** Um
  filtro de uma opção só não corta nada, e prometer um corte que não existe é
  pior que não ter o filtro;
- **"não informar" é diferente de "sem cauda".** Um vestido sem cauda marcado
  como "não informar" some do filtro de quem quer justamente vestido sem cauda.

### Achar o vestido, que é o que ela faz o dia inteiro

O catálogo é a ferramenta de venda: a Danielli abre no balcão e vira a tela
para a noiva. Cinco coisas existem por causa disso.

- **A barra de busca e filtro gruda no topo.** Achar um vestido no meio da
  lista e ter que rolar até em cima para filtrar acontece a cada atendimento.
- **A folha de contato** (botão de ampliar, ou `?vista=denso`): seis vestidos
  por linha no computador, dois no celular, só foto e nome, 30 por vez. É o
  modo de a noiva apontar.
- **A busca ignora acento** — "alicia" acha "Alícia" — e enxerga cor,
  silhueta, decote, ocasião e numeração, não só o nome. Várias palavras somam:
  "renda manga longa" acha o que tem as três.
- **Ordenar por nome (A–Z)** existe sempre. Antes o seletor só aparecia com
  preço cadastrado, e como está tudo "sob consulta" ninguém conseguia ordenar.
- **A ordem padrão é a curadoria dela:** vestido marcado como `destaque` no
  painel vai para o topo do catálogo. Quem abre o link vê primeiro o que a
  loja quer mostrar, não o que foi cadastrado primeiro.
- **Voltar volta para onde estava.** Rolar até o vigésimo oitavo vestido,
  abrir a ficha e voltar não joga mais a pessoa no primeiro.

Tudo isso mora na URL, então qualquer estado é um link que dá para colar no
WhatsApp: `/catalogo?vista=denso&cor=marfim&ordem=nome`.

### O catálogo é de noiva, e só

Não é uma loja com uma seção de noiva. A diferença aparece em decisões que uma
vitrine genérica não tomaria:

- a data que se pergunta é a do **casamento**, não "do evento";
- o próximo passo é a **prova**, nunca a compra;
- **não existe caminho daqui para festa ou 15 anos** — nem no rodapé. Quem
  está escolhendo vestido de casamento não quer ser oferecida outra coisa;
- os selos falam em "o dia do seu casamento". A peça de festa tem a frase dela
  (`detalheFesta` em `src/data/selos.ts`);
- o fim da grade não é o fim do assunto: quem rolou 40 vestidos e não marcou
  nenhum recebe um "não achou o seu? conta como você imagina", e quem marcou
  recebe o empurrão para mandar.

### A lista de prova ("quero provar esses")

O catálogo tem um marcador em cada vestido. A noiva marca enquanto folheia e a
barra do rodapé transforma isso em **uma** mensagem de WhatsApp com os nomes,
a data do casamento, o manequim e um link `?provar=…&data=…` que **reabre a
mesma seleção** do lado da Danielli — os vestidos já ficam separados antes de
a noiva chegar.

**A data é o que muda a resposta.** Sem ela, a primeira mensagem da loja é
obrigatoriamente uma pergunta: disponibilidade de vestido de aluguel só existe
em relação a um dia. Com ela, já dá para responder "esses três estão livres,
vem quinta?".

Data e manequim ficam **junto da lista, não em cada vestido** — ela tem um
casamento só. Preencher na ficha preenche na barra, e vice-versa. Nenhum dos
dois é obrigatório.

Não é carrinho: não reserva, não cobra e não promete disponibilidade. Só a
agenda da loja pode fazer isso.

Fica no `localStorage` do navegador da noiva, teto de 12 vestidos. Ver
`src/lib/selecao.ts`.

### Prova social: foto + fala

O depoimento aqui não é texto solto: é a **foto da noiva ao lado da fala
dela**. Uma frase elogiosa sem rosto é indistinguível de texto inventado — e
este projeto já teve depoimento inventado uma vez.

Enquanto a lista está vazia, a seção mostra um **espaço reservado** de moldura
tracejada, para dar para ver o formato. Vire `mostrarEspacoReservado` para
`false` em `src/data/depoimentos.ts` antes de mandar qualquer link para uma
noiva; com a lista preenchida ele é ignorado de qualquer forma.

Precisa de autorização **das duas coisas**: uma pessoa pode topar que a fala
apareça e não querer o rosto.

### O que foi esvaziado, e por quê

`google.ts` e `depoimentos.ts` **tinham conteúdo inventado** — 12 avaliações,
uma nota que o Google nunca deu e 4 depoimentos, escritos para o site poder ser
visto de pé enquanto era prévia interna. Os nomes dos casais em
`casamentos.ts` também eram inventados.

Foram esvaziados. Publicar avaliação inventada como real é propaganda enganosa,
e nome falso sobre a foto de um casamento real atribui a pessoas identificáveis
uma identidade que não é delas.

**As seções somem sozinhas quando os dados estão vazios** — é assim que o site
fica honesto sem ficar quebrado. Preencher com o real liga tudo de volta.

### Aviso que não é do site

As pastas `Lennys atelie*` (projeto de referência) trazem um `.env.local` e um
`database password.txt`. Estão no `.gitignore`, mas **troque essa senha**: ela
já esteve em disco dentro de um projeto versionado.

---

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

> Ao alterar `tailwind.config.ts`, **reinicie o `npm run dev`** — esse arquivo
> não recarrega a quente.

---

## Por que quatro arquivos HTML

Quando a Danielli cola um link no WhatsApp, aparece um cartão com foto e
título. **Esse cartão é a primeira impressão, antes de qualquer clique.**

O robô que monta o cartão **não executa JavaScript**. Numa aplicação de página
única os três links devolveriam o mesmo `index.html` e portanto o mesmo cartão:
a noiva e a formanda receberiam previews idênticos.

Por isso cada peça é um HTML de verdade — `index.html`, `catalogo.html`,
`festa.html`, `admin.html` — com as próprias tags Open Graph escritas no
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
  publicado: true,                 // a curadoria — ver abaixo
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

### `publicado` — a curadoria

Nem todo vestido do acervo entra no catálogo que a cliente recebe: a regra da
Danielli é que só entra o que tem foto profissional. O acervo interno pode (e
deve) ser maior que o catálogo publicado.

Quem enxerga o quê:

- **tela de cliente** chama `publicadas()` antes de qualquer outra coisa —
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
catálogo — que hoje fica escondida.

---

## Celular primeiro

É onde a maioria abre — o link vai colado numa conversa de WhatsApp. O peso da
apresentação saiu de **7,9 MB para 1,9 MB** no celular, sem tirar conteúdo:

| o que | como |
| --- | --- |
| vídeos: 7,4 → 1,9 MB | versão de 540px para tela estreita (`-540.mp4`), e carrossel horizontal no lugar dos três empilhados — só o primeiro entra na tela, os outros dois só baixam se ela arrastar |
| fotos dos casamentos: 854 → 434 KB | duas larguras (400 e 900) com `srcset` e um `sizes` por tamanho de quadro. Antes, um quadro de 160px recebia a foto de 900 |
| alvos de toque | 44px no marcador "quero provar", no ícone do Instagram do topo e na pausa dos vídeos; 36–40px nos links de texto |
| a pausa dos vídeos | era `opacity-0 group-hover` — **não existia no toque**, e ela é exigência de acessibilidade. Agora é visível no celular e escondida no computador |

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
decorador), e **qualquer foto com o nome do casal legível** — bastidor
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

Os originais ficam em `videos-originais/`, **fora do Git** — 33 MB que nunca
são servidos, guardados só para permitir reencodar com outro alvo sem pedir os
arquivos de novo.

O script tira a faixa de áudio (autoplay só existe mudo, então ela era peso
puro), comprime em CRF 31 — calibrado quadro a quadro contra o original, a
pedraria e a renda sobrevivem — e gera um pôster `.webp` de cada um.

**Onde cada um está:**

| arquivo | onde | por quê |
| --- | --- | --- |
| `atelier.mp4` | folha "Quem atende" | panorâmica pelos manequins: prova que existe loja e acervo de verdade. **A Danielli não aparece nele** — o retrato dela continua faltando |
| `editorial-1/2/3.mp4` | folha "De perto, e em movimento" | tríptico sobre preto, entre "O que está incluído" e a amostra do acervo |

**Vertical não vai para a abertura.** 9:16 numa tela larga é cortar dois terços
do quadro ou deixar tarja. Por isso os vídeos moram nos blocos de duas colunas
e no tríptico, onde a coluna já é retrato.

Nada baixa antes de entrar na tela, e o vídeo pausa ao sair. Com
`prefers-reduced-motion` o vídeo nem é montado: fica o pôster.

## Ingestão das fotos

Dois caminhos, os dois com tabela versionada no Git:

**Instagram** (`scripts/importar-instagram.mjs`) — a tabela `MAPA` traduz o
número da foto no dump para o caminho que o site usa.

**Fotógrafos** (`scripts/importar-fotografos.mjs`) — três passos, e o do meio é
humano:

```bash
node scripts/importar-fotografos.mjs --folhas   # monta folhas de contato numeradas
# escolher os números junto com a Danielli, preencher a tabela SELECAO
node scripts/importar-fotografos.mjs            # processa só o escolhido
```

O passo humano existe porque os fotógrafos entregam a cobertura inteira do
casamento, não um catálogo. No conjunto "Fornecedores - Thamiris e Rodrigo" são
185 fotos e a maioria é maquiagem, sapato do noivo, decoração e mesa de doces —
o pacote vai para todos os fornecedores da festa. Um import cego jogaria
bandeja de frios no catálogo de noiva.

A tabela `SELECAO` já está preenchida com **24 vestidos de noiva** (48 fotos)
tirados do conjunto de vestidos. Ficaram de fora, e é decisão a levar para a
Danielli:

- **20 fotos com marca d'água de outra loja** — VIASPOSA, RAINHA, IDEAL noivas
  e CENTER NOIVAS. São fotos de catálogo dos fornecedores e estão entre as
  melhores do lote, mas a marca de outra loja dentro do catálogo dela derruba
  justamente a autoridade que ele existe para construir. Pedir a versão limpa
  ao fornecedor resolve; fotografar as peças dela resolve melhor.
- **4 prints de tela** e as fotos de noivo, casal e festa, que não são
  material de catálogo de noiva.

O script gira pelo EXIF, corta em **3:4** e converte para WebP com no máximo
1600px. Foto muito fora de 3:4 perderia mais de 25% no corte — nesse caso ela
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

O código é revalidado a cada carregamento — cupom vencido ou desativado para de
valer sozinho.

---

## O painel não congela mais o catálogo

A edição do painel é mesclada **campo a campo** sobre o código, e não substitui
a lista inteira. Antes, quem mexesse no painel em março ficava com o catálogo
congelado em março: vestido novo no código não chegava, e campo novo em
vestido antigo também não — foi assim que a capa sumiu num teste, porque a
Aurora salva no painel não tinha o campo `hero`.

Agora o código é a base e a edição dela é a camada de cima. O que ela editou
vence; o que ela nunca tocou continua vindo do código. Vestidos apagados no
painel ficam numa lista `removidos`, senão voltariam da semente a cada
carregamento.

## O painel (`/admin`)

Feito para o **celular**: a Danielli não tem computador. Navegação fixa no
rodapé, cartões em vez de tabela, e o interruptor de publicar em primeiro
plano — é a ação que ela mais vai repetir.

O que ele **ainda não** é:

- **não tem banco.** Grava no `localStorage` de quem está mexendo. Não aparece
  para a cliente, não aparece em outro aparelho, some ao limpar o navegador;
- **não tem autenticação.** A entrada é um botão e `/admin` é endereço público;
- **não envia foto.** O cadastro pede um caminho de arquivo que já exista em
  `public/`.

**Os três buracos são o mesmo trabalho**, e é o próximo passo do projeto: banco
+ storage de imagem + login. A camada `src/lib/loja.ts` é onde isso se costura
— as telas não mudam, porque nenhuma delas importa os dados direto.

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

Trios de canais RGB, não hex — é o único formato em que o Tailwind injeta
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
