from pydantic import BaseModel, Field
from typing import Optional


class UserBase(BaseModel):
    phone: str = Field(..., max_length=14, description="Telefone do usuário")
    gender: str = Field(..., max_length=1, description="Gênero (M/F/O)")
    race: str = Field(..., max_length=14, description="Raça/Etnia")
    job: str = Field(..., max_length=50, description="Profissão")
    job_label: str = Field(..., max_length=50, description="Classificação do trabalho")
    name: str = Field(..., max_length=50, description="Nome do usuário")
    alert_urgent: bool = Field(default=False, description="Receber alertas urgentes")


class UserCreate(UserBase):
    zipcode: str = Field(..., max_length=8, min_length=8, description="CEP (apenas números)")


class UserResponse(UserBase):
    id: int
    address_id: int

    class Config:
        from_attributes = True
