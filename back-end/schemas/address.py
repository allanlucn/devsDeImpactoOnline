from typing import List, TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from schemas.base import Base

if TYPE_CHECKING:
    from schemas.user import User

class Address(Base):
    __tablename__ = "address"

    id: Mapped[int] = mapped_column(primary_key=True)
    zipcode: Mapped[str] = mapped_column(String(8), unique=True)
    street : Mapped[str] = mapped_column(String(50))
    neighborhood : Mapped[str] = mapped_column(String(50))
    city : Mapped[str] = mapped_column(String(50))
    state : Mapped[str] = mapped_column(String(50))
    residents: Mapped[List["User"]] = relationship(back_populates="address")
    

    def __repr__(self):
        return f"<Address(id={self.id}, zipcode='{self.zipcode}', street='{self.street}', city='{self.city}', state='{self.state}')>"