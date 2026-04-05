# HomeBase — App Overview

## What it is
A React Native + Expo family command center app. Built for Aamir's family to manage tasks, schedules, shopping, household members, and now personal finances in one place.

## Who it's for
Aamir's family — multiple household members each with their own role (admin, member, simple).

## Stack
- **Framework:** React Native + Expo SDK 52
- **Auth + DB:** Firebase Auth + Firestore (project: homebase-bf641)
- **Navigation:** React Navigation (bottom tabs + native stack)
- **Icons:** MaterialCommunityIcons (from @expo/vector-icons)
- **UI:** Custom dark theme — see `src/theme/index.js`
- **Node version:** Must use Node 20 via `nvm use 20`

## How to run
```bash
nvm use 20
cd ~/Desktop/dev/homebase
npx expo start
```
Scan QR code with Expo Go on phone.

## GitHub
https://github.com/aamirprinceali/HomeBase

## Project structure
```
src/
  config/      — Firebase setup (firebase.js)
  context/     — AppContext.js (data/CRUD), AuthContext.js (user/auth)
  navigation/  — AppNavigator.js (all routes)
  screens/     — Organized by feature (auth, dashboard, tasks, finances, etc.)
  components/  — Reusable UI pieces (EmergencyButton, etc.)
  theme/       — Colors, Typography, Spacing, Radius, Shadows (index.js)
```

## Data model (Firestore)
All data lives under `households/{householdId}/` subcollections:
- `tasks` — personal/assigned tasks
- `householdTasks` — household board tasks (claimable)
- `shoppingItems` — shared shopping list
- `expenses` — personal expenses (filtered by createdBy in UI)

User profiles live at `users/{uid}`.
