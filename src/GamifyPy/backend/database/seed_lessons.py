from backend.database.database import Database
from backend.database.schemas import Leccion
import re

def lecciones_md(ruta_archivo: str) -> list[dict]:
    with open(ruta_archivo, "r", encoding="utf-8") as f:
        contenido = f.read()

    # Divide usando los títulos como separadores
    bloques = re.split(r"(## Lección \d+: .+)", contenido)

    lecciones = []
    for i in range(1, len(bloques), 2):
        titulo_raw = bloques[i].strip()
        contenido_md = bloques[i + 1].strip()

        # Extraer solo el texto del título
        titulo = re.sub(r"^##\s*", "", titulo_raw)

        lecciones.append({
            "titulo": titulo,
            "contenido": contenido_md
        })

    return lecciones

def insertar_lecciones(ruta_md: str, id_nivel: int):
    db = Database()
    session = db.get_session()
    lecciones = lecciones_md(ruta_md)

    for idx, leccion in enumerate(lecciones, start=1):
        nueva_leccion = Leccion(
            id_nivel=id_nivel,
            titulo=leccion["titulo"],
            contenido=leccion["contenido"],
            orden=idx
        )
        session.add(nueva_leccion)

    session.commit()
    session.close()
    print(f"✅ {len(lecciones)} lecciones insertadas para el nivel {id_nivel}.")

'''
lecciones = lecciones_md("Docs/Level13.md")
for leccion in lecciones:
    print(f"Título: {leccion['titulo']}")
    print(f"Contenido:\n{leccion['contenido']}\n")
    print("-" * 40)
    print("\n")
'''

if __name__ == "__main__":
    archivo_md = "Docs/Level14.md"
    id_nivel = 14
    insertar_lecciones(archivo_md, id_nivel)
