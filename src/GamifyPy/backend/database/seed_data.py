from backend.database.database import Database
from backend.database.schemas import Categoria, Nivel
from sqlalchemy import text

db = Database()
session = db.get_session()

def reset_data():
    """Elimina datos existentes de las tablas relacionadas."""
    print("🗑️ Eliminando datos previos...")

    session.query(Nivel).delete()
    session.query(Categoria).delete()
    session.commit()

    # Reiniciar ID
    session.execute(text("ALTER SEQUENCE categoria_id_seq RESTART WITH 1"))
    session.execute(text("ALTER SEQUENCE niveles_id_seq RESTART WITH 1"))
    session.commit()

    print("✅ Datos eliminados.")

def seed():
    reset_data()

    # Insertar categorías
    categorias = [
        Categoria(
            nombre="Principiante",
            descripcion="Fundamentos esenciales de programación y lógica básica en Python, incluyendo variables, tipos de datos y operaciones."
        ),
        Categoria(
            nombre="Intermedio",
            descripcion="Uso de condicionales y estructuras de control para resolver problemas mediante decisiones y repeticiones."
        ),
        Categoria(
            nombre="Avanzado",
            descripcion="Desarrollo estructurado con funciones, introducción a Streamlit y modularidad en Python."
        ),
        Categoria(
            nombre="Experto",
            descripcion="Dominio de estructuras de datos como listas, cadenas y diccionarios, además de manejo robusto de errores y excepciones."
        ),
        Categoria(
            nombre="Creativo / Visual",
            descripcion="Exploración visual de la programación mediante Turtle y desarrollo de videojuegos básicos con Pygame."
        )
    ]
    session.add_all(categorias)
    session.commit()

    # Insertar niveles
    niveles = [
        # Principiante
        Nivel(id_categoria=1, orden=1, nombre="Nivel 1: Explorador de Variables",
              descripcion="Aprende a declarar variables, utilizar distintos tipos de datos (int, float, str) y resolver operaciones aritméticas simples en Python."),
        Nivel(id_categoria=1, orden=2, nombre="Nivel 2: Guardián de la Lógica",
              descripcion="Desarrolla habilidades en lógica booleana usando operadores como ==, !=, <, >, and, or y not para tomar decisiones simples."),

        # Intermedio
        Nivel(id_categoria=2, orden=3, nombre="Nivel 3: Maestro de Decisiones",
              descripcion="Domina el uso de estructuras condicionales como if, elif y else para controlar el flujo de ejecución en tus programas."),
        Nivel(id_categoria=2, orden=4, nombre="Nivel 4: Domador de Bucles",
              descripcion="Utiliza ciclos for y while para repetir instrucciones. Controla la ejecución con break y continue según condiciones específicas."),

        # Avanzado
        Nivel(id_categoria=3, orden=5, nombre="Nivel 5: Forjador de Funciones",
              descripcion="Crea tus propias funciones, define parámetros y retorna valores para reutilizar tu código."),
        Nivel(id_categoria=3, orden=6, nombre="Nivel 6: Creador de Apps con Streamlit",
              descripcion="Aprende los componentes básicos de Streamlit para construir interfaces simples en Python."),
        Nivel(id_categoria=3, orden=7, nombre="Nivel 7: Mago de Módulos",
              descripcion="Importa módulos propios o de la librería estándar como math y random. Aprende a estructurar programas más grandes."),

        # Experto
        Nivel(id_categoria=4, orden=8, nombre="Nivel 8: Guardián de Listas y Cadenas",
              descripcion="Domina listas y cadenas en Python. Comprende mutabilidad e inmutabilidad, y aplica funciones como append, split, len y más."),
        Nivel(id_categoria=4, orden=9, nombre="Nivel 9: Maestro de Diccionarios",
              descripcion="Aprende a trabajar con diccionarios: almacenar pares clave-valor, acceder a datos y recorrer colecciones con for."),
        Nivel(id_categoria=4, orden=10, nombre="Nivel 10: Invocador de Errores",
              descripcion="Identifica y controla errores comunes usando try y except. Mejora la robustez de tus programas con buen manejo de excepciones."),

        # Creativo / Visual
        Nivel(id_categoria=5, orden=11, nombre="Nivel 11: Aprendiz del Dibujo con Turtle",
              descripcion="Crea gráficos básicos con Turtle usando líneas, colores y bucles para patrones simples."),
        Nivel(id_categoria=5, orden=12, nombre="Nivel 12: Arquitecto Visual con Turtle",
              descripcion="Dibuja figuras complejas, usa funciones para modular tu código y aplica rellenos y combinaciones."),
        Nivel(id_categoria=5, orden=13, nombre="Nivel 13: Iniciador de Juegos con Pygame",
              descripcion="Aprende los fundamentos de Pygame: ventana de juego, imágenes y eventos de teclado."),
        Nivel(id_categoria=5, orden=14, nombre="Nivel 14: Maestro de Juegos con Pygame",
              descripcion="Desarrolla lógica básica de videojuegos con movimiento de sprites, colisiones y bucles de juego.")
    ]
    session.add_all(niveles)
    session.commit()
    print("✅ Categorías y niveles insertados correctamente.")

if __name__ == "__main__":
    seed()
