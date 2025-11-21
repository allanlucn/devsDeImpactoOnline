from typing import TYPE_CHECKING
from sqlalchemy import CHAR, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from schemas.base import Base

if TYPE_CHECKING:
    from schemas.address import Address



class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    phone: Mapped[str] = mapped_column(String(14))
    gender: Mapped[str] = mapped_column(CHAR(1))
    race: Mapped[str] = mapped_column(String(14))
    job: Mapped[str] = mapped_column(String(50))
    address_id: Mapped[int] = mapped_column(ForeignKey("address.id"))
    address: Mapped["Address"] = relationship(back_populates="residents")
 
    def __repr__(self):
        return f"<User(id={self.id}, phone='{self.phone}', job='{self.job}')>"
