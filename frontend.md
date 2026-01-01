# Frontend Report (Expo React Native)

## Scope and context
- Project root: frontend-only/
- Entry component: frontend-only/App.tsx
- App name: Lingora (app.json)
- App slug: lingora-frontend (app.json)
- Scheme: lingora (app.json)
- Orientation: portrait (app.json)
- Platforms: ios, android, web (app.json)
- Android package: com.lingora.frontend (app.json)
- UI focus: mobile learning app (no admin web UI here)
- Backend dependency: FastAPI service at API_BASE

## Runtime and dependencies
- Expo SDK: ~54.0.0
- React: 19.1.0
- React Native: 0.81.5
- Axios: 1.7.2
- AsyncStorage: @react-native-async-storage/async-storage 2.2.0
- Navigation core: @react-navigation/native 6.1.10
- Navigation stacks: @react-navigation/native-stack 6.9.18
- Navigation tabs: @react-navigation/bottom-tabs 6.5.11
- Gestures: react-native-gesture-handler ~2.28.0
- Safe area: react-native-safe-area-context ~5.6.0
- Screens: react-native-screens ~4.16.0
- Reanimated: react-native-reanimated ~4.1.1
- Icons: @expo/vector-icons ^15.0.3 (MaterialCommunityIcons)
- TypeScript: ~5.9.2
- Babel: babel-preset-expo ~54.0.0

## Build and tooling configuration
- package.json main: node_modules/expo/AppEntry.js
- Script: npm run start (Expo dev server)
- Script: npm run android (native run)
- Script: npm run ios (native run)
- Script: npm run web (Expo web)
- babel.config.js presets: babel-preset-expo
- babel.config.js plugin: react-native-reanimated/plugin
- tsconfig extends: expo/tsconfig.base
- tsconfig strict: true
- tsconfig allowJs: true
- tsconfig noEmit: true
- tsconfig resolveJsonModule: true
- tsconfig types: react, react-native, node

## File layout (frontend-only/)
- App.tsx (root component)
- app.json (Expo app config)
- package.json (dependencies and scripts)
- babel.config.js (Babel config)
- tsconfig.json (TypeScript config)
- src/config.ts (API base and offline flags)
- src/api/client.ts (Axios client and token injection)
- src/api/auth.ts (auth API wrapper + offline)
- src/api/study.ts (study API wrapper + offline)
- src/context/AuthProvider.tsx (auth context)
- src/navigation/index.tsx (navigation root)
- src/components/TopBar.tsx (top stats bar)
- src/components/TextField.tsx (input wrapper)
- src/components/PrimaryButton.tsx (button component)
- src/components/Icon.tsx (icon wrapper)
- src/screens/* (app screens)
- src/data/units.ts (local units)
- src/data/lessons.ts (local lesson content)
- src/data/curriculum.ts (local curriculum)
- src/i18n/* (internationalization)
- src/player.ts (player stats)
- src/hooks/usePlayerStats.ts (player stats hook)
- src/theme.ts (colors)
- src/offline.ts (offline storage logic)
- src/shims/platformConstants.ts (turbo module shim)

## Environment configuration
- EXPO_PUBLIC_API_BASE sets the API base URL
- Auto-detects Expo dev host from NativeModules.SourceCode.scriptURL
- Fallback to ExponentConstants manifest debuggerHost and hostUri
- Auto base uses http://<host>:8000 when detected
- Android emulator fallback: http://10.0.2.2:8000
- iOS/web fallback: http://localhost:8000
- EXPO_PUBLIC_OFFLINE_MODE enables offline mode (truthy values)
- EXPO_PUBLIC_OFFLINE_USER_NAME sets offline seed name
- EXPO_PUBLIC_OFFLINE_USER_EMAIL sets offline seed email
- EXPO_PUBLIC_OFFLINE_USER_PASSWORD sets offline seed password

## App initialization sequence
- App.tsx loads platformConstants shim before React Native usage
- App.tsx loads react-native-gesture-handler globally
- GestureHandlerRootView wraps the entire app
- AuthProvider wraps navigation and owns auth state
- AuthProvider bootstrap runs on mount
- bootstrap calls refreshMe and then clears loading state
- refreshMe calls /auth/me and updates user state
- refreshMe clears token and offline session on error
- NavRoot shows a loading screen while AuthProvider is loading

## Navigation map
- Root is NavigationContainer in src/navigation/index.tsx
- Unauthenticated stack: Login -> Register
- Authenticated stack: Main (tabs) + Lesson + Unit
- Tabs: Home, Lessons, Practice, League, Profile
- Tab icons are MaterialCommunityIcons with pill backgrounds
- Lesson screen is a separate stack screen for reading lesson info
- Unit screen is a separate stack screen for quizzes
- Parent navigation is used for Unit from nested tab screens

## API client behavior
- Axios client baseURL uses API_BASE from src/config.ts
- Axios timeout is 8000 ms
- Request interceptor reads lingora_auth_token from AsyncStorage
- Authorization header is attached when token exists
- API functions are centralized in src/api/auth.ts and src/api/study.ts
- Error handling expects FastAPI detail strings or arrays
- No retry or caching layer beyond in-memory state

## Auth and session management
- Token storage key: lingora_auth_token
- loginMobile uses POST /auth/login-mobile
- register uses POST /auth/register
- After login/register, /auth/me is called to hydrate user
- logout clears token and offline session
- refreshMe clears token on invalid/expired credentials
- User context stores { name, email } only
- API token is not stored in memory beyond AsyncStorage

## Offline mode implementation
- OFFLINE_MODE is a config flag from EXPO_PUBLIC_OFFLINE_MODE
- Offline users stored under lingora_offline_users
- Offline session stored under lingora_offline_session
- Offline progress stored under lingora_offline_progress
- Offline email normalization lowercases and trims
- ensureOfflineSeedUser creates a default user if none exist
- Offline login checks stored users by email + password
- Offline register appends new user to storage
- Offline me returns the session user by email
- Offline progress map is keyed by normalized email
- Offline submitAnswer updates attempts and completed flag
- UnitScreen toggles offline mode on API failure per unit
- Offline mode uses local units and curriculum content

## Data models (frontend types)
- TokenResponse: token + user object
- User shape: { id, name, email }
- UnitSummary: { id, title }
- CurriculumUnit: { id, title, description?, lessons }
- Curriculum: { units: CurriculumUnit[] }
- UnitDetail: { id, title, learn, quiz }
- UnitLearn: { text, code?, details?, summary? }
- UnitProgress: { unit_id, attempts, correct_answers, completed }
- UnitAnswerResponse: { correct, progress }

## Screen breakdown: LoginScreen
- Inputs: email, password
- Validates email presence and basic format
- Displays API_BASE or Offline mode label
- Maps FastAPI error detail strings to UI errors
- Adds hint for real device when API_BASE is 10.0.2.2

## Screen breakdown: RegisterScreen
- Inputs: name, email, password
- Validates name and email
- Validates password length >= 6
- Displays API_BASE or Offline mode label
- Uses /auth/register then /auth/me

## Screen breakdown: HomeScreen
- Loads /api/curriculum and /api/progress in parallel
- Flattens all quizzes into a global ordered list
- Section number = global index / 10 (10 quizzes per section)
- Unit number = position inside section (1-10)
- Node icon is based on unit number (star on unit 10)
- Locked nodes are disabled beyond next quiz index
- Banner shows the next quiz with a Lessons shortcut

## Screen breakdown: LessonsScreen
- Loads /api/curriculum and /api/progress in parallel
- SectionList groups lessons by curriculum sections
- Computes per-lesson completion from quiz progress
- Next index is first incomplete lesson
- Locked lessons are disabled beyond next index
- Tapping a lesson opens LessonScreen (read info, then start quizzes)

## Screen breakdown: LessonScreen
- Loads lesson info and progress for the selected lesson
- Shows lesson text, code snippet, and detailed bullets (5 by default)
- Shows quiz count and completion progress for that lesson
- Start button launches the first quiz in the lesson

## Screen breakdown: PracticeScreen
- Loads /api/units and /api/progress in parallel
- Mistakes are attempted but incomplete units
- Completed are units with completed=true
- Random practice chooses from completed units
- Mistake practice chooses from mistakes list
- Includes a tip that navigates back to Home

## Screen breakdown: LeagueScreen
- Loads /api/units and /api/progress in parallel
- XP = completedCount * 10
- League tiers: Bronze < 200, Silver 200-499, Gold 500-999, Platinum 1000-1499, Diamond 1500-2199, Legend 2200+
- Fake users are generated per league and ranked against the player
- Progress bar shows progress to the next league
- Continue button navigates to Home

## Screen breakdown: ProfileScreen
- Avatar initials derived from user name
- Shows total units and completed count
- XP and league computed from progress
- Refresh profile triggers /auth/me
- Network card calls /ping
- Logout clears token and offline session
- Modal sheet contains placeholder actions
- Language selector allows the user to change the app language.

## Screen breakdown: UnitScreen
- Reads unit id from route params
- Fetches unit via /api/units/{id}
- Falls back to local units on API errors
- Steps: learn -> quiz -> done, with out-of-hearts step
- Hearts are loaded from and persisted to AsyncStorage.
- An incorrect answer costs one heart.
- When a user runs out of hearts, they are shown an "Out of hearts" message.
- submitAnswer called for quiz submissions
- Quiz does not reveal correct answer
- Details list shows 3 items with Show more toggle
- Summary is shown after completion
- Back to path resets hearts and state

## Screen breakdown: StudyScreen (legacy)
- Simple FlatList of local units
- Uses hardcoded progress fill based on index
- Navigates to Unit with local unit id
- Not wired in the current navigation

## Screen breakdown: SettingsScreen (legacy)
- Shows account info and API base
- Uses React Native Button for actions
- Provides /ping test and logout
- Not wired in the current navigation

## UI components
- TopBar shows streak, gems, hearts; tapping hearts shows a live refill countdown
- PrimaryButton supports loading and disabled states
- TextField wraps TextInput with icon and styles
- Icon is a MaterialCommunityIcons wrapper

## Theme and styling
- Palette: bg0 #0b0f14, bg1 #0f141a, card #111827, card2 #0b1220
- Palette: border #1f2933, text #e5e7eb, muted #94a3b8
- Palette: primary #60a5fa, primaryBorder #93c5fd
- Palette: success #34d399, danger #f87171, warning #fbbf24, locked #374151
- Most screens use colors.bg1 for backgrounds

## Content
- The curriculum includes 14 lessons with 10 quizzes each (140 total).
- Lessons are read-first; quizzes follow after reading.
- The content is internationalized and supports English, Russian, and Tajik.
- Offline content is defined in `frontend-only/src/data/lessons.ts`, `frontend-only/src/data/units.ts`, and `frontend-only/src/data/curriculum.ts`.
- The backend serves the content from `backend/app/data/curriculum.json` and `backend/app/data/units.json`.

## Known issues and gaps
- Offline progress does not sync to backend
- No pull-to-refresh or cache invalidation for study data
- StudyScreen and SettingsScreen are legacy and unused

