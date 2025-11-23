from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException, status

from schemas.projetos_lei import ProjetoLei
from schemas.user import User
from services.recommendation import RecommendationService


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
    
    @staticmethod
    def get_personalized_feed(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[ProjetoLei]:

        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )

        all_projects = db.query(ProjetoLei).limit(1000).all()
        
        state = None
        if hasattr(user, 'address') and user.address:
            state = user.address.state

        ranked_projects = RecommendationService.filter_and_rank_projects(
            projects=all_projects,
            gender=user.gender,
            race=user.race,
            job_label=user.job_label,
            state=state,
            min_score=0.5
        )
        return ranked_projects[skip:skip + limit]
