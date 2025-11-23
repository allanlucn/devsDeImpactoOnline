from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException, status

from schemas.projetos_lei import ProjetoLei


class ProjetoLeiService:
    @staticmethod
    def get_projetos_lei(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        ano: Optional[int] = None,
        tipo: Optional[str] = None
    ) -> List[ProjetoLei]:
        query = db.query(ProjetoLei)
        
        if ano:
            query = query.filter(ProjetoLei.ano == ano)
        if tipo:
            query = query.filter(ProjetoLei.tipo == tipo)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def get_projeto_lei_by_id(db: Session, projeto_id: int) -> ProjetoLei:
        projeto = db.query(ProjetoLei).filter(ProjetoLei.id == projeto_id).first()
        if projeto is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projeto de lei não encontrado"
            )
        return projeto
    
    @staticmethod
    def search_projetos_lei(
        db: Session,
        search_term: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[ProjetoLei]:
        query = db.query(ProjetoLei).filter(
            (ProjetoLei.titulo.ilike(f"%{search_term}%")) |
            (ProjetoLei.ementa.ilike(f"%{search_term}%")) |
            (ProjetoLei.resumo_ia.ilike(f"%{search_term}%"))
        )
        return query.offset(skip).limit(limit).all()
