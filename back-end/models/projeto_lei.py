from pydantic import BaseModel, Field, field_serializer
from typing import Optional, Union, List, Any
from datetime import date, datetime


class ProjetoLeiBase(BaseModel):
    id_externo_api: Optional[str] = Field(None, description="Identificador externo da API")
    tipo: Optional[str] = Field(None, description="Tipo do projeto de lei")
    numero: Optional[str] = Field(None, description="Número do projeto")
    ano: Optional[int] = Field(None, description="Ano do projeto")
    ementa: Optional[str] = Field(None, description="Ementa do projeto de lei")
    resumo_ia: Optional[str] = Field(None, description="Resumo gerado por IA")
    analise_juridica: Optional[str] = Field(None, description="Análise jurídica do projeto")
    impacto_social: Optional[str] = Field(None, description="Análise de impacto social")
    tags_ia: Optional[Union[dict, List[str]]] = Field(None, description="Tags geradas por IA em formato JSON")
    link_inteiro_teor: Optional[str] = Field(None, description="Link para o inteiro teor do projeto")
    data_apresentacao: Optional[Union[str, date]] = Field(None, description="Data de apresentação do projeto")
    data_processamento: Optional[Union[str, datetime]] = Field(None, description="Data e hora do processamento")
    titulo: Optional[str] = Field(None, description="Título do projeto de lei")


class ProjetoLeiResponse(ProjetoLeiBase):
    id: int

    @field_serializer('tags_ia')
    def serialize_tags_ia(self, tags_ia: Optional[Union[dict, List[str]]], _info) -> Optional[Any]:
        if tags_ia is None:
            return None
        if isinstance(tags_ia, list):
            return {"tags": tags_ia}
        return tags_ia
    
    @field_serializer('data_apresentacao')
    def serialize_data_apresentacao(self, data_apresentacao: Optional[Union[str, date]], _info) -> Optional[str]:
        if data_apresentacao is None:
            return None
        if isinstance(data_apresentacao, date):
            return data_apresentacao.isoformat()
        return data_apresentacao
    
    @field_serializer('data_processamento')
    def serialize_data_processamento(self, data_processamento: Optional[Union[str, datetime]], _info) -> Optional[str]:
        if data_processamento is None:
            return None
        if isinstance(data_processamento, datetime):
            return data_processamento.isoformat()
        return data_processamento

    class Config:
        from_attributes = True
