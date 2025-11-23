from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from db.config import get_db
from models.projeto_lei import ProjetoLeiResponse
from services.projeto_lei import ProjetoLeiService

router = APIRouter(prefix="/news", tags=["news"])


@router.get("/", response_model=List[ProjetoLeiResponse])
def get_projetos_lei(
    skip: int = Query(0, ge=0, description="Número de registros a pular"),
    limit: int = Query(100, ge=1, le=500, description="Número máximo de registros a retornar"),
    ano: Optional[int] = Query(None, description="Filtrar por ano"),
    tipo: Optional[str] = Query(None, description="Filtrar por tipo de projeto"),
    db: Session = Depends(get_db)
):
    return ProjetoLeiService.get_projetos_lei(db, skip, limit, ano, tipo)


@router.get("/search", response_model=List[ProjetoLeiResponse])
def search_projetos_lei(
    q: str = Query(..., min_length=3, description="Termo de busca (mínimo 3 caracteres)"),
    skip: int = Query(0, ge=0, description="Número de registros a pular"),
    limit: int = Query(100, ge=1, le=500, description="Número máximo de registros a retornar"),
    db: Session = Depends(get_db)
):
    return ProjetoLeiService.search_projetos_lei(db, q, skip, limit)
