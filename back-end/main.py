from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
import asyncio

load_dotenv()

from core.config import settings
from api.v1 import api_router
from agents.routes import router as agents_router
from services.whatsapp_service import WhatsAppService
from jobs.notification_scheduler import start_notification_scheduler

notification_scheduler = None


async def validate_whatsapp_connection():
    if not settings.zapi_instance_id or not settings.zapi_token or not settings.zapi_client_token:
        print("Z-API nao configurada. Notificacoes WhatsApp desabilitadas.")
        print("Configure ZAPI_INSTANCE_ID, ZAPI_TOKEN e ZAPI_CLIENT_TOKEN no .env")
        return False
    
    print("\nVerificando conexao com WhatsApp Z-API...")
    
    try:
        status = await WhatsAppService.check_instance_status()
        
        if status.get("success") and status.get("connected"):
            print(f"WhatsApp conectado! Estado: {status.get('state')}")
            return True
        elif status.get("success"):
            print(f"WhatsApp nao conectado. Estado: {status.get('state')}")
            print("As notificacoes serao enviadas quando o WhatsApp estiver conectado.")
            return True
        else:
            print(f"Erro ao verificar WhatsApp: {status.get('error')}")
            return False
    except Exception as e:
        print(f"Erro ao validar WhatsApp: {e}")
        return False


def create_app() -> FastAPI:
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    if api_router:
        application.include_router(api_router)
    
    if agents_router:
        application.include_router(agents_router)

    @application.get("/")
    def read_root():
        return {
            "message": f"API {settings.app_name} rodando!",
            "docs": "/docs"
        }
    
    @application.on_event("startup")
    async def startup_event():
        global notification_scheduler
        
        print("\n" + "="*80)
        print(f"Iniciando {settings.app_name} v{settings.app_version}")
        print("="*80 + "\n")
        
        whatsapp_ok = await validate_whatsapp_connection()
        
        if whatsapp_ok:
            try:
                notification_scheduler = start_notification_scheduler()
                print("Sistema de notificacoes inicializado com sucesso!\n")
            except Exception as e:
                print(f"Erro ao iniciar scheduler de notificacoes: {e}\n")
        else:
            print("Sistema de notificacoes nao inicializado.\n")
        
        print("="*80)
        print("Aplicacao pronta para receber requisicoes!")
        print("="*80 + "\n")
    
    @application.on_event("shutdown")
    async def shutdown_event():
        """Evento executado no shutdown da aplicação."""
        global notification_scheduler
        
        if notification_scheduler:
            from jobs.notification_scheduler import stop_notification_scheduler
            stop_notification_scheduler(notification_scheduler)

    return application

app = create_app()