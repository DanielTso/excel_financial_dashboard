# GEMINI.md — Tso Financial Dashboard
## Project Context & Guardrails for Gemini CLI

> **Owner:** Daniel Tso  
> **Project:** Personal Financial Dashboard (Tso Finance)  
> **Deployment:** Railway.com (PostgreSQL + Web Service)  
> **Purpose:** A personal-use financial management dashboard inspired by Quicken Deluxe, built as a modern web application with an Excel-dashboard aesthetic — clean, data-dense, and functional.

---

## 1. PROJECT IDENTITY

### 1.1 App Name
**Tso Finance** — a personal financial command center.

### 1.2 Tagline
*"Your money. Your clarity. Your command."*

### 1.3 Design Philosophy
This is a **utility-first, data-rich dashboard** that feels like a premium spreadsheet application — not a SaaS marketing page. Think: the best Excel dashboard you've ever seen, rebuilt as a responsive web app. Every pixel should serve the data. The design should feel **trustworthy, precise, and calm** — like a well-organized ledger from a high-end accounting firm.

**Design Pillars:**
- **Clarity over decoration** — data is the hero, not gradients or gimmicks
- **Excel-native familiarity** — grids, cells, compact rows, tabular data
- **Warm professionalism** — approachable but serious about money
- **Information density** — show more, scroll less
- **Actionable at a glance** — KPI cards, sparklines, conditional formatting

---

## 2. DESIGN SYSTEM — "Ledger"

### 2.1 Color Palette

**CRITICAL: NO dark themes. NO purple gradients. NO neon accents. NO dark navy backgrounds. NO glassmorphism. NO AI-slop aesthetics.**

The palette is inspired by **warm paper, ink, and natural materials** — like a leather-bound financial ledger.

#### Primary Background & Surface Colors
```css
--color-bg-page:        #F7F5F0;   /* Warm parchment — main page background */
--color-bg-card:        #FFFFFF;   /* Clean white — card/panel surfaces */
--color-bg-card-alt:    #FAF9F6;   /* Off-white — alternating row backgrounds */
--color-bg-sidebar:     #2C2C2C;   /* Charcoal — sidebar only (NOT a dark theme) */
--color-bg-header:      #FFFFFF;   /* White — top header bar */
--color-bg-input:       #FFFFFF;   /* White — form inputs */
--color-bg-hover:       #F0EDE6;   /* Warm sand — hover states on rows/items */
--color-bg-selected:    #E8F4E8;   /* Pale mint — selected/active row */
```

#### Text Colors
```css
--color-text-primary:   #1A1A1A;   /* Near-black — headings, primary data */
--color-text-secondary: #5C5C5C;   /* Medium gray — labels, descriptions */
--color-text-tertiary:  #8A8A8A;   /* Light gray — timestamps, metadata */
--color-text-on-dark:   #F0EDE6;   /* Warm off-white — text on charcoal sidebar */
--color-text-link:      #2B6CB0;   /* Steel blue — hyperlinks */
```

#### Semantic / Data Colors
```css
--color-positive:       #2D7D46;   /* Forest green — income, gains, positive delta */
--color-positive-bg:    #E8F4E8;   /* Pale green — positive cell background */
--color-negative:       #C53030;   /* Brick red — expenses, losses, negative delta */
--color-negative-bg:    #FDE8E8;   /* Pale red — negative cell background */
--color-warning:        #B7791F;   /* Amber — warnings, approaching limits */
--color-warning-bg:     #FEFCBF;   /* Pale yellow — warning cell background */
--color-info:           #2B6CB0;   /* Steel blue — informational, neutral KPIs */
--color-info-bg:        #EBF4FF;   /* Pale blue — informational cell background */
```

#### Accent & Interactive Colors
```css
--color-accent-primary: #2B6CB0;   /* Steel blue — primary buttons, active tabs */
--color-accent-hover:   #1E4E8C;   /* Deeper blue — button hover */
--color-accent-pressed: #153E75;   /* Dark navy — button pressed */
--color-border:         #D9D5CC;   /* Warm gray — card borders, dividers */
--color-border-strong:  #B0ADA6;   /* Darker gray — table borders, focus rings */
--color-divider:        #E8E5DE;   /* Subtle warm — row dividers */
```

#### Chart & Graph Colors (ordered for data visualization)
```css
--chart-1: #2B6CB0;   /* Steel blue — primary series */
--chart-2: #2D7D46;   /* Forest green — secondary series */
--chart-3: #B7791F;   /* Amber — tertiary series */
--chart-4: #C53030;   /* Brick red — quaternary series */
--chart-5: #6B46C1;   /* Muted violet — fifth series */
--chart-6: #2C7A7B;   /* Teal — sixth series */
--chart-7: #9C4221;   /* Rust — seventh series */
--chart-8: #5C5C5C;   /* Medium gray — eighth series */
```

### 2.2 Typography

**Font Stack — Load from Google Fonts**

| Role | Font Family | Weight(s) | Size Range | Usage |
|------|------------|-----------|------------|-------|
| **Display / Page Titles** | `"DM Serif Display"` | 400 | 28–36px | Dashboard title, section headers |
| **Headings / Card Titles** | `"Source Sans 3"` | 600, 700 | 16–22px | Card headers, nav labels, KPI labels |
| **Body / Data Labels** | `"Source Sans 3"` | 400, 500 | 13–15px | Descriptions, form labels, paragraphs |
| **Tabular Data / Numbers** | `"JetBrains Mono"` | 400, 500 | 12–14px | Dollar amounts, percentages, table cells, totals |
| **Small / Metadata** | `"Source Sans 3"` | 400 | 11–12px | Timestamps, footnotes, helper text |

**Typography Rules:**
- ALL monetary values MUST use `JetBrains Mono` for alignment and readability
- Numbers in tables MUST be right-aligned
- Use `tabular-nums` font-feature-setting for all numeric columns
- Negative values display in `--color-negative` with a minus sign (no parentheses)
- Positive deltas display in `--color-positive` with a `+` prefix
- Currency symbols are slightly smaller than the number (0.85em)
- Section headings use `DM Serif Display` for warmth; everything else is `Source Sans 3`

### 2.3 Spacing & Layout

```css
--space-xs:   4px;
--space-sm:   8px;
--space-md:   16px;
--space-lg:   24px;
--space-xl:   32px;
--space-2xl:  48px;

--radius-sm:  4px;    /* Input fields, small badges */
--radius-md:  8px;    /* Cards, panels, modals */
--radius-lg:  12px;   /* Only for special highlight cards */

--shadow-card:    0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-hover:   0 4px 12px rgba(0,0,0,0.08);
--shadow-modal:   0 10px 40px rgba(0,0,0,0.12);
```

### 2.4 Layout Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  HEADER BAR (white, 56px height)                               │
│  [Logo/Name]        [Search]        [Notifications] [Profile]  │
├────────┬───────────────────────────────────────────────────────┤
│        │  MAIN CONTENT AREA (warm parchment background)        │
│  S     │                                                       │
│  I     │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  D     │  │ KPI Card│ │ KPI Card│ │ KPI Card│ │ KPI Card│    │
│  E     │  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│  B     │                                                       │
│  A     │  ┌───────────────────────┐ ┌───────────────────────┐  │
│  R     │  │   CHART / GRAPH       │ │   CHART / GRAPH       │  │
│        │  │   (Income vs Expense) │ │   (Net Worth Trend)   │  │
│  220px │  └───────────────────────┘ └───────────────────────┘  │
│  wide  │                                                       │
│        │  ┌─────────────────────────────────────────────────┐  │
│  dark  │  │  TRANSACTION TABLE (Excel-style)                │  │
│  char- │  │  Sortable columns, filters, pagination          │  │
│  coal  │  └─────────────────────────────────────────────────┘  │
│        │                                                       │
├────────┴───────────────────────────────────────────────────────┤
│  FOOTER (optional — version, last sync timestamp)              │
└────────────────────────────────────────────────────────────────┘
```

**Grid System:**
- Main content uses a 12-column CSS Grid
- KPI cards: 4 columns across (3-col span each) on desktop; 2×2 on tablet; stacked on mobile
- Charts: 6-col span each (side by side); full-width on tablet/mobile
- Transaction table: full 12-col span
- Sidebar collapses to hamburger menu below 768px

### 2.5 Component Specifications

#### KPI Cards
- Height: ~120px
- Top: small label in `--color-text-secondary` (13px, Source Sans 3)
- Middle: large number in `JetBrains Mono` (28px, bold)
- Bottom: delta badge (e.g., `+4.2%` or `-$320`) with semantic background color
- Optional: mini sparkline (50px tall) in bottom-right corner
- Border: 1px solid `--color-border`
- Background: `--color-bg-card`
- Hover: elevate with `--shadow-hover`

#### Data Tables (Excel-Style)
- Alternating row colors: `--color-bg-card` / `--color-bg-card-alt`
- Column headers: `Source Sans 3` 600 weight, 12px uppercase, `--color-text-secondary`
- Cell padding: 10px horizontal, 8px vertical
- Sortable columns with subtle arrow indicators
- Sticky header row on scroll
- Row hover: `--color-bg-hover`
- Active/selected row: `--color-bg-selected`
- Compact density: rows are 40px tall max
- Numeric columns right-aligned in `JetBrains Mono`

#### Charts
- Library: **Recharts** (React) or **Chart.js** (vanilla)
- Background: transparent on `--color-bg-card`
- Grid lines: dotted, `--color-divider`
- Axis labels: `Source Sans 3` 12px, `--color-text-tertiary`
- Tooltips: white background, `--shadow-card`, rounded 8px
- Use the chart color palette in order (--chart-1 through --chart-8)
- Always include a legend positioned at top-right or below chart

#### Sidebar Navigation
- Background: `--color-bg-sidebar` (charcoal #2C2C2C)
- Text: `--color-text-on-dark`
- Active item: left border accent `--color-accent-primary`, slightly lighter background
- Icons: Lucide Icons (20px), paired with labels
- Sections: Dashboard, Accounts, Budget, Transactions, Bills & Income, Net Worth, Reports, Settings

#### Buttons
- Primary: `--color-accent-primary` bg, white text, `--radius-sm`, 600 weight
- Secondary: transparent bg, `--color-accent-primary` text, 1px border
- Danger: `--color-negative` bg, white text
- All buttons: 36px height, 16px horizontal padding, subtle hover transitions

#### Form Inputs
- Height: 36px
- Border: 1px solid `--color-border`
- Focus: 2px solid `--color-accent-primary`
- Background: `--color-bg-input`
- Border radius: `--radius-sm`
- Font: `Source Sans 3` 14px

---

## 3. TECH STACK

### 3.1 Frontend
| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **Next.js 14+** (App Router) | Server components, API routes |
| Language | **TypeScript** | Strict mode enabled |
| Styling | **Tailwind CSS 3+** | Custom theme config matching Ledger design system |
| Component Library | **shadcn/ui** | Customized to match Ledger palette — NOT default styles |
| Charts | **Recharts** | For all data visualization |
| Icons | **Lucide React** | Consistent, clean iconography |
| Tables | **TanStack Table** | Sortable, filterable, Excel-style data grids |
| Forms | **React Hook Form + Zod** | Validation with schema types |
| State Management | **Zustand** | Lightweight client state |
| Date Handling | **date-fns** | Lightweight date formatting |

### 3.2 Backend
| Layer | Technology | Notes |
|-------|-----------|-------|
| Runtime | **Node.js** (via Next.js API routes) | Deployed on Railway |
| Database | **PostgreSQL** (Railway) | Primary data store |
| ORM | **Prisma** | Type-safe database queries |
| Auth | **NextAuth.js** (Auth.js v5) | Email/password for personal use |
| API Pattern | **tRPC** OR Next.js Server Actions | Type-safe API layer |

### 3.3 Infrastructure
| Layer | Technology | Notes |
|-------|-----------|-------|
| Hosting | **Railway.com** | Web service + managed PostgreSQL |
| CI/CD | Railway auto-deploy from GitHub | Push to `main` triggers deploy |
| Environment Variables | Railway dashboard | All secrets managed there |
| Version Control | **GitHub** | Private repository |

### 3.4 Project Structure
```
tso-finance/
├── GEMINI.md                        # THIS FILE — Gemini CLI guardrails
├── .gemini/
│   └── settings.json                # Gemini CLI configuration
├── prisma/
│   └── schema.prisma                # Database schema
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (fonts, providers)
│   │   ├── page.tsx                 # Dashboard home (server component)
│   │   ├── globals.css              # CSS variables, base styles
│   │   ├── accounts/
│   │   ├── budget/
│   │   ├── transactions/
│   │   ├── bills/
│   │   ├── net-worth/
│   │   ├── reports/
│   │   └── settings/
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives (Button, Input, etc.)
│   │   ├── dashboard/               # KPI cards, charts, widgets
│   │   ├── tables/                  # Transaction table, account list
│   │   ├── forms/                   # Add transaction, edit budget
│   │   ├── layout/                  # Sidebar, Header, Footer
│   │   └── charts/                  # Recharts wrappers
│   ├── lib/
│   │   ├── db.ts                    # Prisma client singleton
│   │   ├── utils.ts                 # Currency formatters, date helpers
│   │   └── constants.ts             # Category lists, chart colors
│   ├── hooks/                       # Custom React hooks
│   ├── types/                       # TypeScript interfaces
│   └── styles/
│       └── ledger-theme.ts          # Tailwind + shadcn theme overrides
├── public/
│   └── fonts/                       # Self-hosted font files (optional)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── railway.json                     # Railway deployment config
```

---

## 4. FEATURE SET (Inspired by Quicken Deluxe)

### 4.1 Dashboard Home (Priority: HIGH)
- **Net Worth KPI Card** — Total assets minus total liabilities, with month-over-month delta
- **Cash Flow KPI Card** — Total income minus total expenses for current month
- **Monthly Budget KPI Card** — % of budget used, with progress bar
- **Upcoming Bills KPI Card** — Next 7 days of scheduled payments, total amount due
- **Income vs. Expense Bar Chart** — Last 6 months, side-by-side bars
- **Net Worth Trend Line Chart** — Last 12 months, area fill under line
- **Top Spending Categories Donut Chart** — Current month, with legend and percentages
- **Recent Transactions Table** — Last 20 transactions, sortable, with category badges

### 4.2 Accounts (Priority: HIGH)
- List all financial accounts: Checking, Savings, Credit Cards, Loans, Investments, Assets
- Each account shows: name, institution, current balance, last updated
- Account groups (Banking, Credit, Investments, Assets, Liabilities)
- Ability to manually add/edit account balances
- Running total / net worth at bottom

### 4.3 Transactions (Priority: HIGH)
- Full Excel-style transaction register
- Columns: Date, Payee, Category, Account, Amount, Running Balance, Notes
- Inline editing (double-click to edit)
- Bulk categorization
- CSV import support
- Search and filter by date range, category, payee, amount range
- Sortable by any column
- Pagination (50 rows per page)

### 4.4 Budget (Priority: HIGH)
- 12-month rolling budget grid (Excel-style)
- Rows = categories, Columns = months
- Cells show: budgeted amount vs actual spending
- Conditional formatting: green (under budget), yellow (approaching), red (over)
- Category grouping (Housing, Food, Transportation, etc.)
- Summary row at bottom with totals
- Budget vs. Actual bar chart per category

### 4.5 Bills & Income (Priority: MEDIUM)
- Scheduled transactions calendar view
- Upcoming bills list with due dates and amounts
- Income tracking with expected vs. actual
- Projected cash flow (next 30 days)
- Overdue/upcoming indicators with warning colors

### 4.6 Net Worth (Priority: MEDIUM)
- Assets list (bank accounts, property, vehicles, investments)
- Liabilities list (credit cards, loans, mortgage)
- Net worth = Assets - Liabilities
- Historical net worth trend (line chart, up to 5 years)
- Asset allocation donut chart

### 4.7 Reports (Priority: MEDIUM)
- Income vs. Expense by period
- Spending by Category
- Spending by Payee
- Net Worth over Time
- Cash Flow Summary
- Budget Performance
- Date range selector on all reports
- Export to CSV / PDF

### 4.8 Settings (Priority: LOW)
- Profile (name, currency preference, fiscal year start)
- Categories management (add/edit/delete/reorder)
- Account management
- Data import/export
- Theme preferences (future: allow customization within light theme)

---

## 5. DATABASE SCHEMA (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  accounts  Account[]
  categories Category[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id            String        @id @default(cuid())
  userId        String
  user          User          @relation(fields: [userId], references: [id])
  name          String        // "Chase Checking", "Amex Platinum"
  type          AccountType   // CHECKING, SAVINGS, CREDIT_CARD, LOAN, INVESTMENT, ASSET
  institution   String?       // "Chase", "American Express"
  currentBalance Decimal      @default(0)
  currency      String        @default("USD")
  isActive      Boolean       @default(true)
  sortOrder     Int           @default(0)
  transactions  Transaction[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

enum AccountType {
  CHECKING
  SAVINGS
  CREDIT_CARD
  LOAN
  INVESTMENT
  ASSET
  LIABILITY
}

model Transaction {
  id          String   @id @default(cuid())
  accountId   String
  account     Account  @relation(fields: [accountId], references: [id])
  date        DateTime
  payee       String
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  amount      Decimal  // Positive = income, Negative = expense
  type        TransactionType // INCOME, EXPENSE, TRANSFER
  memo        String?
  isRecurring Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}

model Category {
  id           String        @id @default(cuid())
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  name         String        // "Groceries", "Rent", "Salary"
  group        String        // "Housing", "Food", "Transportation"
  icon         String?       // Lucide icon name
  color        String?       // Hex color for charts
  isIncome     Boolean       @default(false)
  sortOrder    Int           @default(0)
  transactions Transaction[]
  budgets      BudgetItem[]
  createdAt    DateTime      @default(now())
}

model BudgetItem {
  id         String   @id @default(cuid())
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  month      Int      // 1-12
  year       Int      // 2025, 2026, etc.
  budgeted   Decimal  // Planned amount
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([categoryId, month, year])
}

model ScheduledTransaction {
  id          String    @id @default(cuid())
  accountId   String
  payee       String
  amount      Decimal
  frequency   Frequency // WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY
  nextDueDate DateTime
  categoryId  String?
  type        TransactionType
  memo        String?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Frequency {
  WEEKLY
  BIWEEKLY
  MONTHLY
  QUARTERLY
  YEARLY
  ONCE
}
```

---

## 6. DEVELOPMENT RULES

### 6.1 Code Style
- **TypeScript strict mode** — no `any` types, no implicit returns
- Use `const` over `let`; never use `var`
- Prefer named exports over default exports (except page.tsx / layout.tsx)
- Use early returns to reduce nesting
- Destructure props in function signatures
- Use descriptive variable names — `monthlyExpenseTotal` not `total`
- Comments: explain WHY, not WHAT

### 6.2 Component Patterns
- **Server Components by default** — only add `"use client"` when state or interactivity is needed
- Colocate component-specific types in the same file
- Use composition over prop drilling
- Extract reusable logic into custom hooks in `/hooks`
- Keep components under 150 lines; split if larger
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes

### 6.3 Naming Conventions
| Entity | Convention | Example |
|--------|-----------|---------|
| Components | PascalCase | `KpiCard.tsx`, `TransactionTable.tsx` |
| Files / Routes | kebab-case | `net-worth/page.tsx` |
| Functions / Hooks | camelCase | `useAccountBalance()`, `formatCurrency()` |
| Constants | SCREAMING_SNAKE | `ACCOUNT_TYPES`, `CHART_COLORS` |
| CSS Variables | kebab-case with prefix | `--color-bg-card`, `--space-md` |
| Database Tables | PascalCase (Prisma) | `Transaction`, `BudgetItem` |
| API Routes | kebab-case | `/api/transactions`, `/api/budget-items` |

### 6.4 Currency Formatting
```typescript
// ALWAYS use this formatter for monetary values
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// For compact display (KPI cards)
const formatCompactCurrency = (amount: number): string => {
  if (Math.abs(amount) >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
};
```

### 6.5 Accessibility
- All interactive elements must be keyboard accessible
- Use semantic HTML (`<table>`, `<nav>`, `<main>`, `<aside>`)
- Color is never the ONLY indicator — pair with icons or text
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
- All images/icons need `alt` text or `aria-label`
- Focus rings must be visible (`--color-accent-primary`)

---

## 7. DEPLOYMENT — Railway.com

### 7.1 Railway Configuration
```json
// railway.json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm start",
    "healthcheckPath": "/api/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### 7.2 Environment Variables (Railway Dashboard)
```
DATABASE_URL=postgresql://...      # Auto-set by Railway PostgreSQL plugin
NEXTAUTH_SECRET=<generate-random>  # openssl rand -base64 32
NEXTAUTH_URL=https://your-app.up.railway.app
NODE_ENV=production
```

### 7.3 Database Setup
1. Add PostgreSQL plugin in Railway dashboard
2. Railway auto-injects `DATABASE_URL` into the service
3. Prisma migrations run automatically on deploy (see startCommand)
4. Use `npx prisma studio` locally for database inspection

### 7.4 Deployment Checklist
- [ ] `prisma/schema.prisma` is up to date
- [ ] All environment variables set in Railway dashboard
- [ ] `railway.json` exists in repo root
- [ ] Health check endpoint (`/api/health`) returns 200
- [ ] Build passes locally with `npm run build`
- [ ] Database migrations tested locally first

---

## 8. ANTI-PATTERNS — DO NOT DO THESE

### 8.1 Design Anti-Patterns
❌ **NO dark theme** — this is a light, warm, paper-inspired dashboard  
❌ **NO purple/violet gradients** — this is the #1 AI-slop indicator  
❌ **NO glassmorphism or frosted glass effects**  
❌ **NO neon or electric colors** — we use muted, natural tones  
❌ **NO rounded pill buttons with gradients**  
❌ **NO floating 3D cards with extreme shadows**  
❌ **NO animated gradient backgrounds**  
❌ **NO stock photography or placeholder hero images**  
❌ **NO emoji as data indicators** — use icons and color coding  
❌ **NO marketing-speak or SaaS-style copy** — this is a tool, not a product page  

### 8.2 Code Anti-Patterns
❌ **NO `any` type** — always define proper TypeScript interfaces  
❌ **NO inline styles** — use Tailwind classes or CSS variables  
❌ **NO `useEffect` for data fetching** — use server components or React Query  
❌ **NO client-side-only routing** — leverage Next.js App Router  
❌ **NO storing sensitive data in localStorage** — use HTTP-only cookies  
❌ **NO raw SQL** — use Prisma ORM for all database operations  
❌ **NO hardcoded colors** — always reference CSS variables or Tailwind theme  
❌ **NO unused imports or dead code** — clean as you go  
❌ **NO console.log in production** — use proper error handling  

---

## 9. RESPONSE FORMATTING FOR GEMINI

When generating code for this project:

1. **Always reference this GEMINI.md** before writing any component, style, or page
2. **Use the exact CSS variables** defined in Section 2.1 — never invent new colors
3. **Use the exact font families** defined in Section 2.2 — never substitute
4. **Follow the component specs** in Section 2.5 — match dimensions, spacing, and states
5. **Follow the file structure** in Section 3.4 — place files in the correct directories
6. **Match the feature specs** in Section 4 — build what's described, not more
7. **Use Prisma** for all database operations — match the schema in Section 5
8. **Test locally** before suggesting deployment steps
9. **Prefer server components** — only use `"use client"` when truly needed
10. **When in doubt, keep it simple** — build a working MVP first, polish second

---

## 10. QUICK REFERENCE — COPY/PASTE

### Google Fonts Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Tailwind Theme Extension
```typescript
// tailwind.config.ts (partial)
theme: {
  extend: {
    colors: {
      parchment: '#F7F5F0',
      charcoal: '#2C2C2C',
      sand: '#F0EDE6',
      'steel-blue': '#2B6CB0',
      forest: '#2D7D46',
      brick: '#C53030',
      amber: '#B7791F',
    },
    fontFamily: {
      display: ['"DM Serif Display"', 'Georgia', 'serif'],
      sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
    },
  },
}
```

### Initial Packages
```bash
# Create project
npx create-next-app@latest tso-finance --typescript --tailwind --eslint --app --src-dir

# Core dependencies
npm install prisma @prisma/client next-auth@beta
npm install zustand date-fns recharts
npm install @tanstack/react-table react-hook-form zod @hookform/resolvers
npm install lucide-react clsx tailwind-merge

# shadcn/ui setup
npx shadcn@latest init
npx shadcn@latest add button input card table badge dialog sheet separator

# Dev dependencies
npm install -D @types/node prisma
```

---

*Last Updated: March 2026*  
*Version: 1.0.0*  
*Author: Daniel Tso — Crafts2Build LLC*
