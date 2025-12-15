# Lingora Frontend Only (Expo)

This is a clean Expo (SDK 54) mobile app with no backend code. Configure your API base via `EXPO_PUBLIC_API_BASE` when running.

## Run (Expo Go)
```cmd
cd "C:\Users\user\Desktop\Lingora python\frontend-only"
npm install
npx expo start --tunnel --clear
```
- For a specific backend: `set EXPO_PUBLIC_API_BASE=https://your-api` before `npx expo start`.
- Android emulator auto-uses `http://10.0.2.2:8000`; iOS/web uses `http://localhost:8000` by default.

## Notes
- PlatformConstants shim is included to avoid TurboModule errors on some devices.
- axios client has an 8s timeout to avoid hanging on unreachable APIs.
- Screens: Login, Register, Study, Unit, Settings (same as prior app).
```
