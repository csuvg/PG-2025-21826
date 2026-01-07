import json
from backend.database.database import Database
from backend.database.schemas import Habilidad, LeccionHabilidad

def habilidades_json(ruta_archivo):
    db = Database()
    session = db.get_session()
    
    with open(ruta_archivo, "r", encoding="utf-8") as f:
        datos = json.load(f)

    for entrada in datos:
        nombre = entrada["nombre"]
        descripcion = entrada["descripcion"]
        id_leccion = entrada["lecciones"]

        # Crear habilidad
        habilidad = Habilidad(nombre=nombre, descripcion=descripcion)
        session.add(habilidad)
        session.flush()

        # Asociar con la lección
        relacion = LeccionHabilidad(
            id_leccion=id_leccion,
            id_habilidades=habilidad.id
        )
        session.add(relacion)

    session.commit()
    print("✅ Habilidades y relaciones agregadas correctamente.")

if __name__ == "__main__":
    habilidades_json("Content/Skills.json")
