from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from sqlalchemy.orm import Session
from pydantic import EmailStr
from backend.database import get_db, Usuario
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import os

SECRET_KEY = "clave_secreta_super_segura"
ALGORITHM = "HS256"
ph = PasswordHasher()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

fastmail = FastMail(conf)

def hash_password(password: str) -> str:
    """ Hashea la contraseña con Argon2. """
    return ph.hash(password)

def verify_password(hashed_password: str, password: str) -> bool:
    """ Verifica una contraseña contra el hash. """
    try:
        ph.verify(hashed_password, password)
        return True
    except VerifyMismatchError:
        return False

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """ Crea un token JWT con los datos proporcionados y una fecha de expiración opcional. """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))

    print(f"This token will expire at: {expire}")

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """ Obtiene el usuario actual a partir del token JWT proporcionado. """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            print("No email found in JWT payload")
            raise credentials_exception
    except JWTError as e:
        print(f"JWTError: {e}")
        raise credentials_exception

    user = db.query(Usuario).filter(Usuario.email == email).first()

    if user is None:
        print(f"User with email {email} not found")
        raise credentials_exception

    return user

def create_refresh_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    """Crea un refresh token JWT con expiración más larga."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def send_verification_email(email: EmailStr, pin: str):
    message = MessageSchema(
        subject="Tu código de verificación",
        recipients=[email],
        body=f"Tu código de verificación es: {pin}",
        subtype="plain"
    )
    await fastmail.send_message(message)

def create_reset_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    data = {"sub": email, "exp": expire}
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

async def send_password_reset_email(email: EmailStr, token: str):
    reset_url = f"https://gamifypy.online/reset-password?token={token}"
    message = MessageSchema(
        subject="Recuperación de contraseña",
        recipients=[email],
        body=f"Para restablecer tu contraseña, haz clic en este enlace:\n{reset_url}\nEste enlace expirará en 15 minutos.",
        subtype="plain"
    )
    await fastmail.send_message(message)
