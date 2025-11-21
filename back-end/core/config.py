from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    app_name: str = "Sem nome no momento"
    app_version: str = "1.0.0"
    
    cors_origins: List[str] = ["*"]
    
    database_url: str = "sqlite:///./app.db"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"

settings = Settings()
