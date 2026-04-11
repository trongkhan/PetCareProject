# "Thú Cưng" - Pet Care Companion App

## Overview
A Vietnamese-focused pet care app for tracking pet health, feeding schedules, and reminders.

---

## Why This Works in Vietnam

| Trend | Opportunity |
|-------|-------------|
| Pet ownership rising fast | HCMC & Hanoi seeing huge growth in dogs/cats |
| Young owners | Millennials/Gen Z treat pets like family |
| Lack of knowledge | First-time owners don't know proper care |
| Expensive vet visits | Prevention & tracking saves money |
| No good Vietnamese app | Existing apps are English, not localized |

---

## Target Users

1. **First-time pet owners** - Need guidance on everything
2. **Busy professionals** - Forget feeding times, vet appointments
3. **Pet parents with multiple pets** - Track each pet separately
4. **Elderly with pets** - Simple reminders for medication, feeding

---

## Core Features

```
App Structure

├── My Pets (Pet Profiles)
│   ├── Photo & basic info
│   ├── Species, breed, age, weight
│   ├── Personality traits
│   └── Medical conditions / allergies
│
├── Feeding Tracker
│   ├── Daily meal schedule
│   ├── Food type & amount
│   ├── Treats log
│   ├── Water reminder
│   └── Weight tracking over time
│
├── Health Records
│   ├── Vaccination history
│   ├── Vet visit logs
│   ├── Medications (current & past)
│   ├── Allergies & conditions
│   ├── Deworming schedule
│   └── Spay/neuter status
│
├── Reminders
│   ├── Feeding times
│   ├── Medication doses
│   ├── Vaccination due dates
│   ├── Vet appointments
│   ├── Grooming schedule
│   ├── Deworming (every 3 months)
│   └── Flea/tick prevention
│
├── Health Insights
│   ├── Weight trend chart
│   ├── Feeding patterns
│   ├── Upcoming care tasks
│   └── Age milestones
│
└── Settings
    ├── Notification preferences
    ├── Multiple pet support
    └── Data backup
```

---

## Detailed Feature Breakdown

### 1. Pet Profiles
```
Fields:
- Name, photo
- Species: Dog / Cat / Bird / Hamster / Fish / Rabbit / Other
- Breed (searchable database)
- Birthday / Adopted date
- Gender
- Weight (track history)
- Microchip number
- Special notes
```

### 2. Feeding Tracker

| Feature | Details |
|---------|---------|
| Meal schedule | Breakfast, lunch, dinner + snacks |
| Food types | Dry food, wet food, raw, homemade |
| Portion tracking | Grams or cups |
| Brand logging | Track what food brand works best |
| Treats counter | "Max 3 treats/day" awareness |
| Water reminder | Especially important for cats |
| Food allergies | Flag unsafe foods |

**Vietnamese-specific:**
- Common local foods pets eat (cơm, thịt, etc.)
- Dangerous foods warning (chocolate, xương gà, nho...)

### 3. Health Records

| Record Type | Fields |
|-------------|--------|
| Vaccinations | Type, date, next due, vet, batch number |
| Vet visits | Date, reason, diagnosis, treatment, cost |
| Medications | Name, dosage, frequency, duration, reminders |
| Lab results | Photos of results, date |
| Weight history | Track growth / diet progress |

**Key vaccinations to track:**
- Dogs: 5-in-1, 7-in-1, rabies, kennel cough
- Cats: 3-in-1, 4-in-1, rabies

### 4. Smart Reminders

```
Reminder Types:
├── Daily
│   ├── Feeding times (morning, evening)
│   ├── Medication doses
│   └── Water check
│
├── Weekly
│   ├── Grooming / brushing
│   ├── Nail check
│   └── Ear cleaning
│
├── Monthly
│   ├── Flea/tick prevention
│   ├── Weight check
│   └── Dental check
│
├── Quarterly
│   └── Deworming
│
└── Yearly
    ├── Vaccination boosters
    └── Annual vet checkup
```

---

## Unique Vietnamese Features

| Feature | Why It Matters |
|---------|----------------|
| Vietnamese breed database | Phú Quốc dog, local cat breeds |
| Local vet finder | Integration or manual save |
| Vietnamese food warnings | What local foods are dangerous |
| Weather alerts | "Hot day - ensure water available" |
| Lunar calendar | Some owners follow lunar dates for care |
| Cost tracking in VND | Track pet expenses |
| Vietnamese notifications | Natural language, not translated |

---

## Screen Flow

```
Home
├── Pet selector (if multiple pets)
├── Today's tasks (feeding, meds)
├── Quick actions (log meal, log weight)
└── Upcoming reminders

Pet Profile
├── Photo & info
├── Edit details
└── Share profile (QR code for vet)

Feeding
├── Today's meals (check off)
├── Meal schedule setup
├── Food history
└── Weight chart

Health
├── Vaccination card
├── Vet visits history
├── Medications
└── Add new record

Reminders
├── All upcoming
├── Add custom reminder
└── Completed history

Settings
├── Manage pets
├── Notifications
├── Backup/restore
└── Language
```

---

## Technical Stack

```
Frontend:
- Expo (React Native)
- expo-notifications (reminders)
- expo-image-picker (pet photos)
- AsyncStorage or expo-sqlite (local data)
- react-native-chart-kit (weight charts)

Optional APIs:
- Weather API (hot day alerts)
- Pet breed API (or local database)

Storage:
- Local-first (works offline)
- Optional cloud backup (Firebase/Supabase)
```

---

## Data Models

```typescript
// Pet
{
  id: string
  name: string
  photo: string
  species: 'dog' | 'cat' | 'bird' | 'hamster' | 'fish' | 'rabbit' | 'other'
  breed: string
  birthday: Date
  gender: 'male' | 'female'
  weight: number // kg
  microchip?: string
  allergies: string[]
  notes: string
  createdAt: Date
}

// Meal Log
{
  id: string
  petId: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'treat'
  food: string
  amount: number
  unit: 'grams' | 'cups'
  timestamp: Date
}

// Health Record
{
  id: string
  petId: string
  type: 'vaccination' | 'vet_visit' | 'medication' | 'weight' | 'other'
  title: string
  date: Date
  nextDue?: Date
  notes: string
  cost?: number
  attachments: string[] // photo URLs
}

// Reminder
{
  id: string
  petId: string
  type: 'feeding' | 'medication' | 'vaccination' | 'grooming' | 'vet' | 'custom'
  title: string
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  time: string // HH:mm
  enabled: boolean
}
```

---

## MVP Scope (v1.0)

**Include:**
- [ ] Single pet profile
- [ ] Basic feeding tracker with reminders
- [ ] Vaccination records
- [ ] Vet visit logs
- [ ] Weight tracking with chart
- [ ] Daily/weekly reminders
- [ ] Local storage

**Exclude (v2+):**
- [ ] Multiple pets
- [ ] Cloud backup
- [ ] Vet finder
- [ ] Community features
- [ ] Pet expense tracking
- [ ] Photo gallery

---

## Monetization Ideas

| Model | Details |
|-------|---------|
| Freemium | Free for 1 pet, pay for multiple |
| Premium features | Cloud backup, advanced insights, widgets |
| Vet partnerships | Referral fees for vet bookings |
| Pet shop ads | Non-intrusive, relevant products |
| Premium themes | Cute UI customizations |

---

## Competition Analysis

| App | Weakness | Your Advantage |
|-----|----------|----------------|
| 11Pets | English only, complex | Vietnamese, simple |
| Pet Pro | Too many features | Focused, easy to use |
| Generic apps | Not localized | Vietnamese context |

---

## Why This Idea Works

1. **Emotional connection** - People love their pets, will use daily
2. **Clear value** - Never miss vaccinations, track health
3. **Repeat engagement** - Daily feeding logs, reminders
4. **Viral potential** - Share pet profiles, recommend to pet owner friends
5. **Monetization clear** - Freemium works well
6. **Growing market** - Pet industry booming in Vietnam
7. **All ages** - Young and old pet owners
