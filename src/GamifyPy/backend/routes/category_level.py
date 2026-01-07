from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from backend.database import get_db, Categoria, Nivel, Leccion, Usuario, ProgresoUsuario
from sqlalchemy.orm import Session
from backend.controllers.auth import get_current_user

router = APIRouter()

@router.get("/categorias")
async def get_categories(db: Session = Depends(get_db)):
    categorias = db.query(Categoria).order_by(Categoria.id).all()
    categoria_data = [
        {
            "id": categoria.id,
            "nombre": categoria.nombre,
            "descripcion": categoria.descripcion,
        } for categoria in categorias
    ]

    return JSONResponse(content={"categorias": categoria_data})

@router.get("/categorias/{categoria_id}/niveles")
async def get_levels_by_category(categoria_id: int, db: Session = Depends(get_db)):
    niveles = (
        db.query(Nivel)
        .filter(Nivel.id_categoria == categoria_id)
        .order_by(Nivel.orden)
        .all()
    )

    if not niveles:
        raise HTTPException(status_code=404, detail="No levels found for this category")
    
    nivel_data = [
        {
            "id": nivel.id,
            "nombre": nivel.nombre,
            "descripcion": nivel.descripcion,
            "orden": nivel.orden,
        } for nivel in niveles
    ]

    return JSONResponse(content={"niveles": nivel_data})

@router.get("/niveles")
def get_all_levels(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    niveles = db.query(Nivel).order_by(Nivel.orden).all()

    ultimo_progreso = (
        db.query(ProgresoUsuario, Leccion, Nivel)
        .join(Leccion, ProgresoUsuario.id_leccion == Leccion.id)
        .join(Nivel, Leccion.id_nivel == Nivel.id)
        .filter(ProgresoUsuario.id_usuario == current_user.id)
        .order_by(Nivel.orden.desc(), Leccion.orden.desc())
        .first()
    )

    if not ultimo_progreso:
        return JSONResponse(content=[
            {
                "id": nivel.id,
                "nombre": nivel.nombre,
                "descripcion": nivel.descripcion,
                "orden": nivel.orden,
                "id_categoria": nivel.id_categoria,
                "completado": False,
                "bloqueado": True if i > 0 else False
            }
            for i, nivel in enumerate(niveles)
        ])

    nivel_actual_id = ultimo_progreso.Nivel.id

    niveles_data = []
    encontrado_actual = False
    for nivel in niveles:
        if nivel.id == nivel_actual_id:
            niveles_data.append({
                "id": nivel.id,
                "nombre": nivel.nombre,
                "descripcion": nivel.descripcion,
                "orden": nivel.orden,
                "id_categoria": nivel.id_categoria,
                "completado": False,
                "bloqueado": False
            })
            encontrado_actual = True
        elif not encontrado_actual:
            niveles_data.append({
                "id": nivel.id,
                "nombre": nivel.nombre,
                "descripcion": nivel.descripcion,
                "orden": nivel.orden,
                "id_categoria": nivel.id_categoria,
                "completado": True,
                "bloqueado": False
            })
        else:
            niveles_data.append({
                "id": nivel.id,
                "nombre": nivel.nombre,
                "descripcion": nivel.descripcion,
                "orden": nivel.orden,
                "id_categoria": nivel.id_categoria,
                "completado": False,
                "bloqueado": True
            })

    return JSONResponse(content=niveles_data)

@router.get("/niveles/{nivel_id}")
def get_level(nivel_id: int, db: Session = Depends(get_db)):
    nivel = db.query(Nivel).filter(Nivel.id == nivel_id).first()
    if not nivel:
        raise HTTPException(status_code=404, detail="Level not found")
    
    nivel_data = {
        "id": nivel.id,
        "nombre": nivel.nombre,
        "descripcion": nivel.descripcion,
        "orden": nivel.orden,
        "id_categoria": nivel.id_categoria,
    }

    return JSONResponse(content=nivel_data)

@router.get("/{nivel_id}/lecciones")
def get_lessons_by_level(nivel_id: int, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    lecciones = (
        db.query(Leccion)
        .filter(Leccion.id_nivel == nivel_id)
        .order_by(Leccion.orden)
        .all()
    )

    if not lecciones:
        raise HTTPException(status_code=404, detail="No lessons found for this level")

    progreso_usuario = (
        db.query(ProgresoUsuario.id_leccion)
        .join(Leccion, ProgresoUsuario.id_leccion == Leccion.id)
        .filter(
            ProgresoUsuario.id_usuario == current_user.id,
            Leccion.id_nivel == nivel_id,
            ProgresoUsuario.completado == True
        )
        .all()
    )

    lecciones_completadas_ids = {p.id_leccion for p in progreso_usuario}
    lecciones_data = []
    bloqueadas = False
    for i, leccion in enumerate(lecciones):
        completada = leccion.id in lecciones_completadas_ids
        bloqueada = False

        if i > 0:
            anterior_completada = lecciones[i - 1].id in lecciones_completadas_ids
            bloqueada = not anterior_completada

        lecciones_data.append({
            "id": leccion.id,
            "titulo": leccion.titulo,
            "orden": leccion.orden,
            "completada": completada,
            "bloqueada": bloqueada
        })

    return JSONResponse(content={"lecciones": lecciones_data})
