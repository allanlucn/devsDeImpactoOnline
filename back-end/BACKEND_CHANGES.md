# Backend Changes - CORS Fix & Setup (2025-11-22)

## Contexto

O frontend estava recebendo erro de CORS e, após correção, erro de falta de chave de API (`missing_groq_api_key`).

## Alterações Realizadas

### 1. Arquivo: `core/config.py`

Atualizado para permitir origens específicas (frontend e backend local).

**Antes:**

```python
cors_origins: List[str] = ["*"]
```

**Depois:**

```python
cors_origins: List[str] = ["http://localhost:5173", "http://localhost:5174", "http://localhost:8000"]
```

### 2. Arquivo: `.env` (Novo)

Foi criado um arquivo `.env` na pasta `back-end` com as configurações necessárias.
**IMPORTANTE:** Este arquivo sobrescreve as configurações padrão. Ele já foi criado com a configuração de CORS correta.

## Ação Necessária

Para que o chat funcione, você precisa adicionar sua chave da API Groq no arquivo `.env` recém-criado.

1. Abra o arquivo `back-end/.env`.
2. Localize a linha `GROQ_API_KEY=""`.
3. Insira sua chave da API entre as aspas. Exemplo: `GROQ_API_KEY="gsk_..."`.
4. **Reinicie o backend** para aplicar todas as mudanças.

## Como Testar

1. Após configurar a chave e reiniciar o backend.
2. Acesse o frontend.
3. Envie uma mensagem no chat.
4. O bot deve responder corretamente.
