from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from schemas.base import Base

if TYPE_CHECKING:
    from schemas.user import User
    from schemas.comment import Comment

class CommentReaction(Base):
    __tablename__ = "comment_reactions"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    comment_id: Mapped[int] = mapped_column(ForeignKey("comments.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    comment: Mapped["Comment"] = relationship("Comment", back_populates="reactions")
    user: Mapped["User"] = relationship("User", back_populates="comment_reactions")

    __table_args__ = (
        UniqueConstraint('comment_id', 'user_id', name='uq_comment_user_reaction'),
    )