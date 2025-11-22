from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 1. Carrega variáveis de ambiente antes de tudo
load_dotenv()

from core.config import settings

# 2. Importação das Rotas (Routers)
# Ajuste o caminho se necessário (ex: se for 'agents.router' ou 'agents.routes')
try:
    from api.v1 import api_router
except ImportError:
    print("Aviso: api_router não encontrado em api.v1. Verifique os imports.")
    api_router = None

try:
    from agents.routes import router as agents_router
except ImportError:
    # Fallback caso o arquivo ainda não exista ou o nome esteja diferente
    print("Aviso: agents_router não encontrado. Verifique se o arquivo agents/routes.py existe.")
    agents_router = None

def create_app() -> FastAPI:
    # 3. Inicializa o App
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version
    )

    # 4. Configura CORS
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 5. Inclui as Rotas
    if api_router:
        application.include_router(api_router) # Geralmente inclui prefixo /api/v1 internamente
    
    if agents_router:
        application.include_router(agents_router)

    # 6. Rota Raiz (Health Check)
    @application.get("/")
    def read_root():
        return {
            "message": f"API {settings.app_name} rodando!",
            "docs": "/docs"
        }

    return application

app = create_app()