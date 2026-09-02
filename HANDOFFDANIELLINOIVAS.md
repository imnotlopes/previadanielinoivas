# Handoff — Danielli Noivas

> Documento de passagem de uma sessão remota (Claude Code na nuvem) para uma
> sessão local. Contém tudo que foi levantado e decidido: o estado real do
> código, o brief da cliente, a reestruturação acordada, o que está travado e
> o que ainda precisa ser decidido.
>
> **Nada de código foi alterado na sessão que gerou este documento.** Só
> leitura, diagnóstico e conversa. A árvore do Git está limpa.

---

## 1. Onde o projeto está

**Repositório:** `imnotlopes/previadanielinoivas` — **público**, default branch
`main`, deploy em `previadanielinoivas.vercel.app`.

**Branch de trabalho da sessão remota:** `claude/projeto-sem-arquivos-locais-fsrlnb`
(idêntica ao remoto, no commit `06992e1 "Adapta o site para a Danielli Noivas,
loja de aluguel"`).

**Build:** validado e passando. `npm install` + `npm run build` rodam limpos —
TypeScript + Vite, build em ~2s.

Uma observação sobre o `package-lock.json`: rodar `npm install` com npm 10.9.7
apaga 102 linhas de campos `libc`/`glibc` das dependências opcionais do `sharp`,
porque o lockfile foi gerado por um npm mais novo. Isso é ruído de versão de
ferramenta, não mudança real. **Não commite esse diff** — reverta com
`git checkout -- package-lock.json`.

---

## 2. O que o projeto é hoje

Um **site de vitrine estático** para loja de aluguel de vestidos. Sem carrinho,
sem checkout, sem estoque, sem calendário. O vestido é exibido e a conversa
continua no WhatsApp.

O código nasceu como vitrine de um atelier de costura **sob medida** e foi
readaptado para a Danielli, que é loja de **aluguel**. A estrutura sobreviveu
inteira à troca — o que é a prova de que a separação entre `src/data/` e o resto
funciona.

### Conteúdo atual, conferido

| item | quantidade |
|---|---|
| vestidos em `src/data/pecas.ts` | **27** |
| — categoria `noiva` | 16 |
| — categoria `festa` | 6 |
| — categoria `debutante` | 5 |
| marcados como `destaque` | 6 |
| fotos em `public/pecas/` | 43 |
| fotos em `public/casamentos/` | 11 |
| fotos em `public/atelier/` | 5 |
| casamentos cadastrados | 7 |
| avaliações do Google | 12 |
| depoimentos | 4 |
| perguntas de FAQ | 4 |
| cupons | 5 |
| vídeos do YouTube | 2 |

Cores em uso: branco (10), marfim (6), azul (3), dourado (2), prata (2), lilás,
preto, rosa, verde (1 cada).

### Stack

Vite 8 · React 19 · TypeScript 6 · Tailwind 3.4 · React Router 7 ·
lucide-react · sharp (WebP, fora do build) · oxlint.

Sem biblioteca de componentes (nada de shadcn/MUI). Tailwind 3.4 e **não** a 4,
por decisão deliberada: a 4 move a config para dentro do CSS e o projeto foi
especificado com `tailwind.config.ts` + `theme.extend`.

### As três camadas — e a do meio é o ativo mais importante

| camada | onde | o que faz |
|---|---|---|
| **conteúdo** | `src/data/*.ts` | a *semente*: peças, cupons, FAQ, casamentos, avaliações, YouTube — versionada no Git |
| **estado** | `src/lib/loja.ts` + `src/components/LojaProvider.tsx` | junta semente + edições do painel (localStorage) + cupom da visitante |
| **telas** | `src/pages/`, `src/components/` | leem `useLoja()`, **nunca** importam os dados direto |

**Essa camada do meio já é o ponto de costura para um backend.** Nenhum
componente sabe de onde vem a lista de vestidos. Trocar o `localStorage` por um
banco de verdade não exige reescrever tela nenhuma. Foi essa troca que obrigou
os auxiliares de `data/pecas.ts` a receberem a lista por parâmetro
(`pecasPorCategoria(lista, cat)` em vez de ler o import direto).

Detalhe de implementação: o provedor mora em `components/`, não em `lib/`,
porque um arquivo que exporta componente **e** funções soltas quebra o
hot-reload do Vite.

### Rotas

```
/                    Home            (vitrine)
/catalogo            Catalogo        (filtro por categoria, cor, busca, ordem, paginação — tudo na URL)
/peca/:slug          Peca            (ficha + galeria)
/sobre               Sobre
/como-funciona       ComoFunciona
/admin/*             Admin           (casca própria, fora do <Layout>)
*                    NaoEncontrada
```

Cada página é um `React.lazy`. O `<Suspense>` fica **dentro do Layout, em volta
do `<Outlet />`** — se ficasse por fora das `<Routes>`, header e rodapé
sumiriam e voltariam a cada troca de rota.

### O modelo de dados atual

```ts
interface Peca {
  slug: string
  nome: string                  // nome do VESTIDO, não da cliente
  categoria: 'noiva' | 'festa' | 'debutante'
  descricao: string             // silhueta + detalhe que identifica
  imagens: string[]             // caminhos a partir de /public
  destaque?: boolean
  precoAluguel: number | null    // null = "sob consulta" (estado de TODO o acervo)
  precoDe?: number | null
  cor: CorPeca                  // uma só por vestido
}
```

Duas convenções que **inverteram** na virada de atelier para loja de aluguel, e
que valem manter:

- **O título é o nome do vestido, não o da cliente.** O mesmo vestido veste
  várias noivas ao longo dos anos e não pertence a nenhuma. Também protege:
  nenhuma cliente aparece identificada sem autorização.
- **A descrição é o vestido, não o estilo.** Quem lê está comparando modelos,
  então a linha diz silhueta e detalhe ("Um ombro só, com babado estruturado"),
  nunca adjetivo de personalidade. E não chuta tecido: afirmar "renda francesa"
  sem certeza é pior do que dizer só "renda".

---

## 3. O brief da cliente (Danielli) — o que ela pediu

Chegou por áudio transcrito. Isto é o que ficou definido:

### 3.1. Ela não quer site

> "não quero mexer com site, por enquanto"

O produto é **material de WhatsApp**: links que ela manda pra cliente no meio da
conversa. Isso inverte as prioridades — o que importa passa a ser o preview do
link, o celular e a curadoria; não SEO nem navegação.

### 3.2. O fluxo comercial dela

```
noiva chama  →  "bom dia, vou te mandar nossa apresentação"
             →  noiva vê como funciona
             →  demonstra interesse
             →  aí ela manda o catálogo
```

### 3.3. Quatro peças, independentes

Ela foi explícita: **não precisa conectar nada.** "Eu consigo montar os
catálogos separados. Pra mim, não precisa conectar nada."

| # | peça | pra quem | conteúdo |
|---|---|---|---|
| 1 | **Apresentação Noiva** | noiva que acabou de chamar | enxuta ("mais sequinha"), visual, a frase da marca, como funciona, depoimentos |
| 2 | **Catálogo Noiva** | noiva que demonstrou interesse | só vestidos com foto profissional. Cor, numeração, vídeo |
| 3 | **Festa e Formatura** | formanda, madrinha, mãe | apresentação curta **junto** com o catálogo, num link só |
| 4 | **Painel** | a Danielli, no celular | cadastrar, publicar, esconder |

Depois: **15 anos / debutante**. (Ela falou "catálogo pra térreo", que é ruído
de transcrição — logo em seguida diz "depois a gente volta de 15 anos também".)

**Por que festa é separado de noiva:** são clientes diferentes, com sazonalidade
diferente. Nas palavras dela, "são dois clientes bem separados" — época de
formanda não é época de noiva. Dentro de festa ela distingue: formanda de alto
padrão, formatura normal, madrinha e mãe.

Título que ela pediu para essa peça: **"Vestidos de festas e formatura"**.

### 3.4. A frase da marca — obrigatória na apresentação

> **"A noiva vem pra escolher o vestido, e o vestido acaba escolhendo ela."**

O contexto que ela deu, e que precisa aparecer junto: a noiva chega com um
vestido salvo no celular, um print — mas só se resolve **no corpo, no espelho**.
É o melhor argumento pra ela sair do celular e vir provar.

### 3.5. Regra de vocabulário

- Material de **noiva** → sempre **"noiva"**. Nunca "cliente".
- Material de **festa/formatura** → "cliente" vale, para formanda, madrinha e mãe.

Nas palavras dela: "sempre vamos enfatizar que ela é a noiva".

### 3.6. Curadoria — ela não quer tudo no catálogo

> "eu não queria colocar tudo num catálogo, porque tem modelo que eu não tenho
> foto profissional dele"

Isso vira **campo**, não decisão de cadastro: cada vestido precisa de um estado
publicado/oculto, que ela liga e desliga do celular. O acervo interno dela pode
ser maior que o catálogo que a cliente recebe.

### 3.7. Ela só tem celular

> "eu tô sem PC aqui, eu tô sem notebook, tô sem nada. Se você falar pra mim que
> eu vou ter que mexer, eu vou ter que comprar um notebook urgente"

**Requisito duro:** o painel precisa ser operável do celular, e precisa ter
banco de verdade — um painel que grava no `localStorage` do navegador dela não
serve, porque o que ela cadastra tem que chegar no aparelho da cliente.

Ela também pediu para ser ensinada: "você me dá os cortes, você me ensina?
porque eu sou péssima nessas coisas".

### 3.8. Material que ela tem

- **PDFs dos fotógrafos** com noivas reais que casaram usando vestidos dela
- **Fotos da filha** — sugeridas para a capa, porque "aí eu sei que não vai ter
  problema" (autorização)
- **Vídeos** dos vestidos em modelos, além das fotos
- **Cor e numeração de todas as fotos** — ela confirmou ter os dois
- Coleção de festa e todas as cores que tem

### 3.9. Perguntas que ela fez, e as respostas

| pergunta | resposta |
|---|---|
| Dá pra pôr vídeo no catálogo? | **Sim.** Abre dentro do próprio catálogo, sem mandar separado |
| Consigo mexer só pelo celular? | **Sim**, se o painel for feito pra celular com banco real. Não precisa comprar notebook |
| Os catálogos ficam conectados? | **Não.** Links separados. Ligar a apresentação ao catálogo depois é um botão |
| Quanto custa? | **Não respondido — é o Edson quem responde.** Ela perguntou pra ele |

### 3.10. Ela quer depoimentos e Google

Gostou da ideia de depoimento ("eu acho muito bacana"). Também citou o Google
como interessante. Ver a seção 5 — o que existe hoje nesses dois arquivos é
fictício e precisa ser substituído pelo real.

---

## 4. A reestruturação acordada

O projeto deixa de ser um site com painel de apêndice e vira **três produtos
separados + o painel**:

```
APRESENTAÇÃO NOIVA    enxuta, animada, uma peça só
                      → reusa a Home atual como base, cortada
                      → a frase da marca, como funciona, depoimentos reais

CATÁLOGO NOIVA        o acervo navegável
                      → só peças publicadas (com foto profissional)
                      → filtro por cor e numeração, foto + vídeo
                      → botão "quero provar este" → WhatsApp com o nome do vestido

FESTA E FORMATURA     apresentação curta + catálogo no mesmo link
                      → ocasiões: formanda alto padrão, formatura, madrinha, mãe

PAINEL                mobile-first, banco real
                      → cadastrar, publicar/ocultar, subir foto do celular
```

Depois: **15 anos**.

### O que muda de concreto no código

1. **As seções institucionais saem do `Layout`.** Hoje `SecaoDepoimentos`,
   `SecaoAvaliacoes`, `Faq` e `SecaoMapa` ficam grudadas depois do `<Outlet />`
   em toda rota — a regra era "qualquer página precisa fechar sozinha", porque
   não se controla por onde a visita entra. **Num catálogo isso é ruído:** quem
   está filtrando vestidos não quer FAQ e mapa embaixo da grade. Esse material
   passa a ser das apresentações.

2. **Cascas separadas.** A apresentação tem casca de peça de marketing; o
   catálogo tem casca de ferramenta, enxuta; o painel já tem a sua.

3. **`/sobre` e `/como-funciona`** são dobradas nas apresentações ou aposentadas
   (decisão em aberto — ver seção 6).

---

## 5. Implicações técnicas — as cinco que importam

### 5.1. O preview do link vira o item mais importante do projeto

Quando ela cola o link no WhatsApp, aparece um cartão com foto e título. **Esse
cartão é a primeira impressão, antes de qualquer clique.**

O problema: o site é uma SPA sem servidor, e **os robôs de preview do WhatsApp,
Facebook e Instagram não executam JavaScript** (o Google executa). O
`ARQUITETURA.md` §9 registra isso como limitação conhecida e "não prioridade".
**Agora é requisito**: são três links que precisam de três cartões distintos.

Saída recomendada: **build multi-página no Vite** (`build.rollupOptions.input`
com um HTML real por peça), cada um com suas próprias tags Open Graph
estáticas. Mantém tudo estático e barato na Vercel. Alternativa mais pesada:
pré-renderizar as rotas (`vite-plugin-ssg`).

Atenção ao mecanismo que já existe: `index.html` tem OG estático marcado com
`data-seo-estatico`, e `main.tsx` remove essas tags antes do primeiro render —
senão o documento fica com **duas** `<meta name="description">` e o Google
considera a estática, genérica. Qualquer mudança na estratégia de SEO precisa
respeitar isso.

### 5.2. O painel precisa de banco e de upload

Hoje: sem autenticação (a "entrada" é um botão e `/admin` é endereço público),
grava em `localStorage`, e o cadastro de fotos é uma `<textarea>` onde se cola
caminhos — porque as fotos entram por `scripts/importar-instagram.mjs`, não por
upload.

Com a Danielli operando do celular, os três buracos viram o trabalho central.
**A camada `lib/loja.ts` é onde isso se costura** — as telas não mudam.

Opção levantada: **Supabase** (banco + storage de imagem + auth). O conector
estava disponível na sessão remota.

### 5.3. Numeração, ocasião, vídeo e estado entram no modelo

```ts
interface Peca {
  // ... campos atuais ...
  numeracao: string | string[]      // ela tem para todas as fotos
  ocasiao?: 'formanda' | 'formatura' | 'madrinha' | 'mae'   // dentro de festa
  video?: string                    // arquivo ou link
  publicado: boolean                // a curadoria da seção 3.6
}
```

Numeração é a **segunda pergunta de toda cliente** e hoje não existe no modelo.

### 5.4. Mobile-first dos dois lados

A noiva olha no celular. A Danielli **cadastra** no celular. Não é só
responsividade do catálogo — o painel inteiro precisa ser pensado para o polegar.

### 5.5. Pipeline de ingestão de PDF

Os fotógrafos mandam PDF. Precisa de um script: **PDF entra → extrai as imagens
→ corta em 3:4 → converte pra WebP → alimenta a tabela com cor e numeração.**

Modelo a seguir: `scripts/importar-instagram.mjs`, que já faz exatamente isso
para o dump do Instagram (tabela `MAPA` traduz o número da foto para o caminho
que o site usa, e redimensiona para no máximo 1600px no lado maior).

Nota sobre corte: as fotos são exibidas em **3:4** (`aspect-[3/4] object-cover`).
Foto muito vertical perde altura no corte — uma 1:2,6 mostra só 51% de si mesma,
o que corta cabeça e barra do vestido. Quando não há foto melhor, a saída usada
no projeto foi preencher as laterais com uma versão desfocada e escurecida da
própria imagem até chegar em 3:4. Ver `marcia-classico-e-elegante.webp`.

---

## 6. O QUE NÃO PODE IR AO AR — bloqueadores

Estes já estavam no projeto e ficam **graves** agora, porque o material vai
direto pro WhatsApp de uma cliente:

### 6.1. As avaliações do Google são fictícias

`src/data/google.ts` — o próprio arquivo avisa em caixa alta: *"NADA neste
arquivo veio do Google. Nota, quantidade de avaliações e os dez depoimentos
abaixo foram ESCRITOS AQUI."* São 12 avaliações inventadas, mais `nota: 5` e
`totalAvaliacoes: 38` que o Google nunca deu.

**Publicar isso é propaganda enganosa.** Saídas: transcrever as reais do Perfil
da Empresa, ou esvaziar `avaliacoesGoogle = []` e zerar `totalAvaliacoes` — a
seção some sozinha.

### 6.2. Os nomes dos casais foram inventados

`src/data/casamentos.ts` — 7 casamentos com nomes fictícios sobre **fotos de
pessoas reais e identificáveis no dia do casamento delas**. Confirmar nome e
autorização de cada casal antes de qualquer publicação.

### 6.3. Os depoimentos são inventados

`src/data/depoimentos.ts` — os 4 foram escritos para o site poder ser visto de
pé. Substituir por reais (a Danielli quer, e tem) ou esvaziar.

### 6.4. Contato e identidade em branco

Em `src/lib/brand.ts`:

- `whatsapp: ''` e `whatsappExibicao: ''` — **enquanto vazio, todos os botões de
  WhatsApp do site caem no Instagram**
- `cidade: ''` — os títulos de SEO saem sem cidade, que é o termo que mais traz
  cliente local
- `SITE_URL` ainda é um endereço inventado da Vercel — as URLs canônicas e de
  Open Graph só ficam corretas depois de apontar pro domínio real
- `assinatura: 'Sonhos existem para serem realizados'` foi completada a partir
  de uma bio truncada no Instagram — confirmar a frase com ela

---

## 7. Decisões ainda em aberto

Foram levantadas na sessão remota e **não foram respondidas**:

1. **Persistência do painel** — Supabase (banco real) · continuar no
   localStorage por enquanto · Git como banco (painel exporta `src/data`, publicar
   = commit).
   *Observação: o requisito 3.7 (ela só tem celular) praticamente elimina as
   opções 2 e 3.*

2. **Público do catálogo** — só público (cliente navega) · só interno
   (ferramenta de acervo) · os dois, com visões diferentes.

3. **Destino de `/sobre`, `/como-funciona`, depoimentos, FAQ, Google e
   casamentos** — dobrar nas apresentações · manter as rotas mas tirar do Layout
   · aposentar.

4. **Dados de aluguel** — só numeração · numeração + status (disponível /
   alugado / manutenção) · tudo incluindo agenda de reserva por data · nada,
   mantém como vitrine.
   *Observação: o `ARQUITETURA.md` assume hoje, de forma consciente, que "o site
   não sabe se um vestido está livre numa data" — disponibilidade é assunto da
   conversa no WhatsApp.*

---

## 8. Material e privacidade — ler antes de mover arquivo

**O repositório é PÚBLICO.** Confirmado via API do GitHub: `"private": false`.

As 43 fotos já em `public/pecas/` vieram do Instagram — já eram públicas, risco
baixo. **O material novo é diferente:** os PDFs dos fotógrafos são noivas reais
identificáveis no dia do casamento delas, e há fotos da filha da Danielli.

Jogar isso num repositório público publica pra qualquer pessoa na internet, com
URL permanente e histórico do Git que **não se apaga só deletando o arquivo
depois**.

O `.gitignore` do projeto já tinha tomado essa decisão de propósito — o dump do
Instagram, os prints das avaliações e o projeto de referência estão todos
excluídos, com o comentário *"continuam no seu disco, apenas fora do
repositório"*. **Manter a regra para o material novo.**

Caminhos possíveis, em ordem de recomendação:

1. **Trabalhar localmente** (é o que está sendo feito com este handoff) — os
   arquivos estão do lado, sem upload e sem exposição.
2. **Tornar o repositório privado** — se for preciso versionar o material. Não
   impede o deploy na Vercel.
3. **Manter o material fora do Git** e commitar só os WebP derivados que forem
   aprovados para publicação — que é o padrão que o projeto já usa.

---

## 9. Armadilhas do projeto — registradas para não custarem tempo de novo

Do `ARQUITETURA.md` §11, vale ter em mente:

- **Alpha modifier com hex falha em silêncio.** As cores são trios de canais
  (`--preto-rgb: 28 28 28`), não hex, porque é o único formato em que o Tailwind
  injeta transparência. Com hex, `text-preto/70` sai sólido ou transparente sem
  dar erro nenhum. O projeto inteiro foi construído com hex antes de isso ser
  descoberto, e metade dos gradientes estava invisível.
- **`tailwind.config.ts` não recarrega a quente.** Mudou o config, reinicie o
  `npm run dev`.
- **`overflow-x: clip`, e não `hidden`, no `html`.** `hidden` na raiz transforma
  o elemento em contêiner de rolagem e quebra o `position: sticky` do cabeçalho.
- **Nunca dimensione elemento em `vw` dentro de contêiner rolável** — `100vw`
  inclui a barra de rolagem e vira estouro horizontal. Os cards do carrossel
  usam `rem`.
- **iOS Safari dimensiona iframe pelo conteúdo** e ignora largura percentual. O
  contorno é `w-px min-w-full` mais wrapper com `overflow-hidden`.
- **Não rode regex em massa sobre arquivo-fonte pelo PowerShell.** Um substituto
  mal escapado corrompeu sete arquivos de uma vez neste projeto.

Sobre a paleta, para não quebrar a regra sem querer: **dourado (`#C9B56B`) é
filete em fundo claro; só pode ser palavra em fundo escuro.** Sobre o off-white
ele rende 1,94:1, ilegível, e nenhum tamanho de fonte conserta. Sobre o preto
suave sobe para 7,71:1. Por isso o botão principal é preto, não dourado.

---

## 10. Por onde retomar

Sugestão de ordem, do que destrava mais para o que depende de decisão:

1. **Calibrar a ingestão** — abrir 2 ou 3 PDFs dos fotógrafos, ver a qualidade
   real, decidir o corte, e escrever `scripts/importar-pdf.mjs`.
2. **Fechar as decisões da seção 7** — principalmente a 1 (persistência), que
   determina todo o resto.
3. **Separar as três peças** — rotas, cascas, e o build multi-página que resolve
   o preview de WhatsApp (5.1).
4. **Modelo de dados novo** (5.3) e a migração das 27 peças existentes.
5. **A apresentação de noiva**, com a frase da marca e o vocabulário da seção 3.5.
6. **O painel de celular** (5.2).
7. **Limpar os bloqueadores da seção 6** antes de qualquer link ir para uma
   cliente real.

### O que perguntar para a Danielli

1. Os **PDFs originais** dos fotógrafos (não print de tela) — resolução importa
2. Por vestido: **nome ou código, cor, numeração e categoria** (noiva / festa /
   formatura / madrinha / mãe)
3. **Quais vestidos NÃO entram** — os sem foto profissional
4. As **fotos da filha** para a capa
5. **Vídeos** — pode ser link do Instagram, se for mais fácil
6. **Depoimentos reais** — print da conversa no WhatsApp já serve
7. **Autorização das noivas reais** — um "pode usar" por escrito de cada uma
8. **WhatsApp oficial e link do Google da loja** (para puxar as avaliações
   verdadeiras)
9. **Confirmar a assinatura da marca** ("Sonhos existem para serem realizados")

---

## 11. Documentos do próprio projeto

Vale ler antes de mexer — são densos e explicam o *porquê* de cada decisão:

- **`ARQUITETURA.md`** (586 linhas) — o que foi decidido, por quê, e onde cada
  decisão mora no código. As seções mais úteis agora: §1 (escopo), §5-A (a
  camada de estado), §9 (SEO em duas camadas), §11 (armadilhas), §13 (em aberto).
- **`README.md`** (360 linhas) — operação: trocar telefone, adicionar vestido,
  subir para a Vercel. A primeira tabela lista todo o conteúdo de prévia que
  precisa ser substituído.
