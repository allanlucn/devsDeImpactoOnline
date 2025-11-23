from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status

from schemas.user import User
from schemas.address import Address
from models.user import UserCreate
from services.address import AddressService


class UserService:
    @staticmethod
    def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        return db.query(User).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        return user
    
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        address = AddressService.get_or_create_address(db, user_data.zipcode)
        
        user_dict = user_data.model_dump()
        user_dict.pop('zipcode')
        user_dict['address_id'] = address.id
        
        new_user = User(**user_dict)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_data: UserCreate) -> User:
        user = UserService.get_user_by_id(db, user_id)

        address = AddressService.get_or_create_address(db, user_data.zipcode)
        
        user_dict = user_data.model_dump()
        user_dict.pop('zipcode')
        user_dict['address_id'] = address.id

        for key, value in user_dict.items():
            setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def delete_user(db: Session, user_id: int) -> None:
        user = UserService.get_user_by_id(db, user_id)
        db.delete(user)
        db.commit()

    @staticmethod
    def auth(db: Session, user_phone: str) -> User:
        user = db.query(User).filter(User.phone == user_phone).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado com este telefone"
            )
        return user 