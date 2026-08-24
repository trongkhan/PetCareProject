# Senly — Progress & Machine Handoff

> Snapshot for continuing work on another MacBook.
> Last updated: **2026-08-24**

Senly is a pet-care mobile app (React Native / Expo) with a Supabase + Gemini AI
backend. The project lives in a `Senly/` folder containing **two git repos**.

## Repos

| Repo | Path | GitHub | Role |
|------|------|--------|------|
| **PetCareProject** | `Senly/PetCareProject` | `github.com/trongkhan/PetCareProject` | Expo app (frontend) |
| **petcare-backend** | `Senly/petcare-backend` | `github.com/trongkhan/petcare-backend` | Supabase Edge Functions (Gemini AI proxy) |

Clone both side by side into a `Senly/` folder on the new machine.

---

## Current status

### petcare-backend — ✅ stable, pushed
- Branch `main`, in sync with `origin/main`.
- Supabase Edge Functions: `ai-extract`, `ai-chat`, `ai-insight` (+ shared `gemini`, `cors`, `auth`).
- Gemini model pinned to `gemini-3.1-flash-lite`.
- RLS migration: `supabase/migrations/0001_example_rls.sql` — only the `pets` table so
  far; `meals` / `health_records` / `reminders` still live in the app's local SQLite,
  not synced to the cloud yet.
- `_shared/auth.ts` imports `supabase-js` via `npm:`, not `jsr:` — `jsr.io` is
  unreliable on the dev network (intermittent 403 from the host, consistent 403 from
  inside Docker), which broke the local edge runtime boot. `npm:` sidesteps it.

### PetCareProject — 🟢 active branch `feat/localization-dark-mode`
Everything below is **committed locally**. The last 2 commits (Android splash fix +
UI/MVVM refactor) are **not yet pushed** — `git push` when ready.

**Feature A — AI "Quick Log"** (main new feature)
Type a plain-language note on Home (e.g. *"Bim had 1 cup of kibble this morning"*),
AI parses it, and you land in a **pre-filled** Add dialog.
- `features/home/HomeScreen/components/QuickLogCard.tsx` — Home input; calls `AIService.extract`, routes to Feeding or Health.
- `services/aiSchemas.ts` — **zod** validation of AI output; invalid → safe `kind: 'unknown'`.
- `store/quickLogStore.ts` — zustand store handing the parsed result to the target screen.
- Feeding / Health screens + Add dialogs — accept an `initial` prefill prop and open pre-filled.
- `locales/en.json` / `vi.json` — bilingual `quicklog` strings.
- `services/AIService.ts` — returns zod-validated `ExtractResult`.
- ⚠️ Not yet exercisable end-to-end locally: the AI functions need `GEMINI_API_KEY`
  (see **Local dev environment** below).

**Feature B — Branding / splash**
- App renamed `TestProject` → **Senly** (`app.json`).
- `components/AppSplash.tsx` + animated splash in `app/_layout.tsx` (native cream splash → fade-in `SENLY.png` → fade-out, no white flash).
- **Android build fix**: `expo-splash-screen`'s prebuild plugin always writes
  `windowSplashScreenAnimatedIcon → @drawable/splashscreen_logo` into `styles.xml`,
  but only generates that drawable when the config has an `image`. This app's splash
  config had `backgroundColor` only (by design — the logo animates in-app, not on the
  native splash), so the reference dangled and `:app:processDebugResources` failed
  with "resource drawable/splashscreen_logo not found". Fixed by pointing `image` at
  a fully transparent PNG (`assets/images/splash-transparent.png`) for both light and
  dark — visually unchanged, but the plugin now has something to generate.

**Feature C — Screen structure + UI pass** (this session)
- `features/account`, `features/assistant`, `features/auth`, `features/settings` split
  into the same `index/styles/types/uiCallback/viewModel` folder shape every other
  screen already used (a convention introduced mid-project that these four, added in
  the auth/nav sprint, never got backfilled into). Business logic that had been living
  directly in Assistant/Auth's View now lives in their `viewModel` hooks.
- New shared components: `ScreenHeader`, `LoadingState`, `EmptyState` (full + compact
  variants), `SegmentedControl` — replacing patterns that had been copy-pasted across
  4–7 screens each (Appbar header boilerplate, centred spinner, the
  outlined-card-with-italic-text empty state).
- `BaseScreen` gained an optional `fab` prop; Home/Feeding/Health/Reminders now pass
  `fab={{ onPress, ... }}` instead of each declaring an identical `<FAB>`.
- Fixed: FAB overlapping trailing content on scroll (new `FabClearance` constant),
  emoji used as icons (Quick Log title, Assistant empty state → vector icons),
  selected/unselected chip and segment colors that read backwards (Paper's default
  `secondaryContainer` made *unselected* chips louder than *selected* ones).
- Home: removed the pet switcher row when there's only one pet (it repeated the
  name/avatar already on the header card below) and removed the "Quick start" chip
  row (it duplicated the three activity cards — Feeding/Health/Reminders — shown
  immediately above it).
- AuthScreen redesigned: sign-up tab removed (planned as its own screen, not sharing
  one form with sign-in), added password show/hide, autofill hints, and a
  reserved-height feedback slot so an error appearing never shifts the layout.

---

## Local dev environment (this session's setup)

The Supabase project ref baked into `.env.example`
(`ppuinennusunlqnttajj.supabase.co`) **no longer exists** — confirmed via public DNS
(NXDOMAIN), meaning the project was deleted, not paused. Until a new cloud project is
provisioned, dev runs against **Supabase local** via Docker.

```bash
cd petcare-backend
supabase start                              # Postgres + Auth + Storage + Studio
supabase functions serve --env-file .env    # Edge Functions

cd ../PetCareProject
npx expo start --clear                      # Metro; --clear picks up new .env values
```

- `PetCareProject/.env` (gitignored, recreate manually) points
  `EXPO_PUBLIC_SUPABASE_URL` at the **host's LAN IP**, e.g. `http://10.x.x.x:54321` —
  not `127.0.0.1` — so a physical device or emulator can reach it.
  (`http://10.0.2.2:54321` also works, Android-emulator-only.) The debug Android
  manifest already sets `usesCleartextTraffic="true"`, so plain HTTP is fine.
- `petcare-backend/.env` (gitignored) must **not** define `SUPABASE_URL` /
  `SUPABASE_ANON_KEY` — the edge runtime injects those itself; the CLI silently skips
  any var starting with `SUPABASE_`.
- `GEMINI_API_KEY` is still **empty** in `petcare-backend/.env` — the three AI
  functions return `"Error: GEMINI_API_KEY is not set"` until it's filled in from
  [Google AI Studio](https://aistudio.google.com/apikey). Auth, local DB and the rest
  of the app work fine without it.
- Only the `pets` table exists in local Postgres so far (see migration note above);
  meals/health/reminders are SQLite-only, not yet synced.

**When moving to Supabase cloud:** provision a new project, `supabase db push` the
migration, `supabase secrets set GEMINI_API_KEY=... GEMINI_MODEL=...`, deploy the
three functions, then swap `PetCareProject/.env` back to the cloud URL + anon key.

---

## Setup on a new MacBook

### Prerequisites
- Node.js LTS + npm
- Expo CLI via `npx expo` (no global install needed)
- Xcode (iOS) / Android Studio (Android) for native builds; or Expo Go for quick runs
- Docker + Supabase CLI (`brew install supabase/tap/supabase`) for local backend dev

### 1. Clone
```bash
mkdir -p ~/Desktop/Senly && cd ~/Desktop/Senly
git clone https://github.com/trongkhan/PetCareProject.git
git clone https://github.com/trongkhan/petcare-backend.git
```

### 2. Frontend env (⚠️ NOT in git)
`.env` is gitignored, so it does **not** transfer via git — recreate it:
```bash
cd PetCareProject
cp .env.example .env
```
Then fill in real values — see **Local dev environment** above for local Supabase, or
use cloud project URL + anon key once one exists. The Supabase **anon key** is
public-by-design (protected by RLS). The **Gemini key is never in the frontend** — it
lives only in backend secrets.

### 3. Install & run frontend
```bash
cd PetCareProject
git checkout feat/localization-dark-mode
npm install
npx expo start        # then press i / a, or scan with Expo Go
```

### 4. Backend
```bash
cd petcare-backend
cp .env.example .env          # fill Gemini secret (gitignored); see note on SUPABASE_* above
supabase start                 # local Postgres + Auth + Edge Functions runtime
supabase functions serve --env-file .env
```
For cloud deploys: `supabase functions deploy ai-extract ai-chat ai-insight` and
`supabase db push`, with the Gemini key set as a **Supabase secret**, not committed.

---

## Tech stack (frontend)
Expo Router · React Native Paper (theming) · zustand (state) · zod (validation) ·
Supabase JS (auth + edge functions) · expo-sqlite (local data) · i18n (VI/EN) ·
dark/light mode · husky + lint-staged pre-commit.

**Screen convention**: every screen lives in `features/<area>/<Name>Screen/` with
`index.tsx` (View), `viewModel.ts` (state + actions, returns `{ selectors, handlers }`),
`styles.ts` (`useStyles` via `createStyles`), `types.ts` (UI callback action enum),
`uiCallback.ts` (callback handler stub). See `ARCHITECTURE.md` — note it still
describes an older flat-file convention (`FeedingScreen.tsx` /
`useFeedingViewModel.ts`) that was superseded by the folder shape before this
session; worth updating separately.

## Handy commands
```bash
npm run lint             # expo lint
npx tsc --noEmit          # typecheck
npx expo start             # dev server
git checkout feat/localization-dark-mode   # the active branch
```

## Next steps / open items
- **Push** the 2 local commits on `feat/localization-dark-mode`
  (`fix(android): add transparent splash image...`,
  `refactor(ui): align screens to MVVM folder format...`) — not pushed yet.
- Provision a new Supabase cloud project (the old ref is gone) and migrate off local
  dev once ready; extend the RLS migration beyond `pets` to `meals` /
  `health_records` / `reminders`.
- Set `GEMINI_API_KEY` locally to actually exercise Quick Log / Assistant end-to-end.
- Merge `feat/localization-dark-mode` → `main` once Quick Log is reviewed/tested.
- Build a dedicated sign-up screen (removed from AuthScreen this session; currently
  no way to create a new account from the UI — `authStore.signUp` still exists and
  works, just isn't wired to any screen).
- Update `ARCHITECTURE.md` to describe the current per-screen folder convention.
- Consider handling the `unknown` AI result more helpfully (currently just an error hint).
