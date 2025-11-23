from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from fastapi import HTTPException, status

from schemas.comment import Comment
from schemas.comment_reaction import CommentReaction
from models.comment import CommentCreate, CommentUpdate


class CommentService:
    @staticmethod
    def get_comments_by_news(
        db: Session, 
        news_id: int, 
        user_id: Optional[int] = None,
        skip: int = 0, 
        limit: int = 100
    ) -> List[dict]:
        comments = db.query(Comment).filter(
            Comment.news_id == news_id
        ).order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()
        
        result = []
        for comment in comments:
            likes_count = db.query(func.count(CommentReaction.id)).filter(
                CommentReaction.comment_id == comment.id
            ).scalar()
            
            user_has_liked = False
            if user_id:
                user_has_liked = db.query(CommentReaction).filter(
                    CommentReaction.comment_id == comment.id,
                    CommentReaction.user_id == user_id
                ).first() is not None
            
            result.append({
                "id": comment.id,
                "news_id": comment.news_id,
                "user_id": comment.user_id,
                "content": comment.content,
                "created_at": comment.created_at,
                "updated_at": comment.updated_at,
                "likes_count": likes_count,
                "user_has_liked": user_has_liked
            })
        
        return result
    
    @staticmethod
    def get_comment_by_id(db: Session, comment_id: int, user_id: Optional[int] = None) -> dict:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comentario nao encontrado"
            )
        
        likes_count = db.query(func.count(CommentReaction.id)).filter(
            CommentReaction.comment_id == comment.id
        ).scalar()
        
        user_has_liked = False
        if user_id:
            user_has_liked = db.query(CommentReaction).filter(
                CommentReaction.comment_id == comment.id,
                CommentReaction.user_id == user_id
            ).first() is not None
        
        return {
            "id": comment.id,
            "news_id": comment.news_id,
            "user_id": comment.user_id,
            "content": comment.content,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at,
            "likes_count": likes_count,
            "user_has_liked": user_has_liked
        }
    
    @staticmethod
    def create_comment(db: Session, comment_data: CommentCreate) -> Comment:
        new_comment = Comment(**comment_data.model_dump())
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        return new_comment
    
    @staticmethod
    def update_comment(
        db: Session, 
        comment_id: int, 
        user_id: int,
        comment_data: CommentUpdate
    ) -> Comment:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comentario nao encontrado"
            )
        
        if comment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Voce nao tem permissao para editar este comentario"
            )
        
        comment.content = comment_data.content
        db.commit()
        db.refresh(comment)
        return comment
    
    @staticmethod
    def delete_comment(db: Session, comment_id: int, user_id: int) -> None:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comentario nao encontrado"
            )
        
        if comment.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Voce nao tem permissao para deletar este comentario"
            )
        
        db.delete(comment)
        db.commit()
