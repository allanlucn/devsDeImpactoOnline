from typing import TYPE_CHECKING, Optional, List
from datetime import datetime
from sqlalchemy import CHAR, ForeignKey, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from schemas.base import Base

if TYPE_CHECKING:
    from schemas.address import Address
    from schemas.comment import Comment
    from schemas.news_reaction import NewsReaction
    from schemas.comment_reaction import CommentReaction

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(14))
    phone: Mapped[str] = mapped_column(String(14))
    gender: Mapped[str] = mapped_column(CHAR(1))
    race: Mapped[str] = mapped_column(String(14))
    job: Mapped[str] = mapped_column(String(50))
    job_label: Mapped[str] = mapped_column(String(50))
    alert_urgent: Mapped[bool] 
    address_id: Mapped[int] = mapped_column(ForeignKey("address.id"))
    address: Mapped["Address"] = relationship(back_populates="residents")
    last_notification_sent: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="user")
    news_reactions: Mapped[List["NewsReaction"]] = relationship("NewsReaction", back_populates="user")
    comment_reactions: Mapped[List["CommentReaction"]] = relationship("CommentReaction", back_populates="user")
   
    def __repr__(self):
        return f"<User(id={self.id}, phone='{self.phone}', job='{self.job}')>"
