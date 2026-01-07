from pydantic import BaseModel

class RespuestaRequest(BaseModel):
    respuesta: str
