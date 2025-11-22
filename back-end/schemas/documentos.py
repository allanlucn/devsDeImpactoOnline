from typing import Optional
from datetime import date, datetime
from sqlalchemy import Text, String, Date, DateTime, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column
from schemas.base import Base

class DocumentoGov(Base):
    # Tem que ser o mesmo nome que criamos no SQL do Supabase
    __tablename__ = "documentos_gov"

    id: Mapped[int] = mapped_column(primary_key=True)
    titulo: Mapped[Optional[str]] = mapped_column(Text)
    texto_completo: Mapped[Optional[str]] = mapped_column(Text)
    resumo_ia: Mapped[Optional[str]] = mapped_column(Text)
    categoria: Mapped[Optional[str]] = mapped_column(String(100))
    link_fonte: Mapped[Optional[str]] = mapped_column(Text)
    data_publicacao: Mapped[Optional[date]] = mapped_column(Date)
    data_processamento: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Documento(id={self.id}, titulo='{self.titulo}')>"