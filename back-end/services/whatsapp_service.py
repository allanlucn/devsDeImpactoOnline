import httpx
import re
from typing import Dict, Any, Optional
from core.config import settings


class WhatsAppService:
    
    @staticmethod
    def format_phone(phone: str) -> str:
        if not phone:
            return ""
        
        phone = phone.strip().replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
        phone = phone.lstrip("+")
        
        if not re.match(r'^\d{10,15}$', phone):
            raise ValueError(f"Telefone invalido: {phone}. Deve conter apenas numeros (10-15 digitos)")
        
        return phone
    
    @staticmethod
    def format_notification(projeto: Any, web_url: str) -> str:
        titulo = projeto.titulo or "Projeto de Lei"
        if len(titulo) > 60:
            titulo = titulo[:57] + "..."

        resumo = projeto.resumo_ia or projeto.ementa or "Nova proposta legislativa"
        if len(resumo) > 150:
            resumo = resumo[:147] + "..."
        
        link = f"{web_url}/news/{projeto.id}"

        mensagem = f"""*Novo Resumo Relevante!*

{titulo}

{resumo}

Saiba mais: {link}"""
        
        if len(mensagem) > 300:
            overhead = len(mensagem) - 300
            resumo = resumo[:len(resumo) - overhead - 3] + "..."
            mensagem = f"""*Novo Resumo Relevante!*

{titulo}

{resumo}

Saiba mais: {link}"""
        
        return mensagem
    
    @staticmethod
    async def send_text_message(phone: str, text: str) -> Dict[str, Any]:
        if not settings.zapi_instance_id or not settings.zapi_token or not settings.zapi_client_token:
            return {
                "success": False,
                "error": "Z-API nao configurada"
            }

        try:
            formatted_phone = WhatsAppService.format_phone(phone)
        except ValueError as e:
            return {
                "success": False,
                "error": str(e),
                "phone": phone
            }

        url = f"https://api.z-api.io/instances/{settings.zapi_instance_id}/token/{settings.zapi_token}/send-text"

        headers = {
            "Content-Type": "application/json",
            "Client-Token": settings.zapi_client_token
        }

        payload = {
            "phone": formatted_phone,
            "message": text,
            "delayMessage": 3
        }
        
        if settings.notifications_dry_run:
            print(f"[DRY-RUN] Enviando mensagem para {formatted_phone}")
            print(f"[DRY-RUN] Mensagem: {text}")
            return {
                "success": True,
                "dry_run": True,
                "phone": formatted_phone
            }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                
                return {
                    "success": True,
                    "response": response.json(),
                    "phone": formatted_phone
                }
        except httpx.HTTPError as e:
            print(f"Erro ao enviar mensagem WhatsApp para {formatted_phone}: {e}")
            return {
                "success": False,
                "error": str(e),
                "phone": formatted_phone
            }
        except Exception as e:
            print(f"Erro inesperado ao enviar mensagem para {formatted_phone}: {e}")
            return {
                "success": False,
                "error": str(e),
                "phone": formatted_phone
            }
    
    @staticmethod
    async def check_instance_status() -> Dict[str, Any]:
        if not settings.zapi_instance_id or not settings.zapi_token or not settings.zapi_client_token:
            return {
                "success": False,
                "connected": False,
                "error": "Z-API nao configurada"
            }

        url = f"https://api.z-api.io/instances/{settings.zapi_instance_id}/token/{settings.zapi_token}/status"

        headers = {
            "Client-Token": settings.zapi_client_token
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                
                data = response.json()

                connected = data.get("connected", False)
                state = "connected" if connected else "disconnected"
                
                return {
                    "success": True,
                    "connected": connected,
                    "state": state,
                    "response": data
                }
        except httpx.HTTPError as e:
            print(f"Erro ao verificar status da instancia WhatsApp: {e}")
            return {
                "success": False,
                "connected": False,
                "error": str(e)
            }
        except Exception as e:
            print(f"Erro inesperado ao verificar instancia: {e}")
            return {
                "success": False,
                "connected": False,
                "error": str(e)
            }
