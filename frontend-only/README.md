# Lingora Frontend (Expo)

This is the frontend mobile application for Lingora, built with React Native (Expo).

## Features

- **Cross-platform:** Runs on both Android and iOS.
- **Offline Mode:** The app can be used offline, with all lesson content available locally.
- **Internationalization (i18n):** The app supports three languages: English, Russian, and Tajik.
- **Gamification:** Hearts and gems, with hearts refilling every 30 minutes.
- **Leaderboard:** League ladder with fake users and progress to the next league.
- **Structured Curriculum:** 14 lessons with 10 quizzes each (140 total). Lessons are read-first, then quizzes.

## Getting Started

### Prerequisites

- Node.js (v18+)
- An Android or iOS emulator, or a physical device with the Expo Go app.

### Run the App

1.  Navigate to the `frontend-only/` directory.
2.  Install the dependencies: `npm install`
3.  Create a `.env` file and set `EXPO_PUBLIC_API_BASE` to your backend's URL (e.g., `http://localhost:8000`). If you are running the backend on the same machine and using an Android emulator, the URL should be `http://10.0.2.2:8000`.
4.  Start the Metro bundler: `npm start`
5.  Follow the instructions in the terminal to run the app on an emulator or a real device.

## Offline Mode

To run the app in offline mode, set `EXPO_PUBLIC_OFFLINE_MODE=true` in your `.env` file. In offline mode, the app will use local data and will not connect to the backend API.

Default offline credentials:
- **Email:** `user1@example.com`
- **Password:** `user1`

You can change the default offline user credentials in the `.env` file.
