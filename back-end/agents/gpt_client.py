import os
from typing import Dict, Any, Optional, List

from .groq_client import call_groq_chat
from .prompt import build_system_message, build_user_message


DEFAULT_MODEL = os.getenv("GROQ_GPT_MODEL", "openai/gpt-oss-120b")


async def call_gpt(text: str, profile: Dict[str, Any] = None, model: str = None, max_tokens: int = 1024, enable_web_search: bool = False, search_country: str = "brazil", search_domains: Optional[List[str]] = None) -> Dict[str, Any]:
    """Chama o modelo GPT hospedado na Groq.

    - `text`: texto (ou transcrição) que será passado ao modelo
    - `profile`: dicionário com informações de contexto do usuário
    - `model`: opcional, sobrescreve `GROQ_GPT_MODEL`
    - `max_tokens`: máximo de tokens na resposta
    - `enable_web_search`: habilita busca na web (padrão: True)
    - `search_country`: país para priorizar nas buscas (padrão: "brazil")
    - `search_domains`: lista de domínios para incluir nas buscas
    Retorna dicionário com `raw` e `text`.
    """
    m = model or DEFAULT_MODEL
    system = build_system_message()
    user = build_user_message(text, profile or {})
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]

    return await call_groq_chat(
        messages=messages, 
        model=m, 
        max_tokens=max_tokens, 
        enable_web_search=enable_web_search, 
        search_country=search_country, 
        search_domains=search_domains
    )


def call_gpt_sync(text: str, profile: Dict[str, Any] = None, model: str = None, max_tokens: int = 1024, enable_web_search: bool = True, search_country: str = "brazil", search_domains: Optional[List[str]] = None) -> Dict[str, Any]:
    import asyncio

    return asyncio.get_event_loop().run_until_complete(
        call_gpt(text, profile, model, max_tokens, enable_web_search, search_country, search_domains)
        )
