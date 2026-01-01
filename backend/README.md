# Lingora Backend (FastAPI)

## Prerequisites
- Python 3.11+
- PostgreSQL (local instance or container)

## Local setup
1. Create a virtual environment:
   - Windows: `python -m venv .venv && .\.venv\Scripts\activate`
   - macOS/Linux: `python3 -m venv .venv && source .venv/bin/activate`
2. Install requirements: `pip install -r requirements.txt`.
3. Create a `.env` file from the `.env.example` and fill in the required environment variables.
4. Make sure you have a running PostgreSQL instance. You can use Docker to start one: `docker run --name lingora-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=lingora -p 5432:5432 -d postgres:16`.

## Run the API locally
- `uvicorn app.main:app --reload`
- The app will load the environment variables from the `.env` file automatically.
- Tables are created automatically on startup via SQLAlchemy metadata.

## Run with Docker Compose
1. Create a `.env` file from the `.env.example` and fill in the required environment variables.
2. Run `docker-compose up --build -d`.
   - API: http://localhost:8000
   - Postgres: localhost:5432 (volume `pgdata` persists data)
3. Stop: `docker-compose down` (add `-v` to also remove the volume).

## Endpoints used by the mobile app
- `GET /ping` -> `{ "ok": true, "service": "lingora-api" }`
- `POST /auth/register` body `{ name, email, password }` -> `{ token, user }`
- `POST /auth/login` body `{ email, password }` -> `{ token, user }`
- `POST /auth/login-mobile` body `{ email, password }` -> `{ token, user }`
- `GET /auth/me` (Bearer token) -> `{ name, email, ... }`
- `POST /auth/logout` -> `{ detail: "Logged out" }`
- `GET /api/curriculum` (Bearer token) -> curriculum units + lessons
- `GET /api/units` (Bearer token) -> list of units
- `GET /api/units/{unit_id}` (Bearer token) -> lesson + quiz payload
- `POST /api/units/{unit_id}/answer` (Bearer token) -> `{ correct, progress }`
- `GET /api/progress` (Bearer token) -> per-unit progress

## Admin panel (web only)
- `GET /admin/login` + `POST /admin/login`
- `GET /admin/` (protected)
- `GET /admin/logout`
- Configure credentials via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`.

Demo credentials (optional)
- Enable by setting `SEED_DEMO_USER=true` in `backend/.env` (see `backend/.env.example`).
- Default credentials:
  - Email: `demo@example.com`
  - Password: `demo1234`

## Study/interactive API
- `GET /api/units` (protected) -> list units
- `GET /api/units/{unit_id}` (protected) -> lesson + quiz (no answer leaked)
- `POST /api/units/{unit_id}/answer` (protected) body `{ answer }` -> `{ correct, progress }`
- `GET /api/progress` (protected) -> per-unit progress for current user

## Frontend integration
- Set `EXPO_PUBLIC_API_BASE` to your API URL before starting Expo (recommended for physical devices and production builds).
- If unset in dev, the Expo app tries to auto-detect the packager host and uses `http://<host>:8000`.
- CORS origins are controlled via `ALLOWED_ORIGINS` in `.env` (comma-separated). Use `*` for local dev.
