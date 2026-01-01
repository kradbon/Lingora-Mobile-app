from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from .config import settings
from .database import Base, SessionLocal, engine
from .models import User
from .routers import admin, auth, health, study
from .security import get_password_hash

app = FastAPI(title="Lingora API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

    if settings.seed_demo_user:
        db = SessionLocal()
        try:
            existing = db.query(User).filter(User.email == settings.demo_email).first()
            if not existing:
                user = User(
                    name=settings.demo_name,
                    email=settings.demo_email,
                    hashed_password=get_password_hash(settings.demo_password),
                    is_active=True,
                )
                db.add(user)
                db.commit()
            else:
                existing.name = settings.demo_name
                existing.hashed_password = get_password_hash(settings.demo_password)
                existing.is_active = True
                db.commit()
        finally:
            db.close()


app.include_router(health.router)
app.include_router(auth.router)
app.include_router(study.router)
app.include_router(admin.router)


@app.get("/admin", include_in_schema=False)
def admin_redirect():
    return RedirectResponse(url="/admin/", status_code=307)


@app.get("/")
def read_root():
    return {"service": settings.app_name}
