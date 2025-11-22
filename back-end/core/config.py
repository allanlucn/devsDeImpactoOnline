from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Sem nome no momento"
    app_version: str = "1.0.0"
    
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:5174", "http://localhost:8000"]
    
    database_url: str = "sqlite:///./app.db"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"

settings = Settings()