# FixForge — Industrial Repair Marketplace

> From breakdown to fix in hours, not days.

India's first on-demand marketplace connecting factory owners with qualified industrial repair technicians.

## Features

- **Landing Page** — Animated pitch page with MagicUI components
- **Factory Dashboard** — Post jobs, browse technicians, track status
- **Technician Dashboard** — Accept/decline jobs, update status, manage profile
- **Admin Panel** — Dispatch board, manage technicians & factories, view call logs
- **Dark Mode** — Full dark mode support across all pages
- **Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui + MagicUI
- Prisma + SQLite
- next-themes (dark mode)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

3. Start development server:
    ```bash
    npm run dev
    ```

4. Open http://localhost:3000

### Custom Port

Use the `PORT` env var to run on a different port:

```bash
PORT=4321 npm run dev
```

Then set `API_BASE_URL` when running tests:

```bash
API_BASE_URL=http://localhost:4321 npx vitest run
```

## Test Accounts

- **Admin:** admin@fixforge.in / admin123
- **Factory Owner:** owner@tatasteel.in / pass123
- **Technician:** aman.singh@fixforge.in / pass123

## API Endpoints

- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `GET /api/jobs` — List jobs
- `POST /api/jobs` — Create job
- `GET /api/technicians` — List technicians
- `GET /api/factories` — List factories
- `GET /api/stats` — Dashboard stats

## Built for

Industrial Repair Marketplace
