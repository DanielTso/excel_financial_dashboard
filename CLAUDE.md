# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tso Finance** is a personal financial dashboard built with Next.js 16, inspired by Quicken Deluxe and Excel. It features a warm, paper-like "Ledger" design system with data-dense, spreadsheet-style UI.

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Database**: SQLite (Prisma ORM) — note: GEMINI.md mentions PostgreSQL for Railway deployment
- **Auth**: NextAuth v5 (Credentials provider, email/password)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **State**: Zustand

## Common Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Testing
npm run test              # Run unit tests
npm run test:coverage     # Run tests with coverage
npm run test:e2e          # Run E2E tests with Playwright

# Database commands (Prisma)
npx prisma generate       # Generate Prisma client after schema changes
npx prisma db push        # Push schema changes to database
npx prisma migrate dev    # Create migration
npx prisma studio         # Open Prisma Studio (database GUI)
npx ts-node prisma/seed.ts           # Run seed script
npx ts-node prisma/migrate-passwords.ts  # Migrate plaintext passwords to bcrypt
```

## Architecture

### App Router Structure

The app uses Next.js App Router with server components by default:

```
src/app/
├── layout.tsx          # Root layout with Sidebar + Header, AuthProvider
├── page.tsx            # Dashboard (server component, fetches from Prisma)
├── accounts/           # Account management pages
├── transactions/       # Transaction list with TanStack Table
├── budget/            # Budget tracking
├── net-worth/         # Net worth reports
├── reports/           # Financial reports
├── login/             # Auth page
└── api/auth/[...nextauth]/route.ts  # NextAuth API route
```

### Component Organization

```
src/components/
├── ui/                 # shadcn/ui primitives (button, card, dialog, etc.)
├── dashboard/          # KPI cards, charts (IncomeExpenseChart, SpendingDonutChart, etc.)
├── layout/             # Sidebar, Header
├── providers/          # AuthProvider (NextAuth session provider)
├── accounts/           # Account-specific components
├── budget/             # Budget components
├── reports/            # Report components
├── transactions/       # TransactionTable (uses TanStack Table)
└── charts/             # Recharts wrappers
```

### Data Flow

1. **Server Components** (pages) fetch directly from Prisma using `auth()` from `@/lib/auth`
2. **Auth**: `src/lib/auth.ts` configures NextAuth with Credentials provider
   - Passwords are hashed with bcrypt (cost factor 12)
   - Protected routes redirect to `/login` if not authenticated
   - Rate limiting applied via `src/middleware.ts`
3. **Client Components** (charts, tables) receive data via props
4. **State Management**: Zustand for client state; server state via Prisma queries
5. **Caching**: React `cache()` wrappers in `src/lib/cache.ts` for request-level deduplication

### Database Schema (Prisma)

Key models in `prisma/schema.prisma`:

- **User** → has many Accounts, Categories
- **Account** → has many Transactions; types: CHECKING, SAVINGS, CREDIT_CARD, LOAN, INVESTMENT, ASSET
- **Transaction** → linked to Account + Category; types: INCOME, EXPENSE, TRANSFER
- **Category** → user-defined with groups, icons, colors; has many Transactions, BudgetItems
- **BudgetItem** → monthly budget per category (unique on categoryId + month + year)
- **ScheduledTransaction** → recurring transactions (WEEKLY, BIWEEKLY, MONTHLY, etc.)

## Design System: "Ledger"

The design is documented in `GEMINI.md`. Key constraints:

### Colors (NO dark themes)

- **Background**: `#F7F5F0` (warm parchment)
- **Card**: `#FFFFFF` (white)
- **Sidebar**: `#2C2C2C` (charcoal — NOT a dark theme)
- **Primary accent**: `#2B6CB0` (steel blue)
- **Positive**: `#2D7D46` (forest green)
- **Negative**: `#C53030` (brick red)
- **Warning**: `#B7791F` (amber)

### Typography

- **Display**: `DM Serif Display` — page titles, section headers
- **Body**: `Source Sans 3` — UI text, labels
- **Monospace**: `JetBrains Mono` — ALL monetary values, numbers in tables

### Critical Rules

1. **ALL monetary values MUST use `JetBrains Mono`** with `tabular-nums`
2. **Numbers in tables MUST be right-aligned**
3. **NO dark themes, NO purple gradients, NO neon, NO glassmorphism**
4. **Data density over whitespace** — Excel-like compact tables
5. **Negative values**: minus sign (not parentheses), `--color-negative` color
6. **Positive deltas**: `+` prefix with `--color-positive`

### Layout

- Sidebar: fixed 220px wide, charcoal background
- Header: 56px height, white background
- Main content: `ml-[220px]` offset, parchment background
- Cards: `shadow-card`, `border-border`, `radius-md` (8px)

## Key Patterns

### Authentication

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  // ... fetch user data via Prisma
}
```

### Database Queries

```typescript
import prisma from "@/lib/db";

const user = await prisma.user.findUnique({ where: { email: session.user.email } });
const accounts = await prisma.account.findMany({ where: { userId: user.id } });
```

### Styling with Tailwind

Use the custom theme variables defined in `globals.css`:

```
bg-background       → #F7F5F0 (parchment)
bg-card             → #FFFFFF
text-foreground     → #1A1A1A
text-muted-foreground → #8A8A8A
border-border       → #D9D5CC
font-mono           → JetBrains Mono
font-display        → DM Serif Display
font-sans           → Source Sans 3
```

Semantic color classes:
- `text-positive` / `bg-positive-bg` — for gains, income
- `text-negative` / `bg-negative-bg` — for losses, expenses
- `text-steel-blue` — links, primary actions

### KPI Cards

Use the `KpiCard` component from `@/components/dashboard/KpiCard`:

```tsx
<KpiCard
  label="Net Worth"
  value="$124,500"
  delta={{ value: "+4.2%", isPositive: true, label: "this month" }}
/>
```

### Tables

Use TanStack Table for Excel-style data tables. See `src/components/transactions/TransactionTable.tsx` for implementation with:
- Sortable columns
- Right-aligned numeric columns in `JetBrains Mono`
- Alternating row colors (`--color-bg-card` / `--color-bg-card-alt`)
- Compact density (40px row height max)

### Charts

Use Recharts with the custom chart colors (`--chart-1` through `--chart-8`). See components in `src/components/dashboard/`:
- `IncomeExpenseChart.tsx`
- `SpendingDonutChart.tsx`
- `NetWorthTrendChart.tsx`

Chart styling rules:
- Transparent background on cards
- Dotted grid lines with `--color-divider`
- Axis labels in `Source Sans 3`, 12px, `--color-text-tertiary`
- Tooltips: white bg, `shadow-card`, 8px radius

## Testing

### Unit Tests (Vitest)

Test files use the pattern `*.test.ts` or `*.test.tsx`:

```
src/
├── lib/
│   ├── utils.test.ts       # cn() utility tests
│   ├── formatters.test.ts  # Currency/date formatting tests
│   └── auth.test.ts        # Auth logic tests
└── components/
    ├── ui/button.test.tsx
    ├── dashboard/KpiCard.test.tsx
    └── transactions/TransactionTable.test.tsx
```

Run tests: `npm run test`
Run with coverage: `npm run test:coverage`

### E2E Tests (Playwright)

Configured in `playwright.config.ts`. Run with: `npm run test:e2e`

### Test Utilities

- `src/test/setup.ts` - Jest-DOM matchers and global mocks
- Mocks for `next-auth`, `next/navigation`, `@/lib/db`

## Environment Setup

Required environment variables (in `.env` or Railway dashboard):

```
DATABASE_URL="file:./dev.db"  # For SQLite local dev
AUTH_SECRET="your-secret-here"
```

## Notes

- Passwords are hashed with bcrypt (cost factor 12)
- 61+ tests covering utilities, components, and auth logic
- Rate limiting: 5 login attempts per 15 minutes per IP
- Security headers configured in `next.config.ts`
- The `GEMINI.md` file contains detailed design guardrails — reference it for any UI work
- Sidebar navigation items are defined in `src/components/layout/Sidebar.tsx`
- All routes except `/login` are protected by NextAuth middleware (configured in `src/lib/auth.ts`)
- Use `getCurrentUser()` from `@/lib/user` instead of duplicating auth checks
