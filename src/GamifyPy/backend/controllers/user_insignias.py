from backend.database import (ProgresoUsuario, IntentoPregunta, InsigniaUsuario, Nivel, Leccion, Pregunta)
from sqlalchemy import func
from datetime import datetime

def assign_insignia(user_id, insignia_id, db):
    """ Asigna una insignia a un usuario si no la tiene ya. """
    existente = db.query(InsigniaUsuario).filter_by(id_usuario=user_id, id_insignia=insignia_id).first()

    if existente:
        return False

    nueva = InsigniaUsuario(id_usuario=user_id, id_insignia=insignia_id, fecha_logro=datetime.now())
    db.add(nueva)
    db.commit()
    return True

def evaluate_level_completion(user_id, db):
    """
    Asigna la insignia de nivel completado cuando:
      - Todas las lecciones del nivel están completadas.
      - Todas las preguntas del nivel han sido intentadas al menos una vez 
    """
    ids_insignias = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13, 14: 14}

    nuevas_insignias = []
    niveles = db.query(Nivel).all()

    for nivel in niveles:
        lecciones = db.query(Leccion).filter_by(id_nivel=nivel.id).all()
        leccion_ids = [l.id for l in lecciones]
        total_lecciones = len(lecciones)

        preguntas = db.query(Pregunta).filter(Pregunta.id_leccion.in_(leccion_ids)).all()
        pregunta_ids = [p.id for p in preguntas]
        total_preguntas = len(preguntas)

        if total_lecciones == 0 or total_preguntas == 0:
            continue  

        lecciones_completadas = db.query(
            func.count(func.distinct(ProgresoUsuario.id_leccion))
        ).filter(
            ProgresoUsuario.id_usuario == user_id,
            ProgresoUsuario.id_leccion.in_(leccion_ids),
            ProgresoUsuario.completado.is_(True)
        ).scalar() or 0

        preguntas_intentadas = db.query(
            func.count(func.distinct(IntentoPregunta.id_preguntas))
        ).filter(
            IntentoPregunta.id_usuario == user_id,
            IntentoPregunta.id_preguntas.in_(pregunta_ids)
        ).scalar() or 0

        if lecciones_completadas == total_lecciones and preguntas_intentadas == total_preguntas:
            insignia_id = ids_insignias.get(nivel.id)
            if insignia_id and assign_insignia(user_id, insignia_id, db):
                nuevas_insignias.append(insignia_id)

    return nuevas_insignias

def evaluate_category_completion(user_id, db):
    """ Evalúa si un usuario ha completado una categoría y asigna una insignia. """
    ids_insignias = {1: 48, 2: 49, 3: 50, 4: 51}
    niveles_categoria = {1: [1, 2], 2: [3, 4], 3: [5, 6, 7], 4: [8, 9, 10]}
    ids_insignias_niveles = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10}

    insignias_usuario = db.query(InsigniaUsuario.id_insignia).filter_by(id_usuario=user_id).all()
    insignias_usuario = set([i[0] for i in insignias_usuario])
    nuevas_insignias = []

    for categoria_id, niveles in niveles_categoria.items():
        insignias_necesarias = {ids_insignias_niveles[nivel] for nivel in niveles}

        if insignias_necesarias.issubset(insignias_usuario):
            insignia_categoria_id = ids_insignias.get(categoria_id)
            if insignia_categoria_id and insignia_categoria_id not in insignias_usuario:
                if assign_insignia(user_id, insignia_categoria_id, db):
                    nuevas_insignias.append(insignia_categoria_id)

    return nuevas_insignias

def evaluate_question_progress(user_id, db):
    """ Evalúa el progreso de las preguntas respondidas por un usuario. """
    ids_insignias_sin_errores = {
        1: 15, 2: 16, 3: 17, 4: 18, 5: 19, 6: 20, 7: 21, 8: 22, 9: 23, 10: 24, 11: 25, 12: 26, 13: 27, 14: 28
    }
    ids_insignias_cinco_errores = {
        1: 29, 2: 30, 3: 31, 4: 32, 5: 33, 6: 34, 7: 35, 8: 36, 9: 37, 10: 38, 11: 39, 12: 40, 13: 41, 14: 42
    }

    niveles = db.query(Nivel).all()
    nuevas_insignias = []

    for nivel in niveles:
        lecciones = db.query(Leccion).filter_by(id_nivel=nivel.id).all()
        preguntas = db.query(Pregunta).filter(
            Pregunta.id_leccion.in_([l.id for l in lecciones])
        ).all()

        if not preguntas:
            continue

        preguntas_intentadas = db.query(IntentoPregunta.id_preguntas).filter(
            IntentoPregunta.id_usuario == user_id,
            IntentoPregunta.id_preguntas.in_([p.id for p in preguntas])
        ).distinct().count()

        if preguntas_intentadas < len(preguntas):
            continue

        errores_preguntas = {}
        for pregunta in preguntas:
            intentos = db.query(IntentoPregunta).filter(
                IntentoPregunta.id_usuario == user_id,
                IntentoPregunta.id_preguntas == pregunta.id
            ).all()

            errores = sum(1 for intento in intentos if not intento.es_correcto)
            errores_preguntas[pregunta.id] = errores

        total_errores = sum(errores_preguntas.values())

        if total_errores == 0:
            insignia_id = ids_insignias_sin_errores.get(nivel.id)
            if insignia_id and assign_insignia(user_id, insignia_id, db):
                nuevas_insignias.append(insignia_id)
        elif total_errores <= 5:
            insignia_id = ids_insignias_cinco_errores.get(nivel.id)
            if insignia_id and assign_insignia(user_id, insignia_id, db):
                nuevas_insignias.append(insignia_id)

    return nuevas_insignias
    