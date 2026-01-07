import os
import logging
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database.schemas import Base
from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class Database:
    """Clase para la conexión a la base de datos PostgreSQL."""

    def __init__(self):
        """
        Conecta a la base de datos PostgreSQL y crea el motor.
        """
        self.engine = None
        self.Session = None

        self.connect()
        self.Session = sessionmaker(bind=self.engine)
        self.create_tables()

    def connect(self):
        """Conecta a la base de datos PostgreSQL y crea un motor."""
        connection_string = os.getenv("DATABASE_URL_HETZNER")
        self.engine = create_engine(connection_string, echo=False)

    def create_tables(self):
        """Crea las tablas en la base de datos si no existen."""
        Base.metadata.create_all(self.engine)

    def get_session(self):
        """
        Obtiene una sesión de la base de datos.
        :return: Sesión de la base de datos
        """
        return self.Session()

    @contextmanager
    def write(self):
        """
        Crea una sesión de la base de datos para realizar alguna operación de escritura (INSERT, UPDATE, DELETE) con validación de errores.
        :return: Sesión de base de datos y el código de estado
        """
        session = self.get_session()
        try:
            yield session
            session.commit()
        except Exception as error:
            logger.error(f"Error en la operación de escritura: {error}")
            session.rollback()
            raise
        finally:
            session.close()

    @contextmanager
    def read(self):
        """
        Crea una sesión de la base de datos para realizar alguna operación de lectura (SELECT) con validación de errores.
        :return: Sesión de base de datos
        """
        session = self.get_session()
        try:
            yield session
        except Exception as error:
            logger.error(f"Error en la operación de lectura: {error}")
            session.rollback()
        finally:
            session.close()

    def clear(self):
        """
        Elimina todas las tablas de la base de datos y las vuelve a crear.
        """
        with self.write() as session:
            Base.metadata.drop_all(self.engine)
            Base.metadata.create_all(self.engine)
            logger.info("Todas las tablas han sido eliminadas y recreadas.")

if __name__ == "__main__":
    db = Database()
    print("Base de datos creada y conectada correctamente.")
