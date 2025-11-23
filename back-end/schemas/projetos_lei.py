from datetime import date, datetime
from sqlalchemy import String, Integer, Text, Date, TIMESTAMP, JSON, Index
from sqlalchemy.orm import Mapped, mapped_column
from schemas.base import Base


class ProjetoLei(Base):
    __tablename__ = "projetos_lei"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    id_externo_api: Mapped[str] = mapped_column(String, nullable=True)
    tipo: Mapped[str] = mapped_column(String, nullable=True, index=True)
    numero: Mapped[str] = mapped_column(String, nullable=True)
    ano: Mapped[int] = mapped_column(Integer, nullable=True, index=True)
    ementa: Mapped[str] = mapped_column(Text, nullable=True)
    resumo_ia: Mapped[str] = mapped_column(Text, nullable=True)
    analise_juridica: Mapped[str] = mapped_column(Text, nullable=True)
    impacto_social: Mapped[str] = mapped_column(Text, nullable=True)
    tags_ia: Mapped[dict] = mapped_column(JSON, nullable=True)
    link_inteiro_teor: Mapped[str] = mapped_column(Text, nullable=True)
    data_apresentacao: Mapped[str] = mapped_column(String, nullable=True, index=True)
    data_processamento: Mapped[str] = mapped_column(String, nullable=True)
    titulo: Mapped[str] = mapped_column(Text, nullable=True)

    __table_args__ = (
        Index('ix_projetos_lei_tipo_ano', 'tipo', 'ano'),
        Index('ix_projetos_lei_data_apresentacao', 'data_apresentacao'),
    )

    def __repr__(self):
        return f"<ProjetoLei(id={self.id}, tipo='{self.tipo}', numero='{self.numero}', ano={self.ano})>"
