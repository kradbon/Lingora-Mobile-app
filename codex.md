# Lingora Codex Notes

This repo contains a PHP-learning mobile app (Expo React Native) and a FastAPI backend.
The mobile app supports online and offline modes.

## Repo layout

- `backend/`: FastAPI API + PostgreSQL integration
  - `backend/app/main.py`: app entrypoint
  - `backend/app/routers/auth.py`: register/login/me
  - `backend/app/routers/study.py`: units, curriculum, progress, answer submission
  - `backend/app/routers/admin.py`: admin panel
  - `backend/app/data/*.json`: backend content
- `frontend-only/`: Expo mobile app
  - `frontend-only/App.tsx`: app root
  - `frontend-only/src/navigation/index.tsx`: navigation + tabs
  - `frontend-only/src/screens/`: main screens (Home, Lessons, Lesson, Unit, Practice, League, Profile)
  - `frontend-only/src/data/lessons.ts`: lesson reading content (14 lessons)
  - `frontend-only/src/data/units.ts`: quiz items (140 quizzes)
  - `frontend-only/src/data/curriculum.ts`: sections and lesson grouping
  - `frontend-only/src/player.ts`: hearts and gems storage
  - `frontend-only/src/offline.ts`: offline session and progress

## Key app behavior

- Lessons: 14 total, read-first, then quizzes.
- Quizzes: 10 per lesson, 140 total.
- Home path: quiz nodes grouped into sections of 10.
- Hearts: 5 hearts; 1 heart every 30 minutes; live countdown when tapping the heart pill.
- League: Bronze, Silver, Gold, Platinum, Diamond, Legend with fake users.
- Languages: English, Russian, Tajik for UI and content.
- Offline: full content and progress stored locally; backend optional.

## Environment variables

### Backend (`backend/.env`)

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key
- `ALLOWED_ORIGINS`: CORS origins (comma-separated, `*` for local dev)
- `SEED_DEMO_USER`: optional demo user seed
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: admin panel credentials

### Frontend (`frontend-only/.env`)

- `EXPO_PUBLIC_API_BASE`: backend URL
- `EXPO_PUBLIC_OFFLINE_MODE`: `true` to force offline mode
- `EXPO_PUBLIC_OFFLINE_USER_NAME`: seed user name
- `EXPO_PUBLIC_OFFLINE_USER_EMAIL`: seed user email
- `EXPO_PUBLIC_OFFLINE_USER_PASSWORD`: seed user password

## APK build (Windows)

1. `cd frontend-only`
2. `npm install`
3. If `android/` does not exist: `npx expo prebuild -p android`
4. `cd android`
5. `.\gradlew assembleRelease`

Output:
`frontend-only/android/app/build/outputs/apk/release/app-release.apk`

If path length issues occur on Windows, use a shorter path (e.g., `subst`) and build from that drive.

## Troubleshooting

- If Expo cannot reach the API, set `EXPO_PUBLIC_API_BASE` and restart Metro.
- If running on a real device, use your PC IP for `EXPO_PUBLIC_API_BASE`.
- Offline builds do not require the backend.
