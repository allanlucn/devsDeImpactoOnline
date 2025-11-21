from db.config import engine
from schemas.base import Base
from schemas.user import User
from schemas.address import Address

def init_db():
    print("Creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()
