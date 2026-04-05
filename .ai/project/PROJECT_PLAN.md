# HomeBase — Project Plan

## Current Priority Order

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
- Add a Finance summary card to AdminDashboard and MemberDashboard
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
