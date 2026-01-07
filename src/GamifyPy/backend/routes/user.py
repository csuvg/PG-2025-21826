from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from backend.database import get_db, Usuario, Insignia, InsigniaUsuario, Habilidad, LeccionHabilidad, ProgresoUsuario, Leccion, Nivel, Categoria
from sqlalchemy.orm import Session
from backend.controllers.auth import get_current_user

router = APIRouter()

@router.get("/me")
async def get_me(current_user: Usuario = Depends(get_current_user)):
    """ Endpoint para obtener los datos del usuario autenticado. """
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_data = {
        "id": current_user.id,
        "nombre": current_user.nombre,
        "email": current_user.email,
        "puntos": current_user.puntos,
        "fecha_registro": current_user.fecha_registro.isoformat(),
    }

    return JSONResponse(content=user_data)

@router.get("/insignias")
async def get_user_insignias(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """ Endpoint para obtener las insignias de un usuario. """
    user_id = current_user.id

    insignias = (
        db.query(InsigniaUsuario)
        .filter(InsigniaUsuario.id_usuario == user_id)
        .join(Insignia)
        .all()
    )

    if not insignias:
        return JSONResponse(content={"insignias": []})
    
    insignia_data = [
        {
            "nombre": insig.insignia.nombre,
            "descripcion": insig.insignia.descripcion,
            "icono": insig.insignia.icono,
            "fecha_logro": insig.fecha_logro.isoformat() if insig.fecha_logro else None,
        } for insig in insignias
    ]

    return JSONResponse(content={"insignias": insignia_data})

@router.get("/habilidades")
def get_user_habilidades(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """ Endpoint para obtener TODAS las habilidades y marcar cuáles están desbloqueadas por el usuario. """
    user_id = current_user.id
    todas_habilidades = db.query(Habilidad).all()

    habilidades_usuario = (
        db.query(Habilidad.id)
        .join(LeccionHabilidad, Habilidad.id == LeccionHabilidad.id_habilidades)
        .join(ProgresoUsuario, LeccionHabilidad.id_leccion == ProgresoUsuario.id_leccion)
        .filter(ProgresoUsuario.id_usuario == user_id, ProgresoUsuario.completado == True)
        .distinct()
        .all()
    )
    ids_desbloqueadas = {h[0] for h in habilidades_usuario}

    habilidad_data = [
        {
            "id": hab.id,
            "nombre": hab.nombre,
            "descripcion": hab.descripcion,
            "isUnlocked": hab.id in ids_desbloqueadas
        }
        for hab in todas_habilidades
    ]

    return JSONResponse(content={"habilidades": habilidad_data})

@router.get("/progreso")
async def get_user_progreso(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """ Endpoint para obtener el progreso de un usuario en las lecciones. """
    if not current_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user_id = current_user.id 

    progreso = (
        db.query(ProgresoUsuario, Leccion, Nivel, Categoria)
        .join(Leccion, ProgresoUsuario.id_leccion == Leccion.id)
        .join(Nivel, Leccion.id_nivel == Nivel.id)
        .join(Categoria, Nivel.id_categoria == Categoria.id)
        .filter(ProgresoUsuario.id_usuario == user_id)
        .order_by(Nivel.orden.desc(), Leccion.orden.desc())
        .first()
    )

    if not progreso:
        return JSONResponse(content={"progreso": []})
    
    progreso_data = {
        "Categoria": progreso.Categoria.nombre,
        "Nivel": progreso.Nivel.nombre,
        "Leccion": progreso.Leccion.titulo,
        "Puntos": current_user.puntos,
        "Completado": progreso.ProgresoUsuario.completado,
        "Fecha Completado": progreso.ProgresoUsuario.fecha_completado.isoformat() if progreso.ProgresoUsuario.fecha_completado else None
    }

    return JSONResponse(content=progreso_data)
