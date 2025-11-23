from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from core.config import settings
from api.v1 import api_router
from agents.routes import router as agents_router

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

    return application

app = create_app()