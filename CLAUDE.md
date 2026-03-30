# HomeBase App — Project Context

## What This Is
A React Native + Expo family command center app. Lets families manage tasks, schedules, shopping lists, and household members in one place.

## Tech Stack
- React Native + Expo (SDK 52)
- Firebase (Auth + Firestore) — project: homebase-bf641
- React Navigation (bottom tabs + native stack)
- Node 20 required (use `nvm use 20` before starting)

## GitHub
https://github.com/aamirprinceali/HomeBase

## How to Run
```bash
nvm use 20
npx expo start
```
Then scan QR code with Expo Go app on your phone.

## Current Status (as of March 2026)
- Firebase set up and connected
- Auth screens built (Welcome, Login, Register)
- Navigation structure in place
- Dashboard screens (Admin, Member, Simple)
- Core screens: Tasks, Calendar, Shopping List, Settings, Household Board
- Onboarding/Household Setup screen

## What Still Needs Work
- [ ] Fix QR code / Expo Go version issue (needed Node 20 — fixed via nvm)
- [ ] Test Firebase auth flow end-to-end (register, login, persist session)
- [ ] Wire up Firestore — tasks/events not saving to DB yet, only local state
- [ ] Test all screens for bugs
- [ ] Push notifications (expo-notifications already installed)
- [ ] Polish UI/UX

## Future Ideas
- Sober living house manager spin-off (same core, residents instead of family)

## Project Structure
```
src/
  config/      — Firebase setup
  context/     — AppContext, AuthContext (global state)
  navigation/  — AppNavigator
  screens/     — All screens organized by feature
  components/  — Reusable UI pieces
  theme/       — Colors, fonts, spacing
```
