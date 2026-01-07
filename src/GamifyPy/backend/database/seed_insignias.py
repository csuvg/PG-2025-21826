import json
from pathlib import Path
from backend.database.database import Database
from backend.database.schemas import Insignia

# Leer archivo JSON
def insignias_json(path="Content/Insignias.json"):
    ruta = Path(path)
    if not ruta.exists():
        raise FileNotFoundError(f"No se encontró el archivo: {path}")
    
    with open(ruta, "r", encoding="utf-8") as archivo:
        return json.load(archivo)

# Insertar en DB
def seed_insignias():
    db = Database()
    session = db.get_session()
    insignias = insignias_json()
    
    for ins in insignias:
        nueva = Insignia(
            nombre=ins["nombre"],
            descripcion=ins["descripcion"],
            icono=ins["icono"]
        )
        session.add(nueva)
    
    session.commit()
    print("✅ Insignias insertadas correctamente.")

if __name__ == "__main__":
    seed_insignias()
