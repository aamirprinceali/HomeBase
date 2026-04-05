# HomeBase — Session Handoff

**Date:** April 2026
**Handed off to:** Codex

---

## What was just completed
Built the **Finances section** — expense tracking for household members (mom's request).

### New files
- `src/screens/finances/FinancesScreen.js` — main finance screen
- `src/screens/finances/AddExpenseScreen.js` — add expense modal

### Modified files
- `src/context/AppContext.js` — added `expenses` state, Firestore subscription, `addExpense`, `deleteExpense`
- `src/navigation/AppNavigator.js` — added Finance tab to all tab layouts + AddExpense modal route

### GitHub
All changes committed and pushed to `main` (commit: 836498e).

---

## Where to pick up next

**Recommended next task:** Firebase Auth + Firestore end-to-end audit

1. Register a new user — verify `users/{uid}` doc is created in Firestore
2. Login → close app → reopen → confirm session persists
3. Run through household setup → confirm `householdId` saves to user profile
4. Test that tasks, shopping, and expenses actually save to Firestore (not just local state)

**After that:**
- Wire CalendarScreen to Firestore
- Add date picker to AddExpenseScreen (currently always saves today's date)
- Add Finance summary card to AdminDashboard

---

## Known issues / watch out for
- Node version: must use `nvm use 20` or Expo will throw errors
- `AppContext.js` line ~76 (`setLoadingData(false)`) is called before subscriptions fully resolve — this is a known quirk, don't move it
- The `getMyTasks()` helper in AppContext has a logic bug (line ~274, double condition) — don't rely on it, use direct filter instead
