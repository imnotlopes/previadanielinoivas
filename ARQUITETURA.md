# Como o site foi construído

Documento de arquitetura: o que foi decidido, por quê, e onde cada decisão mora
no código. Para instruções de operação (trocar telefone, adicionar vestido,
subir para a Vercel), veja o [README](README.md).

> **Nota de origem.** Este código nasceu como vitrine de um atelier de costura
> **sob medida** e foi readaptado para a **Danielli Noivas**, que é loja de
> **aluguel**. A estrutura sobreviveu inteira à troca — é a prova de que a
> separação entre `src/data/` e o resto funciona —, mas o conteúdo e a direção
> visual são outros. Onde este documento fala de decisão antiga que mudou, ele
> diz qual era e o que a substituiu.

---

## 1. O escopo, e a decisão que define tudo

O site é uma **vitrine estática**, não uma loja. Não há carrinho, checkout,
preço, estoque nem calendário de reservas. O vestido é exibido e a conversa
continua no WhatsApp, com a mensagem já preenchida com o nome do modelo e a
categoria.

Isso vale sublinhar para um negócio de aluguel: **o site não sabe se um vestido
está livre numa data.** Disponibilidade é assunto da conversa, e tentar espelhar
a agenda da loja aqui exigiria backend, banco e disciplina diária de quem
atende. Enquanto a reserva for combinada no WhatsApp, o site continua sendo um
arquivo estático.

Há duas exceções aparentes, e as duas confirmam a regra:

**O cupom de parceira** parece transação, mas não é. Ele chega por `?cupom=` na
URL, fica guardado no navegador da visitante e é copiado para dentro da
mensagem do WhatsApp. Nenhum valor é cobrado, nenhum uso é contabilizado no
servidor — porque não há servidor. O cupom é um recado.

**O painel administrativo** parece um sistema, mas é uma maquete funcional. Ele
grava no `localStorage` de quem está mexendo, e nada do que é editado ali chega
à cliente. Existe para decidir o que vale construir antes de construir. A §13
detalha o limite.

Essa decisão é a raiz de todas as outras. Sem transação não há necessidade de
backend, banco, autenticação ou painel administrativo. O que sobra é um site
que precisa ser **rápido, bonito e fácil de editar por uma pessoa só**. Toda a
arquitetura abaixo é consequência disso.

Consequência prática: o conteúdo vive em arquivos TypeScript versionados no
Git, não num CMS. Editar o catálogo é editar um array e fazer commit. Em troca
de um pouco de fricção para quem edita, ganha-se site sem custo de servidor,
sem tela de login, sem banco para migrar e com histórico completo de mudanças.

---

## 2. Stack

| camada | escolha | motivo |
| --- | --- | --- |
| build | Vite 8 | build de 2 a 3 segundos, HMR instantâneo |
| UI | React 19 | metadados nativos no `<head>`, sem react-helmet |
| tipos | TypeScript 6 | o catálogo é dado estruturado; o compilador pega erro de categoria e caminho |
| estilo | Tailwind CSS 3.4 | o design system vira restrição, não sugestão |
| rotas | React Router 7 | quatro rotas, com filtro na query string |
| ícones | lucide-react | traço fino, combina com a tipografia |
| imagens | sharp | conversão para WebP em script local, fora do build |
| lint | oxlint | padrão do create-vite 9, roda em milissegundos |

**Tailwind 3.4 e não a 4.** A versão 4 move a configuração para dentro do CSS.
O projeto foi especificado com `tailwind.config.ts` e `theme.extend`, e a 3.4 é
a última que entrega exatamente esse formato. Foi escolha deliberada, não
atraso de versão.

**Sem biblioteca de componentes.** Nada de shadcn, MUI ou Chakra. O visual é
específico demais: raio zero em tudo, sombras quase invisíveis, versalete com
entrelinha larga. Adaptar uma biblioteca genérica custaria mais do que escrever
os oito componentes que o site realmente usa.

---

## 3. Como o projeto está organizado

```
public/
  pecas/            fotos do catálogo, em WebP
  casamentos/       casamentos de clientes, exibidos na home
  atelier/          provador, atendimento, acessórios
  og-image.jpg      preview ao compartilhar link (1200x630)
  logo.png          ARTE DA MARCA — origem de todas as variações
  favicon.png · apple-touch-icon.png · logo-*.webp

src/
  data/             CONTEÚDO: pecas · google · casamentos · youtube · faq
  lib/              brand.ts (contatos) · utils.ts · diagnosticoOverflow.ts
  components/       casca e blocos reutilizáveis
  pages/            Home · Catalogo · Peca · Sobre · NaoEncontrada
  index.css         design tokens e classes de componente
tailwind.config.ts  mapeia os tokens para as utilities
vercel.json         rewrite de SPA
scripts/
  importar-instagram.mjs   dump do Instagram → public/
  webp.mjs                 conversão avulsa de imagem
  seo.ts                   sitemap, robots e JSON-LD no build
```

**As fotos de `public/` são geradas, não copiadas à mão.** O dump do Instagram
chega com nomes como `imgi_36_753237135_..._n.webp`; a tabela `MAPA` em
`scripts/importar-instagram.mjs` traduz o número de cada foto para o caminho que
o site usa e já redimensiona. Trocar a foto de um vestido é mudar um número
nessa tabela e rodar o script — nenhum arquivo de `src/` é tocado.

A separação que importa é **`data/` versus todo o resto**. Quem for mexer no
conteúdo do site mexe só em `src/data/`. Nenhum componente tem número de
telefone, `@` do Instagram ou nome de peça escrito direto no meio do JSX.

---

## 4. Design system

Tudo começa em `src/index.css`, no bloco `:root`. O `tailwind.config.ts` não
define cor nenhuma: ele só aponta para as variáveis. Fonte única de verdade.

### As cores são trios de canais, e isso não é decoração

```css
--preto-rgb: 28 28 28;           /* trio de canais, sem vírgula */
--preto: rgb(var(--preto-rgb));  /* versão pronta para CSS puro */
```

```ts
preto: 'rgb(var(--preto-rgb) / <alpha-value>)'
```

Esse é o único formato em que o Tailwind consegue injetar transparência. Com
hex dentro da variável, `text-preto/70` e `bg-preto/50` **falham em silêncio**:
não dão erro, não aparecem no console, simplesmente saem sólidos ou
transparentes. O projeto foi construído inteiro com hex antes de isso ser
descoberto, e metade dos gradientes e sobreposições estava invisível. Se um dia
uma cor for trocada, converta o hex para os três canais decimais.

### A paleta tem quatro cores, e a proporção faz parte dela

| cor | hex | uso | fatia |
| --- | --- | --- | --- |
| Off-white | `#FAF9F6` | fundo principal | ~70% |
| Preto suave | `#242321` | títulos, textos e faixas invertidas | ~20% |
| Bege champagne | `#D8D0C2` | divisores e superfícies secundárias | ~8% |
| Dourado | `#C9B56B` | só detalhe | ~2% |
| Branco | `#FFFFFF` | cards e áreas de contraste | — |

A versão anterior deste site era estritamente preto e branco, sem acento. A
Danielli tem dourado na logo, e ignorá-lo seria descolar o site da marca — mas o
Instagram dela já é saturado de "dourado + noiva + ornamentação", e repetir isso
no site entregaria mais do mesmo. Daí a proporção acima: **o dourado entra, mas
com teto.**

**O teto não é gosto, é contraste.** `#C9B56B` sobre o off-white rende 1,94:1.
Isso é ilegível como texto, e nenhum tamanho de fonte conserta — nem o mínimo de
3:1 que a WCAG aceita para texto grande. Sobre o preto suave o mesmo dourado
sobe para 7,71:1 e passa folgado. A regra que sai daí é operacional:

> **Dourado é filete em fundo claro; pode ser palavra em fundo escuro.**

Por isso o botão principal é preto suave, e não dourado: botão dourado não teria
contraste para o texto de dentro dele. A hierarquia dos botões continua vindo de
**peso e preenchimento** — cheio contra contorno —, não de matiz.

O `--cinza` (`#6B6560`) é o preto rebaixado para rótulos e texto de apoio. Não
foi escolhido no olho: é o cinza mais claro que ainda cumpre 4,5:1 sobre o
off-white, e foi puxado para o quente para conversar com o champagne.

### Tipografia e forma

- **Cormorant Garamond** nos títulos, em versalete com `letter-spacing: 0.18em`.
- **Montserrat** no corpo e na navegação. Geométrica e limpa, faz contraste com
  a serifada dos títulos sem disputar com ela.
- Escala de h1 a h6 em `clamp()`, então o tipo cresce com a tela sem breakpoint.
- `border-radius: 0` em absolutamente tudo. A **única** exceção do site inteiro
  é o botão flutuante do WhatsApp, que é redondo por convenção da plataforma.
- Sombras quase invisíveis (5% e 7% de opacidade). O que separa os blocos é
  espaço e filete, não elevação.

### O hero continua sendo foto sangrada com véu escuro

Chegou a ser trocado por uma dobra clara em duas colunas e voltou atrás. O véu
(`from-preto/85 via-preto/60 to-preto/25`) existe para sustentar o contraste do
texto branco por cima de foto de vestido claro, e é ele que precisa ser
reconferido sempre que a imagem do hero mudar. O dourado aparece ali no filete
de 1px sob o título.

---

## 5. A camada de dados

`src/data/pecas.ts` é o coração. Cada modelo é um objeto:

```ts
{
  slug: 'noiva-aurora',          // vira a URL /peca/noiva-aurora
  nome: 'Aurora',                // o nome do VESTIDO
  categoria: 'noiva',            // noiva | festa | debutante
  descricao: 'Renda com gola alta e manga longa',
  imagens: ['/pecas/aurora-renda-gola-alta.webp', '...-2.webp'],
  destaque: true,                // opcional, aparece na home
}
```

Duas convenções valem registro, e as duas **inverteram** na virada de atelier
sob medida para loja de aluguel:

**O título é o nome do vestido, não o da cliente.** Na versão anterior era o
contrário: cada peça era feita para uma pessoa, e o site ficava mais forte
dizendo isso. Aqui o mesmo vestido veste várias noivas ao longo dos anos e não
pertence a nenhuma delas — batizá-lo pelo nome de uma seria errado no ano
seguinte. E há o lado prático: nenhuma cliente aparece identificada pelo nome
sem ter autorizado. O nome próprio também serve de código na conversa ("quero
provar o Aurora").

**A descrição é o vestido, não o estilo.** Antes era o adjetivo com que a
costureira descrevia a peça ("Romântico, Minimalista e Contemporâneo"). Numa
loja de aluguel quem lê está comparando modelos, então a linha precisa dizer
silhueta e o detalhe que identifica aquele: "Um ombro só, com babado
estruturado". Continua sem chutar tecido — afirmar "renda francesa" sem certeza
é pior do que dizer só "renda".

**A cidade não está escrita nos textos de SEO.** Ela sai de `brand.cidade`
através de uma constante `local` no topo do arquivo, que devolve `' em Cidade,
UF'` ou string vazia. Enquanto a constante estiver vazia os títulos saem sem
cidade — corretos, só sem o termo que mais traz cliente. Foi feito assim porque
a cidade aparecia em quinze strings diferentes, e quinze pontos de edição à mão
é onde uma delas fica para trás.

### O resto do site se deriva daí

Ninguém mantém lista de categoria em dois lugares:

```ts
export const pecasDestaque       // filtra destaque: true
export const categoriasDisponiveis  // só categorias que têm peça
export const categoriasVitrine   // capa (1ª imagem) + contagem, para a home
export function pecasPorCategoria(c)
export function buscarPeca(slug)
```

Adicionar uma peça de uma categoria nova faz o chip aparecer no filtro e o card
aparecer na vitrine da home, sem tocar em componente nenhum. Foi assim que a
troca de "sob medida" por "casual" custou poucas linhas.

Os outros arquivos de `data/` seguem a mesma ideia: `google.ts` (perfil e
avaliações), `casamentos.ts`, `youtube.ts`, `faq.ts`.

**Três dessas seções se escondem sozinhas quando não há dado.** `SecaoAvaliacoes`
retorna `null` com a lista vazia, `SecaoYoutube` também, e `SecaoMapa` some
quando não há nem endereço nem telefone. Isso não é elegância: é o que permite
publicar o site com o conteúdo que já existe e preencher o resto depois, sem
deixar no ar um cartão vazio ou um mapa-múndi genérico no lugar da loja.

---

## 5-A. O estado da loja, e por que ele é uma camada

`src/lib/loja.ts` junta três coisas numa fonte só:

1. a **semente**, que é o conteúdo escrito em `src/data/` e versionado no Git;
2. as **edições** feitas no painel, no `localStorage` de quem mexeu;
3. o **cupom ativo** da visitante, que chegou por `?cupom=` na URL.

Os componentes leem `useLoja()` em vez de importar `pecas` direto. Foi essa
troca que obrigou os auxiliares de `data/pecas.ts` a receberem a lista por
parâmetro (§5): a lista que a tela mostra deixou de ser a que está no arquivo.

**O provedor mora em `components/LojaProvider.tsx`, não no lib.** Não é
organização: um arquivo que exporta componente *e* funções soltas quebra o
recarregamento a quente do Vite, e o lint avisa. Componente sozinho num
arquivo, funções e ganchos no outro.

Duas decisões pequenas dentro do provedor merecem registro:

**O `?cupom=` é consumido e apagado da URL.** Ele é a porta de entrada do link
da parceira, não parte da identidade da página. Deixá-lo grudado sujaria toda
URL compartilhada dali em diante e criaria duas versões do mesmo endereço aos
olhos do buscador.

**Só o código do cupom é guardado, nunca o objeto.** O cupom é revalidado a
cada render contra a lista atual, porque ele pode ter vencido desde que foi
salvo, ou ter sido desativado. Guardar o objeto congelado faria o site prometer
desconto que já não vale.

---

## 5-B. Preço, e a decisão de não ter nenhum

Todo o acervo está com `precoAluguel: null`, e o site mostra "Valor sob
consulta" em todo lugar. Isso **não** é um campo esperando conserto: ninguém
informou a tabela da loja, e inventar valor de aluguel é o tipo de erro que a
cliente só descobre dentro da loja.

O que existe é a máquina inteira pronta em volta do vazio: `lib/preco.ts` é a
única função do projeto que calcula desconto, o componente `<Preco>` decide
sozinho entre valor, valor riscado e "sob consulta", e o catálogo esconde a
ordenação por preço enquanto `temPreco()` for falso — filtro que não filtra
nada é pior que filtro ausente, porque a cliente mexe, não acontece nada, e
conclui que o site está quebrado.

Preencher um número em `data/pecas.ts` acende tudo isso de uma vez.

---

## 6. Rotas e carregamento

Quatro rotas, e cada página é um `React.lazy`:

```tsx
<Route element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="catalogo" element={<Catalogo />} />
  <Route path="peca/:slug" element={<Peca />} />
  <Route path="sobre" element={<Sobre />} />
  <Route path="*" element={<NaoEncontrada />} />
</Route>
```

O `<Suspense>` fica **dentro do Layout, em volta do `<Outlet />`**, e não em
volta das `<Routes>`. A diferença é visível: com ele por fora, header e rodapé
sumiriam e voltariam a cada troca de rota. Do jeito que está, a casca fica
parada e só o miolo troca. O fallback reserva `60svh` de altura para o rodapé
não saltar enquanto o chunk baixa.

### O filtro do catálogo mora na URL

`useSearchParams` é a fonte de verdade, não `useState`:

```ts
const filtroAtivo = ehCategoria(params.get('categoria')) ? ... : null
```

Isso resolve quatro coisas de uma vez: os cards da home entram direto filtrados
(`/catalogo?categoria=noiva`), o botão voltar do navegador funciona, o link
filtrado pode ser colado no WhatsApp ("olha os verdes que eu vi") e cada
categoria vira página de entrada própria para o buscador. Valor desconhecido na
URL é ignorado em silêncio, nunca quebra a página.

O catálogo hoje lê da URL categoria, cor, busca, ordenação **e** quantos
vestidos mostrar. O `mostrar` estar ali junto não é capricho: sem ele, quem
clicou "carregar mais" três vezes, abriu um vestido e voltou, cairia de volta
na primeira dúzia.

**Só a categoria entra na URL canônica.** Cor, busca e ordenação são recortes
da mesma página; se cada combinação virasse endereço próprio, o buscador
acharia dezenas de páginas quase idênticas disputando entre si.

---

## 7. As seções que fecham toda página

Ficam no `Layout`, dentro do `<main>`, depois do `<Outlet />`:

```tsx
<SecaoDepoimentos />  {/* prova social escolhida pela casa */}
<SecaoAvaliacoes />   {/* prova social pública, do Google */}
<Faq />               {/* dúvidas */}
<SecaoMapa />         {/* onde encontrar */}
```

A ordem é intencional: convence, comprova, tira a dúvida, diz onde fica.
Repetem em todas as rotas porque em site de vitrine não se controla por onde a
visita entra, e qualquer página precisa conseguir fechar sozinha.

Depoimento e avaliação do Google são coisas diferentes e por isso são dois
blocos: a avaliação é transcrição literal de um perfil público, que ninguém
edita; o depoimento é a seleção da própria casa e pode ser recortado. Misturar
os dois apagaria a diferença justamente onde ela importa.

Acima do cabeçalho, e fora do sticky, mora a `<BannerCupom />`. Ela não é fixa
de propósito: faixa grudada come altura de tela no celular, que é por onde
chega a cliente que veio pelo link da parceira.

`SecaoGoogle.tsx` exporta dois componentes justamente para o FAQ poder ficar no
meio dos dois. As avaliações rolam na horizontal, com cards de largura em `rem`
(nunca `vw`, ver §11) e o carrossel dentro de um contêiner com `overflow-hidden`.

**A seção do YouTube usa fachada.** Em vez de carregar cinco iframes do YouTube
(cada um custa centenas de KB e cookies de rastreamento), mostra a thumbnail e
só troca pelo iframe do `youtube-nocookie.com` depois do clique.

---

## 8. Imagens

**Toda foto mora em `public/`, nunca em `src/assets/`.** Caminho em texto
(`'/pecas/kelly.webp'`) só funciona a partir de `public/`. Em `src/assets/` o
Vite exige `import` para versionar o arquivo, e a string vira link quebrado no
build. Como as fotos vêm de um array de dados, `public/` é a única opção viável.

**Tudo é WebP.** As fotos do catálogo saem já convertidas de
`scripts/importar-instagram.mjs`, que redimensiona para no máximo 1600 px de
lado maior. O `npm run webp` (`scripts/webp.mjs`) continua existindo para
arquivo avulso que entre em `public/` por fora do script. Os dois preservam
`og-image.jpg`, `favicon.png` e `apple-touch-icon.png` de propósito, porque robô
de preview e ícone de sistema nem sempre entendem WebP.

**A logo tem três tratamentos, e nenhum é escolha estética.** A arte é
`public/logo.png`, com o fundo removido à mão; as variações saem dela no script:

- **normal**, para fundo claro: os canais RGB multiplicados por 0,8. O dourado
  da marca é bem claro e, reduzido à altura do cabeçalho (44px) sobre o
  off-white, virava uma mancha pálida que parecia imagem quebrada. O
  escurecimento preserva matiz e alfa, então o lettering continua o mesmo.
- **`-claro`**, para o rodapé preto: a silhueta preenchida de branco, tirada do
  próprio canal alfa. Sem isso o "Danielli" em dourado escuro sumiria no fundo.
  Funciona porque a filigrana é desenhada em traço fino — a silhueta preserva o
  desenho em vez de virar um borrão.
- **ícones**, achatados sobre branco: o `apple-touch-icon` do iOS não aceita
  alfa, e logo clara com fundo transparente desaparece na barra de um navegador
  em tema escuro.

A arte tem 150 px de lado, o que é o limite para o selo do rodapé. É a única
coisa que precisa ser trocada quando aparecer um vetorial da marca.

**As fotos são exibidas em 3:4** (`aspect-[3/4] object-cover`), no card e na
galeria. Isso significa que foto muito vertical perde altura no corte: uma foto
1:2,6 mostra só 51% de si mesma, o que na prática corta cabeça e barra do
vestido. Quando isso acontece e não há foto melhor, a saída usada foi preencher
as laterais com uma versão desfocada e escurecida da própria imagem até chegar
em 3:4, em vez de cortar a peça. É o caso de `marcia-classico-e-elegante.webp`.

---

## 9. SEO em duas camadas

O problema: o site é uma SPA sem servidor, e **os robôs de preview do WhatsApp,
Facebook e Instagram não executam JavaScript**. O Google executa.

A solução são duas camadas:

1. **Estática, no `index.html`.** Open Graph completo com URLs absolutas. É o
   que os robôs de preview leem. Toda tag dessa camada carrega o atributo
   `data-seo-estatico`.
2. **Por rota, no `<Seo>`.** React 19 eleva `<title>` e `<meta>` para o `<head>`
   sozinho, então não há react-helmet. Serve ao Google.

O detalhe que faz a coisa funcionar está em `main.tsx`:

```ts
document.querySelectorAll('[data-seo-estatico]').forEach((tag) => tag.remove())
```

Sem essa linha o documento fica com **duas** `<meta name="description">`, e o
Google considera a primeira, que é a estática e genérica. Ou seja: as descrições
por página seriam escritas e ignoradas. A limpeza roda antes do primeiro render.

**Limite conhecido:** compartilhar o link de uma peça específica mostra o
preview genérico do atelier, não a foto daquela peça. Resolver isso exige
pré-renderizar as rotas no build (`vite-plugin-ssg` ou similar), o que mantém o
site estático e na Vercel. Ficou de fora por não ser prioridade.

**SEO local:** está pendente, e de propósito. A cidade da loja ainda não foi
informada, então `brand.cidade` está vazia e todas as strings de SEO saem sem
ela. Preencher aquela constante conserta as quinze de uma vez (ver §5); as tags
de Open Graph do `index.html` são a exceção, por serem texto fixo.

**JSON-LD só com dado que existe.** `scripts/seo.ts` monta o `ClothingStore` do
negócio e injeta no `index.html` durante o build, mas cada bloco é condicional:
sem telefone não sai `telephone`, sem endereço não sai `address`, e o
`aggregateRating` só entra quando há link do perfil no Google apontado em
`googleNegocio.url`. Campo em branco no JSON-LD é pior do que campo ausente — e
declarar nota sem um perfil público onde conferi-la é o tipo de coisa que rende
penalidade manual.

---

## 10. Acessibilidade, performance e deploy

**Acessibilidade.** Contraste medido por script a cada troca de paleta — a
regra do dourado da §4 saiu dessa medição —, `alt`
descritivo em toda imagem de conteúdo e `alt=""` nas decorativas, carrossel com
`role="region"` e `tabIndex`, foco visível, hierarquia de heading sem pular
nível, e `<span className="sr-only">` onde o rótulo visual não basta.

**Performance.** Números do build atual:

```
index.html                    3,11 kB  │ gzip:  1,10 kB
CSS                          25,18 kB  │ gzip:  5,67 kB
runtime + vendor            209,28 kB  │ gzip: 66,92 kB
Home                         14,02 kB  │ gzip:  4,61 kB
Catalogo                      2,69 kB  │ gzip:  1,28 kB
Peca                          4,53 kB  │ gzip:  1,80 kB
```

Quem abre a home baixa o chunk da home, não o catálogo inteiro. Fontes com
`preconnect` e `display=swap`. `loading="lazy"` e `decoding="async"` em tudo,
menos nas duas primeiras imagens da home, que entram com prioridade.

**Deploy.** Estático na Vercel, build `npm run build`, saída `dist/`. O
`vercel.json` tem uma linha que é indispensável:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Sem ela, abrir `/catalogo` direto ou dar F5 em `/peca/noiva-kelly` daria 404: o
servidor procuraria um arquivo nesse caminho, que não existe, porque o
roteamento é todo do lado do cliente.

---

## 11. Armadilhas encontradas no caminho

Vale registrar, porque custaram tempo e voltariam a custar.

**`tailwind.config.ts` não recarrega a quente.** Mudou o config, reinicie o
`npm run dev`. Sem isso a alteração parece não ter efeito e leva a diagnóstico
errado.

**Alpha modifier com hex falha em silêncio.** Já descrito na §4. É o tipo de
bug que não aparece em erro nenhum, só no visual.

**`overflow-x: clip`, e não `hidden`, no `html`.** `overflow: hidden` na raiz
transforma o elemento em contêiner de rolagem e **quebra o `position: sticky`**
do cabeçalho. `clip` prende a largura sem esse efeito colateral. Ressalva: o
Safari anterior à 16 ignora `clip`, então isso é uma barreira, não a única.

**Nunca dimensione elemento em `vw` dentro de contêiner rolável.** `100vw`
inclui a barra de rolagem e vira estouro horizontal. Os cards do carrossel usam
`rem`.

**iOS Safari dimensiona iframe pelo conteúdo** e ignora largura percentual. O
contorno usado nos dois iframes do site é `w-px min-w-full` mais um wrapper com
`overflow-hidden`.

**A capa de Short do YouTube mente.** `oardefault.jpg` responde **200** com um
placeholder cinza de 120x90 para vídeo sem capa vertical, então `onError` nunca
dispara. A detecção real é testar `naturalWidth <= 120` no `onLoad`.

**Não rode regex em massa sobre arquivo-fonte pelo PowerShell.** Um substituto
mal escapado corrompeu sete arquivos de uma vez neste projeto. Edição de código
é feita arquivo a arquivo.

---

## 12. Diagnóstico embutido

`src/lib/diagnosticoOverflow.ts` existe por um motivo específico: houve relato
de rolagem lateral no aparelho da cliente que não se reproduzia em teste. O
módulo é carregado por `?overflow` na URL, por import dinâmico, então vira um
chunk de 2 kB que **visitante nenhum baixa**. Ligado, ele desenha um painel na
própria tela listando os elementos que passam da largura da viewport, contorna
em vermelho os não contidos e tenta rolar a página para provar se ela de fato
se move.

Quando o problema for confirmado resolvido, este arquivo, a chamada em
`main.tsx` e esta seção podem sair.

---

## 13. Em aberto

- **`SITE_URL`** em `src/lib/brand.ts` ainda é um endereço inventado da Vercel.
  As URLs canônicas e de Open Graph só ficam corretas depois de apontar para o
  domínio real, e as absolutas do `index.html` precisam acompanhar.
- **Conteúdo de prévia.** Boa parte do texto foi escrita a partir das fotos do
  Instagram, não veio da loja, e está marcada com `TODO` ou com um bloco
  `ATENÇÃO` no próprio arquivo. A lista completa está na primeira tabela do
  [README](README.md). Os dois pontos que **impedem** a publicação:
  - **as avaliações do Google em `data/google.ts` são fictícias**, assim como a
    nota e a contagem. Publicá-las como reais é propaganda enganosa. Ou
    transcreva as verdadeiras do Perfil da Empresa, ou zere a lista — a seção
    some sozinha;
  - **os nomes dos casais em `data/casamentos.ts` foram inventados**, e as fotos
    são de pessoas identificáveis no dia do casamento delas. Confirme os nomes e
    a autorização de cada casal antes de subir.
- **Contato e cidade** (`whatsapp`, `whatsappExibicao`, `cidade` em `brand.ts`)
  ainda estão vazios. Sem número, todos os botões de WhatsApp caem no Instagram.
- **`SITE_URL`** ainda é um endereço inventado da Vercel. As URLs canônicas e de
  Open Graph só ficam corretas depois de apontar para o domínio real, e as
  absolutas do `index.html` precisam acompanhar.
- **A assinatura da marca** ("Sonhos existem para serem realizados") foi
  completada a partir de uma bio truncada no Instagram. Confirmar a frase.
- **Preview por peça** ao compartilhar link, ver §9.
- **O painel administrativo é uma maquete.** Grava no `localStorage`, não tem
  autenticação (a "entrada" é um botão, e `/admin` é endereço público) e não
  publica nada. Serve para decidir o que vale construir. Ligar isso de verdade
  é outro projeto: banco, autenticação e envio de imagem — e nesse dia a
  camada de `lib/loja.ts` é o ponto de costura, porque os componentes já leem
  dela em vez de importar os dados direto.
- **Os cupons não contam uso.** O campo `usos` existe e é exibido, mas nada o
  incrementa: não há servidor para registrar a aplicação. Enquanto for assim,
  o número é o que alguém digitou no painel.
