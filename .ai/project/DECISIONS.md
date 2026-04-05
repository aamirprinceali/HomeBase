# HomeBase — Architecture Decisions

## Expenses stored under household, filtered by user in UI
**Decision:** `expenses` live at `households/{householdId}/expenses` with a `createdBy` field.
**Why:** Consistent with all other data (tasks, shopping, etc.) — one Firestore subscription handles it. The UI filters by `createdBy === userProfile.id` so each person only sees their own expenses. Future: could allow "shared expense" feature without changing the data model.

## Role-based tab navigation
**Decision:** Admin/member users get full tabs; "simple" role gets a stripped-down set.
**Why:** Dad (simple role) wanted a minimal interface. This is handled in `HomeTabs()` in AppNavigator.

## Dark theme throughout
**Decision:** All screens use the dark theme from `src/theme/index.js`.
**Why:** Original design decision — consistent look, `Colors.background = '#0A0A14'`.

## No local state fallback for expenses
**Decision:** Expenses go straight to Firestore — no offline/local state fallback.
**Why:** Consistent with how tasks and shopping were eventually wired. Firestore's onSnapshot handles real-time updates.

## Expense categories are fixed (8 categories)
**Decision:** Food, Bills, Medical, Personal, Transport, Shopping, Fun, Other — defined in `FinancesScreen.js` as `EXPENSE_CATEGORIES` and exported for use in `AddExpenseScreen`.
**Why:** Simple enough for mom to use without setup. Can always extend later.
