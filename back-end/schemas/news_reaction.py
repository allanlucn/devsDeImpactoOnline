from typing import TYPE_CHECKING
from datetime import datetime
from sqlalchemy import ForeignKey, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from schemas.base import Base
from models.enums.reaction import ReactionType

if TYPE_CHECKING:
    from schemas.user import User
    from schemas.projetos_lei import ProjetoLei

class NewsReaction(Base):
    __tablename__ = "news_reactions"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    news_id: Mapped[int] = mapped_column(ForeignKey("projetos_lei.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    reaction_type: Mapped[ReactionType] = mapped_column(SQLEnum(ReactionType), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, nullable=False)

    news: Mapped["ProjetoLei"] = relationship("ProjetoLei", back_populates="reactions")
    user: Mapped["User"] = relationship("User", back_populates="news_reactions")

    __table_args__ = (
        UniqueConstraint('news_id', 'user_id', name='uq_news_user_reaction'),
    )