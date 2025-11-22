from db.config import engine
from schemas.base import Base
from schemas.user import User
from schemas.address import Address
from schemas.documentos import DocumentoGov
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    logger.info("Checking database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables check completed!")

if __name__ == "__main__":
    init_db()