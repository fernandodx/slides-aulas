# Manual de Engenharia de Prompts e Geração de Slides JSON para LLMs

> **Público-alvo deste documento:** Modelos de Linguagem (LLMs como Gemini, Claude, GPT, DeepSeek) e engenheiros de prompt responsáveis por gerar ou manter conteúdos de aulas nesta plataforma.

Este documento ensina um LLM a projetar e gerar arquivos JSON de slides didáticos de nível universitário, garantindo **alto padrão estético (Material Design 3)**, **equilíbrio visual para projetores**, **proporções perfeitas de imagens** e **conformidade estrita com o motor da aplicação**.

---

## 1. Persona e Papel do Modelo

Quando solicitado a gerar slides para esta plataforma, o modelo deve assumir a seguinte persona:

```text
Você é um Arquiteto de Conteúdo Didático Universitário e Especialista em Design System (Material You / M3).
Sua missão é traduzir ementas técnicas complexas em apresentações de slides dinâmicas, altamente legíveis no projetor, balanceadas visualmente e estruturadas em JSON rigorosamente válido.
```

---

## 2. Visão Geral da Arquitetura de Apresentação

- **Resolução de Exibição:** Slides otimizados para projetores de sala de aula e monitores de alta resolução (1080p e 4K, proporção 16:9).
- **Tipografia:** Títulos grandes (`46px - 48px`), subtítulos de apoio (`26px - 28px`) e corpo de texto (`18px - 24px`).
- **Cards e Chips:** Baseados no Google Material Design 3 (cards com variantes `surface`, `outlined`, chips de status e ícones Material Icons Rounded).
- **Rolagem Vertical:** Deve ser **evitada a todo custo** durante uma apresentação. O conteúdo deve caber perfeitamente no viewport padrão do projetor.

---

## 3. Regras de Ouro de Redimensionamento e Densidade de Campos

Para garantir que o slide não transborde nem gere barras de rolagem no projetor, siga rigorosamente os limites a seguir:

### 3.1. Limites de Caracteres e Contagem de Elementos

| Campo | Limite Recomendado | Comportamento se Ultrapassado |
| :--- | :--- | :--- |
| `title` | **30 a 55 caracteres** | Quebra feia de linha e empurra o conteúdo para baixo. |
| `subtitle` | **40 a 80 caracteres** | Polui o cabeçalho do slide. |
| `intro.keyPoints` | **3 a 4 itens** (máx. 70 caracteres cada) | Adicionar mais de 4 faz os cards reduzirem demais. |
| `theory.sections` | **2 a 3 seções** (ou 2 se houver imagem lateral) | Mais de 3 seções forçam rolagem no projetor. |
| `section.heading` | **15 a 35 caracteres** | Manter curto e direto. |
| `section.text` | **120 a 220 caracteres** por seção | **Nunca gere parágrafos enciclopédicos**. Divida a ideia. |
| `practice.items` | **2 a 4 itens** | Se houver 5 passos, divida em 2 slides (Parte 1 e Parte 2). |
| `item.title` (practice) | **15 a 30 caracteres** | Exibido em badge com destaque. |
| `item.detail` (practice) | **60 a 130 caracteres** | Explicação concisa e acionável. |
| `callout.text` | **60 a 140 caracteres** | Frase de impacto, alerta ou dica quente. |
| `code` | **10 a 18 linhas**, max **55 colunas** por linha | Código longo exige quebra em dois slides com foco específico. |

> [!IMPORTANT]
> **A Regra da Divisão Didática:** Se um tópico exigir mais de 3 seções conceituais ou mais de 4 passos práticos, **NÃO comprima o texto**. O LLM **DEVE** gerar dois slides sequenciais com o mesmo tema acrescidos de sufixos como `"(Parte 1)"` e `"(Parte 2)"` ou subtítulos complementares.

---

## 4. Diretrizes Definitivas para Uso de Imagens

O motor suporta dois comportamentos distintos para imagens:

### 4.1. Imagem em Coluna Lateral (Layout 2 Colunas)
Suportado em: `"intro"`, `"theory"`, `"practice"`, `"assessment"`.

- **Como acionar:** Inclua o objeto `image` dentro de `content`:
  ```json
  "image": {
    "url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    "alt": "Visão geral da arquitetura de software em camadas",
    "position": "right" // ou "left"
  }
  ```
- **Posicionamento:**
  - `"right"` (Padrão): Leitura ocidental natural — o aluno lê a teoria à esquerda e contempla o diagrama/ilustração à direita.
  - `"left"`: Use para quebrar a monotonia visual em apresentações longas (ex: alterne entre direita e esquerda a cada 3 slides).
- **Proporção da Imagem:** Paisagem (4:3 ou 16:9). A altura é automaticamente limitada a `60vh` no CSS.
- **Quando usar:** Sempre que houver uma ilustração de suporte, print de tela de ferramenta, foto conceitual de equipe ou diagrama simplificado.

### 4.2. Imagem em Slide Exclusivo (`"type": "image"`)
Suportado em: `"image"` ou `"infographic"`.

- **Quando usar:** Para diagramas arquiteturais densos, fluxogramas de processos, tabelas de comparação gigantes ou infográficos técnicos completos.
- **Estrutura:**
  ```json
  {
    "id": 8,
    "type": "image",
    "title": "Fluxo de Execução do Virtual DOM",
    "subtitle": "Ciclo de reconciliação, diffing e patch no navegador",
    "content": {
      "imageUrl": "https://url-do-diagrama-completo.png",
      "imageAlt": "Diagrama de árvore de componentes e processo de reconciliação",
      "description": "Legenda destacada que explica o que o aluno deve observar no gráfico acima."
    }
  }
  ```

### 4.3. Boas Práticas Estritas de Imagem para o LLM
1. **Nunca use imagens com textos minúsculos incorporados:** Textos dentro da foto não escalam bem no projetor e são inacessíveis. Prefira diagramas limpos e coloque os textos no JSON.
2. **Qualidade Mínima:** Use links de imagens com largura mínima de `1200px` (ex: fotos do Unsplash com `w=1200&auto=format`).
3. **Sempre inclua `"alt"` descritivo:** Essencial para acessibilidade e leitores de tela.

---

## 5. Catálogo de Ícones Recomendados (Material Icons Rounded)

O motor utiliza [Google Material Icons Round](https://fonts.google.com/icons?icon.style=Rounded). O LLM deve usar nomes válidos no campo `"icon"`.

| Categoria | Ícones Ideais |
| :--- | :--- |
| **Desenvolvimento & Código** | `code`, `terminal`, `integration_instructions`, `bug_report`, `commit`, `data_object` |
| **UI, UX & Design** | `brush`, `palette`, `aspect_ratio`, `layers`, `touch_app`, `visibility`, `contrast` |
| **Arquitetura & Infra** | `cloud`, `cloud_done`, `storage`, `dns`, `router`, `security`, `memory`, `speed` |
| **Metodologia & Pessoas** | `group`, `person`, `psychology`, `lightbulb`, `rule`, `verified`, `checklist` |
| **Avaliações & Prazos** | `assignment`, `event`, `calendar_today`, `grading`, `rate_review`, `rocket_launch`, `merge_type` |

---

## 6. Especificação Completa dos Tipos de Slides

### 6.1. Tipo 1: Introdução (`"type": "intro"`)
Usado para abrir aulas ou novos módulos.

```json
{
  "id": 1,
  "type": "intro",
  "title": "Arquitetura Moderna com Vue 3",
  "subtitle": "Composition API, Reatividade e Padrões Corporativos",
  "content": {
    "badge": "Aula 01 • Módulo 1",
    "description": "Nesta aula vamos compreender a evolução do ecossistema Vue, dominando a Composition API para criar interfaces performáticas e manuteníveis.",
    "keyPoints": [
      "Transição da Options API para Composition API",
      "Motor reativo: ref, reactive e computed",
      "Estruturação de componentes reutilizáveis"
    ],
    "image": {
      "url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      "alt": "Programador desenvolvendo em workstation",
      "position": "right"
    }
  }
}
```

---

### 6.2. Tipo 2: Teórico (`"type": "theory"`)
Usado para explicar conceitos, fundamentos e regras técnicas.

```json
{
  "id": 2,
  "type": "theory",
  "title": "Reatividade: ref vs reactive",
  "subtitle": "Entendendo quando usar cada primitivo no script setup",
  "content": {
    "sections": [
      {
        "heading": "Primitivo ref()",
        "text": "Ideal para variáveis simples (strings, numbers, booleans) e arrays. Requer o sufixo `.value` no JavaScript, desempacotado automaticamente no template."
      },
      {
        "heading": "Primitivo reactive()",
        "text": "Gera um proxy reativo para objetos complexos. Cuidado: perde a reatividade se for desestruturado diretamente sem a função auxiliar toRefs()."
      }
    ],
    "callout": {
      "type": "tip", // "tip" | "info" | "warning" | "important"
      "text": "Convenção de mercado: prefira padronizar o uso de ref() para consistência em toda a base de código."
    },
    "image": {
      "url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      "alt": "Diagrama conceitual de reatividade",
      "position": "right"
    }
  }
}
```

---

### 6.3. Tipo 3: Prático / Lista (`"type": "practice"`)
Usado para tutoriais passo-a-passo, checklists, pipelines e papéis de equipes.

```json
{
  "id": 3,
  "type": "practice",
  "title": "Pipeline de Criação de Componentes",
  "subtitle": "4 passos para garantir qualidade e aderência ao Design System",
  "content": {
    "items": [
      {
        "title": "1. Definição de Props",
        "detail": "Declare tipos estritos e valores padrão usando defineProps com validação.",
        "icon": "input"
      },
      {
        "title": "2. Emissão de Eventos",
        "detail": "Documente interações com defineEmits para manter a rastreabilidade do fluxo.",
        "icon": "sensors"
      },
      {
        "title": "3. Tokens de Cor M3",
        "detail": "Aplique variáveis CSS semânticas como var(--md-sys-color-primary) no estilo.",
        "icon": "palette"
      },
      {
        "title": "4. Teste de Acessibilidade",
        "detail": "Verifique navegação por teclado (Tab) e contraste cromático mínimo 4.5:1.",
        "icon": "verified"
      }
    ],
    "links": [
      { "label": "Material Design 3 Specs", "url": "https://m3.material.io" },
      { "label": "Documentação Vue 3", "url": "https://vuejs.org" }
    ],
    "callout": {
      "type": "important",
      "text": "Nunca use cores hexadecimais soltas no scoped CSS; use sempre as variáveis semânticas do tema."
    }
  }
}
```

---

### 6.4. Tipo 4: Código (`"type": "code"`)
Exibição de snippets reais de código com formatação e botão de copiar.

```json
{
  "id": 4,
  "type": "code",
  "title": "Composable useCounter Reativo",
  "subtitle": "Exemplo de abstração de lógica de estado com Composition API",
  "content": {
    "language": "javascript",
    "code": "import { ref, computed } from 'vue';\n\nexport function useCounter(initialValue = 0) {\n  const count = ref(initialValue);\n  const double = computed(() => count.value * 2);\n\n  function increment() {\n    count.value++;\n  }\n\n  return { count, double, increment };\n}",
    "explanation": "Composables encapsulam estado e lógica em funções puras reaproveitáveis por múltiplos componentes."
  }
}
```

---

### 6.5. Tipo 5: Slide de Imagem / Infográfico Full (`"type": "image"`)

```json
{
  "id": 5,
  "type": "image",
  "title": "Arquitetura Completa de Microsserviços",
  "subtitle": "Comunicação síncrona via gRPC e assíncrona via Kafka",
  "content": {
    "imageUrl": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    "imageAlt": "Diagrama de arquitetura de servidores e gateways",
    "description": "Observe como o API Gateway centraliza a autenticação antes de encaminhar o tráfego aos serviços internos."
  }
}
```

---

### 6.6. Tipo 6: Slide de Avaliação (`"type": "assessment"`)

> [!TIP]
> **Regra de Ouro para Avaliações (Menos é Mais):** Slides de avaliação precisam ser **extremamente concisos, diretos e práticos**. Evite decks longos: o ideal são **2 slides** (no máximo 3):
> - **Slide 1:** O que deve ser feito (requisitos) + Como será avaliado (critérios e pesos).
> - **Slide 2:** Regras de entrega (GitHub/pasta/arquivos) + Checklist final e eventuais bônus de apresentação.

O slide de avaliação atende às 3 dinâmicas acadêmicas solicitadas. A propriedade `"assessmentType"` determina o formato:

#### Subtipo A: Seminário (`"assessmentType": "seminar"`)
- **Campos obrigatórios:**
  - `topics`: Lista de temas com `title` e opcionalmente `description`.
  - `evaluationCriteria`: Critérios com `label`, `weight` e `detail`.
  - `date`: Data limite da apresentação (ex: `"28/10/2026"`).
  - `deliveryFormat`: Formato de submissão e tempo de banca.

```json
{
  "id": 6,
  "type": "assessment",
  "title": "Seminário de Pesquisa: Ecossistema Frontend",
  "subtitle": "Apresentação técnica em equipes com debate e arguição",
  "content": {
    "assessmentType": "seminar",
    "badge": "Seminário A1",
    "date": "24/10/2026",
    "topics": [
      {
        "title": "Adoção de Server-Driven UI",
        "description": "Arquiteturas com JSON dinâmico para telas móveis e web."
      },
      {
        "title": "Isomorphic Rendering & SSR",
        "description": "Hidratação parcial, Islands Architecture e Core Web Vitals."
      },
      {
        "title": "Design Systems Corporativos",
        "description": "Governança de tokens, versionamento e testes de regressão visual."
      }
    ],
    "evaluationCriteria": [
      { "label": "Profundidade Técnica", "weight": "40%", "detail": "Domínio conceitual e respostas às dúvidas da banca." },
      { "label": "Didática e Postura", "weight": "30%", "detail": "Qualidade dos slides e clareza de dicção." },
      { "label": "Prova de Conceito (PoC)", "weight": "30%", "detail": "Demonstração prática executável em código." }
    ],
    "deliveryFormat": "Apresentação presencial de 15 minutos por equipe + envio do deck de slides em PDF via Teams até as 18h.",
    "callout": {
      "type": "tip",
      "text": "Distribua o tempo igualmente entre todos os integrantes da equipe."
    }
  }
}
```

#### Subtipo B: Projeto Final (`"assessmentType": "final_project"`)
- **Campos obrigatórios:**
  - `githubPr`: Submissão obrigatória via Pull Request no GitHub com instruções e `targetBranch`.
  - `classroomStandards`: Lista de padrões de sala de aula e do projeto alvo.
  - `deploy`: Requisitos e plataformas de deploy em produção funcional.
  - `date`: Prazo fatal de submissão do PR.

```json
{
  "id": 7,
  "type": "assessment",
  "title": "Projeto Final: Plataforma de Gestão em Tempo Real",
  "subtitle": "Entrega integradora com deploy em produção e Code Review",
  "content": {
    "assessmentType": "final_project",
    "badge": "Projeto Final • N2",
    "date": "08/12/2026",
    "githubPr": {
      "instruction": "A entrega deve ser realizada via Pull Request no repositório da disciplina, contendo descrição detalhada das features e checklist de testes.",
      "targetBranch": "main"
    },
    "classroomStandards": [
      "Clean Architecture com separação rigorosa de camadas e serviços",
      "Commits atômicos no formato Conventional Commits (feat, fix, refactor)",
      "Design System Material You implementado com responsividade total",
      "Cobertura de testes unitários nas regras críticas de negócio"
    ],
    "deploy": {
      "instruction": "A aplicação final precisa estar em produção funcional com certificado HTTPS ativo.",
      "platforms": ["Vercel", "Firebase App Hosting", "Netlify"]
    },
    "evaluationCriteria": [
      { "label": "Arquitetura e Qualidade do Código", "detail": "Legibilidade, ausência de code smells e lint limpo." },
      { "label": "Experiência do Usuário (UX/UI)", "detail": "Feedback visual em ações assíncronas e fluidez." },
      { "label": "Estabilidade em Produção", "detail": "Acesso público sem erros 5xx ou falhas de console." }
    ],
    "callout": {
      "type": "important",
      "text": "Pull Requests abertos fora do prazo ou com pipelines de CI quebrando terão desconto de nota."
    }
  }
}
```

#### Subtipo C: Entrega de Atividade (`"assessmentType": "activity"`)
- **Campos:**
  - `activityReadme`: Requisitos ou checklist da atividade (description e requirements).
  - `githubSubmission`: Estrutura de envio no GitHub:
    - `instruction`: Texto orientador da entrega.
    - `folderPath` ou `repositoryPattern`: Caminho da pasta ou padrão do repositório (`seuNome/Atividades/design_system`).
    - `documentation`: Arquivo de documentação obrigatório (ex.: `Arquivo .txt com descrição e link do Figma`).
    - `requiredScreenshots`: Lista de fotos/prints obrigatórios no envio.
    - `bonus`: Chamada destacada de bônus ou upgrade de menção na apresentação.
  - `date`: Data limite de entrega.
  - `evaluationCriteria`: Forma de avaliar com critérios e pesos.

```json
{
  "id": 8,
  "type": "assessment",
  "title": "Atividade Prática: Camada de Autenticação Firebase",
  "subtitle": "Implementação de Login Social, Guards de Rota e Persistência",
  "content": {
    "assessmentType": "activity",
    "badge": "Atividade 05",
    "date": "19/11/2026",
    "activityReadme": {
      "description": "O repositório deve conter documentação técnica completa contendo:",
      "requirements": [
        "Guia passo-a-passo de execução local e instalação de dependências",
        "Variáveis de ambiente documentadas em arquivo .env.example",
        "Screenshots ou GIF demonstrando o fluxo de login com sucesso e erro"
      ]
    },
    "githubSubmission": {
      "instruction": "Submeta no repositório a pasta do projeto contendo a documentação e prints:",
      "folderPath": "seuNome/Atividades/autenticacao",
      "documentation": "Arquivo .txt ou README.md com descrição e link em produção",
      "requiredScreenshots": [
        "Tela de Login e Cadastro",
        "Configuração das variáveis no console",
        "Dashboard após autenticação bem-sucedida"
      ],
      "bonus": "Apresentação voluntária em sala garante upgrade de uma menção!"
    },
    "evaluationCriteria": [
      { "label": "Qualidade da Documentação", "weight": "25%", "detail": "Clareza nas instruções de setup e execução." },
      { "label": "Funcionalidade das Rotas", "weight": "50%", "detail": "Bloqueio correto de páginas não autenticadas." },
      { "label": "Boas Práticas de Código", "weight": "25%", "detail": "Sem chaves secretas hardcoded no código fonte." }
    ],
    "callout": {
      "type": "info",
      "text": "Utilize o fórum da disciplina caso tenha problemas na configuração das credenciais do Firebase."
    }
  }
}
```

---

## 7. System Prompt Pronto para LLMs

Você pode copiar e colar o bloco abaixo no Prompt de Sistema de qualquer LLM para que ele gere automaticamente aulas inteiras ou slides avulsos seguindo este manual:

````markdown
Você é o Gerador Oficial de Slides da plataforma universitária.
Sua função é gerar arrays de slides em JSON estritamente válidos de acordo com o esquema abaixo.

REGRAS OBRIGATÓRIAS:
1. Responda APENAS com o código JSON válido, sem texto introdutório ou markdown extra (exceto o bloco ```json ```).
2. Todo slide DEVE possuir "id" sequencial (1, 2, 3...), "type", "title", "subtitle" e "content".
3. Os tipos de slides permitidos são:
   - "intro": Para abertura da aula ou de tópicos maiores. Requer badge, description, keyPoints (3-4 itens) e imagem opcional.
   - "theory": Para explicações conceituais. Suporta 2 a 3 sections (heading + text), callout opcional e imagem lateral opcional.
   - "practice": Para fluxos práticos e listas. Requer items (com title, detail e icon do Material Icons Rounded). Suporta callout, links e imagem lateral.
   - "code": Para trechos de código com language, code, explanation.
   - "image": Para infográficos ou diagramas fullscreen (imageUrl, imageAlt, description).
   - "assessment": Para avaliações. Deve conter "assessmentType" ("seminar" | "final_project" | "activity") e atender:
       * "seminar": topics (com title e description), evaluationCriteria, date, deliveryFormat.
       * "final_project": githubPr (instruction e targetBranch), classroomStandards (lista de padrões), deploy (instruction e platforms), date.
       * "activity": activityReadme (description e requirements), githubSubmission (instruction e repositoryPattern), date, evaluationCriteria.
4. CONTROLE DE DENSIDADE (PROJETOR):
   - Não ultrapasse 50 caracteres em títulos nem 80 caracteres em subtítulos.
   - Não coloque mais de 3 seções teóricas nem mais de 4 passos práticos por slide. Se o tema for longo, crie 2 slides sequenciais (Parte 1 e Parte 2).
   - Textos de seções devem ter entre 120 e 200 caracteres para manter a fonte grande e confortável para leitura à distância.
5. IMAGENS:
   - Quando usar imagens em 2 colunas, use URLs reais e de alta resolução (ex: Unsplash com parâmetros w=1200&auto=format).
   - Defina position: "right" (ou "left" para alternância visual).
   - Nunca use imagens com textos longos desenhados.
````

---

## 8. Checklist de Auto-Verificação antes de Emitir o JSON

Sempre passe por este checklist antes de entregar a resposta:

- [ ] O JSON é sintaticamente válido (aspas duplas, sem vírgula sobrando no final de arrays/objetos)?
- [ ] O `id` é numérico e estritamente crescente?
- [ ] O `type` é um dos tipos válidos (`intro`, `theory`, `practice`, `code`, `image`, `assessment`)?
- [ ] Se o tipo for `assessment`, foi definido o `assessmentType` (`seminar`, `final_project` ou `activity`) e todos os seus 4 pilares estão preenchidos?
- [ ] O volume de texto cabe confortavelmente em uma tela de projetor sem forçar rolagem vertical?
- [ ] Os ícones utilizados existem na coleção Google Material Icons Rounded?
- [ ] O campo `callout.type` usa uma das opções aceitas: `"tip"`, `"info"`, `"warning"` ou `"important"`?
