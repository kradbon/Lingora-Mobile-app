# Lingora

Lingora is a mobile application for learning PHP. It provides a structured curriculum with lessons and quizzes, and it is designed to be used both online and offline.

## Features

- **Cross-platform:** Built with React Native (Expo), the app runs on both Android and iOS.
- **Backend:** The backend is powered by FastAPI and PostgreSQL, providing a robust API for the frontend.
- **Offline Mode:** The app can be used offline, with all lesson content available locally.
- **Internationalization (i18n):** The app supports three languages: English, Russian, and Tajik. The user can switch the language dynamically in the profile screen.
- **Gamification:**
    - **Hearts:** Users have a limited number of hearts, which are consumed for incorrect quiz answers.
    - **Hearts refill:** 1 heart every 30 minutes (5 hearts in 2.5 hours) with a live countdown when tapped.
    - **Gems:** Users earn gems by completing units.
- **Leaderboard:** A league ladder with fake users that you climb by completing quizzes.
- **Structured Curriculum:** 14 lessons with 10 quizzes each (140 total). Lessons are read-first, then quizzes.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Docker and Docker Compose
- Android Studio or Xcode for running the mobile app on an emulator or a real device.

### Backend Setup

1.  Navigate to the `backend/` directory.
2.  Create a `.env` file from the `.env.example` and fill in the required environment variables.
3.  Run `docker-compose up -d` to start the PostgreSQL database.
4.  Create a virtual environment: `python -m venv .venv`
5.  Activate the virtual environment: `source .venv/bin/activate` (or `.\.venv\Scripts\activate` on Windows)
6.  Install the dependencies: `pip install -r requirements.txt`
7.  Run the backend server: `uvicorn app.main:app --reload`

The backend will be available at `http://localhost:8000`.

### Frontend Setup

1.  Navigate to the `frontend-only/` directory.
2.  Install the dependencies: `npm install`
3.  Create a `.env` file and set `EXPO_PUBLIC_API_BASE` to your backend's URL (e.g., `http://localhost:8000`).
4.  Start the Metro bundler: `npm start`
5.  Follow the instructions in the terminal to run the app on an emulator or a real device.

## Admin Panel

The admin panel is available at `http://localhost:8000/admin/login`. You can use it to manage the app's content.
