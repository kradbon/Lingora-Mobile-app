API integration guide (for backend devs)
========================================

Base URL
- Use the backend base URL provided to you (e.g., `https://api.example.com`).
- In the mobile app, the base URL is read from `EXPO_PUBLIC_API_BASE`. Set it before `npx expo start`, e.g.:
  - PowerShell: `$env:EXPO_PUBLIC_API_BASE="https://api.example.com"`
  - cmd: `set EXPO_PUBLIC_API_BASE=https://api.example.com`
  - If unset, the app defaults to `http://10.0.2.2:8000` on Android emulator and `http://localhost:8000` on iOS/web.

Endpoints (as used by the app)
- POST `/auth/register` — body `{ name, email, password }`, returns `{ token, user }`.
- POST `/auth/login-mobile` — body `{ email, password }`, returns `{ token, user }`.
- GET `/auth/me` — returns current user `{ name, email, ... }`.
- POST `/auth/logout` (optional) — to invalidate token if supported.
- GET `/ping` — health check `{ ok: true, service: "lingora-api" }`.

Auth details
- Bearer token expected: `Authorization: Bearer <token>`.
- The app stores the token in AsyncStorage under key `lingora_auth_token`.
- Axios client attaches the token automatically on every request.
- Rate limiting (if enabled): login endpoints often limited (e.g., 5/min/IP).

Backend expectations for MayoAI/C# developer
- Implement the above endpoints with JSON bodies and responses as shown.
- On successful login/register, return `200` with JSON:
  ```json
  { "token": "<jwt-or-session-token>", "user": { "name": "Alice", "email": "alice@example.com" } }
  ```
- `GET /auth/me` should return the same user object (no token refresh expected).
- CORS: allow the mobile origin; for local dev `*` is fine, otherwise specify the Expo dev URL or your domain.
- Health: `GET /ping` should return status 200 with `{ "ok": true, "service": "lingora-api" }`.

Error handling (expected by app)
- On auth errors, return status 400/401 with a JSON `detail` field, e.g. `{ "detail": "Invalid credentials" }`.
- Other errors: return JSON with a message in `detail` to surface in the UI.

Sample C# (HttpClient) call
```csharp
var client = new HttpClient { BaseAddress = new Uri("https://api.example.com") };
var payload = new { email = "admin@lingora.local", password = "secret" };
var resp = await client.PostAsJsonAsync("/auth/login-mobile", payload);
resp.EnsureSuccessStatusCode();
var data = await resp.Content.ReadFromJsonAsync<LoginResponse>();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", data.token);
```
Where `LoginResponse` is `{ public string token { get; set; } public User user { get; set; } }`.

Expo/mobile notes
- Expo SDK: 54; React Native: 0.76.3.
- If you change the backend URL, restart Expo after setting `EXPO_PUBLIC_API_BASE`.
- Network timeout in the app is 8s; slow/stuck requests will surface as errors.

Checklist for backend dev
- [ ] Implement endpoints above with the response shapes shown.
- [ ] Enable CORS for the mobile/web origins.
- [ ] Provide the final API base URL for the mobile app to use via `EXPO_PUBLIC_API_BASE`.
