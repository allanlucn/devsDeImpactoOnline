from sqlalchemy.orm import Session
from typing import List
from schemas.documentos import DocumentoGov

class DocumentoService:
    @staticmethod
    def get_documentos(db: Session, skip: int = 0, limit: int = 50) -> List[DocumentoGov]:
        # Ordena pelos mais recentes processados
        return db.query(DocumentoGov).order_by(DocumentoGov.data_processamento.desc()).offset(skip).limit(limit).all()