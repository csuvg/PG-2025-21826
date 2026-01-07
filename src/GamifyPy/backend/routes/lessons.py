from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from backend.database import get_db, Leccion, Pregunta, OpcionPregunta, Habilidad, LeccionHabilidad, ProgresoUsuario
from sqlalchemy.orm import Session
from backend.controllers.auth import get_current_user
from backend.controllers.user_insignias import assign_insignia
from datetime import datetime

router = APIRouter()

@router.get("/{leccion_id}")
async def get_lesson(leccion_id: int, db: Session = Depends(get_db)):
    lecciones = db.query(Leccion).filter(Leccion.id == leccion_id).first()
    if not lecciones:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    leccion_data = {
        "id": lecciones.id,
        "titulo": lecciones.titulo,
        "contenido": lecciones.contenido,
        "orden": lecciones.orden,
        "id_nivel": lecciones.id_nivel,
    }

    return JSONResponse(content=leccion_data)

@router.get("/{leccion_id}/preguntas")
async def get_lesson_questions(leccion_id: int, db: Session = Depends(get_db)):
    preguntas = db.query(Pregunta).filter(Pregunta.id_leccion == leccion_id).all()

    resultado = []
    for pregunta in preguntas:
        opciones = []
        if pregunta.tipo == "opcion_multiple":
            opciones = db.query(OpcionPregunta).filter(OpcionPregunta.id_preguntas == pregunta.id).all()
            opciones = [
                {
                    "texto": opcion.texto_opcion,
                    "valor": opcion.valor_opcion,
                } for opcion in opciones
            ]

        pregunta_data = {
            "id": pregunta.id,
            "pregunta": pregunta.pregunta,
            "tipo": pregunta.tipo,
            "codigo_inicial": pregunta.codigo_inicial,
            "puntos": pregunta.puntos,
            "opciones": opciones if opciones else None,
        }
        resultado.append(pregunta_data)

    return JSONResponse(content={"preguntas": resultado})

@router.get("/{leccion_id}/habilidades")
async def get_lesson_skills(leccion_id: int, db: Session = Depends(get_db)):
    habilidades = (
        db.query(Habilidad)
        .join(LeccionHabilidad, Habilidad.id == LeccionHabilidad.id_habilidades)
        .filter(LeccionHabilidad.id_leccion == leccion_id)
        .all()
    )

    if not habilidades:
        return JSONResponse(content={"habilidades": []})
    
    habilidad_data = [
        {
            "id": hab.id,
            "nombre": hab.nombre,
            "descripcion": hab.descripcion,
        } for hab in habilidades
    ]

    return JSONResponse(content={"habilidades": habilidad_data})

@router.post("/{leccion_id}/completar")
async def complete_lesson(leccion_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user_id = current_user.id

    progreso = db.query(ProgresoUsuario).filter_by(id_usuario=user_id, id_leccion=leccion_id).first()
    if progreso:
        if progreso.completado:
            return JSONResponse(content={"message": "Lesson already completed"}, status_code=200)
        progreso.completado = True
        progreso.fecha_completado = datetime.now()
    else:
        progreso = ProgresoUsuario(
            id_usuario=user_id,
            id_leccion=leccion_id,
            completado=True,
            fecha_completado=datetime.now()
        )
        db.add(progreso)
    db.commit()

    leccion_actual = db.query(Leccion).filter(Leccion.id == leccion_id).first()

    if leccion_actual and leccion_actual.orden == 1:
        id_insignia = 54
        assign_insignia(user_id, id_insignia, db)

    # Caso 1: Si la lección actual es la última lección del nivel, debemos pasar a la primera lección del siguiente nivel
    siguiente_leccion = (
        db.query(Leccion)
        .filter(Leccion.orden > leccion_actual.orden) 
        .filter(Leccion.id_nivel == leccion_actual.id_nivel)
        .order_by(Leccion.orden.asc())
        .first()
    )

    # Si no se encuentra la siguiente lección en el mismo nivel, buscar la primera del siguiente nivel
    if not siguiente_leccion:
        siguiente_leccion = (
            db.query(Leccion)
            .filter(Leccion.id_nivel > leccion_actual.id_nivel)
            .order_by(Leccion.orden.asc())
            .first()
        )

    if siguiente_leccion:
        progreso_siguiente = db.query(ProgresoUsuario).filter_by(
            id_usuario=user_id, id_leccion=siguiente_leccion.id
        ).first()

        # Si no existe el progreso para la siguiente lección, lo creamos con completado=False
        if not progreso_siguiente:
            nuevo_progreso = ProgresoUsuario(
                id_usuario=user_id,
                id_leccion=siguiente_leccion.id,
                completado=False
            )
            db.add(nuevo_progreso)
        else:
            # Si ya existe el progreso pero no está completado, lo marcamos como no completado
            if not progreso_siguiente.completado:
                progreso_siguiente.completado = False
        db.commit()

    return JSONResponse(content={"message": "Lesson completed successfully"}, status_code=200)
