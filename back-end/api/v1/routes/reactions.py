from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from db.config import get_db
from models.news_reaction import NewsReactionStats
from models.enums.reaction import ReactionType
from services.news_reaction import NewsReactionService

router = APIRouter(prefix="/reactions", tags=["reactions"])


@router.get("/news/{news_id}", response_model=NewsReactionStats)
def get_news_reaction_stats(
    news_id: int,
    user_id: int = Query(None),
    db: Session = Depends(get_db)
):
    return NewsReactionService.get_news_reaction_stats(db, news_id, user_id)


@router.post("/news/{news_id}/{reaction_type}")
def toggle_news_reaction(
    news_id: int,
    reaction_type: ReactionType,
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    result = NewsReactionService.toggle_reaction(db, news_id, user_id, reaction_type)
    stats = NewsReactionService.get_news_reaction_stats(db, news_id, user_id)
    return {
        "action": result["action"],
        "reaction_type": result["reaction_type"],
        "stats": stats
    }


@router.post("/comments/{comment_id}/like")
def toggle_comment_like(
    comment_id: int,
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    from services.comment_reaction import CommentReactionService
    return CommentReactionService.toggle_like(db, comment_id, user_id)
