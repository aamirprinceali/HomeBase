# HomeBase — Feature List

## ✅ Built & Working

### Auth
- Welcome/splash screen
- Register + Login screens
- Firebase Auth — session persists on reopen

### Navigation
- Bottom tab navigation (role-aware)
- Admin tabs: Home, Tasks, Household, Shopping, Calendar, Finances
- Simple tabs (Dad): Home, Tasks, Household, Finances
- Native stack for modals (AddTask, AddExpense, Settings)

### Dashboards (role-based routing)
- `AdminDashboard` — full household management view
- `MemberDashboard` — individual member view
- `SimpleDashboard` — minimal/simplified view

### Tasks
- Task list screen
- Add task modal
- Complete / uncomplete / delete tasks
- Firestore wired ✅

### Shopping List
- Add / check off / delete items
- Clear all checked at once
- Firestore wired ✅

### Household Board
- Post household-wide tasks
- Claim / unclaim / complete tasks
- Firestore wired ✅

### Calendar
- View household events by date
- Firestore wiring: partially done

### Finances (NEW — April 2026)
- `FinancesScreen` — main view with:
  - This Week + This Month totals (summary cards)
  - Category breakdown bars (filtered to current month)
  - Filter chips by category
  - Scrollable expense list (newest first)
  - Delete individual expenses
- `AddExpenseScreen` (modal) — large amount input, 8-category picker, optional note
- Each user only sees their own expenses (filtered by `createdBy` in UI)
- Firestore wired ✅ — stored under `households/{id}/expenses`

### Settings
- Settings screen built (not fully wired)

### Onboarding
- Household setup (create or join with invite code)

---

## ❌ Not Yet Done / Known Gaps
- [ ] Calendar — Firestore not fully wired (local state only)
- [ ] Push notifications (expo-notifications installed, not configured)
- [ ] Settings screen — most options not wired
- [ ] Expense editing (can add/delete, not edit)
- [ ] Expense date picker (currently defaults to today only)
- [ ] Budget limits / alerts per category
- [ ] Dashboard summary card for finances
- [ ] Firebase Auth end-to-end test (register → login → persist)
