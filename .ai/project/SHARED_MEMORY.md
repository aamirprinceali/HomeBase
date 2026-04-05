# HomeBase — Shared Memory (Claude + Codex)

## Critical dev rules
- **Always run `nvm use 20` before `npx expo start`** — Node 20 required
- All secrets in `.env` — never hardcode Firebase config
- Dark theme only — all new screens must import from `src/theme/index.js`
- Follow existing patterns: AppContext for data, Firestore subcollections under `households/{householdId}/`

## Where things live
| What | File |
|---|---|
| All data + CRUD | `src/context/AppContext.js` |
| Auth + user profile | `src/context/AuthContext.js` |
| All routes | `src/navigation/AppNavigator.js` |
| Theme (colors, fonts, spacing) | `src/theme/index.js` |
| Firebase init | `src/config/firebase.js` |
| Expense categories | `src/screens/finances/FinancesScreen.js` → `EXPENSE_CATEGORIES` (exported) |

## Firestore collections
```
households/{householdId}/
  tasks/           — personal/assigned tasks
  householdTasks/  — board tasks (claimable)
  shoppingItems/   — shared shopping list
  expenses/        — personal expenses (filter by createdBy in UI)
users/{uid}/       — user profiles
```

## User roles
- `admin` — full tabs, household management
- `member` — full tabs, no admin controls
- `simple` — stripped tabs (Home, Tasks, Household, Finances only)

## Last session (April 2026)
Built the full **Finances** section:
- `src/screens/finances/FinancesScreen.js` — main view
- `src/screens/finances/AddExpenseScreen.js` — add modal
- AppContext updated: `expenses` state, Firestore sub, `addExpense`, `deleteExpense`
- AppNavigator updated: Finance tab on all tab views, AddExpense modal route
- Committed and pushed to GitHub (commit: 836498e)
