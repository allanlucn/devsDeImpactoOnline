from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Optional
from fastapi import HTTPException, status

from schemas.news_reaction import NewsReaction
from models.news_reaction import NewsReactionCreate
from models.enums.reaction import ReactionType


class NewsReactionService:
    @staticmethod
    def get_news_reaction_stats(db: Session, news_id: int, user_id: Optional[int] = None) -> Dict:
        likes_count = db.query(func.count(NewsReaction.id)).filter(
            NewsReaction.news_id == news_id,
            NewsReaction.reaction_type == ReactionType.like
        ).scalar()
        
        dislikes_count = db.query(func.count(NewsReaction.id)).filter(
            NewsReaction.news_id == news_id,
            NewsReaction.reaction_type == ReactionType.dislike
        ).scalar()
        
        user_reaction = None
        if user_id:
            reaction = db.query(NewsReaction).filter(
                NewsReaction.news_id == news_id,
                NewsReaction.user_id == user_id
            ).first()
            if reaction:
                user_reaction = reaction.reaction_type
        
        return {
            "likes_count": likes_count,
            "dislikes_count": dislikes_count,
            "user_reaction": user_reaction
        }
    
    @staticmethod
    def toggle_reaction(
        db: Session, 
        news_id: int, 
        user_id: int, 
        reaction_type: ReactionType
    ) -> Dict:
        existing_reaction = db.query(NewsReaction).filter(
            NewsReaction.news_id == news_id,
            NewsReaction.user_id == user_id
        ).first()
        
        if existing_reaction:
            if existing_reaction.reaction_type == reaction_type:
                db.delete(existing_reaction)
                db.commit()
                return {"action": "removed", "reaction_type": None}
            else:
                existing_reaction.reaction_type = reaction_type
                db.commit()
                return {"action": "updated", "reaction_type": reaction_type}
        else:
            new_reaction = NewsReaction(
                news_id=news_id,
                user_id=user_id,
                reaction_type=reaction_type
            )
            db.add(new_reaction)
            db.commit()
            return {"action": "created", "reaction_type": reaction_type}
