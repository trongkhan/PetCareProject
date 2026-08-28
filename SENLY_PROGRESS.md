# Senly — Progress & Machine Handoff

> Snapshot for continuing work on another MacBook.
> Last updated: **2026-08-28**

Senly is a pet-care mobile app (React Native / Expo) with a Supabase + Gemini AI
backend. The project lives in a `Senly/` folder containing **two git repos**.

## Repos

| Repo | Path | GitHub | Role |
|------|------|--------|------|
| **PetCareProject** | `Senly/PetCareProject` | `github.com/trongkhan/PetCareProject` | Expo app (frontend) |
| **petcare-backend** | `Senly/petcare-backend` | `github.com/trongkhan/petcare-backend` | Supabase Edge Functions + DB schema |

Clone both side by side into a `Senly/` folder on the new machine.

---

## Current status

### petcare-backend — ✅ stable, pushed, cloud project live
- Branch `main`, in sync with `origin/main`.
- Cloud project **`ppuinennusunlqnttajj` ("Senly", region ap-southeast-1) is alive**
  — an earlier note in this doc claiming it was deleted was wrong (DNS/health-check
  came back live; only the anon key needed refreshing).
- Supabase Edge Functions: `ai-extract`, `ai-chat`, `ai-insight` (+ shared `gemini`,
  `cors`, `auth`). Gemini model pinned to `gemini-3.1-flash-lite`.
- DB schema — **all four app tables now exist on the cloud project with RLS**:
  - `0001_example_rls.sql` — `pets`
  - `0002_meals_health_reminders_rls.sql` — `meals` / `health_records` / `reminders`,
    each mirroring the local SQLite schema (`models/db/client.ts`); RLS on these
    joins up to the owning pet (`auth.uid() = pets.user_id`) rather than trusting a
    second denormalized `user_id` on the child row.
  - `0003_pets_missing_columns.sql` — backfills `adopted_date` / `microchip` /
    `allergies` onto `pets`, present in local SQLite since the start but missing
    from `0001`.
  - ⚠️ Schema only — **no sync code exists yet**. The app is still 100% local
    SQLite; nothing reads or writes these cloud tables. This was prep, not a
    working sync feature.
- **CI/CD**: `.github/workflows/deploy-supabase.yml` — pushing to `main` with
  changes under `supabase/migrations/**` or `supabase/functions/**` runs
  `supabase db push` + `supabase functions deploy` automatically. Needs the repo
  secret `SUPABASE_ACCESS_TOKEN` (added). Nobody should run `supabase db push` /
  `supabase functions deploy` against the cloud project from a personal machine
  anymore — that bypasses review. First real run was triggered via a comment-only
  commit; **check the Actions tab if you haven't confirmed it went green.**
- `_shared/auth.ts` imports `supabase-js` via `npm:`, not `jsr:` — `jsr.io` is
  unreliable on the dev network (intermittent 403 from the host, consistent 403 from
  inside Docker), which broke the local edge runtime boot. `npm:` sidesteps it.

### PetCareProject — 🟢 active branch `feat/localization-dark-mode`, pushed
Everything below is on `origin/feat/localization-dark-mode` (last commit `27f8f1e`).

**Feature A — AI "Quick Log"**
Type a plain-language note on Home, AI parses it, lands in a **pre-filled** Add
dialog. `QuickLogCard.tsx` → `AIService.extract` → `services/aiSchemas.ts` (zod,
invalid → safe `kind: 'unknown'`) → `store/quickLogStore.ts` → Feeding/Health screens
open pre-filled. `GEMINI_API_KEY` **is now set** in `petcare-backend/.env`, so this
is exercisable end-to-end locally (point the app at local or cloud Supabase — see
**Local dev environment**).

**Feature B — Theming**
- Primary accent changed **teal → green** ("Grass", `#16A34A` / `#DCFCE7`),
  `constants/petThemes.ts`.
- The **per-pet color picker feature is gone entirely** — it used to let each pet
  pick one of 5 preset accents; now there's one fixed app-wide theme.
  `PetThemePicker.tsx` deleted, `petTheme` dropped from `Pet`/`CreatePetInput` and
  from `PetRepository`'s SQL (the `pet_theme` SQLite column stays, unused, rather
  than a risky `DROP COLUMN`), `activePetStore` no longer tracks a theme.
- Baloo 2 (Regular 400 / Medium 500 added, on top of the existing 600/700/800) is
  now the font for **every** typescale variant including body/label, not just
  headings — `constants/petThemes.ts`'s `APP_FONTS`. Audited every Paper `<Text>`
  missing a `variant` prop (that case silently skips theme fonts and falls back to
  system font) and fixed each one across the app.
- `onSurfaceVariant` (light theme) darkened slightly — most body/secondary text is
  explicitly colored with this token, and it read too thin at the old value.

**Feature C — Home redesign**
- Pet identity (avatar + name) moved from a body card into the **header**, replacing
  the static "Senly" title — `PetHeaderTrigger.tsx`, tappable, opens
  `PetPickerSheet.tsx` (a real bottom sheet, animated open/close) to switch the
  active pet or create a new one. Replaces the old inline `PetSwitcher` row and the
  `PetHeaderCard` gradient block (both deleted).
- `BaseScreen` gained `bottomBarClearance` (reserves room above the floating tab bar
  — every screen used to hand-roll `FabClearance`/`TabBarClearance` itself) and
  `ownPortalHost` (opt-in; only `CreatePetScreen`/`EditPetScreen` need it — see bug
  notes below).

**Feature D — Services/architecture cleanup**
- `services/AuthService.ts` (new) wraps every `supabase.auth.*` call;
  `store/authStore.ts` goes back to holding state only, matching
  `ARCHITECTURE.md`'s "services = side-effects, store = state" split — it no longer
  imports the Supabase client directly.
- Every screen's `viewModel.ts` / `uiCallback.ts` / `types.ts` / `styles.ts` renamed
  to `<screenName>.viewModel.ts` etc. (e.g. `HomeScreen/viewModel.ts` →
  `HomeScreen/home.viewModel.ts`) across all 11 screens — quick-open search by
  basename used to return a dozen identically-named files with no way to tell them
  apart without reading the full path.
- Code-style pass: pulled non-per-item inline arrow handlers out into named
  `useCallback`/`function` handlers; multi-property inline `style={{...}}` objects
  moved into each screen's `StyleSheet`/theme style factory (single theme-color
  merges via `style={[styles.x, {color: theme.colors.y}]}` were left alone — that's
  the accepted pattern here, not something to eliminate).

**Bug fixes (this session, iOS)**
- **Splash flash**: the in-app splash overlay started at `opacity: 0` (fading IN),
  betting that the *native* splash was still covering the screen for that whole
  fade — the moment it wasn't, Home flashed through. Now starts fully opaque; only
  the hand-off OUT at the end fades.
- **Bottom clearance under the floating tab bar**: `TabBarClearance`/`FabClearance`
  are fixed constants that never included the device's home-indicator inset, but
  `FloatingTabBar` positions itself with `insets.bottom` baked in — so on a notched
  iPhone, content (e.g. the Assistant input row) sat under where the tab bar
  actually renders. `BaseScreen` now adds `insets.bottom` to the reserved clearance
  for screens whose `SafeAreaView` doesn't already cover the bottom edge (every tab
  screen — Home/Assistant/Account use `edges={['top']}`).
- **DatePickerField's bottom sheet invisible on Create/Edit Pet**: those screens are
  presented as a native modal (`presentation: 'modal'`); the app-level `Portal.Host`
  (from `PaperProvider`, mounted once near the root) sits *behind* that modal's own
  native surface, so a `<Portal>` opened from inside mounted but rendered invisibly.
  Fixed via `BaseScreen`'s new opt-in `ownPortalHost` prop, set only on those two
  screens. (First attempt made it unconditional for every screen, which broke
  Home's `PetPickerSheet` — it got a host scoped *under* the floating tab bar
  instead of the root one it needs. Reverted to opt-in.)
- **`ScreenHeader` flush against the status bar** on `CreatePetScreen`/
  `EditPetScreen`: they forced `statusBarHeight={0}`, assuming modal presentation
  always auto-insets — true on iOS, not on Android. Removed; `Appbar.Header` now
  falls back to its own `useSafeAreaInsets()` on both screens, matching the other
  five screens using `ScreenHeader` that never had the override.
- ⚠️ **Not yet re-verified on a real device** since the latest fixes — the safe-area
  and bottom-sheet changes were pushed but the user hadn't confirmed a rebuild
  looked right as of this doc's last update.

---

## Local dev environment

```bash
cd petcare-backend
supabase start                              # Postgres + Auth + Storage + Studio
supabase functions serve --env-file .env    # Edge Functions

cd ../PetCareProject
npx expo start --clear                      # Metro; --clear picks up new .env values
```

- `PetCareProject/.env` (gitignored, recreate manually) currently points
  `EXPO_PUBLIC_SUPABASE_URL` at **`http://localhost:54321`** — by explicit choice,
  this only works from the **iOS simulator or web** (shares the host's network). A
  physical device or Android emulator can't reach `localhost` on itself; swap to the
  host's LAN IP (`http://10.x.x.x:54321`) or, Android-emulator-only,
  `http://10.0.2.2:54321` if you need those.
- `petcare-backend/.env` (gitignored) must **not** define `SUPABASE_URL` /
  `SUPABASE_ANON_KEY` — the edge runtime injects those itself; the CLI silently skips
  any var starting with `SUPABASE_`.
- `GEMINI_API_KEY` **is set** in `petcare-backend/.env` — Quick Log / Assistant work
  end-to-end now, no more "GEMINI_API_KEY is not set" errors.
- The cloud project's real anon key (for pointing `.env` at cloud instead of local)
  is in `petcare-backend`'s operator notes / whoever set up CI — `.env.example`'s
  anon key is still a placeholder, deliberately not filled in there.

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
the cloud project URL + anon key. The Supabase **anon key** is public-by-design
(protected by RLS). The **Gemini key is never in the frontend** — it lives only in
backend secrets.

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
For cloud deploys: push to `main` (see CI/CD above) — don't run `supabase db push` /
`supabase functions deploy` by hand against the cloud project anymore.

---

## Tech stack (frontend)
Expo Router · React Native Paper (theming) · zustand (state) · zod (validation) ·
Supabase JS (auth + edge functions) · expo-sqlite (local data) · i18n (VI/EN) ·
dark/light mode · react-native-reanimated (animations) · husky + lint-staged
pre-commit.

**Screen convention**: every screen lives in `features/<area>/<Name>Screen/` with
`index.tsx` (View), `<name>.viewModel.ts` (state + actions, returns
`{ selectors, handlers }`), `<name>.styles.ts` (`useStyles` via `createStyles`),
`<name>.types.ts` (UI callback action enum), `<name>.uiCallback.ts` (callback
handler stub) — `<name>` is the screen name without its `Screen` suffix, lowercase
first letter (e.g. `HomeScreen/home.viewModel.ts`,
`CreatePetScreen/createPet.viewModel.ts`). See `ARCHITECTURE.md` — its `services/`
listing is current, but the top-level folder tree still shows an older flat-file
convention (`FeedingScreen.tsx` / `useFeedingViewModel.ts`) that predates even the
un-prefixed folder shape; still worth a pass.

## Handy commands
```bash
npm run lint             # expo lint
npx tsc --noEmit          # typecheck
npx expo start             # dev server
git checkout feat/localization-dark-mode   # the active branch
```

## Next steps / open items
- **Verify the iOS fixes on a real rebuild** — safe-area/bottom-sheet/animation
  changes above were pushed but not yet re-confirmed working end to end.
- **Confirm the first `deploy-supabase` Actions run went green** (Actions tab on
  `petcare-backend`) — triggered but not confirmed as of this doc's update.
- Write the actual SQLite ↔ Supabase **sync logic** — the cloud schema exists
  (pets/meals/health_records/reminders, all RLS'd) but nothing reads or writes it
  yet; the app is still 100% local-only.
- Build a dedicated sign-up screen — explicitly on hold per direct instruction, do
  **not** start this without being asked again. `authStore.signUp` /
  `AuthService.signUp` still exist and work, just aren't wired to any screen.
- Update `ARCHITECTURE.md`'s folder-tree diagram to match the current per-screen
  file convention (the `services/` section is already current).
- Consider handling the `unknown` AI result more helpfully (currently just an error
  hint, `quicklog.unknown`).
- Merge `feat/localization-dark-mode` → `main` once reviewed/tested.
