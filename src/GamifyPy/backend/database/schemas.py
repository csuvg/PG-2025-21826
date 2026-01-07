from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=True)
    puntos = Column(Integer, default=0)
    fecha_registro = Column(DateTime, server_default=func.now())

    insignias = relationship("InsigniaUsuario", back_populates="usuario")

class Categoria(Base):
    __tablename__ = 'categoria'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String)

class Nivel(Base):
    __tablename__ = 'niveles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_categoria = Column(Integer, ForeignKey('categoria.id', ondelete="CASCADE"), nullable=False)
    nombre = Column(String, nullable=False)
    descripcion = Column(String)
    orden = Column(Integer)

class Leccion(Base):
    __tablename__ = 'lecciones'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_nivel = Column(Integer, ForeignKey('niveles.id', ondelete="CASCADE"), nullable=False)
    titulo = Column(String, nullable=False)
    contenido = Column(Text)
    orden = Column(Integer)

class Habilidad(Base):
    __tablename__ = 'habilidades'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(Text, nullable=False)
    descripcion = Column(Text)

class LeccionHabilidad(Base):
    __tablename__ = 'lecciones_habilidades'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_leccion = Column(Integer, ForeignKey('lecciones.id', ondelete="CASCADE"), nullable=False)
    id_habilidades = Column(Integer, ForeignKey('habilidades.id', ondelete="CASCADE"), nullable=False)

class Pregunta(Base):
    __tablename__ = 'preguntas'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_leccion = Column(Integer, ForeignKey('lecciones.id', ondelete="CASCADE"), nullable=False)
    pregunta = Column(Text, nullable=False)
    codigo_inicial = Column(Text)
    respuesta = Column(Text, nullable=False)
    tipo = Column(String, nullable=False)
    puntos = Column(Integer, default=0)

class ProgresoUsuario(Base):
    __tablename__ = 'progreso_usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('usuarios.id', ondelete="CASCADE"), nullable=False)
    id_leccion = Column(Integer, ForeignKey('lecciones.id', ondelete="CASCADE"), nullable=False)
    completado = Column(Boolean, default=False)
    fecha_completado = Column(DateTime)

class IntentoPregunta(Base):
    __tablename__ = 'intentos_preguntas'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('usuarios.id', ondelete="CASCADE"), nullable=False)
    id_preguntas = Column(Integer, ForeignKey('preguntas.id', ondelete="CASCADE"), nullable=False)
    respuesta_enviada = Column(Text)
    es_correcto = Column(Boolean)
    retroalimentacion = Column(Text)
    fecha = Column(DateTime, server_default=func.now())

class OpcionPregunta(Base):
    __tablename__ = 'opciones_preguntas'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_preguntas = Column(Integer, ForeignKey('preguntas.id', ondelete="CASCADE"), nullable=False)
    texto_opcion = Column(Text, nullable=False)
    valor_opcion = Column(Boolean, nullable=False)

class Insignia(Base):
    __tablename__ = 'insignias'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(Text)
    icono = Column(Text)

class InsigniaUsuario(Base):
    __tablename__ = 'insignias_usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey('usuarios.id', ondelete="CASCADE"), nullable=False)
    id_insignia = Column(Integer, ForeignKey('insignias.id', ondelete="CASCADE"), nullable=False)
    fecha_logro = Column(DateTime, server_default=func.now())

    usuario = relationship("Usuario", back_populates="insignias")
    insignia = relationship("Insignia")
