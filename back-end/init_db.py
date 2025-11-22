from db.config import engine
from schemas.base import Base
from schemas.user import User
from schemas.address import Address
from schemas.documentos import DocumentoGov 

def init_db():
    print("Checking database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables check completed!")

if __name__ == "__main__":
    init_db()