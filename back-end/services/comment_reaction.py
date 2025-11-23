from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from schemas.comment_reaction import CommentReaction
from schemas.comment import Comment


class CommentReactionService:
    @staticmethod
    def toggle_like(db: Session, comment_id: int, user_id: int) -> dict:
        comment = db.query(Comment).filter(Comment.id == comment_id).first()
        if not comment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comentario nao encontrado"
            )
        
        existing_reaction = db.query(CommentReaction).filter(
            CommentReaction.comment_id == comment_id,
            CommentReaction.user_id == user_id
        ).first()
        
        if existing_reaction:
            db.delete(existing_reaction)
            db.commit()
            return {"action": "removed", "liked": False}
        else:
            new_reaction = CommentReaction(
                comment_id=comment_id,
                user_id=user_id
            )
            db.add(new_reaction)
            db.commit()
            return {"action": "created", "liked": True}
