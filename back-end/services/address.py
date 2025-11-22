import requests
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from schemas.address import Address

class AddressService:
    @staticmethod
    def get_or_create_address(db: Session, zipcode: str) -> Address:
        address = db.query(Address).filter(Address.zipcode == zipcode).first()
        if address:
            return address
        
        try:
            response = requests.get(f"https://viacep.com.br/ws/{zipcode}/json/")
            data = response.json()
            
            if "erro" in data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="CEP não encontrado"
                )
            
            new_address = Address(
                zipcode=zipcode,
                street=data.get("logradouro", ""),
                neighborhood=data.get("bairro", ""),
                city=data.get("localidade", ""),
                state=data.get("uf", "")
            )
            
            db.add(new_address)
            db.commit()
            db.refresh(new_address)
            
            return new_address
            
        except requests.RequestException:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Erro ao consultar serviço de CEP"
            )

