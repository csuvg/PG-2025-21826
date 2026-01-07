from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import JSONResponse
from backend.database import get_db, Pregunta, OpcionPregunta, Leccion, IntentoPregunta, Usuario
from sqlalchemy import desc
from sqlalchemy.orm import Session
from backend.controllers.auth import get_current_user
from backend.models.question import RespuestaRequest
from backend.controllers.evaluation import evaluate_multiple_choice, evaluate_code

router = APIRouter()

@router.get("/{nivel_id}/preguntas/opcion-multiple")
async def get_multiple_choice_questions(nivel_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """ Preguntas de opción múltiple con estado de intento del usuario """
    preguntas = (
        db.query(Pregunta)
        .join(Leccion, Pregunta.id_leccion == Leccion.id)
        .filter(
            Leccion.id_nivel == nivel_id,
            Pregunta.tipo == "opcion_multiple"
        )
        .all()
    )

    resultado = []
    for pregunta in preguntas:
        ultimo_intento = (
            db.query(IntentoPregunta)
            .filter(
                IntentoPregunta.id_usuario == current_user.id,
                IntentoPregunta.id_preguntas == pregunta.id
            )
            .order_by(desc(IntentoPregunta.fecha))
            .first()
        )

        opciones = (
            db.query(OpcionPregunta)
            .filter(OpcionPregunta.id_preguntas == pregunta.id)
            .all()
        )

        resultado.append({
            "id": pregunta.id,
            "pregunta": pregunta.pregunta,
            "codigo_inicial": pregunta.codigo_inicial,
            "respuesta": pregunta.respuesta,
            "tipo": pregunta.tipo,
            "puntos": pregunta.puntos,
            "opciones": [
                {
                    "texto": opcion.texto_opcion,
                    "valor": opcion.valor_opcion,
                } for opcion in opciones
            ],
            "intento_realizado": ultimo_intento is not None,
            "correcto": ultimo_intento.es_correcto if ultimo_intento else None,
            "respuesta_enviada": ultimo_intento.respuesta_enviada if ultimo_intento else None,
            "retroalimentacion": ultimo_intento.retroalimentacion if ultimo_intento else None
        })

    return JSONResponse(content={"preguntas": resultado})

@router.get("/{nivel_id}/preguntas/codigo")
async def get_code_questions(nivel_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """ Preguntas de código con estado de intento del usuario """
    preguntas = (
        db.query(Pregunta)
        .join(Leccion, Pregunta.id_leccion == Leccion.id)
        .filter(
            Leccion.id_nivel == nivel_id,
            Pregunta.tipo == "codigo"
        )
        .all()
    )

    resultado = []
    for pregunta in preguntas:
        ultimo_intento = (
            db.query(IntentoPregunta)
            .filter(
                IntentoPregunta.id_usuario == current_user.id,
                IntentoPregunta.id_preguntas == pregunta.id
            )
            .order_by(desc(IntentoPregunta.fecha))
            .first()
        )

        resultado.append({
            "id": pregunta.id,
            "pregunta": pregunta.pregunta,
            "codigo_inicial": pregunta.codigo_inicial,
            "respuesta": pregunta.respuesta,
            "tipo": pregunta.tipo,
            "puntos": pregunta.puntos,
            "intento_realizado": ultimo_intento is not None,
            "correcto": ultimo_intento.es_correcto if ultimo_intento else None
        })

    return JSONResponse(content={"preguntas": resultado})

@router.post("/{pregunta_id}/evaluar")
async def evaluate_question(
    pregunta_id: int,
    request: RespuestaRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """ Endpoint para evaluar una respuesta a una pregunta. """
    respuesta = request.respuesta
    pregunta = db.query(Pregunta).filter_by(id=pregunta_id).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    
    if pregunta.tipo == "opcion_multiple":
        es_correcto, retroalimentacion = await evaluate_multiple_choice(db, pregunta, respuesta)
    elif pregunta.tipo == "codigo":
        try:
            es_correcto, retroalimentacion = await evaluate_code(pregunta, respuesta)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error al evaluar el código: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail="Tipo de pregunta no soportado")
    
    intento = IntentoPregunta(
        id_usuario=current_user.id,
        id_preguntas=pregunta_id,
        respuesta_enviada=respuesta,
        es_correcto=es_correcto,
        retroalimentacion=retroalimentacion
    )
    db.add(intento)

    if es_correcto:
        puntos_actuales = current_user.puntos or 0
        puntos_ganados = pregunta.puntos or 0
        current_user.puntos = puntos_actuales + puntos_ganados

    db.commit()

    return {
        "es_correcto": es_correcto,
        "retroalimentacion": retroalimentacion,
        "puntos_ganados": puntos_ganados if es_correcto else 0,
        "puntos_totales": current_user.puntos
    }
