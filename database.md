# Database Report (PostgreSQL + SQLAlchemy)

## Scope and context
- Primary store: PostgreSQL
- ORM: SQLAlchemy 2.x
- Schema defined in backend/app/models.py
- Connection setup in backend/app/database.py
- Tables are created at API startup

## Connection configuration
- DATABASE_URL is loaded from backend/.env
- Default local URL: postgresql+psycopg2://postgres:postgres@localhost:5432/lingora
- Docker URL: postgresql+psycopg2://postgres:postgres@db:5432/lingora
- Engine uses pool_pre_ping=True
- SessionLocal uses autocommit=False
- SessionLocal uses autoflush=False
- get_db yields a session and closes it after use
- Base = declarative_base

## Schema overview
- users table stores authentication identity
- unit_progress table stores per-unit progress
- Content (units and curriculum) is stored in JSON files, not DB
- Offline mobile content is bundled in the frontend and does not touch the DB

## users table columns
- id: Integer, primary key, indexed
- name: String(100), required
- email: String(255), required, unique, indexed
- hashed_password: String(255), required
- is_active: Boolean, default true
- created_at: DateTime, default datetime.utcnow
- updated_at: DateTime, default datetime.utcnow with onupdate

## unit_progress table columns
- id: Integer, primary key, indexed
- user_id: Integer, foreign key -> users.id, indexed
- unit_id: String(64), required, indexed
- attempts: Integer, default 0
- correct_answers: Integer, default 0
- completed: Boolean, default false
- created_at: DateTime, default datetime.utcnow
- updated_at: DateTime, default datetime.utcnow with onupdate
- Unique constraint: uq_unit_progress_user_unit (user_id, unit_id)

## Relationships and constraints
- unit_progress.user_id references users.id
- No SQLAlchemy relationship() fields are defined
- No ON DELETE CASCADE at DB level
- Admin delete explicitly removes unit_progress rows
- Email uniqueness enforced at DB and API level

## Table creation behavior
- Base.metadata.create_all is called on startup
- No Alembic migrations are configured
- Schema changes require manual updates or migrations
- Create-all runs each startup (idempotent)

## Data access patterns (code paths)
- Auth register inserts a new user row
- Auth login selects user by email
- Auth me selects user by id + email
- Progress update selects progress by user_id + unit_id
- Progress update inserts new row if missing
- Progress update increments attempts each submission
- Progress update increments correct_answers on correct
- Progress update sets completed=true on correct
- Progress list selects all rows for current user
- Admin list selects all users ordered by id
- Admin create inserts a user row
- Admin set password updates hashed_password
- Admin delete deletes progress rows then user row
- Admin export selects all users ordered by id

## Query shapes (approximate)
- SELECT users WHERE email = :email
- SELECT users WHERE id = :id AND email = :email
- INSERT INTO users (name, email, hashed_password, is_active)
- SELECT unit_progress WHERE user_id = :user AND unit_id = :unit
- INSERT INTO unit_progress (user_id, unit_id, attempts, correct_answers, completed)
- UPDATE unit_progress SET attempts = attempts + 1
- UPDATE unit_progress SET correct_answers = correct_answers + 1
- UPDATE unit_progress SET completed = true
- SELECT unit_progress WHERE user_id = :user
- SELECT users ORDER BY id ASC
- DELETE unit_progress WHERE user_id = :user
- DELETE users WHERE id = :user

## Data dictionary notes
- users.name stores display name
- users.email stores login identifier
- users.hashed_password uses passlib pbkdf2_sha256
- users.is_active gates auth (inactive = unauthorized)
- unit_progress.unit_id matches content unit ids (uNN-*)
- unit_progress.attempts counts answer submissions
- unit_progress.correct_answers counts correct submissions
- unit_progress.completed indicates at least one correct answer

## Data lifecycle
- User record created on /auth/register or admin create
- Demo user can be created/updated on startup
- Password reset replaces hashed_password
- User deletion removes progress rows then user row
- Progress rows created on first answer for a unit
- Progress rows update with each answer submission

## Indexing and performance
- users.id and users.email are indexed
- unit_progress.id, user_id, and unit_id are indexed
- Unique constraint prevents duplicate progress per user/unit
- No composite index beyond the unique constraint
- No full-text or search indexes are defined

## Transaction and consistency
- Each API request uses a single SQLAlchemy session
- Commits are issued after create/update operations
- No explicit transaction blocks are defined
- Default isolation uses PostgreSQL defaults
- No optimistic locking or version columns are used

## Security considerations
- Passwords are never stored in plain text
- Tokens are JWTs and not stored in the DB
- No encryption-at-rest configuration in code
- No audit tables for login or progress events
- No soft deletes; deletes are hard deletes

## Operational notes
- docker-compose creates a postgres:16 container
- Data persists in a named volume (pgdata)
- No backup scripts are included in repo
- No migrations, seeds, or fixtures beyond demo user
- DB connection settings are environment-driven

## Integration with API responses
- UserPublic schema exposes id, name, email
- UnitProgressOut exposes unit_id, attempts, correct_answers, completed
- Progress list returns one entry per unit attempted
- /api/units/{id}/answer returns correctness + progress snapshot

## Example SQL (for reference)
- CREATE TABLE users (id serial primary key, email varchar(255) unique, ...)
- CREATE TABLE unit_progress (id serial primary key, user_id int references users(id), ...)
- CREATE UNIQUE INDEX uq_unit_progress_user_unit ON unit_progress (user_id, unit_id)
- CREATE INDEX ix_users_email ON users (email)
- CREATE INDEX ix_unit_progress_user_id ON unit_progress (user_id)

## Failure modes and edge cases
- Duplicate email registration returns 400 before DB insert
- Progress rows can only exist for authenticated users
- unit_id is treated as string and not validated against DB
- If content unit ids change, progress rows may orphan logically
- Progress is not reset when a unit definition changes

## Potential improvements
- Add Alembic migrations and versioning
- Add cascade deletes at DB level
- Add last_login or audit fields
- Consider partial indexes for active users only
- Add transaction wrappers for admin bulk actions

## Key files
- backend/app/database.py
- backend/app/models.py
- backend/app/routers/auth.py
- backend/app/routers/study.py
- backend/app/routers/admin.py
- backend/app/config.py
- backend/app/security.py
- backend/app/schemas.py
- backend/app/main.py
- docker-compose.yml

## ORM model details (expanded)
- User.__tablename__: users
- User.id: Column(Integer, primary_key=True, index=True)
- User.name: Column(String(100), nullable=False)
- User.email: Column(String(255), nullable=False, unique=True, index=True)
- User.hashed_password: Column(String(255), nullable=False)
- User.is_active: Column(Boolean, default=True)
- User.created_at: Column(DateTime, default=datetime.utcnow)
- User.updated_at: Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
- UnitProgress.__tablename__: unit_progress
- UnitProgress.id: Column(Integer, primary_key=True, index=True)
- UnitProgress.user_id: Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
- UnitProgress.unit_id: Column(String(64), nullable=False, index=True)
- UnitProgress.attempts: Column(Integer, default=0)
- UnitProgress.correct_answers: Column(Integer, default=0)
- UnitProgress.completed: Column(Boolean, default=False)
- UnitProgress.created_at: Column(DateTime, default=datetime.utcnow)
- UnitProgress.updated_at: Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
- UnitProgress.__table_args__: UniqueConstraint on (user_id, unit_id)

## Demo user seeding (DB impact)
- Seed logic runs in backend/app/main.py on startup
- If SEED_DEMO_USER is false, no seed occurs
- If user does not exist, a new user row is inserted
- If user exists, name and hashed_password are updated
- Seeded user is forced to is_active = true
- Seed uses demo_email as unique key for lookup

## Admin UI and DB behavior
- Admin create user inserts into users table
- Admin set password updates hashed_password
- Admin delete removes unit_progress rows first
- Admin delete then removes the user row
- Admin export selects all users ordered by id
- Admin UI does not expose progress data

## Suggested analysis queries
- Count users: SELECT COUNT(*) FROM users;
- Count progress rows: SELECT COUNT(*) FROM unit_progress;
- Active users: SELECT COUNT(*) FROM users WHERE is_active = true;
- Users without progress: SELECT u.id FROM users u LEFT JOIN unit_progress p ON p.user_id = u.id WHERE p.id IS NULL;
- Progress by unit: SELECT unit_id, COUNT(*) FROM unit_progress GROUP BY unit_id;
- Completion rate: SELECT unit_id, SUM(completed::int) FROM unit_progress GROUP BY unit_id;
- Attempts per user: SELECT user_id, SUM(attempts) FROM unit_progress GROUP BY user_id;
- Correct rate: SELECT user_id, SUM(correct_answers) FROM unit_progress GROUP BY user_id;

## Maintenance and operations
- Backups are not configured in repo
- Use pg_dump for backups and pg_restore for recovery
- Monitor table bloat and run VACUUM as needed
- Use ANALYZE for updated query planner stats
- Consider index on (user_id, completed) if filtering by completion
- Consider index on (user_id, unit_id) already via unique constraint
- Consider adding foreign key cascade if hard deletes are common

## Observability and logging gaps
- No DB query logging configured by default
- No slow query monitoring configured
- No metrics collection for DB usage
- Errors are surfaced via FastAPI exceptions
