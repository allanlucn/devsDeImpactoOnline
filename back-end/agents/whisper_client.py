from typing import Dict, Any
import os

from .groq_client import call_groq_transcribe


async def transcribe_audio_bytes(audio_bytes: bytes, filename: str = "audio.wav", model: str = None, timeout: int = 60) -> Dict[str, Any]:
    """Transcreve áudio usando o endpoint Groq/Whisper.

    Retorna {'raw': ..., 'text': 'transcribed text'} ou {'error':..., 'text': ''}.
    """
    m = model or os.getenv("WHISPER_MODEL", "whisper-large-v3")
    return await call_groq_transcribe(audio_bytes=audio_bytes, filename=filename, model=m, timeout=timeout)


def transcribe_audio_bytes_sync(audio_bytes: bytes, filename: str = "audio.wav", model: str = None) -> Dict[str, Any]:
    import asyncio

    return asyncio.get_event_loop().run_until_complete(transcribe_audio_bytes(audio_bytes, filename, model))
