from typing import Optional
import json
import os
import logging

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Header, Body

from agents.gpt_client import call_gpt
from agents.whisper_client import transcribe_audio_bytes
from agents.groq_client import GROQ_API_KEY

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("/health")
async def health():
    """Checagem básica de saúde das integrações de IA."""
    return {"ok": True, "groq_configured": bool(GROQ_API_KEY)}


@router.post("/simplify")
async def simplify_endpoint(payload: dict = Body(...), authorization: Optional[str] = Header(None)):
    """Recebe JSON {text, profile?, doc_id?, options?} e retorna resumo.

    Exemplo de payload:
    {
      "text": "Texto do projeto de lei...",
      "profile": {"profissao":"motoboy"}
    }
    """
    text = payload.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="Campo 'text' obrigatório")

    profile = payload.get("profile") or {}

    try:
        res = await call_gpt(text, profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"status": "done", "raw": res.get("raw"), "text": res.get("text")}


@router.post("/transcribe")
async def transcribe_endpoint(file: UploadFile = File(...), metadata: Optional[str] = Form(None), authorization: Optional[str] = Header(None)):
    """Recebe áudio multipart e metadata (JSON string). Retorna transcrição + summary.

    Form fields:
    - file: arquivo de áudio (wav/mp3/webm)
    - metadata: JSON string opcional com profile/doc_id/options
    """
    meta = {}
    if metadata:
        try:
            meta = json.loads(metadata)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=400, 
                detail=f"metadata inválida; envie JSON válido. Erro: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=400, 
                detail=f"Erro ao processar metadata: {str(e)}"
            )

    audio_bytes = await file.read()

    trans_res = await transcribe_audio_bytes(audio_bytes, filename=file.filename, timeout=int(os.getenv("GROQ_TRANSCRIBE_TIMEOUT", "60")))

    if trans_res.get("error"):
        raise HTTPException(status_code=500, detail=trans_res.get("error"))

    transcription = trans_res.get("text", "")

    try:
        summary_res = await call_gpt(transcription, meta.get("profile") or {})
        
        if summary_res.get("error"):
            return {
                "status": "partial",
                "transcription": transcription,
                "error": summary_res.get("error"),
                "text": ""
            }
    except Exception as e:
        logging.error("Erro ao gerar resumo: %s", str(e))
        return {
            "status": "partial",
            "transcription": transcription,
            "error": f"Erro ao gerar resumo: {str(e)}",
            "text": ""
        }

    return {
        "status": "done", 
        "transcription": transcription, 
        "raw": summary_res.get("raw"), 
        "text": summary_res.get("text")
    }