Admin Web

- Templates live in this folder: admin/templates.
- Pages are served by the backend at:
  - /admin/login
  - /admin
  - /admin/logout

How it works
- The FastAPI backend includes an admin router that renders these templates.
- This keeps end-user flows in the mobile app only; the browser is used solely for admin operations.

