from fastapi import APIRouter, HTTPException, Body
from typing import Optional, Dict, Any
from datetime import datetime

from agents.gpt_client import call_gpt

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/")
async def chat_endpoint(
    payload: Dict[str, Any] = Body(...)
):
    """Endpoint de chat que recebe mensagem do usuário e retorna resposta do bot.
    
    Request Body:
    {
        "message": "Olá, gostaria de saber mais sobre...",
        "profile": {"profissao": "motoboy", "idade": "30"}  # opcional
    }
    
    Response:
    {
        "response": "Resposta do bot...",
        "timestamp": "2023-10-27T10:00:00Z"
    }
    """
    message = payload.get("message")
    if not message:
        raise HTTPException(status_code=400, detail="Campo 'message' obrigatório")
    
    # Extrai o perfil do usuário se fornecido
    profile = payload.get("profile") or {}
    
    try:
        # Chama o GPT através do agents/simplify
        res = await call_gpt(message, profile)
        
        if res.get("error"):
            raise HTTPException(
                status_code=500, 
                detail=f"Erro ao processar mensagem: {res.get('error')}"
            )
        
        return {
            "response": res.get("text", ""),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
