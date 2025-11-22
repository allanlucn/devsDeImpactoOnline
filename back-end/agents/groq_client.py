import os
import asyncio
import mimetypes
from typing import Any, Dict

import httpx
import logging

logging.basicConfig(level=logging.INFO)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# URLs padrões compatíveis com OpenAI-style endpoints na API Groq
GROQ_CHAT_URL = os.getenv("GROQ_CHAT_URL", "https://api.groq.com/openai/v1/chat/completions")
GROQ_TRANSCRIBE_URL = os.getenv("GROQ_TRANSCRIBE_URL", "https://api.groq.com/openai/v1/audio/transcriptions")
GROQ_API_URL = os.getenv("GROQ_API_URL", "https://api.groq.com/v1/engines/grok")



def call_groq_sync(prompt: str, timeout: int = 15) -> Dict[str, Any]:
    return asyncio.get_event_loop().run_until_complete(call_groq(prompt, timeout))

def _get_audio_mime_type(filename: str) -> str:
    """Detecta o tipo MIME do arquivo de áudio baseado na extensão."""
    mime_type, _ = mimetypes.guess_type(filename)
    if mime_type and mime_type.startswith('audio/'):
        return mime_type
    
    # Fallback baseado na extensão
    ext = filename.lower().split('.')[-1] if '.' in filename else ''
    mime_map = {
        'wav': 'audio/wav',
        'mp3': 'audio/mpeg',
        'ogg': 'audio/ogg',
        'webm': 'audio/webm',
        'm4a': 'audio/mp4',
        'flac': 'audio/flac',
        'mpga': 'audio/mpeg',
        'mpeg': 'audio/mpeg',
        'mp4': 'audio/mp4',
    }
    return mime_map.get(ext, 'audio/wav')


async def call_groq_chat(messages: list, model: str = "openai/gpt-oss-120b", max_tokens: int = 512, timeout: int = 30) -> Dict[str, Any]:
    """Chama o endpoint de chat/completions da Groq usando formato compatível com OpenAI.

    - `messages`: lista de objetos {role: system|user|assistant, content: str}
    - `model`: nome do modelo hospedado na Groq (ex: "llama-3.3-70b", "gpt-oss-120b").
    Retorna o JSON cru e um campo `text` com o conteúdo principal quando possível.
    """
    if GROQ_API_KEY is None:
        return {"error": "missing_groq_api_key", "text": ""}

    # usa a URL de chat configurada (OpenAI-compatible) por padrão
    chat_url = os.getenv("GROQ_CHAT_URL") or GROQ_CHAT_URL

    payload = {"model": model, "messages": messages, "max_tokens": max_tokens}
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}

    async with httpx.AsyncClient(timeout=timeout) as client:
        try:
            logging.info("call_groq_chat POST %s model=%s", chat_url, model)
            r = await client.post(chat_url, json=payload, headers=headers)
            logging.info("call_groq_chat status=%s", r.status_code)
            r.raise_for_status()
            data = r.json()
            # Tenta extrair texto em formato OpenAI-compatible
            text = ""
            try:
                text = data.get("choices", [])[0].get("message", {}).get("content", "")
            except Exception:
                text = data.get("text") or ""
            return {"raw": data, "text": text}
        except httpx.HTTPError as e:
            logging.exception("call_groq_chat HTTP error")
            return {"error": str(e), "text": ""}


async def call_groq_transcribe(audio_bytes: bytes, filename: str = "audio.wav", model: str = "whisper-large-v3", timeout: int = 60) -> Dict[str, Any]:
    """Envia áudio para o endpoint de transcrição da Groq (Whisper).

    Retorna JSON cru e campo `text` quando disponível.
    """
    if GROQ_API_KEY is None:
        return {"error": "missing_groq_api_key", "text": ""}

    transcribe_url = os.getenv("GROQ_TRANSCRIBE_URL") or GROQ_TRANSCRIBE_URL

    # Detecta o tipo MIME correto baseado na extensão do arquivo
    mime_type = _get_audio_mime_type(filename)

    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    files = {
        "file": (filename, audio_bytes, mime_type)
    }
    data = {
        "model": model
    }

    async with httpx.AsyncClient(timeout=timeout) as client:
        try:
            logging.info("call_groq_transcribe POST %s model=%s", transcribe_url, model)
            r = await client.post(transcribe_url, files=files, data=data, headers=headers)
            logging.info("call_groq_transcribe status=%s", r.status_code)
            r.raise_for_status()
            data_response = r.json()
            text = data_response.get("text") or data_response.get("transcription") or ""
            return {"raw": data_response, "text": text}
        except httpx.HTTPError as e:
            logging.exception("call_groq_transcribe HTTP error")
            return {"error": str(e), "text": ""}


def call_groq_chat_sync(messages: list, model: str = "gpt-oss-120b", max_tokens: int = 512, timeout: int = 30) -> Dict[str, Any]:
    return asyncio.get_event_loop().run_until_complete(call_groq_chat(messages, model, max_tokens, timeout))


def call_groq_transcribe_sync(audio_bytes: bytes, filename: str = "audio.wav", model: str = "whisper-large-v3") -> Dict[str, Any]:
    return asyncio.get_event_loop().run_until_complete(call_groq_transcribe(audio_bytes, filename, model))
