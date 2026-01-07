from backend.database.database import Database
from backend.database.schemas import Pregunta, OpcionPregunta
import json

def preguntas_json(ruta_archivo: str):
    db = Database().get_session()

    with open(ruta_archivo, "r", encoding="utf-8") as f:
        preguntas_data = json.load(f)

    for p in preguntas_data:
        pregunta = Pregunta(
            id_leccion=p["id_leccion"],
            pregunta=p["texto"],
            tipo=p["tipo"],
            puntos=p.get("puntos", 0),
            codigo_inicial=p.get("codigo_inicial", ""),
            respuesta=p.get("respuesta", "")
        )

        db.add(pregunta)
        db.flush()

        if p["tipo"] == "opcion_multiple":
            for opcion in p.get("opciones", []):
                db.add(OpcionPregunta(
                    id_preguntas=pregunta.id,
                    texto_opcion=opcion["texto"],
                    valor_opcion=opcion["correcta"]
                ))

    db.commit()
    db.close()
    print("✅ Preguntas insertadas exitosamente.")

if __name__ == "__main__":
    preguntas_json("Content/Level14.json")
