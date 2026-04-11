# Thú Cưng — App Architecture

## Overview

This app follows **MVVM (Model-View-ViewModel)** architecture adapted for Expo Router's file-based navigation constraint.

**Core rule:** `app/` is a routing manifest only — every file there is a thin re-export. All real logic lives in `features/`.

---

## Folder Structure

```
├── app/                          # Expo Router — entry points only (thin re-exports)
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar config (icons, titles)
│   │   ├── index.tsx             # → HomeScreen
│   │   ├── feeding.tsx           # → FeedingScreen
│   │   ├── health.tsx            # → HealthScreen
│   │   └── reminders.tsx         # → RemindersScreen
│   ├── pet/
│   │   ├── [id].tsx              # → PetProfileScreen (receives petId param)
│   │   └── create.tsx            # → CreatePetScreen (modal)
│   └── _layout.tsx               # Root stack + DB init
│
├── features/                     # Feature modules — real MVVM lives here
│   ├── home/
│   │   ├── HomeScreen.tsx        # View
│   │   └── useHomeViewModel.ts   # ViewModel
│   ├── feeding/
│   │   ├── FeedingScreen.tsx
│   │   └── useFeedingViewModel.ts
│   ├── health/
│   │   ├── HealthScreen.tsx
│   │   └── useHealthViewModel.ts
│   ├── reminders/
│   │   ├── RemindersScreen.tsx
│   │   └── useRemindersViewModel.ts
│   └── pets/
│       ├── PetProfileScreen.tsx
│       ├── CreatePetScreen.tsx
│       ├── usePetProfileViewModel.ts
│       └── useCreatePetViewModel.ts
│
├── models/                       # Model layer — data types + DB access
│   ├── types/
│   │   ├── Pet.ts
│   │   ├── Meal.ts
│   │   ├── HealthRecord.ts
│   │   └── Reminder.ts
│   ├── repositories/
│   │   ├── PetRepository.ts
│   │   ├── MealRepository.ts
│   │   ├── HealthRepository.ts
│   │   └── ReminderRepository.ts
│   └── db/
│       └── client.ts             # SQLite client + initDB() + table schemas
│
├── store/                        # Zustand — lightweight global state
│   ├── activePetStore.ts         # Which pet is currently selected
│   └── settingsStore.ts          # Language, theme, notification prefs
│
├── services/                     # Side-effect services (no UI, no state)
│   ├── NotificationService.ts    # expo-notifications scheduling
│   └── StorageService.ts         # AsyncStorage typed wrapper
│
├── components/                   # Shared UI (no business logic)
│   ├── ui/
│   │   ├── icon-symbol.tsx
│   │   └── icon-symbol.ios.tsx
│   └── haptic-tab.tsx
│
├── constants/
│   └── theme.ts                  # Colors, Fonts
│
└── hooks/
    ├── use-color-scheme.ts
    └── use-color-scheme.web.ts
```

---

## MVVM Layers

### View — `features/<name>/<Name>Screen.tsx`
- Pure rendering only
- Calls ViewModel hook and binds state/actions to UI
- No direct repository or service calls
- No business logic

```tsx
export function FeedingScreen() {
  const vm = useFeedingViewModel();
  return <MealList meals={vm.meals} onDelete={vm.deleteMeal} />;
}
```

### ViewModel — `features/<name>/use<Name>ViewModel.ts`
- One hook per screen
- Owns all state and actions for that screen
- Coordinates between Repository, Services, and Zustand stores
- Returns a plain object (state + actions) — no JSX

```ts
export function useFeedingViewModel() {
  const { activePetId } = useActivePetStore();
  const [meals, setMeals] = useState<Meal[]>([]);

  const logMeal = (input) => {
    const saved = MealRepository.create({ ...input, petId: activePetId });
    setMeals(prev => [saved, ...prev]);
  };

  return { meals, logMeal };
}
```

### Model — `models/`
- **Types** (`models/types/`) — plain TypeScript interfaces, no logic
- **Repositories** (`models/repositories/`) — the only layer that touches the database
- **DB client** (`models/db/client.ts`) — SQLite connection + schema init

```ts
// Only layer allowed to call db.*
export const MealRepository = {
  getByPetId(petId: string): Meal[] { ... },
  create(input: CreateMealInput): Meal { ... },
  delete(id: string): void { ... },
};
```

---

## Data Flow

```
User interaction
      ↓
View (Screen) — calls ViewModel action
      ↓
ViewModel — coordinates logic
      ↓
Repository — reads/writes SQLite
      ↓
DB client (expo-sqlite)
```

For cross-screen shared state (active pet, settings):

```
ViewModel ←→ Zustand store ←→ other ViewModels
```

---

## State Management — Two Layers

| Layer | Tool | What it holds |
|---|---|---|
| Persistent data | `expo-sqlite` via Repositories | Pets, meals, health records, reminders |
| Global UI state | Zustand | Active pet ID, app settings |
| Local screen state | `useState` / `useReducer` | Forms, loading flags, local lists |

---

## Navigation

Expo Router with file-based routing. Tab bar defined in `app/(tabs)/_layout.tsx`.

| Route | Screen | Presentation |
|---|---|---|
| `/` | Home | Tab |
| `/feeding` | Feeding tracker | Tab |
| `/health` | Health records | Tab |
| `/reminders` | Reminders | Tab |
| `/pet/create` | Create pet | Modal |
| `/pet/[id]` | Pet profile | Stack push |

---

## Database

**expo-sqlite** with a synchronous API (`runSync`, `getAllSync`, `getFirstSync`).

Tables: `pets`, `meals`, `health_records`, `reminders`

`initDB()` is called once in `app/_layout.tsx` on app startup. It creates all tables with `CREATE TABLE IF NOT EXISTS` — safe to call on every launch.

All foreign keys use `ON DELETE CASCADE` so deleting a pet cleans up all its related records.

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `expo-router` | File-based navigation |
| `expo-sqlite` | Local-first database |
| `zustand` | Global state management |
| `expo-notifications` | Push notification scheduling |
| `uuid` + `react-native-get-random-values` | UUID generation in Hermes |
| `date-fns` | Date formatting/manipulation |
| `zod` | Schema validation (forms) |
| `@react-native-async-storage/async-storage` | App preferences storage |

> **Note:** `react-native-get-random-values` must be imported before `uuid` in every repository file. This polyfills the random source that `uuid` needs to work in Hermes (React Native's JS engine).

---

## Adding a New Feature

1. Create `features/<name>/` with:
   - `<Name>Screen.tsx` — View
   - `use<Name>ViewModel.ts` — ViewModel
2. Add types to `models/types/<Name>.ts`
3. Add a repository to `models/repositories/<Name>Repository.ts`
4. Add a route in `app/` that re-exports the screen:
   ```ts
   import { NameScreen } from '@/features/name/NameScreen';
   export default NameScreen;
   ```
5. Register the route in `app/(tabs)/_layout.tsx` or `app/_layout.tsx`

---

## MVP Scope (v1.0)

- [x] Single pet profile
- [x] Feeding tracker
- [x] Health records + vaccinations
- [x] Scheduled reminders (expo-notifications)
- [x] Local-first storage (offline)

**Deferred to v2:**
- Multiple pets
- Cloud backup (Firebase / Supabase)
- Vet finder
- Weight chart (react-native-gifted-charts)
- Vietnamese breed database
- Pet expense tracking in VND
