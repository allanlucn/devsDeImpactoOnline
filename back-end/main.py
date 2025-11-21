from typing import Union
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from db.config import engine, get_db
from schemas import Base
from schemas.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/usuarios/")
def criar_usuario(nome: str, email: str, senha: str, db: Session = Depends(get_db)):
    novo_usuario = User(nome=nome, email=email, senha=senha)
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return {"id": novo_usuario.id, "nome": novo_usuario.nome, "email": novo_usuario.email}


@app.get("/usuarios/")
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(User).all()
    return usuarios