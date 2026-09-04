# Senly — Progress & Machine Handoff

> Snapshot for continuing work on another MacBook.
> Last updated: **2026-09-04**

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

### petcare-backend — ✅ stable, pushed, **CI/CD green + cloud verified (2026-09-04)**
- Branch `main`, in sync with `origin/main`. Cloud project `ppuinennusunlqnttajj`
  ("Senly", ap-southeast-1) is Active. Note: Supabase **auto-pauses** the free-tier
  project when idle — if a deploy fails with `project is paused`, restore it from
  the dashboard first.
- Supabase Edge Functions: `ai-extract`, `ai-chat`, `ai-insight` (+ shared `gemini`,
  `cors`, `auth`). Gemini model pinned to `gemini-3.1-flash-lite`.
- **⚠️ Correction to earlier notes:** the CI/CD had **never actually succeeded**
  before 2026-09-04 (every run failed) and the cloud tables did **not** exist yet,
  despite prior claims here. Three bugs were found and fixed:
  1. Workflow referenced secret `SUPABASE_ACCESS_TOKEN`, but the repo secret is
     named `PETCARE_BE_CI` → "Access token not provided". Fixed to use the real name.
  2. `supabase db push` on GitHub runners hit "IPv6 is not supported" — needs the
     DB password to use the IPv4 pooler. Added secret `SUPABASE_DB_PASSWORD` and
     `db push -p "$SUPABASE_DB_PASSWORD"`.
  3. The project was paused; restored from the dashboard.
  The first green run deployed migrations `0001`–`0004` and all functions, and the
  cloud endpoints were verified live.
- **CI/CD**: `.github/workflows/deploy-supabase.yml` — push to `main` touching
  `supabase/migrations/**` or `supabase/functions/**` runs `db push` + deploys
  **all** functions (no hardcoded list). Secrets required: `PETCARE_BE_CI` (access
  token) + `SUPABASE_DB_PASSWORD`. Don't deploy from a personal machine — it
  bypasses review.
- DB schema on cloud (all deployed + RLS):
  - `0001` pets · `0002` meals/health_records/reminders · `0003` pets column backfill.
  - `0004_tags_and_scans.sql` — the tag tracking feature (see below). **First tables
    actually used by a shipped feature.** meals/health/pets are still 100% local
    SQLite — no sync engine exists; only tags live in the cloud.
- `_shared/auth.ts` imports `supabase-js` via `npm:`, not `jsr:` (jsr.io flaky on the
  dev network / 403 inside Docker, broke the local edge runtime boot).

### Tag tracking — 🆕 core "find a lost pet" feature (backend live, app MVP built)
Physical QR/NFC tag on the collar → a stranger who finds the pet opens a public web
page (no app, no login) and sends the owner a sighting.
- **Backend** (`0004` + `tag-public` / `tag-scan` functions, both `verify_jwt=false`):
  - `tags` (uuid + short printable `code` like `K7M2Q9`) + `tag_scans` (unified
    location log; `source` is `'scan'` now, `'gps'` in Phase 2 — same table, so the
    app map/history never changes when GPS is added).
  - **Pets live in local SQLite**, so the tag **snapshots** the pet's display fields
    (`pet_name`/`pet_species`/`pet_photo`) instead of a cloud FK — the finder page is
    self-contained, no pet-sync needed. `pet_id` is a plain local reference.
  - Public functions use the service role and expose only hand-picked fields; RLS +
    explicit table GRANTs (migrations create tables that otherwise lack API grants).
  - `tag-public?tag=<uuid or code>` renders the lost-pet HTML (case-insensitive,
    resolves either ref via `_shared/tags.ts`); `tag-scan` appends one sighting.
  - Local dev: `make dev` in petcare-backend, seed tag code **`DEMO01`**.
- **App MVP** (`feat/localization-dark-mode`): `services/TagService.ts` (talks to the
  cloud tags tables — the app's first cloud feature), `features/tag/TagScreen/` +
  `app/tag.tsx`, entry on Home ("Theo dõi"). Create tag → shows code + URL to write
  on the tag, "đang lạc" toggle, contact phone/reward, scan list with "open in Maps".
  **No NFC/Maps native deps yet** — lean MVP; NFC write + real map are the next step.
- **Physical tags**: blank **NTAG215** (~12k on Shopee) for dev; custom printed
  QR+NFC tags with instructions for real use (a finder must see "quét mã để báo chủ",
  so the tag needs a QR + printed short code, not just an invisible NFC chip).

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
- App font switched **Baloo 2 → Nunito** (`@expo-google-fonts/nunito`,
  `constants/theme.ts`'s `Fonts`). Baloo 2 was applied to every typescale variant
  including body/label, not just headings, then turned out to have unpredictable
  line-height/ascent metrics in React Native — glyphs sat visibly off-center in a
  row centered via `alignItems: 'center'` (worst in the Home header's pet-name
  trigger), and a `marginTop` hand-nudge wasn't an acceptable fix. Swapped the
  whole family rather than patch around it; the `marginTop` hack is gone from
  `PetHeaderTrigger.tsx`. Along the way, audited every Paper `<Text>` missing a
  `variant` prop (that case silently skips theme fonts and falls back to system
  font) and fixed each one across the app — still applies with Nunito.
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
cd petcare-backend && make dev              # Supabase stack + Edge Functions (one cmd)

cd ../PetCareProject
yarn install                                # ⚠️ YARN project — never `npm install`
yarn expo start --clear                     # Metro; --clear picks up new env values
```

**Env files (frontend)** — Expo picks one by mode automatically, no manual switching:
- `.env.development` (committed) → **LOCAL** Supabase; loaded by `yarn expo start`.
- `.env.production` (committed) → **CLOUD** Supabase; loaded by production builds.
- `.env.development.local` (gitignored) → per-machine override; **highest priority**.
- Both committed files carry only the public anon key (safe — RLS protects data).
- `127.0.0.1` in `.env.development` only reaches the Mac from the **iOS Simulator**.
  For a physical device / Android emulator, or to dev against cloud, create
  `.env.development.local` — see `.env.example` for the exact values.

**Gotchas**
- **Yarn project** (only `yarn.lock` is tracked). Running `npm install` creates a
  stray `package-lock.json` and can rewrite `yarn.lock` — if that happens, delete
  `package-lock.json`, `git checkout yarn.lock`, then `yarn install --ignore-engines`
  (needed because `@supabase/supabase-js` declares node ≥22 and this machine is 20;
  harmless for RN/Metro).
- **After ANY node_modules reinstall, re-run `pod install`.** Native pods generate
  files at build time (e.g. `expo-sqlite`'s podspec `prepare_command` copies a 9 MB
  `sqlite3.c` into `node_modules/expo-sqlite/ios/`). Reinstalling node_modules wipes
  that copy; if pods aren't reinstalled, the iOS build fails with
  `Build input file cannot be found: .../sqlite3.c` and a wall of
  `cannot find 'exsqlite3_*' in scope`. Fix: `npx pod-install`. If it still fails
  after that, the Xcode build cache is stale — `rm -rf ios/build` and clear
  DerivedData, or regenerate native: `rm -rf ios && npx expo prebuild --clean -p ios
  && npx pod-install`. (`ios/` is gitignored/CNG-generated, so deleting it is safe.)
- `petcare-backend/.env` (gitignored) must **not** define `SUPABASE_URL` /
  `SUPABASE_ANON_KEY` — the edge runtime injects those; the CLI skips `SUPABASE_*`.
- `GEMINI_API_KEY` is set in `petcare-backend/.env` — Quick Log / Assistant work E2E.

**Next DevOps step (deferred):** for a safe staging environment, add a separate
Supabase project + a `staging` branch/pipeline. Not done yet — only one (prod)
project exists; premature until prod has real users.

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
