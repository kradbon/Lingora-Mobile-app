# Backend Report (FastAPI)

## Scope and context
- Project root: backend/
- Entry module: backend/app/main.py
- Runtime: Python 3.11
- API framework: FastAPI 0.115.0
- Database: PostgreSQL via SQLAlchemy 2.0
- Admin UI: server-rendered HTML via Jinja2
- Note: The mobile app can run fully offline; the API is optional in offline builds.

## Dependencies (requirements.txt)
- fastapi==0.115.0
- uvicorn[standard]==0.30.1
- SQLAlchemy==2.0.29
- psycopg2-binary==2.9.9
- pydantic-settings==2.6.1
- passlib==1.7.4
- python-jose[cryptography]==3.3.0
- python-multipart==0.0.9
- email-validator==2.2.0
- Jinja2==3.1.4

## Configuration (backend/app/config.py)
- app_name default: lingora-api
- database_url default: postgresql+psycopg2://postgres:postgres@localhost:5432/lingora
- secret_key default: change-me
- access_token_exp_minutes default: 10080
- allowed_origins default: *
- environment default: local
- seed_demo_user default: false
- demo_name default: Demo User
- demo_email default: demo@example.com
- demo_password default: demo1234
- admin_enabled default: true
- admin_name default: Lingora Admin
- admin_email default: admin@example.com
- admin_password default: admin1234
- admin_token_exp_minutes default: 1440
- allowed_origins_list splits ALLOWED_ORIGINS by commas

## App startup and lifecycle
- FastAPI app configured with title "Lingora API"
- CORS middleware allows configured origins and all methods/headers
- on_startup creates DB tables via Base.metadata.create_all
- on_startup optionally seeds the demo user
- Seeded demo user name/email/password pulled from settings
- Seeded demo user updates name and password if user exists
- Root endpoint GET / returns { service: app_name }
- GET /admin redirects to /admin/ with status 307

## Database integration
- Engine created in backend/app/database.py
- SessionLocal uses autocommit=False and autoflush=False
- get_db yields a session and closes it after request
- Base is SQLAlchemy declarative_base

## Auth and security
- Password hashing uses passlib pbkdf2_sha256
- verify_password handles UnknownHashError and ValueError
- JWT algorithm: HS256
- User token payload includes sub, email, exp
- Admin token payload includes admin=true, email, name, exp
- Tokens are created in backend/app/security.py
- decode_access_token uses the shared secret_key
- HTTPBearer is used with auto_error=False
- get_current_user checks token, user id, and email
- Inactive users are treated as unauthorized

## Pydantic schemas (backend/app/schemas.py)
- UserBase: name, email
- UserCreate: name, email, password
- UserLogin: email, password
- UserPublic: id, name, email
- TokenResponse: token, user
- PingResponse: ok, service
- UnitSummary: id, title
- UnitLearn: text, code?, details[], summary[]
- UnitQuizPublic: question, choices[]
- UnitDetail: id, title, learn, quiz
- UnitProgressOut: unit_id, attempts, correct_answers, completed
- UnitAnswerRequest: answer (int)
- UnitAnswerResponse: correct, progress
- CurriculumUnit: id, title, description?, lessons[]
- Curriculum: units[]

## Router overview
- health router in backend/app/routers/health.py
- auth router in backend/app/routers/auth.py
- study router in backend/app/routers/study.py
- admin router in backend/app/routers/admin.py
- Routers are included in main.py with tags
- admin router is excluded from OpenAPI schema

## Health endpoint
- GET /ping returns { ok: true, service: "lingora-api" }
- Response schema: PingResponse

## Auth endpoints
- POST /auth/register
- Request: { name, email, password }
- Response: { token, user }
- Error 400 if email already registered
- POST /auth/login-mobile
- Request: { email, password }
- Response: { token, user }
- Error 401 on invalid credentials
- POST /auth/login (same as login-mobile)
- GET /auth/me
- Header: Authorization: Bearer <token>
- Response: { id, name, email }
- Error 401 for missing or invalid token
- POST /auth/logout
- Behavior: deletes cookie lingora_token
- Note: JWT tokens are not revoked (stateless)

## Study endpoints
- GET /api/units
- Response: list of { id, title }
- GET /api/curriculum
- Response: { units: [ { id, title, description?, lessons[] } ] }
- GET /api/units/{unit_id}
- Response: { id, title, learn, quiz }
- learn.text and learn.code from units.json
- learn.details and learn.summary merged from detail files
- quiz includes question and choices only (answer hidden)
- POST /api/units/{unit_id}/answer
- Request: { answer: int }
- Response: { correct: bool, progress: UnitProgressOut }
- GET /api/progress
- Response: list of UnitProgressOut for current user

## Study content pipeline
- units.json loaded at import time
- units_by_id map is built from units.json
- unit_details.json provides details and summary
- unit_details_extra.json provides extra details/summary
- unit_details_new.json provides newer details/summary
- /api/units/{id} merges detail arrays in order: base, extra, new
- curriculum.json groups lessons into 9 units
- curriculum is filtered to only include valid units/lessons
- Lesson titles are derived from units.json

## Progress tracking logic
- UnitProgress row is created on first answer
- attempts increments on every submission
- correct_answers increments only if correct
- completed is set true on a correct answer
- Progress is always committed after update
- Progress list is filtered by current user id

## Admin panel behavior
- Admin router prefix: /admin
- Admin login page: GET /admin/login
- Admin login submit: POST /admin/login
- Admin logout: GET /admin/logout
- Admin index: GET /admin/
- Admin create user: POST /admin/users
- Admin set password: POST /admin/users/{id}/password
- Admin delete user: POST /admin/users/{id}/delete
- Admin export CSV: GET /admin/export/users.csv
- Admin access requires ADMIN_ENABLED true
- Admin cookie name: lingora_admin_token
- Cookie attributes: httponly, samesite=lax, secure=false
- Cookie max_age uses ADMIN_TOKEN_EXPIRE_MINUTES
- Admin token uses create_admin_token with admin=true
- Token validation uses decode_access_token and admin flag

## Admin templates
- admin_login.html includes email + password form
- admin_login.html renders error message on failure
- admin_index.html shows current admin name/email
- admin_index.html lists users with actions
- admin_index.html includes create user form
- admin_index.html includes reset password form
- admin_index.html includes delete user form
- admin_index.html includes CSV export link

## Data access patterns
- Register: select user by email, insert user
- Login: select user by email, verify password
- Me: select user by id + email
- Units: no DB access (JSON only)
- Unit detail: no DB access (JSON only)
- Submit answer: select or insert UnitProgress
- Progress list: select UnitProgress by user_id
- Admin list users: select all users ordered by id
- Admin create: insert user
- Admin set password: update user hashed_password
- Admin delete: delete unit_progress rows, then delete user
- Admin export: select all users ordered by id

## Deployment and operations
- Local run: uvicorn backend.app.main:app --reload --env-file backend/.env
- Dockerfile base: python:3.11-slim
- Dockerfile installs build-essential and libpq-dev
- Dockerfile copies requirements.txt and installs pip deps
- Dockerfile copies app/ into /app/app
- Dockerfile command: uvicorn app.main:app --host 0.0.0.0 --port 8000
- docker-compose defines db service (postgres:16)
- docker-compose defines api service (build ./backend)
- docker-compose DATABASE_URL points to db:5432
- docker-compose exposes ports 5432 and 8000
- docker-compose uses volume pgdata for persistence

## Known issues and risks
- Tables are created on startup with no migrations
- JSON content loaded at import time requires restart to change
- Logout does not invalidate JWT tokens
- No rate limiting or account lockout for auth endpoints
- Admin cookie uses secure=false (HTTP only)

## Key files
- backend/app/main.py
- backend/app/config.py
- backend/app/database.py
- backend/app/models.py
- backend/app/security.py
- backend/app/dependencies.py
- backend/app/schemas.py
- backend/app/routers/auth.py
- backend/app/routers/study.py
- backend/app/routers/admin.py
- backend/app/routers/health.py
- backend/app/templates/admin_login.html
- backend/app/templates/admin_index.html
- backend/app/data/units.json
- backend/app/data/unit_details.json
- backend/app/data/unit_details_extra.json
- backend/app/data/unit_details_new.json
- backend/app/data/curriculum.json
- backend/requirements.txt
- backend/Dockerfile
- docker-compose.yml

## Content inventory (units.json)
- u01-intro: Intro to PHP
- u02-syntax: Syntax & Variables
- u03-strings: Strings
- u04-arrays: Arrays
- u05-control: Control Flow
- u06-loops: Loops
- u07-funcs: Functions
- u08-scope: Scope & Globals
- u09-include: Include/Require
- u10-forms: Forms & Input
- u11-sessions: Sessions
- u12-cookies: Cookies
- u13-oop: OOP Basics
- u14-construct: Constructors
- u15-inherit: Inheritance
- u16-interface: Interfaces
- u17-traits: Traits
- u18-namespaces: Namespaces
- u19-composer: Composer
- u20-autoload: Autoloading
- u21-exceptions: Exceptions
- u22-files: File I/O
- u23-datetime: Date & Time
- u24-json: JSON
- u25-http: HTTP Basics
- u26-pdo: PDO
- u27-mysqli: MySQLi
- u28-curl: HTTP Client (cURL)
- u29-regex: Regex
- u30-security: Security Basics
- u31-uploads: File Uploads
- u32-mail: Email
- u33-testing: Testing
- u34-frameworks: Frameworks
- u35-apis: REST APIs
- u36-operators: Operators & Comparisons
- u37-constants: Constants
- u38-types: Types & strict_types
- u39-nullability: Null, ??, and ?->
- u40-arrays-advanced: Advanced Array Functions
- u41-closures: Closures & Arrow Functions
- u42-generators: Generators (yield)
- u43-error-logging: Error Reporting & Logging
- u44-phpdoc: PHPDoc & Static Analysis
- u45-psr-style: PSR-12 & Formatting
- u46-config-env: Config & Environment
- u47-routing: Routing (Front Controller)
- u48-templating: Templates & Output Escaping
- u49-validation: Validation with filter_var
- u50-auth-sessions: Login with Sessions
- u51-jwt: JWT Auth (APIs)
- u52-cors: CORS Basics
- u53-pdo-crud: PDO CRUD Patterns
- u54-transactions: Transactions
- u55-testing-advanced: PHPUnit Assertions
- u56-mocking-di: Dependency Injection & Mocking
- u57-caching: Caching & Performance
- u58-deployment: Deployment Basics
- u59-laravel-basics: Laravel Basics
- u60-laravel-routing: Laravel Routing
- u61-laravel-eloquent: Laravel Eloquent ORM
- u62-laravel-validation: Laravel Validation
- u63-laravel-auth: Laravel Auth & Middleware
