# Tso Finance

A personal financial dashboard built with Next.js 16, inspired by Quicken Deluxe and Excel. Features a warm, paper-like "Ledger" design system with data-dense, spreadsheet-style UI.

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![Tests](https://img.shields.io/badge/tests-61%20passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- **Dashboard** - Net worth, income/expense trends, spending breakdown
- **Accounts** - Manage checking, savings, credit cards, investments
- **Transactions** - Paginated transaction list with filtering and CSV export
- **Budget** - Monthly budget tracking by category
- **Reports** - Visual analytics with spending by category

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Database**: SQLite (Prisma ORM)
- **Auth**: NextAuth v5 with bcrypt password hashing
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library + Playwright

## Getting Started

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your AUTH_SECRET

# Setup database
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run unit tests
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── ui/          # shadcn/ui primitives
│   ├── dashboard/   # Dashboard widgets
│   ├── layout/      # Sidebar, Header
│   └── ...
├── lib/             # Utilities
│   ├── auth.ts      # NextAuth config
│   ├── db.ts        # Prisma client
│   ├── cache.ts     # React cache wrappers
│   └── ...
└── test/            # Test setup
```

## Security Features

- bcrypt password hashing (cost factor 12)
- Rate limiting on auth endpoints (5 attempts / 15 min)
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Protected API routes

## Testing

- **61 unit tests** covering utilities, formatters, auth, and components
- Vitest with jsdom environment
- React Testing Library for component tests
- Playwright configured for E2E testing

## Design System

See [GEMINI.md](./GEMINI.md) for detailed design guidelines.

- **Background**: `#F7F5F0` (warm parchment)
- **Primary**: `#2B6CB0` (steel blue)
- **Positive**: `#2D7D46` (forest green)
- **Negative**: `#C53030` (brick red)

## License

MIT - Personal use only

---

Built with ❤️ by Daniel Tso
