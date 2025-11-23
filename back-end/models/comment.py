from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CommentBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)


class CommentCreate(CommentBase):
    news_id: int
    user_id: int


class CommentUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)


class CommentResponse(CommentBase):
    id: int
    news_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    likes_count: int = 0
    user_has_liked: bool = False

    class Config:
        from_attributes = True
