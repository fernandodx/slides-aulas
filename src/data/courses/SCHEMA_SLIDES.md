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

O motor suporta 5 tipos principais de slides, controlados pela propriedade `"type"`:

1. `"intro"`: Usado para aberturas de aula ou de módulo.
2. `"theory"`: Usado para explicações teóricas, textos longos em duas colunas.
3. `"practice"`: Usado para checklists, ferramentas, papéis de pessoas e tópicos passo-a-passo.
4. `"image"`: Slide exclusivo para exibir imagens gigantes (ex: infográficos, tabelas grandes).
5. `"assessment"`: Usado para dinâmicas de avaliação acadêmica (Seminários, Projeto Final e Entrega de Atividades).
6. `"code"` (Opcional): Slide com snippet de código formatado e botão de copiar.

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

### E. Slide de Avaliação (`"type": "assessment"`)

**Ideal para:** Apresentar dinâmicas avaliativas, prazos, critérios de nota e formato de submissão de forma clara e visual para a turma.

O slide de avaliação suporta 3 modalidades principais, definidas por `"assessmentType"`:
1. `"seminar"` (Seminário)
2. `"final_project"` (Projeto Final)
3. `"activity"` (Entrega de Atividade)

---

#### 1. Subtipo Seminário (`"assessmentType": "seminar"`)

Contempla: **Definição de temas**, **Forma de avaliação**, **Data** e **Forma de entrega**.

```json
{
  "id": 5,
  "type": "assessment",
  "title": "Seminário: Arquitetura de Software",
  "subtitle": "Apresentação em equipes sobre padrões modernos",
  "content": {
    "assessmentType": "seminar",
    "badge": "Avaliação A1",
    "date": "28/10/2026",
    "topics": [
      {
        "title": "Microsserviços vs Monolitos Modulares",
        "description": "Trade-offs de latência, escalabilidade e complexidade operacional."
      },
      {
        "title": "Serverless & Edge Computing",
        "description": "Casos de uso com Cloudflare Workers e Firebase Functions."
      },
      {
        "title": "Event-Driven Architecture",
        "description": "Comunicação assíncrona com Apache Kafka e RabbitMQ."
      }
    ],
    "evaluationCriteria": [
      {
        "label": "Domínio Técnico",
        "weight": "40%",
        "detail": "Profundidade dos conceitos e resposta às perguntas da banca."
      },
      {
        "label": "Clareza e Didática",
        "weight": "30%",
        "detail": "Estrutura dos slides, postura e clareza na exposição."
      },
      {
        "label": "Demonstração Prática",
        "weight": "30%",
        "detail": "Exemplo funcional em código ou diagrama arquitetural detalhado."
      }
    ],
    "deliveryFormat": "Apresentação ao vivo de 15 minutos por grupo + envio dos slides em PDF via Google Classroom até as 18h do dia do seminário.",
    "callout": {
      "type": "tip",
      "text": "Todos os membros do grupo devem apresentar pelo menos uma parte do conteúdo."
    }
  }
}
```

---

#### 2. Subtipo Projeto Final (`"assessmentType": "final_project"`)

Contempla: **Entrega via Pull Request no GitHub**, **Padrões de sala de aula além do projeto alvo** e **Deploy em produção**.

```json
{
  "id": 6,
  "type": "assessment",
  "title": "Projeto Final: Dashboard Interativo",
  "subtitle": "Entrega consolidada da disciplina",
  "content": {
    "assessmentType": "final_project",
    "badge": "Projeto Final (N2)",
    "date": "05/12/2026",
    "githubPr": {
      "instruction": "A entrega deve ser realizada impreterivelmente via Pull Request no repositório oficial da disciplina com template de PR preenchido.",
      "targetBranch": "release/v1.0"
    },
    "classroomStandards": [
      "Arquitetura em camadas (MVVM / Clean Architecture) respeitada",
      "Commits semânticos seguindo o padrão Conventional Commits",
      "Componentização limpa e fidelidade visual ao Design System (M3)",
      "Histórico de colaboração com participação equilibrada da equipe"
    ],
    "deploy": {
      "instruction": "A aplicação deve estar 100% funcional em ambiente de produção com HTTPS ativo.",
      "platforms": ["Vercel", "Firebase App Hosting", "Netlify"]
    },
    "evaluationCriteria": [
      { "label": "Qualidade do Código e Arquitetura", "detail": "Testes, tipagem e separação de responsabilidades." },
      { "label": "Fidelidade de Interface e UX", "detail": "Responsividade, acessibilidade e microinterações." },
      { "label": "Estabilidade do Deploy", "detail": "Zero erros no console em produção." }
    ],
    "callout": {
      "type": "important",
      "text": "Pull Requests submetidos após as 23h59 da data limite não serão aceitos."
    }
  }
}
```

---

#### 3. Subtipo Entrega de Atividade (`"assessmentType": "activity"`)

Contempla: **Descrição da atividade via README**, **Entrega no GitHub**, **Data** e **Forma de avaliar**.

```json
{
  "id": 7,
  "type": "assessment",
  "title": "Atividade Prática: Consumo de APIs REST",
  "subtitle": "Implementação de autenticação e listagem reativa",
  "content": {
    "assessmentType": "activity",
    "badge": "Atividade 04",
    "date": "14/11/2026",
    "activityReadme": {
      "description": "Toda a especificação da atividade deve constar no README.md do repositório.",
      "requirements": [
        "Instruções claras de instalação e execução (`npm run dev`)",
        "Documentação das variáveis de ambiente necessárias (`.env.example`)",
        "Demonstração visual (GIF ou screenshots) das telas implementadas"
      ]
    },
    "githubSubmission": {
      "instruction": "Envio do link ou pasta no repositório no GitHub com a estrutura solicitada.",
      "folderPath": "seuNome/Atividades/design_system",
      "documentation": "Arquivo .txt com descrição e link público do projeto",
      "requiredScreenshots": [
        "Foto da paleta de cores",
        "Foto dos componentes",
        "Foto da primeira tela do protótipo"
      ],
      "bonus": "Apresentação voluntária garante upgrade de 1 menção (MM → MS; MS → SS)"
    },
    "evaluationCriteria": [
      {
        "label": "README Completo",
        "weight": "30%",
        "detail": "Instruções reproduzíveis e documentação adequada."
      },
      {
        "label": "Funcionalidade Obrigatória",
        "weight": "50%",
        "detail": "Login, listagem e tratamento de erros de rede."
      },
      {
        "label": "Qualidade do Código",
        "weight": "20%",
        "detail": "Organização de pastas e ausência de warnings no linter."
      }
    ],
    "callout": {
      "type": "info",
      "text": "Dúvidas sobre o README podem ser tiradas no fórum da disciplina até 48h antes do prazo."
    }
  }
}
```

---

## 3. Resumo de Propriedades Especiais

| Propriedade JSON | Onde pode ser usada? | Função |
| :--- | :--- | :--- |
| `"image"` | `intro`, `theory`, `practice`, `assessment` | Cria um layout em 2 colunas. Requer `"url"` e opcionalmente `"alt"` e `"position" : "left" \| "right"`. |
| `"callout"` | `theory`, `practice`, `assessment` | Cria um retângulo de aviso/dica colorido no pé da página. Requer `"type" : "info" \| "tip" \| "warning" \| "important"` e `"text"`. |
| `"icon"` | Dentro de `content.items` em `practice` | Renderiza um ícone elegante do Google Material Icons ao lado do item da lista. |
| `"badge"` | `intro`, `assessment` | Um chip elegante (ex: "Aula 01", "Avaliação A1") exibido no topo do slide. |
| `"assessmentType"` | `assessment` | Define a modalidade da avaliação: `"seminar"`, `"final_project"` ou `"activity"`. |
| `"date"` / `"deadline"` | `assessment` | Exibe chip com o prazo limite acompanhado de ícone de calendário. |
| `"topics"` | `assessment` (`seminar`) | Lista de temas para seminários com títulos e descrições. |
| `"evaluationCriteria"`| `assessment` | Lista de critérios de avaliação com pesos e detalhes. |
| `"deliveryFormat"` | `assessment` (`seminar`) | Orientações de entrega e apresentação da banca. |
| `"githubPr"` | `assessment` (`final_project`) | Instruções de abertura de PR e branch alvo no GitHub. |
| `"classroomStandards"`| `assessment` (`final_project`) | Padrões de código e convenções de sala de aula. |
| `"deploy"` | `assessment` (`final_project`) | Requisitos e plataformas suportadas para deploy. |
| `"activityReadme"` | `assessment` (`activity`) | Requisitos de documentação no README.md do repositório. |
| `"githubSubmission"`| `assessment` (`activity`) | Orientações de envio de link e padrão do repositório no GitHub. |

---

## Dicas Rápidas para os próximos JSONs:

1. Sempre busque imagens com boa resolução (acima de 1200px) e evite textos gigantes dentro das imagens, preferindo fontes grandes no próprio JSON para manter a acessibilidade e contraste.
2. Evite colocar muito texto em `"sections"` de slides teóricos; se for muito texto, divida em dois slides para manter a leitura agradável no projetor.
3. Brinque com os ícones! Consulte [Google Fonts Icons](https://fonts.google.com/icons) para deixar os slides `practice` e `assessment` mais vivos.
4. Para slides de avaliação, mantenha datas explícitas e critérios objetivos (com pesos percentuais quando couber) para reduzir dúvidas dos alunos durante a aula.

