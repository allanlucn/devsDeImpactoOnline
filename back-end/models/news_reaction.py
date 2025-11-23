from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.enums.reaction import ReactionType


class NewsReactionCreate(BaseModel):
    news_id: int
    user_id: int
    reaction_type: ReactionType


class NewsReactionResponse(BaseModel):
    id: int
    news_id: int
    user_id: int
    reaction_type: ReactionType
    created_at: datetime

    class Config:
        from_attributes = True


class NewsReactionStats(BaseModel):
    likes_count: int = 0
    dislikes_count: int = 0
    user_reaction: Optional[ReactionType] = None
