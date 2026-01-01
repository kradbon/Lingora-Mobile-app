from datetime import datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.exc import UnknownHashError

from .config import settings

ALGORITHM = "HS256"
# NOTE: bcrypt backend is failing in some environments due to the 72-byte limit behavior.
# pbkdf2_sha256 is a pure-passlib implementation and avoids that runtime failure.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except (UnknownHashError, ValueError):
        return False


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str | int, email: str, expires_minutes: int | None = None) -> str:
    minutes = expires_minutes or settings.access_token_exp_minutes
    expire = datetime.utcnow() + timedelta(minutes=minutes)
    to_encode: dict[str, Any] = {"sub": str(subject), "email": email, "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)


def create_admin_token(email: str, name: str, expires_minutes: int | None = None) -> str:
    minutes = expires_minutes or settings.admin_token_exp_minutes
    expire = datetime.utcnow() + timedelta(minutes=minutes)
    to_encode: dict[str, Any] = {"admin": True, "email": email, "name": name, "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
