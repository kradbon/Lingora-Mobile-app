from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from fastapi import APIRouter, Cookie, Depends, Form, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse, Response
from fastapi.templating import Jinja2Templates
from jose import JWTError
from sqlalchemy.orm import Session

from .. import models
from ..config import settings
from ..database import get_db
from ..security import create_admin_token, decode_access_token, get_password_hash

router = APIRouter(prefix="/admin", tags=["admin"], include_in_schema=False)

templates_dir = Path(__file__).resolve().parent.parent / "templates"
templates = Jinja2Templates(directory=str(templates_dir))


@dataclass(frozen=True)
class AdminIdentity:
    name: str
    email: str


def _admin_login_redirect(token: str) -> RedirectResponse:
    response = RedirectResponse(url="/admin/", status_code=303)
    response.set_cookie(
        key="lingora_admin_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=settings.admin_token_exp_minutes * 60,
        path="/",
    )
    return response


def get_current_admin(
    token_cookie: str | None = Cookie(default=None, alias="lingora_admin_token"),
) -> AdminIdentity:
    if not settings.admin_enabled:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    if not token_cookie:
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            detail="Not authenticated",
            headers={"Location": "/admin/login"},
        )

    try:
        payload = decode_access_token(token_cookie)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            detail="Invalid or expired token",
            headers={"Location": "/admin/login"},
        )

    if payload.get("admin") is not True:
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            detail="Not authenticated",
            headers={"Location": "/admin/login"},
        )

    email = payload.get("email")
    name = payload.get("name") or settings.admin_name
    if not email or email != settings.admin_email:
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            detail="Not authenticated",
            headers={"Location": "/admin/login"},
        )

    return AdminIdentity(name=str(name), email=str(email))


def get_optional_admin(
    token_cookie: str | None = Cookie(default=None, alias="lingora_admin_token"),
) -> AdminIdentity | None:
    if not token_cookie or not settings.admin_enabled:
        return None
    try:
        payload = decode_access_token(token_cookie)
    except JWTError:
        return None
    if payload.get("admin") is not True:
        return None
    email = payload.get("email")
    name = payload.get("name") or settings.admin_name
    if not email or email != settings.admin_email:
        return None
    return AdminIdentity(name=str(name), email=str(email))


@router.get("/login", response_class=HTMLResponse)
def admin_login_page(request: Request, admin: AdminIdentity | None = Depends(get_optional_admin)):
    if not settings.admin_enabled:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    if admin:
        return RedirectResponse(url="/admin/", status_code=303)
    return templates.TemplateResponse(
        "admin_login.html",
        {"request": request, "error": None, "email": settings.admin_email},
    )


@router.post("/login", response_class=HTMLResponse)
def admin_login_submit(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
):
    if not settings.admin_enabled:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    if email != settings.admin_email or password != settings.admin_password:
        return templates.TemplateResponse(
            "admin_login.html",
            {"request": request, "error": "Invalid admin credentials", "email": email},
            status_code=400,
        )

    token = create_admin_token(email=settings.admin_email, name=settings.admin_name)
    return _admin_login_redirect(token)


@router.get("/logout")
def admin_logout():
    response = RedirectResponse(url="/admin/login", status_code=303)
    response.delete_cookie("lingora_admin_token", path="/")
    return response


@router.get("/", response_class=HTMLResponse)
def admin_index(
    request: Request,
    admin: AdminIdentity = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    users = db.query(models.User).order_by(models.User.id.asc()).all()
    users_view = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "roles": "user",
            "created_at": u.created_at,
        }
        for u in users
    ]
    return templates.TemplateResponse(
        "admin_index.html",
        {"request": request, "user": {"name": admin.name, "email": admin.email}, "users": users_view},
    )


@router.post("/users")
def admin_create_user(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    admin: AdminIdentity = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    _ = admin
    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        return RedirectResponse(url="/admin/?error=email-exists", status_code=303)

    user = models.User(name=name, email=email, hashed_password=get_password_hash(password))
    db.add(user)
    db.commit()
    return RedirectResponse(url="/admin/", status_code=303)


@router.post("/users/{user_id}/password")
def admin_set_password(
    user_id: int,
    password: str = Form(...),
    admin: AdminIdentity = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    _ = admin
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return RedirectResponse(url="/admin/?error=user-not-found", status_code=303)

    user.hashed_password = get_password_hash(password)
    db.commit()
    return RedirectResponse(url="/admin/", status_code=303)


@router.post("/users/{user_id}/delete")
def admin_delete_user(
    user_id: int,
    admin: AdminIdentity = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    _ = admin
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return RedirectResponse(url="/admin/?error=user-not-found", status_code=303)

    db.query(models.UnitProgress).filter(models.UnitProgress.user_id == user_id).delete(
        synchronize_session=False
    )
    db.delete(user)
    db.commit()
    return RedirectResponse(url="/admin/", status_code=303)


@router.get("/export/users.csv")
def admin_export_users_csv(
    admin: AdminIdentity = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    import csv
    import io

    _ = admin
    users = db.query(models.User).order_by(models.User.id.asc()).all()

    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["id", "name", "email", "is_active", "created_at"])
    for u in users:
        w.writerow([u.id, u.name, u.email, u.is_active, u.created_at.isoformat() if u.created_at else ""])

    return Response(
        content=buf.getvalue(),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": "attachment; filename=users.csv"},
    )
