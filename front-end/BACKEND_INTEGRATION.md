# Guia de Integração Back-end (FastAPI)

Este documento descreve os endpoints e estruturas de dados esperados pelo Front-end para integração com a API (FastAPI).

## Configuração de Ambiente

O Front-end deve apontar para a URL da API. Recomenda-se usar uma variável de ambiente:

```env
VITE_API_URL=http://localhost:8000
```

## Arquitetura do Front-end (Camada de API)

O projeto Front-end possui uma camada dedicada para comunicação com o Back-end, localizada em `src/api/`.

- **`src/api/chat.js`**: Contém funções para interação com o Chatbot (`sendMessageToApi`).
- **`src/api/news.js`**: Contém funções para buscar notícias e interagir com likes/comentários (`fetchNewsApi`, `likeNewsApi`, `likeCommentApi`).

Atualmente, essas funções retornam dados "mockados" (simulados). Para integrar com o FastAPI real, basta substituir o conteúdo dessas funções pelas chamadas HTTP reais (usando `fetch` ou `axios`).

## Endpoints Esperados

### 1. Chatbot

**Endpoint:** `POST /chat`
**Descrição:** Envia uma mensagem do usuário e recebe a resposta do bot.

**Request Body (JSON):**

```json
{
  "message": "Olá, gostaria de saber mais sobre..."
}
```

**Response Body (JSON):**

```json
{
  "response": "Olá! Sou o assistente virtual. Como posso ajudar?",
  "timestamp": "2023-10-27T10:00:00Z"
}
```

### 2. Notícias (News)

**Endpoint:** `GET /news`
**Descrição:** Retorna a lista de notícias relevantes para exibir na barra lateral.

**Response Body (JSON):**

```json
[
  {
    "id": 1,
    "title": "Nova tecnologia de IA",
    "summary": "Resumo curto da notícia para exibição no card...",
    "url": "https://...",
    "likes": 120,
    "liked_by_user": false
  },
  {
    "id": 2,
    "title": "Avanços na Medicina",
    "summary": "Cientistas descobrem...",
    "url": "https://...",
    "likes": 85,
    "liked_by_user": false
  }
]
```

### 3. Comentários

Os comentários são criados pelos usuários da solução. O Front-end precisa de endpoints separados para buscar e criar comentários.

#### 3.1. Listar Comentários

**Endpoint:** `GET /news/{news_id}/comments`
**Descrição:** Retorna todos os comentários de uma notícia específica.

**Response Body (JSON):**

```json
[
  {
    "id": 101,
    "news_id": 1,
    "user": "João Silva",
    "text": "Muito interessante!",
    "likes": 10,
    "liked_by_user": false,
    "timestamp": "2023-10-27T10:05:00Z"
  },
  {
    "id": 102,
    "news_id": 1,
    "user": "Maria Santos",
    "text": "Quero testar.",
    "likes": 5,
    "liked_by_user": false,
    "timestamp": "2023-10-27T10:10:00Z"
  }
]
```

> **Nota:** Os comentários devem vir ordenados por número de likes (decrescente).

#### 3.2. Criar Comentário

**Endpoint:** `POST /news/{news_id}/comments`
**Descrição:** Cria um novo comentário em uma notícia específica.

**Request Body (JSON):**

```json
{
  "user_id": 123,
  "text": "Minha opinião sobre a notícia..."
}
```

**Response Body (JSON):**

```json
{
  "id": 103,
  "news_id": 1,
  "user": "Nome do Usuário",
  "text": "Minha opinião sobre a notícia...",
  "likes": 0,
  "liked_by_user": false,
  "timestamp": "2023-10-27T10:15:00Z"
}
```

### 4. Likes / Upvotes

#### 4.1. Like em Notícia

**Endpoint:** `POST /news/{news_id}/like`
**Descrição:** Adiciona ou remove um like da notícia (toggle).

**Response Body (JSON):**

```json
{
  "likes": 121,
  "liked_by_user": true
}
```

#### 4.2. Like em Comentário

**Endpoint:** `POST /comments/{comment_id}/like`
**Descrição:** Adiciona ou remove um like do comentário (toggle).

**Response Body (JSON):**

```json
{
  "likes": 11,
  "liked_by_user": true
}
```

## Tipagem no Front-end (Referência)

Para facilitar a integração, estas são as interfaces que estamos usando no React:

```typescript
interface Comment {
  id: number;
  user: string;
  text: string;
  likes: number;
  liked_by_user: boolean;
}

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  url?: string;
  likes: number;
  liked_by_user: boolean;
  comments: Comment[]; // Carregado separadamente via GET /news/{id}/comments
}

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}
```

## Fluxo de "Saiba Mais"

Quando o usuário clica em "Saiba Mais" em uma notícia:

1. O Front-end preenche o input do chat com: `"Quero saber mais sobre {News Title}"`.
2. O usuário envia.
3. O Back-end recebe isso no endpoint `POST /chat`.
