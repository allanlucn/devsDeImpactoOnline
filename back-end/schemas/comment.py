from typing import TYPE_CHECKING, List
from datetime import datetime
from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from schemas.base import Base

if TYPE_CHECKING:
    from schemas.user import User
    from schemas.projetos_lei import ProjetoLei
    from schemas.comment_reaction import CommentReaction

class Comment(Base):
    __tablename__ = "comments"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    news_id: Mapped[int] = mapped_column(ForeignKey("projetos_lei.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    news: Mapped["ProjetoLei"] = relationship("ProjetoLei", back_populates="comments")
    user: Mapped["User"] = relationship("User", back_populates="comments")
    reactions: Mapped[List["CommentReaction"]] = relationship("CommentReaction", back_populates="comment", cascade="all, delete-orphan")