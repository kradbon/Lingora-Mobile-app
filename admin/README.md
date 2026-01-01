Admin Web

- Pages are served by the backend at:
  - /admin/login
  - /admin (redirects to /admin/)
  - /admin/
  - /admin/logout

How it works
- The FastAPI backend includes an admin router that renders templates from `backend/app/templates`:
  - `backend/app/templates/admin_login.html`
  - `backend/app/templates/admin_index.html`
- This keeps end-user flows in the mobile app only; the browser is used solely for admin operations.

Credentials
- Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env` (see `backend/.env.example`).

Scope
- The admin panel is only for user management and CSV export.
- Lesson/quiz content for the mobile app is maintained in the frontend offline data files.
