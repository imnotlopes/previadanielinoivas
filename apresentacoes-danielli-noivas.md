# Atelier Danielli Noivas: converter o site em ferramenta de venda

Brief de execução. Leia inteiro antes de escrever código.

---

## 1. Contexto

Existe hoje uma prévia publicada em `https://previadanielinoivas.vercel.app`, construída como site institucional com catálogo. Rotas atuais:

| Rota | Conteúdo |
|---|---|
| `/` | Landing de noiva, cerca de 15.300px de altura, 12 seções |
| `/catalogo` | Grade com 40 vestidos de noiva, busca, filtros, "carregar mais" |
| `/catalogo/noiva-*` | 40 páginas individuais |
| `/festa` | 6 vestidos de festa (página órfã, sem link de lugar nenhum) |
| `/festa/festa-*` | 6 páginas individuais |
| `/admin` | Painel de demonstração em localStorage |

Build estático com HTML pré-renderizado por rota e bundles por página (`assets/principal-*.js`, `assets/admin-*.js`), hospedado na Vercel. Sem backend, sem formulário.

**A cliente redefiniu o produto.** Não é um site. São apresentações de venda que ela cola no WhatsApp depois que a cliente já a procurou. O tráfego não vem de busca, vem do link enviado por ela.

---

## 2. Objetivo

Entregar três apresentações independentes, cada uma com link próprio, otimizadas para leitura no celular dentro de uma conversa de WhatsApp já em andamento.

| Rota | Público | Prioridade |
|---|---|---|
| `/noivas` | Noivas | 1, entregar sozinha |
| `/madrinhas` | Madrinhas, formandas e mães | 2 |
| `/noivos` | Noivos e padrinhos | 3, sem material ainda |

Cada apresentação precisa funcionar sem que a pessoa tenha passado por qualquer outra página do domínio.

O papel da peça é: criar desejo, provar autoridade, e devolver a pessoa para a conversa no WhatsApp com a prova encaminhada. Não é explicar o que é um ateliê.

---

## 3. Regras inegociáveis

1. **Sem valores.** Nenhum preço, e também nenhum "valor sob consulta" (hoje aparece 51 vezes e lê como informação faltando). No lugar do preço, exibir cores disponíveis e tamanhos.
2. **Sem contagem de peças.** Remover "40 vestidos", "VER OS 40 VESTIDOS", "40 vestidos para provar", o contador acima da grade e o bloco de estatística. A cliente pediu linguagem sem número: "diversos modelos disponíveis no ateliê".
3. **A palavra "catálogo" sai do texto visível e das URLs.** O produto se chama apresentação.
4. **Nenhuma foto de pessoa real sem autorização.** Detalhe na seção 8.
5. **`noindex, nofollow` nas três apresentações.** É material de conversa comercial, não conteúdo de busca.
6. **Nada de exaustividade.** A apresentação mostra uma amostra e diz isso explicitamente. O acervo completo fica no ateliê.

---

## 4. O que remover

- As 46 rotas individuais de peça (`/catalogo/noiva-*` e `/festa/festa-*`). A peça abre em overlay na própria apresentação.
- Campo de busca no acervo.
- Painel de filtros e ordenação.
- Botões "CARREGAR MAIS" e "Mostrar todos os 40 de uma vez".
- Alternância de densidade da grade ("MAIS POR VEZ").
- Toda contagem numérica de peças, em qualquer lugar.
- Placeholders de briefing que estão publicados na home hoje e precisam sair antes de qualquer coisa:
  - "ESPAÇO RESERVADO. Aqui entram os anos de atelier e quantas noivas já saíram daqui vestidas. Só números que ela consiga confirmar."
  - "NOME DA NOIVA" e "Aqui entra a fala dela, do jeito que ela escreveu."
  - "Espaço reservado. Cada depoimento é a foto dela mais a fala dela. Print de conversa no WhatsApp serve de fonte..."
- Entradas de peça no `sitemap.xml`. O sitemap passa a listar só a home institucional futura.

---

## 5. Estrutura de cada apresentação

Seis a oito blocos verticais. Meta de leitura: dois minutos no polegar. Cada bloco se sustenta sozinho, porque a leitora rola rápido e para no que interessa.

### Bloco 1: abertura
- Foto forte de capa, específica do público.
- Saudação personalizável (ver seção 7).
- Uma linha de posicionamento e um botão para o WhatsApp.

### Bloco 2: autoridade
Conteúdo confirmado pela cliente, e que não existe em lugar nenhum do site hoje:
- No mercado desde abril de 2004 (22 anos).
- Atende noivas, madrinhas, padrinhos, mães e formandas, incluindo formatura de alto padrão.
- Representante das marcas Center Noivas, Rainha Noivas, MD Noivas e Monê, além de vestidos importados da Turquia.

Marca representada é o que separa ateliê sério de loja comum. Dar peso visual a esse bloco.

### Bloco 3: o que o ateliê oferece
Reaproveitar os quatro blocos que já existem e funcionam:
- Prova com hora marcada: atendimento individual, sem fila e sem pressa.
- Ajuste no seu corpo: incluído no aluguel, feito antes de você levar.
- Data reservada: a peça fica bloqueada para o dia do seu evento.
- Devolução sem lavar: da higienização cuidamos nós.

### Bloco 4: os modelos
- Grade simples, 8 a 12 peças por apresentação, sem paginação.
- Cada card: foto, identificação da peça, cores disponíveis, tamanhos.
- Toque no card abre overlay em tela cheia com as fotos maiores e o botão de marcar.
- Frase obrigatória acima ou abaixo da grade: deixar explícito que são alguns dos modelos e que o acervo completo fica no ateliê.

### Bloco 5: prova social
- Fotos de clientes reais autorizadas, com depoimento.
- Enquanto os depoimentos não chegarem, o bloco não é renderizado. Nada de placeholder no ar.

### Bloco 6: como funciona
Os quatro passos que já existem: agenda, prova sem compromisso, data reservada, ajuste. Encurtar os textos, é ferramenta de venda e não landing longa.

### Bloco 7: encerramento
- Botão principal de WhatsApp com mensagem pré-escrita, diferente por apresentação (seção 6).
- Endereço e cidade quando preenchidos.

---

## 6. O motor: seleção e retorno ao WhatsApp

Este é o recurso central do produto. Sem ele, é um PDF em HTML.

Fluxo:
1. A cliente marca as peças que quer provar (botão de marcar no card e no overlay).
2. Um botão fixo mostra quantas marcou e permite enviar.
3. Ao enviar, abre o WhatsApp com mensagem já montada.

Formato da mensagem gerada:

```
Oi Danielli! Vi a apresentação de noivas e queria provar estes modelos:
- [identificação da peça 1]
- [identificação da peça 2]
- [identificação da peça 3]

Meu casamento é em [data, se informada].
```

Regras:
- O texto de abertura muda por apresentação ("apresentação de noivas", "de madrinhas e formandas", "de noivos e padrinhos"). É assim que a cliente sabe de qual peça veio cada contato, sem instalar ferramenta nenhuma.
- Campos de data do evento e manequim continuam opcionais.
- A seleção persiste em `localStorage` enquanto a pessoa navega.
- Enquanto o número de WhatsApp não estiver preenchido nas configurações, manter o comportamento atual de cair no Instagram, e não gerar link quebrado.

---

## 7. Link personalizado

A apresentação aceita um parâmetro de nome:

```
/noivas?nome=Camila
```

Quando presente, o bloco de abertura exibe uma saudação com o nome. Sem o parâmetro, exibe a versão neutra. Sanitizar a entrada (só letras, espaço e acento, limite de caracteres, sem HTML).

Isso é o que faz a peça deixar de parecer material encaminhado e passar a parecer material montado para aquela cliente.

---

## 8. Correções de conteúdo obrigatórias

1. **Legenda errada.** O site afirma hoje, na capa da apresentação e na peça "Aurora", que o vestido foi o que "a Natália, filha da Danielli, escolheu para o próprio casamento". Está errado em três pontos: não é o vestido da filha, a cor não é marfim e sim branco, e o nome "Aurora" foi inventado na prévia. Natália é noiva cliente, não é a filha da Danielli.
2. **Todos os nomes e cores das peças na prévia são fictícios** (Aurora, Isadora, Valentina, Malu, Mariana, e os demais). Nenhum vai para produção sem confirmação da cliente. Enquanto não houver confirmação, usar identificação neutra por código.
3. **Autorização de imagem.** A cliente autorizou o uso da foto da noiva Natália e da foto da filha dela. As fotos em `public/casamentos/` incluem uma segunda cliente (arquivos `thamiris-rodrigo-*`) que não foi autorizada. Remover essas imagens do produto até haver autorização escrita.
4. **Rodapé** com ano fixo "© 2026". Trocar por ano calculado.

---

## 9. Modelo de dados

Uma fonte única de dados para as três apresentações.

```ts
type Publico = 'noivas' | 'madrinhas' | 'noivos'

type Peca = {
  codigo: string          // identificação interna, obrigatória
  nome?: string           // só se a cliente confirmar nomes
  publico: Publico
  fotos: string[]         // primeira é a capa
  video?: string
  cores: string[]         // ex: ['Branco', 'Marfim']
  tamanhos: string[]      // ex: ['38', '40', '42']
  descricao: string       // uma linha, ex: 'Renda com gola alta e manga longa'
  destaque: boolean
  visivel: boolean
  preco: null             // campo previsto, desligado nesta fase
}

type Config = {
  whatsapp: string        // país + DDD + número, só dígitos
  whatsappExibicao: string
  instagram: string
  cidade: string          // "Cidade, UF"
  endereco?: string
  mostrarPrecos: false    // chave que liga a fase de catálogo no futuro
}
```

O campo `preco` e a chave `mostrarPrecos` ficam construídos e desligados. A cliente já sinalizou que quer catálogo com valores numa fase seguinte, e essa fase precisa ser uma chave, não uma refatoração.

---

## 10. Metadados por apresentação

Cada rota precisa de `og:title`, `og:description` e `og:image` próprios. Quando a cliente cola o link no WhatsApp, esse card é a primeira impressão, antes de a página carregar. As três não podem compartilhar a mesma foto de noiva.

Adicionar `<meta name="robots" content="noindex, nofollow">` nas três apresentações.

---

## 11. Painel administrativo

O painel em `/admin` continua sendo demonstração em `localStorage` nesta fase. Ajustes necessários:

- Trocar o campo de preço por cores e tamanhos na edição da peça.
- Adicionar o campo de público na peça.
- Remover da tela inicial o alerta "Nenhum vestido tem preço", que deixa de fazer sentido.
- Manter os alertas de WhatsApp e cidade não preenchidos.
- Manter o módulo de cupons como está. Não é prioridade nesta fase.

---

## 12. Fora de escopo

Não construir nesta entrega:

- Backend, banco de dados ou autenticação real no painel.
- Formulário de agendamento com calendário. O agendamento acontece na conversa do WhatsApp.
- Carrinho, checkout ou qualquer fluxo de pagamento.
- Reconstrução da home institucional. Ela é fase 2 e sai da mesma base.
- A apresentação de noivos e padrinhos além do esqueleto vazio. Não existe uma única foto de traje masculino no projeto.

---

## 13. Ordem de execução

1. Remover os placeholders de briefing publicados e as fotos sem autorização. Isso é o primeiro commit, isolado.
2. Criar a base de dados de peças e o componente de apresentação, com os blocos da seção 5.
3. Publicar `/noivas` completa e funcionando de ponta a ponta, incluindo seleção e retorno ao WhatsApp.
4. Publicar `/madrinhas`, reaproveitando as 6 peças de festa que já existem.
5. Deixar `/noivos` como esqueleto, esperando material.
6. Limpar as rotas antigas (`/catalogo`, `/festa` e as 46 páginas de peça) com redirecionamento para a apresentação correspondente.

---

## 14. Critérios de aceite

- [ ] Nenhuma ocorrência da palavra "catálogo" no texto visível ou nas URLs das apresentações
- [ ] Nenhum número de peças em qualquer texto
- [ ] Nenhuma ocorrência de "valor sob consulta"
- [ ] Nenhum texto de briefing ou placeholder no ar
- [ ] Nenhuma foto de pessoa sem autorização confirmada
- [ ] As três rotas abrem sozinhas, sem depender de navegação anterior
- [ ] `noindex` presente nas três
- [ ] `og:image` e `og:title` distintos por apresentação
- [ ] Seleção de peças gera mensagem de WhatsApp com a lista correta e o texto de origem correto
- [ ] `?nome=` renderiza a saudação personalizada e a entrada é sanitizada
- [ ] Sem número de WhatsApp configurado, os botões caem no Instagram e nenhum link quebrado é gerado
- [ ] A apresentação abre em menos de 2 segundos em conexão móvel simulada
- [ ] Grade legível e navegável em tela de 360px de largura
- [ ] Ano do rodapé calculado

---

## 15. Pendências com a cliente

Bloqueiam parte da execução e precisam ser cobradas em paralelo:

- Fotos das peças em modelo, com código, cores disponíveis e tamanhos
- Depoimentos das clientes, com autorização de fala e de imagem separadas
- Autorização escrita da segunda cliente das fotos de casamento, ou confirmação de remoção
- Foto da filha da Danielli e definição de como creditar
- Número de WhatsApp, cidade e endereço
- Confirmação se as peças terão nome próprio ou identificação por código
- Material de trajes masculinos para a apresentação de noivos e padrinhos
