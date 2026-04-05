# HomeBase — Project Plan

## Current Priority Order

### 0. Dashboard + visual QA (ACTIVE)
- Verify redesigned dashboard on real devices
- Check floating tab bar spacing on smaller phones
- Confirm all dashboard cards route to the correct screens
- Decide whether `SimpleDashboard` should get a full matching redesign or stay accessibility-first

### 1. Firebase wiring audit (HIGH)
Most screens exist but not all data persists to Firestore. Need to verify:
- Tasks ✅ wired
- Shopping ✅ wired
- Household Board ✅ wired
- Expenses ✅ wired
- Calendar ❌ needs wiring
- Settings ❌ needs wiring

### 2. Firebase Auth end-to-end test (HIGH)
- Register a new user → confirm Firestore `users/{uid}` doc is created
- Login → session persists on app close/reopen
- Household setup flow → `householdId` saved to user profile

### 3. Finances improvements (MEDIUM)
- Add date picker to AddExpenseScreen (currently defaults to today)
- Add edit expense capability
- Replace placeholder Upcoming Bills dashboard card with real bill data when supported
- Budget limit per category (optional stretch goal)

### 4. Calendar wiring (MEDIUM)
- Wire CalendarScreen to Firestore
- Add events, view by date

### 5. Push notifications (LOW)
- expo-notifications already installed
- Need to configure for task reminders / event alerts

### 6. Settings screen (LOW)
- Profile editing
- Notification preferences
- Household management (invite code, member roles)

### 7. Polish & testing (ONGOING)
- Test all screens for edge cases
- Fix any UI bugs found on real device
- Validate dashboard spacing/interactions on iPhone and Android after redesign
