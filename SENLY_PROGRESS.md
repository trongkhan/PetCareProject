# Senly — Progress & Machine Handoff

> Snapshot for continuing work on another MacBook.
> Last updated: **2026-08-23**

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
- Gemini model pinned to `gemini-3.1-flash-lite` (confirmed working end-to-end).
- RLS migration: `supabase/migrations/0001_example_rls.sql`.

### PetCareProject — 🟢 active branch `feat/localization-dark-mode`
All work below is committed and pushed on the `feat/localization-dark-mode` branch.

**Feature A — AI "Quick Log"** (main new feature)
Type a plain-language note on Home (e.g. *"Bim had 1 cup of kibble this morning"*),
AI parses it, and you land in a **pre-filled** Add dialog.
- `features/home/HomeScreen/components/QuickLogCard.tsx` — Home input; calls `AIService.extract`, routes to Feeding or Health.
- `services/aiSchemas.ts` — **zod** validation of AI output; invalid → safe `kind: 'unknown'`.
- `store/quickLogStore.ts` — zustand store handing the parsed result to the target screen.
- Feeding / Health screens + Add dialogs — accept an `initial` prefill prop and open pre-filled.
- `locales/en.json` / `vi.json` — added bilingual `quicklog` strings.
- `services/AIService.ts` — now returns zod-validated `ExtractResult`.

**Feature B — Branding / splash**
- App renamed `TestProject` → **Senly** (`app.json`).
- `components/AppSplash.tsx` + animated splash in `app/_layout.tsx` (native cream splash → fade-in `SENLY.png` → fade-out, no white flash).
- Removed leftover default Expo starter images.

---

## Setup on a new MacBook

### Prerequisites
- Node.js LTS + npm
- Expo CLI via `npx expo` (no global install needed)
- Xcode (iOS) / Android Studio (Android) for native builds; or Expo Go for quick runs
- Supabase CLI (only if deploying/editing backend functions)

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
# then fill in the real value:
#   EXPO_PUBLIC_SUPABASE_URL=https://ppuinennusunlqnttajj.supabase.co   (already in example)
#   EXPO_PUBLIC_SUPABASE_ANON_KEY=<real anon key from Supabase dashboard>
```
The Supabase **anon key** is public-by-design (protected by RLS). The **Gemini key is
never in the frontend** — it lives only in backend secrets.

### 3. Install & run frontend
```bash
cd PetCareProject
git checkout feat/localization-dark-mode
npm install
npx expo start        # then press i / a, or scan with Expo Go
```

### 4. Backend (only if editing/deploying functions)
```bash
cd petcare-backend
cp .env.example .env          # fill Supabase + Gemini secrets (also gitignored)
# Deploy functions with the Supabase CLI, e.g.:
#   supabase functions deploy ai-extract
```
The Gemini API key must be set as a **Supabase secret**, not committed.

---

## Tech stack (frontend)
Expo Router · React Native Paper (theming) · zustand (state) · zod (validation) ·
Supabase JS (auth + edge functions) · expo-sqlite (local data) · i18n (VI/EN) ·
dark/light mode · husky + lint-staged pre-commit.

## Handy commands
```bash
npm run lint            # expo lint
npx expo start          # dev server
git checkout feat/localization-dark-mode   # the active branch
```

## Next steps / open items
- Merge `feat/localization-dark-mode` → `main` once Quick Log is reviewed/tested.
- Quick Log has not yet been exercised against real device input at scale — worth a QA pass.
- Consider handling the `unknown` AI result more helpfully (currently just an error hint).
