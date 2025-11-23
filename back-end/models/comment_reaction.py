from pydantic import BaseModel
from datetime import datetime


class CommentReactionCreate(BaseModel):
    comment_id: int
    user_id: int


class CommentReactionResponse(BaseModel):
    id: int
    comment_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
