# Guia de Criação de Slides (JSON)

A plataforma de slides é alimentada por arquivos JSON. Cada aula possui um array principal contendo objetos. Cada objeto representa um **Slide**.

Abaixo, detalhamos todos os tipos de slides disponíveis, seus parâmetros, e as opções de formatação.

---

## 1. Estrutura Base (Comum a todos os slides)

Todo slide precisa ter, no mínimo, a seguinte estrutura:

```json
{
  "id": 1,
  "type": "intro",
  "title": "Título Principal do Slide",
  "subtitle": "Um subtítulo de apoio",
  "content": {
     // O conteúdo varia dependendo do "type" do slide
  }
}
```

---

## 2. Tipos de Slides (`type`)

O motor suporta 4 tipos principais de slides, controlados pela propriedade `"type"`:

1. `"intro"`: Usado para aberturas de aula ou de módulo.
2. `"theory"`: Usado para explicações teóricas, textos longos em duas colunas.
3. `"practice"`: Usado para checklists, ferramentas, papéis de pessoas e tópicos passo-a-passo.
4. `"image"`: Slide exclusivo para exibir imagens gigantes (ex: infográficos, tabelas grandes).
5. `"code"` (Opcional): Slide de código.

---

### A. Slide de Introdução (`"type": "intro"`)

**Ideal para:** Primeira tela da aula ou abertura de um novo capítulo.

```json
{
  "id": 1,
  "type": "intro",
  "title": "Apresentação da Aula",
  "subtitle": "O que vamos aprender",
  "content": {
    "badge": "Aula 01",
    "description": "Nesta aula vamos mergulhar fundo nos conceitos essenciais de...",
    "keyPoints": [
      "Ponto 1 para aprender",
      "Ponto 2 para aprender",
      "Ponto 3 para aprender"
    ],
    "image": {
      "url": "https://url-da-foto.jpg",
      "alt": "Descrição acessível da foto",
      "position": "right" 
    }
  }
}
```

*Nota:* O uso de `"image"` fará o slide dividir-se em duas colunas. Se `"position"` for omitido, o padrão é a direita.

---

### B. Slide Teórico (`"type": "theory"`)

**Ideal para:** Textos explicativos com parágrafos.

```json
{
  "id": 2,
  "type": "theory",
  "title": "Como o Design afeta o Código",
  "subtitle": "A importância da colaboração",
  "content": {
    "sections": [
      {
        "heading": "Estética ≠ Experiência",
        "text": "O texto descritivo desta seção. Pode conter várias linhas."
      },
      {
        "heading": "Carga Cognitiva",
        "text": "Outro texto descritivo..."
      }
    ],
    "callout": {
      "type": "info", // "info", "tip", "warning" ou "important"
      "text": "Esta é uma caixa de destaque para chamar a atenção do aluno!"
    },
    "image": {
      "url": "https://url-da-foto.jpg",
      "alt": "Descrição da foto",
      "position": "right" // ou "left"
    }
  }
}
```

---

### C. Slide Prático / Lista (`"type": "practice"`)

**Ideal para:** Apresentar listas de coisas, pessoas, papéis, regras e passos práticos com ícones!

```json
{
  "id": 3,
  "type": "practice",
  "title": "Papéis em um Squad Ágil",
  "subtitle": "Quem faz o que?",
  "content": {
    "items": [
      {
        "title": "Desenvolvedor",
        "detail": "Cria e implementa a aplicação no código.",
        "icon": "code" 
      },
      {
        "title": "Designer",
        "detail": "Monta protótipos visuais.",
        "icon": "brush"
      }
    ],
    "callout": {
      "type": "tip",
      "text": "Pense no design antes do código!"
    },
    "image": {
      "url": "https://url-da-foto.jpg",
      "alt": "Squad",
      "position": "left"
    }
  }
}
```

**Sobre o parâmetro `"icon"`:** Você pode usar *qualquer nome de ícone* que exista na biblioteca [Google Material Icons (Round)](https://fonts.google.com/icons?icon.style=Rounded). (Ex: `home`, `person`, `settings`, `account_balance`).

---

### D. Slide de Imagem / Infográfico (`"type": "image"`)

**Ideal para:** Mostrar uma única imagem gigante com destaque total (ex: fluxograma, print de tela, arquitetura de software).

```json
{
  "id": 4,
  "type": "image",
  "title": "Fluxograma de Autenticação",
  "subtitle": "Como funciona o Firebase Auth",
  "content": {
    "imageUrl": "https://url-da-imagem-enorme.jpg",
    "imageAlt": "Diagrama de arquitetura",
    "description": "Aqui embaixo você pode colocar uma legenda legal para sua imagem, explicando detalhes importantes."
  }
}
```

---

## 3. Resumo de Propriedades Especiais

| Propriedade JSON | Onde pode ser usada? | Função |
| :--- | :--- | :--- |
| `"image"` | `intro`, `theory`, `practice` | Cria um layout em 2 colunas. Requer `"url"` e opcionalmente `"alt"` e `"position" : "left" | "right"`. |
| `"callout"` | `theory`, `practice` | Cria um retângulo de aviso/dica colorido no pé da página. Requer `"type" : "info" | "tip" | "warning"` e `"text"`. |
| `"icon"` | Dentro de `content.items` em `practice` | Renderiza um ícone elegante do Google Material Icons ao lado do item da lista. |
| `"badge"` | `intro` | Um pequeno chip (ex: "Aula 01") exibido no topo do slide. |

---

## Dicas Rápidas para os próximos JSONs:

1. Sempre busque imagens com boa resolução (acima de 1200px) e evite textos gigantes dentro das imagens, preferindo fontes grandes no próprio JSON para manter a acessibilidade e contraste.
2. Evite colocar muito texto em `"sections"` de slides teóricos; se for muito texto, dívida em dois slides para manter a leitura agradável no projetor.
3. Brinque com os ícones! Consulte [Google Fonts Icons](https://fonts.google.com/icons) para deixar os slides `practice` mais vivos.
