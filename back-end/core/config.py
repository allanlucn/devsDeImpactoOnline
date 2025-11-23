from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Sem nome no momento"
    app_version: str = "1.0.0"
    
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:5174", "http://localhost:8000"]
    
    database_url: str = "sqlite:///./app.db"
    
    zapi_instance_id: str = ""
    zapi_token: str = ""
    zapi_client_token: str = ""
    
    web_url: str = "http://localhost:3000"
    notifications_dry_run: bool = False
    notification_min_score: float = 5.0
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"

settings = Settings()