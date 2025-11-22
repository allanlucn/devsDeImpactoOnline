"""Script de debugging para chamadas diretas ao endpoint de chat da Groq.

Roda uma chamada simples usando o helper sync `call_groq_chat_sync` e imprime
o retorno cru para ajudar a diagnosticar `model_not_found` ou 404s.
"""
import os
from agents.groq_client import call_groq_chat_sync


def main():
    model = os.getenv("DEBUG_GROQ_MODEL", "llama-3.3-70b")
    print("Debug Groq: model=", model)
    messages = [
        {"role": "system", "content": "Você é um assistente que responde em português (pt-BR)."},
        {"role": "user", "content": "Resuma em 1 frase: Projeto de lei exemplo..."},
    ]

    res = call_groq_chat_sync(messages=messages, model=model, max_tokens=200, timeout=30)
    print("== RAW RESPONSE ==")
    print(res)


if __name__ == "__main__":
    main()
