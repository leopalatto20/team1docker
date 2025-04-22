from pydantic import BaseModel

class MaestroLogin(BaseModel):
    Correo: str
    Grupo: str
