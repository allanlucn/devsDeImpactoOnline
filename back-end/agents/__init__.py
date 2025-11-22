"""Pacote de agentes: expõe funções de alto nível de IA.

Este pacote contém o código de orquestração de LLM e clientes HTTP
simples para Grok (Groq), Llama e para transcrição (Whisper).
As implementações aqui são placeholders leves e assíncronos, prontos
para serem conectados a endpoints reais e à camada de persistência.
"""

from .gpt_client import call_gpt, call_gpt_sync
from .whisper_client import transcribe_audio_bytes, transcribe_audio_bytes_sync

__all__ = ["call_gpt", "call_gpt_sync", "transcribe_audio_bytes", "transcribe_audio_bytes_sync"]
