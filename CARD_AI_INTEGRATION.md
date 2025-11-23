# Como Gerar Título e Subtítulo do Card com IA

Este documento explica como implementar a geração automática de título e subtítulo para os cards de protesto na `ShareCardPage.jsx` usando a API Groq.

---

## 📋 Contexto

Atualmente, o texto do card é estático:

```javascript
const cardText = {
  title: "MOTORISTAS EM ALERTA!",
  subtitle:
    "O PL 234 quer taxar nossas corridas. Vão mexer no nosso dinheiro. Eu já votei contra. Faça sua parte!",
};
```

Queremos que este texto seja gerado dinamicamente pela IA com base no conteúdo da notícia.

---

## 🎯 Arquitetura da Solução

### Backend

**Localização**: `/back-end/agents/routes/agents_routes.py`

Já existe um endpoint de exemplo (`/agents/pressure`) que pode servir de base:

```python
@router.post("/pressure")
async def pressure_summary_endpoint(request: Request):
    data = await request.json()
    text = data.get("text", "")
    profile = data.get("profile", {})

    system_msg = build_pressure_system_message()
    user_msg = build_pressure_user_message(text, profile)

    messages = [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": user_msg}
    ]

    res = await call_groq_chat(messages=messages, enable_web_search=False)
    return {"status": "done", "text": res.get("text")}
```

### Frontend

**Localização**: `/front-end/src/pages/ShareCardPage.jsx`

O código já está preparado com a estrutura básica para receber dados da API.

---

## 🔧 Passo a Passo para Implementação

### 1. Criar o Prompt Específico para Cards

Crie o arquivo `/back-end/agents/card_prompt.py`:

```python
from typing import Dict

def build_card_system_message() -> str:
    return (
        "Você é um especialista em mobilização social e comunicação direta. "
        "Seu objetivo é criar mensagens impactantes para cards de protesto.\n\n"
        "RESPONDA SEMPRE EM FORMATO JSON:\n"
        '{"title": "TÍTULO CURTO EM CAPS", "subtitle": "Subtítulo explicativo direto"}\n\n'
        "REGRAS:\n"
        "- TÍTULO: Máximo 5 palavras, CAIXA ALTA, chamativo, use emojis se apropriado\n"
        "- SUBTÍTULO: Máximo 2 linhas, linguagem simples, explique o impacto direto\n"
        "- Seja alarmista se houver risco real ao trabalhador\n"
        "- Use tom de urgência e mobilização\n"
        "- Evite termos técnicos ou números de projetos de lei"
    )

def build_card_user_message(news_content: str, profile: Dict[str, str]) -> str:
    occupation = profile.get("occupation", "trabalhador")

    return (
        f"Público-alvo: {occupation}\n\n"
        f"Conteúdo da notícia:\n{news_content}\n\n"
        "Gere um card de protesto impactante em JSON."
    )
```

### 2. Criar o Endpoint no Backend

Em `/back-end/agents/routes/agents_routes.py`, adicione:

```python
from agents.card_prompt import build_card_system_message, build_card_user_message
import json

@router.post("/card-text")
async def generate_card_text(request: Request):
    """
    Gera título e subtítulo para card de protesto.

    Body:
    {
        "newsContent": "texto da notícia...",
        "profile": {"occupation": "motorista de app"}
    }

    Response:
    {
        "status": "done",
        "title": "MOTORISTAS EM ALERTA!",
        "subtitle": "O PL 234 quer taxar..."
    }
    """
    try:
        data = await request.json()
        news_content = data.get("newsContent", "")
        profile = data.get("profile", {})

        if not news_content:
            raise HTTPException(status_code=400, detail="newsContent é obrigatório")

        system_msg = build_card_system_message()
        user_msg = build_card_user_message(news_content, profile)

        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg}
        ]

        # Não usar web_search para gerar texto criativo
        res = await call_groq_chat(messages=messages, enable_web_search=False)

        if res.get("error"):
            raise Exception(res.get("error"))

        # Parse do JSON retornado pela IA
        ai_response = res.get("text", "")
        try:
            card_data = json.loads(ai_response)
            return {
                "status": "done",
                "title": card_data.get("title", "ALERTA!"),
                "subtitle": card_data.get("subtitle", "Seus direitos estão em risco.")
            }
        except json.JSONDecodeError:
            # Fallback se a IA não retornar JSON válido
            return {
                "status": "done",
                "title": "ALERTA!",
                "subtitle": ai_response[:150]  # Limita a 150 caracteres
            }

    except Exception as e:
        logging.error(f"Erro ao gerar texto do card: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
```

### 3. Atualizar o Frontend

Em `/front-end/src/pages/ShareCardPage.jsx`:

```javascript
const ShareCardPage = () => {
  // ... código existente ...

  const [cardText, setCardText] = useState({
    title: "MOTORISTAS EM ALERTA!",
    subtitle: "O PL 234 quer taxar nossas corridas...",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Gerar texto ao montar o componente
  useEffect(() => {
    generateCardText();
  }, []);

  const generateCardText = async () => {
    setIsGenerating(true);
    try {
      const storedProfile = localStorage.getItem("userProfile");
      const profile = storedProfile ? JSON.parse(storedProfile) : {};

      const response = await fetch("http://localhost:8000/agents/card-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newsContent: news.content || news.summary || news.title,
          profile: {
            occupation: profile.occupation || profile.job,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar texto do card");
      }

      const data = await response.json();
      setCardText({
        title: data.title,
        subtitle: data.subtitle,
      });
    } catch (error) {
      console.error("Erro ao gerar texto do card:", error);
      // Mantém texto padrão em caso de erro
    } finally {
      setIsGenerating(false);
    }
  };

  // ... resto do código ...
};
```

### 4. Adicionar Loading State (Opcional)

Para melhor UX, mostre um indicador de carregamento:

```javascript
{
  isGenerating && (
    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-20">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-sm">Gerando mensagem...</p>
      </div>
    </div>
  );
}
```

---

## 🔑 Variáveis de Ambiente

Certifique-se de que o `.env` do backend contém:

```bash
GROQ_API_KEY=sua_chave_aqui
GROQ_CHAT_URL=https://api.groq.com/openai/v1/chat/completions
```

---

## 🧪 Testando

1. **Teste o endpoint diretamente:**

```bash
curl -X POST http://localhost:8000/agents/card-text \
  -H "Content-Type: application/json" \
  -d '{
    "newsContent": "Câmara aprova PL que taxa corridas de app em 10%",
    "profile": {"occupation": "motorista de app"}
  }'
```

2. **Teste no frontend:**
   - Navegue até PressurePage
   - Clique em "Fazer Pressão"
   - Clique em "Compartilhe"
   - Verifique se o texto é gerado automaticamente

---

## 📊 Parâmetros do Groq

A função `call_groq_chat` aceita:

- `messages`: Array de mensagens (system/user)
- `model`: Padrão `openai/gpt-oss-120b` (ver `.env`)
- `max_tokens`: Limite de tokens (padrão 1024)
- `enable_web_search`: `False` para geração criativa
- `temperature`: Não configurado, usar padrão (0.7)

---

## ⚠️ Troubleshooting

### Erro 400 Bad Request

- Geralmente causado por `web_search` ativado
- Solução: `enable_web_search=False`

### Texto não atualiza

- Verifique se `useEffect` está sendo chamado
- Verifique console do navegador para erros
- Confirme que o backend está rodando

### Resposta não é JSON

- A IA pode não seguir o formato sempre
- Implementamos fallback para extrair texto bruto
- Ajuste o prompt se necessário

---

## 🎨 Customização

### Ajustar Tom da Mensagem

Edite `build_card_system_message()` em `card_prompt.py`:

- Mais urgente: "Use tom ALARMISTA e URGENTE"
- Mais neutro: "Use tom informativo e neutro"
- Mais mobilizador: "Use tom de CHAMADO À AÇÃO"

### Ajustar Tamanho

Modifique as regras no prompt:

- `"TÍTULO: Máximo 3 palavras"` (mais curto)
- `"SUBTÍTULO: Máximo 1 linha"` (mais conciso)

---

## 📚 Referências

- **Groq Client**: `/back-end/agents/groq_client.py`
- **Pressure Prompt** (exemplo): `/back-end/agents/pressure_prompt.py`
- **Routes**: `/back-end/agents/routes/agents_routes.py`
- **ShareCardPage**: `/front-end/src/pages/ShareCardPage.jsx`

---

**Última atualização**: 2025-11-23
