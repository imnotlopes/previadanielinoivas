# Atelier Danielli Noivas — vitrine

Catálogo estático do acervo de aluguel. Sem carrinho e sem checkout: os vestidos
são exibidos em vitrine e todo contato acontece pelo WhatsApp, com a mensagem já
preenchida conforme o modelo.

React + Vite + TypeScript + Tailwind CSS. Sem backend.

---

## ⚠️ Antes de publicar

O site está de pé, mas parte do conteúdo é **prévia**: foi escrita a partir das
fotos do Instagram para o site poder ser visto funcionando, e não veio da loja.
Publicar assim como está seria afirmar coisas que ninguém confirmou.

| onde | o que falta | por quê |
| --- | --- | --- |
| `src/lib/brand.ts` | `whatsapp` e `whatsappExibicao` | sem número, todo botão de WhatsApp cai no Instagram |
| `src/lib/brand.ts` | `cidade` | a busca é local; sem cidade o site perde o termo que mais traz cliente |
| `src/lib/brand.ts` | `assinatura` | a bio do Instagram aparece truncada ("Sonhos Existe…"); confirmar a frase inteira |
| `src/data/google.ts` | **avaliações inventadas** | depoimento fictício publicado como real é propaganda enganosa — transcreva as do Google ou zere a lista |
| `src/data/google.ts` | endereço, horários, link do perfil | o bloco do mapa fica escondido enquanto estiverem vazios |
| `src/data/pecas.ts` | nomes e descrições dos vestidos | os nomes foram inventados; confirmar como a loja chama cada modelo |
| `src/data/casamentos.ts` | nomes dos casais | inventados — e é preciso autorização de cada casal para publicar a foto |
| `src/data/faq.ts` | prazos e regra de devolução | é o que a cliente vem conferir; errar aqui vira discussão no balcão |
| `src/pages/Sobre.tsx` | etapas do processo, acessórios | mesmo motivo |
| `src/pages/ComoFunciona.tsx` | prazos, ajuste, devolução | página que a cliente lê antes de decidir se vale a viagem |
| `src/data/selos.ts` | as quatro promessas | selo é promessa: se o ajuste for cobrado à parte, a conversa começa errada |
| `src/data/depoimentos.ts` | **depoimentos inventados** | mesmo problema das avaliações do Google |
| `src/data/cupons.ts` | **cupons inventados** | troque pelos combinados de verdade, ou esvazie a lista |
| `src/data/pecas.ts` | `precoAluguel` de cada vestido | está tudo `null`, ou seja, "valor sob consulta" — ver abaixo |
| `index.html` | título e descrição com a cidade | estas tags são texto fixo e não acompanham `brand.cidade` |

Cada um desses pontos está marcado com `TODO` ou com um bloco `ATENÇÃO` no
próprio arquivo.

E um aviso que não é do site: as pastas `Lennys atelie` e
`Lennys atelie - Exemplo`, copiadas para dentro deste projeto como referência,
trazem um `.env.local` e um `database password.txt`. Elas estão no
`.gitignore` e não vão para o repositório, mas **a senha que está ali dentro
deve ser trocada** — ela já esteve em disco dentro de um projeto versionado.

---

## Rodar localmente

```bash
npm install
```

```bash
npm run dev
```

Abre em `http://localhost:5173`.

| comando | o que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | gera a pasta `dist/` para produção |
| `npm run preview` | serve o `dist/` para conferir antes do deploy |
| `npm run lint` | roda o oxlint |

> Ao alterar `tailwind.config.ts`, **reinicie o `npm run dev`** — esse arquivo não
> recarrega a quente e as mudanças só aparecem depois do restart.

---

## Trocar WhatsApp, Instagram e domínio

Tudo em **`src/lib/brand.ts`**. Nenhum componente tem número ou @ escrito direto.

```ts
export const brand = {
  nome: 'Danielli Noivas',
  subtitulo: 'Atelier',
  instagram: '@atelierdaniellinoivas',
  whatsapp: '',          // ← 55 + DDD + número, só dígitos
  whatsappExibicao: '',  // ← mesmo número, formatado: (31) 98884-3406
  cidade: '',            // ← "Cidade, UF"
}

export const SITE_URL = 'https://danielli-noivas.vercel.app' // ← domínio real
```

O WhatsApp usa **formato internacional, apenas dígitos**: `55` + DDD + número,
sem `+`, espaço, parêntese ou traço. Exemplo para (31) 98765-4321 →
`5531987654321`.

Enquanto `whatsapp` estiver vazio, `linkWhatsApp()` devolve o Instagram: é
melhor o botão levar a um canal que existe do que a um `wa.me/` sem número.

Preencher `cidade` conserta sozinho os títulos e descrições de todas as páginas
de categoria — eles são montados a partir dessa constante. As tags de Open
Graph do `index.html` são a exceção: são texto fixo e precisam ser editadas à
mão.

Ao trocar o `SITE_URL`, atualize também as URLs absolutas de Open Graph no
`index.html` (explicação abaixo).

---

## Adicionar ou editar vestidos

Tudo em **`src/data/pecas.ts`**. Cada modelo é um objeto no array `pecas`:

```ts
{
  slug: 'noiva-aurora',                   // vira a URL /peca/noiva-aurora
  nome: 'Aurora',                         // o nome do VESTIDO, não da cliente
  categoria: 'noiva',                     // noiva | festa | debutante
  descricao: 'Renda com gola alta e manga longa',
  cor: 'marfim',                          // alimenta o filtro de cor
  precoAluguel: null,                     // null = "valor sob consulta"
  precoDe: null,                          // opcional: valor cheio, riscado
  imagens: [
    '/pecas/aurora-renda-gola-alta.webp',
    '/pecas/aurora-renda-gola-alta-2.webp',
  ],
  destaque: true,                         // opcional — aparece na home
}
```

O `slug` precisa ser único e sem acento ou espaço — é o endereço da página.

**O título é o nome do vestido, não o da cliente.** O acervo é de aluguel: o
mesmo vestido veste várias noivas ao longo do tempo e não pertence a nenhuma
delas. E assim nenhuma cliente aparece identificada sem ter autorizado.

### Preço

Todo o acervo está com `precoAluguel: null`, e por isso o site mostra
**"Valor sob consulta"** em todo lugar. Isso é decisão, não pendência de
código: ninguém informou a tabela da loja, e inventar valor de aluguel é o
tipo de erro que a cliente só descobre dentro da loja.

A interface inteira já funciona com preço. Basta preencher `precoAluguel` que
o valor aparece no card, na página do vestido e no cálculo do cupom — e a
ordenação por preço, hoje escondida, aparece sozinha no catálogo.

O site se atualiza sozinho a partir desse arquivo: a home escolhe os destaques,
a vitrine de categorias monta as capas e a contagem, e o catálogo gera os
filtros só das categorias que têm vestido cadastrado. Criar uma categoria nova
é acrescentá-la ao tipo `CategoriaPeca` e às quatro tabelas do topo do arquivo.

Os outros arquivos de conteúdo são `casamentos.ts`, `google.ts` (perfil e
avaliações), `depoimentos.ts`, `cupons.ts`, `selos.ts`, `youtube.ts` e
`faq.ts`. Quase todos **somem sozinhos do site** enquanto estiverem vazios,
então dá para publicar sem eles e preencher depois.

---

## Cupons de parceira

Cada cupom em `src/data/cupons.ts` vira um link para divulgação:

```
https://seu-dominio.com.br/?cupom=NOIVA10
```

Quem abre esse link vê uma faixa de desconto no topo do site, que fica
guardada no navegador dela por 30 dias, e o código entra automaticamente na
mensagem do WhatsApp. **Não há checkout**: o cupom é um recado para a loja
saber por onde a cliente chegou e qual desconto prometer.

O código é revalidado a cada carregamento — cupom vencido, desativado ou que
estourou o limite de usos simplesmente para de valer, sem precisar avisar
ninguém.

---

## O painel administrativo (`/admin`)

Existe para **demonstrar** como será operar a loja: cadastrar vestido, criar
cupom, trocar o WhatsApp. As telas são de verdade e as edições aparecem no
site na hora.

O que ele **não** é, e isso precisa ficar claro para quem for ver a demonstração:

- **não tem banco de dados.** Tudo é gravado no `localStorage` do navegador de
  quem está mexendo. Não aparece para a cliente, não aparece em outro
  computador e some se você limpar os dados de navegação;
- **não tem autenticação.** A entrada é um botão, e o endereço `/admin` é
  público. Não guarde nada sensível ali;
- **não publica nada.** O que a visitante vê continua sendo o conteúdo de
  `src/data/`, versionado no Git e enviado no deploy.

O próprio painel avisa isso na tela, e tem um botão "descartar minhas
alterações" para voltar ao conteúdo do código.

Ligar isso a um backend de verdade é outro projeto: exige banco, autenticação
e upload de imagem. O que existe aqui é o desenho das telas e o fluxo, para
decidir o que vale construir antes de construir.

---

## Onde colocar as imagens

As fotos publicadas ficam em **`public/`**, e são geradas a partir do dump do
Instagram por um script:

```bash
node scripts/importar-instagram.mjs
```

O dump do Instagram vem com nome ilegível (`imgi_36_753237135_..._n.webp`). A
tabela `MAPA` em `scripts/importar-instagram.mjs` traduz o número de cada foto
para o caminho e o nome que o site usa, e o script já redimensiona para no
máximo 1600 px de lado. **Para trocar a foto de um vestido, mude o número na
tabela e rode o script de novo** — o `pecas.ts` continua apontando para o mesmo
caminho.

A pasta `instagram/` não faz parte do repositório (ver `.gitignore`): é material
de trabalho. O que o site publica é o resultado do script.

```
public/
  pecas/                     fotos do catálogo
  casamentos/                fotos dos casamentos exibidos na home
  atelier/                   provador, atendimento, acessórios
  og-image.jpg               preview ao compartilhar o link (1200×630)
  favicon.png                ícone da aba
  apple-touch-icon.png       ícone ao salvar na tela inicial do iPhone
  logo.png                   ARTE DA MARCA — origem de todas as variações
  logo-simbolo.webp          selo — usado no header
  logo-completo-claro.webp   selo em branco — usado no rodapé preto
```

**Não use `src/assets` para as fotos.** Caminho em texto só funciona a partir de
`public/`; em `src/assets` o Vite exige `import` e a imagem some no build.

Proporção retrato **3:4** é o formato em que os cards exibem as fotos.

### Sobre os arquivos da logo

`public/logo.png` é a arte da marca com o fundo já removido à mão. É a **única**
coisa que precisa ser trocada quando chegar um arquivo melhor: as quatro
variações e os dois ícones saem dela, rodando o script de importação.

- As versões **normais** são a arte com os canais RGB multiplicados por 0,8. A
  logo é dourada e bem clara; reduzida à altura do header (44 px) sobre o
  off-white, a original virava uma mancha pálida. O escurecimento mantém o
  matiz e o alfa, então o lettering continua o mesmo.
- As versões **`-claro`**, para o rodapé preto, são a silhueta da logo
  preenchida de branco, tirada do próprio canal alfa. Sem isso o "Danielli" em
  dourado escuro sumiria no preto.
- **`favicon.png` e `apple-touch-icon.png`** vão achatados sobre branco: o iOS
  não aceita alfa no apple-touch-icon, e uma logo clara e transparente some na
  barra de um navegador em tema escuro.

O header usa **só o selo** e escreve "DANIELLI NOIVAS / ATELIER" com a tipografia
do site. Motivo: o nome dentro da logo, reduzido à altura do header, ficaria com
cerca de 4 px — ilegível.

A arte atual tem 150 px de lado, o que é o limite para o selo do rodapé. Se um
dia aparecer a logo em **SVG** ou em alta resolução, é ela que substitui
`public/logo.png`.

---

## Deploy na Vercel

O projeto é 100% estático.

1. Suba o repositório para o GitHub.
2. Na Vercel, **Add New → Project** e importe o repositório.
3. A Vercel detecta Vite sozinha. Confirme:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy.

O `vercel.json` já está no projeto com o rewrite que faz `/catalogo`, `/sobre` e
`/peca/:slug` funcionarem quando acessados direto ou recarregados — sem ele,
essas URLs dariam 404.

Depois do deploy, atualize `SITE_URL` em `src/lib/brand.ts` e as URLs de Open
Graph no `index.html` com o domínio real.

O build também gera `sitemap.xml`, `robots.txt` e o JSON-LD do negócio, a partir
dos mesmos arquivos de `src/data/` (ver `scripts/seo.ts`).

---

## Nota sobre o preview de links

Os robôs do WhatsApp, Facebook e Instagram **não executam JavaScript**. Como o
site é uma SPA sem servidor, eles leem apenas as tags que estão no `index.html`.

Na prática:

- Compartilhar **qualquer link** do site mostra o preview da loja
  (`og-image.jpg`, título e descrição gerais). Funciona.
- Compartilhar o link de **um vestido específico** mostra esse mesmo preview
  genérico, e não a foto e o nome daquele modelo.

O componente `<Seo>` define título e descrição por página corretamente para o
Google, que executa JavaScript. Se um dia o preview por vestido for importante,
o caminho é pré-renderizar as rotas no build (`vite-plugin-ssg` ou similar) —
continua estático e continua na Vercel.

---

## Estrutura

```
public/                fotos, logo e ícones (gerados pelo script de importação)
scripts/
  importar-instagram.mjs   dump do Instagram → public/
  webp.mjs                 conversão avulsa para WebP
  seo.ts                   sitemap, robots e JSON-LD no build
src/
  components/          Header, Footer, CardPeca, GaleriaPeca, BotaoWhatsapp, Seo…
  data/                pecas · casamentos · google · depoimentos · cupons ·
                       selos · youtube · faq ← conteúdo
  lib/                 brand.ts (contatos) · loja.ts (estado) · preco.ts ·
                       historico.ts · utils.ts
  pages/               Home · Catalogo · Peca · Sobre · ComoFunciona · NaoEncontrada
  pages/admin/         painel de demonstração (vestidos, cupons, configurações)
  index.css            design system (tokens + componentes)
tailwind.config.ts     mapeia os tokens para o Tailwind
```

### Sobre as cores

As cores ficam em `src/index.css` como **trio de canais RGB**, não hex:

```css
--preto-rgb: 36 35 33;           /* #242321 */
--preto: rgb(var(--preto-rgb));  /* pronto para CSS puro */
```

É o único formato em que o Tailwind consegue aplicar opacidade — sem ele,
`text-preto/70` é silenciosamente ignorado. Para trocar uma cor, converta o hex
para os três canais decimais.

A paleta e, principalmente, **a proporção dela**:

| cor | hex | uso | fatia |
| --- | --- | --- | --- |
| Off-white | `#FAF9F6` | fundo principal | ~70% |
| Preto suave | `#242321` | títulos, textos e faixas invertidas | ~20% |
| Bege champagne | `#D8D0C2` | divisores e superfícies secundárias | ~8% |
| Dourado | `#C9B56B` | só detalhe: filete, eyebrow em fundo escuro | ~2% |
| Branco | `#FFFFFF` | cards e áreas de contraste | — |

**O dourado não é cor estrutural.** Ele não pinta fundo, não pinta botão
principal e não carrega bloco de texto. Sobre o off-white ele rende 1,94:1, ou
seja, é ilegível como texto em fundo claro e nenhum tamanho de fonte conserta
isso; sobre o preto suave sobe para 7,71:1 e aí funciona como palavra. Daí a
regra: **dourado é filete em fundo claro e pode ser texto em fundo escuro.**

O `--cinza` (`#6B6560`) é o preto rebaixado usado em rótulos e texto
secundário; é o mais claro que ainda cumpre 4,5:1 sobre o off-white.

Tipografia: **Cormorant Garamond** nos títulos e **Montserrat** no corpo e na
navegação.

Sobre fundo escuro use as variantes claras: `.filete-claro`,
`.btn-contorno-claro` e a prop `variante="claro"` do `BotaoWhatsapp`.
