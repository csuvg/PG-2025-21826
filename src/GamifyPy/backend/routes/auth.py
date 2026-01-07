from fastapi import APIRouter, Depends, HTTPException, Cookie, Body, Request
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import EmailStr
from datetime import timedelta
from backend.database import get_db, Usuario, ProgresoUsuario
from sqlalchemy.orm import Session
from backend.controllers.auth import ( create_access_token, create_refresh_token, verify_password, hash_password, 
                                      send_verification_email, create_reset_token, send_password_reset_email, 
                                      SECRET_KEY, ALGORITHM )
from backend.controllers.user_insignias import assign_insignia
from backend.models.auth import LoginRequest, RegisterRequest, EmailRequest, ResetPasswordRequest
from google.oauth2 import id_token
from google.auth.transport import requests
from urllib.parse import urlencode
from jose import JWTError
from random import randint
import jwt, os, httpx, traceback

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
verification_codes = {}
reset_token = {}

@router.post("/login")
async def login(login_request: LoginRequest, db=Depends(get_db)):
    """ Endpoint para iniciar sesión con usuario y contraseña. """
    user = db.query(Usuario).filter(Usuario.email == login_request.email).first()

    if not user or not user.password or not verify_password(user.password, login_request.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=15))
    refresh_token = create_refresh_token(data={"sub": user.email}, expires_delta=timedelta(days=7))

    response = JSONResponse(content={
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "nombre": user.nombre,
            "email": user.email,
            "id": user.id,
        }
    })

    return response

@router.post("/register")
async def register(register_request: RegisterRequest, db=Depends(get_db)):
    """ Endpoint para registrar un nuevo usuario. """
    email = register_request.email

    if email in verification_codes:
        raise HTTPException(status_code=400, detail="Verifica tu PIN antes de registrarte.")

    existing_user = db.query(Usuario).filter(Usuario.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = Usuario(
        nombre=register_request.username,
        email=email,
        password=hash_password(register_request.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    progreso_existente = db.query(ProgresoUsuario).filter_by(
        id_usuario=new_user.id,
        id_leccion=1
    ).first()

    if not progreso_existente:
        primer_progreso = ProgresoUsuario(
            id_usuario=new_user.id,
            id_leccion=1,
            completado=False
        )
        db.add(primer_progreso)
        db.commit()

    id_insignia = 53
    assign_insignia(new_user.id, id_insignia, db)

    return {
        "message": "Usuario registrado correctamente",
        "email": email,
    }

@router.post("/send-pin")
async def send_pin(request: EmailRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == request.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Este correo ya está registrado.")

    pin = str(randint(100000, 999999))
    verification_codes[request.email] = pin

    await send_verification_email(request.email, pin)

    return {"message": "PIN enviado al correo correctamente."}

@router.post("/verify-pin")
async def verify_pin(email: EmailStr = Body(...), pin: str = Body(...)):
    expected_pin = verification_codes.get(email)
    if not expected_pin:
        raise HTTPException(status_code=400, detail="No se encontró PIN para este correo.")
    if pin != expected_pin:
        raise HTTPException(status_code=400, detail="PIN incorrecto")

    del verification_codes[email]  # eliminar después de verificar

    return {"message": "Correo verificado exitosamente ✅"}

@router.get("/login/google")
async def login_google(request: Request):
    redirect_uri = str(request.url_for("auth_callback")).replace("http://", "https://")
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope=openid%20email%20profile"
    )
    return RedirectResponse(url=google_auth_url)

@router.get("/callback")
async def auth_callback(code: str, request: Request, db: Session = Depends(get_db)):
    try:
        token_request_uri = "https://oauth2.googleapis.com/token"
        redirect_uri = str(request.url_for("auth_callback")).replace("http://", "https://")
        data = {
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(token_request_uri, data=data)
            response.raise_for_status()
            token_response = response.json()

        id_token_value = token_response.get('id_token')
        if not id_token_value:
            raise HTTPException(status_code=400, detail="No se recibió id_token")

        id_info = id_token.verify_oauth2_token(id_token_value, requests.Request(), GOOGLE_CLIENT_ID)

        email = id_info.get('email')
        name = id_info.get('name')

        user = db.query(Usuario).filter(Usuario.email == email).first()

        if not user:
            user = Usuario(
                email=email,
                nombre=name,
                password=None
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            primer_progreso = ProgresoUsuario(
                id_usuario=user.id,
                id_leccion=1,
                completado=False
            )
            db.add(primer_progreso)
            db.commit()

            id_insignia = 53
            assign_insignia(user.id, id_insignia, db)

        access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=15))
        refresh_token = create_refresh_token(data={"sub": user.email}, expires_delta=timedelta(days=7))

        frontend_callback_url = os.getenv("FRONTEND_CALLBACK", "https://gamifypy.online/auth/callback")

        query_data = {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "name": user.nombre,
            "email": user.email,
        }

        redirect_url = f"{frontend_callback_url}?{urlencode(query_data)}"
        redirect_response = RedirectResponse(url=redirect_url)
        return redirect_response

    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error en login con Google")

@router.post("/forgot-password")
async def forgot_password(request: EmailRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Correo no encontrado.")
    
    token = create_reset_token(user.email)
    reset_token[user.email] = token

    await send_password_reset_email(user.email, token)
    return {"message": "Enlace de recuperación enviado al correo."}

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")
    
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    user.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Contraseña actualizada correctamente."}

@router.post("/refresh")
async def refresh_token(body: dict, db: Session = Depends(get_db)):
    """ Refresca el token de acceso usando un refresh token JWT """
    refresh_token = body.get("refresh_token")
    print(f"Refresh token received: {refresh_token}")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(Usuario).filter(Usuario.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        new_access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=15))
        return {"access_token": new_access_token, "token_type": "bearer"}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid refresh token. Error: {str(e)}")
