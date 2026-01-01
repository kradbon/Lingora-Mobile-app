API integration guide (for backend devs)
========================================

Base URL
- In the mobile app, the base URL is read from `EXPO_PUBLIC_API_BASE` (recommended).
  - PowerShell: `$env:EXPO_PUBLIC_API_BASE="http://192.168.1.10:8000"`
  - cmd: `set EXPO_PUBLIC_API_BASE=http://192.168.1.10:8000`
- If unset, the app tries to auto-detect the Expo dev server host and uses `http://<host>:8000`.
- Final fallback: Android emulator -> `http://10.0.2.2:8000`, iOS/web -> `http://localhost:8000`.

Endpoints (as used by the app)
- POST `/auth/register` -> body `{ name, email, password }`, returns `{ token, user }`.
- POST `/auth/login-mobile` -> body `{ email, password }`, returns `{ token, user }`.
- GET `/auth/me` -> returns current user `{ id, name, email }`.
- GET `/ping` -> health check `{ ok: true, service: "lingora-api" }`.
- GET `/api/curriculum` -> curriculum sections + lessons.
- GET `/api/units` -> list of quiz units.
- GET `/api/units/{unit_id}` -> lesson + quiz payload (answers hidden).
- POST `/api/units/{unit_id}/answer` -> `{ correct, progress }`.
- GET `/api/progress` -> per-unit progress list.

Auth details
- Bearer token expected: `Authorization: Bearer <token>`.
- The app stores the token in AsyncStorage under key `lingora_auth_token`.
- Axios attaches the token automatically on every request.

Error handling (expected by app)
- On auth errors, return status 400/401 with a JSON `detail` field, e.g. `{ "detail": "Invalid credentials" }`.
- Validation errors should return 422 with `detail` as an array (FastAPI default).

Sample C# (HttpClient) call
```csharp
var client = new HttpClient { BaseAddress = new Uri("https://api.example.com") };
var payload = new { email = "demo@example.com", password = "demo1234" };
var resp = await client.PostAsJsonAsync("/auth/login-mobile", payload);
resp.EnsureSuccessStatusCode();
var data = await resp.Content.ReadFromJsonAsync<LoginResponse>();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", data.token);
```
Where `LoginResponse` is `{ public string token { get; set; } public User user { get; set; } }`.

Expo/mobile notes
- If you change the backend URL, restart Expo after setting `EXPO_PUBLIC_API_BASE`.
- Network timeout in the app is 8s; slow/stuck requests will surface as errors.
- Offline mode bypasses the API and uses local content in the app bundle.
