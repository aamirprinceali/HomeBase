# HomeBase — Shared Memory (Claude + Codex)

## Critical dev rules
- **Always run `nvm use 20` before `npx expo start`** — Node 20 required
- All secrets in `.env` — never hardcode Firebase config
- Current design direction is soft light mode with calm blue/lavender accents — all new screens should import from `src/theme/index.js`
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
Dashboard and visual refresh:
- `AdminDashboard` redesigned around a soft light card layout inspired by the supplied reference image
- `MemberDashboard` aligned to the same visual layout
- Bottom tab bar refreshed to a floating light-card style
- Theme moved away from dark/purple-heavy styling to a calmer light palette
- Upcoming Bills card is placeholder-only for now and routes to `Finances`
- Verified by running `npx expo export --platform web`
