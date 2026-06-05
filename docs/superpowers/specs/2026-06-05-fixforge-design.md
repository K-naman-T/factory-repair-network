# FixForge — Industrial Repair Marketplace Spec

## Problem Statement

When specialized machinery breaks down in small manufacturing units, owners face multi-day production halts because there is no on-demand network or marketplace connecting them with qualified industrial technicians who can diagnose and repair niche equipment quickly.

**Severity Score:** 78.5/100 (Razorpay FixMyItch)
**Category:** B2B Services

## Solution

FixForge is a two-sided marketplace connecting factory owners with qualified industrial repair technicians. Factory owners post repair jobs, the system matches them with available technicians by specialty and location, and technicians accept and resolve issues.

## Target Users

1. **Factory Owner** — Manages a manufacturing unit, needs equipment repaired quickly
2. **Technician** — Qualified industrial repair specialist, wants to find and accept jobs
3. **Admin** — Platform operator, manages dispatch and oversight

## Core User Flows

### Factory Owner Flow
1. Register as factory owner → provide factory details
2. Post a repair job → describe issue, select specialty, set urgency
3. System auto-matches best technician → or admin manually dispatches
4. Track job status → open → assigned → in_progress → resolved
5. View history and spending

### Technician Flow
1. Register as technician → provide specialty, city, availability
2. View assigned jobs → accept or decline
3. Update job status → in_progress → resolved
4. Manage profile and availability

### Admin Flow
1. View all open jobs on dispatch board
2. Manually assign technicians to jobs
3. Manage technicians and factories
4. View call logs and system stats

## Data Models

### Factory
- id: Int (PK, auto-increment)
- name: String (required)
- address: String (required)
- city: String (required)
- phone: String (required)
- email: String (optional)
- createdAt: DateTime (default now)

### Technician
- id: Int (PK, auto-increment)
- name: String (required)
- email: String (optional, unique)
- specialty: String (required) — enum: HVAC, Plumbing, Electrical, Pest, Industrial
- city: String (required)
- phone: String (required)
- available: Boolean (default true)
- rating: Float (default 4.5)
- createdAt: DateTime (default now)

### Job
- id: Int (PK, auto-increment)
- factoryId: Int (FK → Factory)
- technicianId: Int? (FK → Technician, nullable)
- specialtyNeeded: String (required)
- description: String (required)
- status: String (default "open") — enum: open, assigned, in_progress, resolved
- urgency: String (default "normal") — enum: low, normal, high, critical
- cost: Float (default 0)
- createdAt: DateTime (default now)
- resolvedAt: DateTime? (nullable)

### CallLog
- id: Int (PK, auto-increment)
- phone: String (required)
- intent: String (required)
- transcript: String? (nullable)
- createdAt: DateTime (default now)

### User
- id: Int (PK, auto-increment)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (required) — enum: factory, technician, admin
- name: String (required)
- createdAt: DateTime (default now)

## Seed Data

### Factories (5)
1. Tata Steel — Jamshedpur Industrial Area, Jamshedpur, +91-657-1000001
2. Bhushan Steel — Dhanbad Sector 7, Dhanbad, +91-326-1000002
3. JSW — Ranchi Plant Road, Ranchi, +91-651-1000003
4. Bokaro Steel Plant — Bokaro Main Gate, Bokaro, +91-6542-100004
5. Tata Steel — Hazaribagh Unit Park, Hazaribagh, +91-6546-100005

### Technicians (10, 2 per specialty)
- HVAC: Aman Singh (Jamshedpur, 4.7), Nisha Das (Ranchi, 4.5)
- Plumbing: Ravi Kumar (Dhanbad, 4.4), Meera Jain (Bokaro, 4.6)
- Electrical: Arjun Patel (Ranchi, 4.8), Pooja Roy (Hazaribagh, 4.3)
- Pest: Sahil Ali (Dhanbad, 4.2), Kiran Sen (Jamshedpur, 4.1)
- Industrial: Vikram Bose (Bokaro, 4.9), Anita Verma (Hazaribagh, 4.6)

### Jobs (20)
- Mix of statuses: 8 open, 4 assigned, 3 in_progress, 5 resolved
- Spread across all specialties and factories
- Realistic descriptions (e.g., "Conveyor belt motor overheating", "AC compressor failure in assembly line")

### Users (3)
- Admin: admin@fixforge.in / admin123
- Factory Owner: owner@tatasteel.in / pass123
- Technician: aman.singh@fixforge.in / pass123

## API Endpoints

### Authentication
- POST /api/auth/register — Create account with role
- POST /api/auth/login — Email + password → session cookie
- POST /api/auth/logout — Destroy session
- GET /api/auth/me — Get current user from session

### Jobs
- GET /api/jobs — List jobs (filters: status, specialty, factory_id, technician_id)
- POST /api/jobs — Create new job
- GET /api/jobs/[id] — Get job detail with factory + technician
- PUT /api/jobs/[id] — Update job (status, technician_id, cost)

### Technicians
- GET /api/technicians — List technicians (filters: specialty, city, available)
- POST /api/technicians — Create technician (admin only)
- PUT /api/technicians/[id] — Update technician (availability, profile)

### Factories
- GET /api/factories — List factories
- POST /api/factories — Create factory (admin only)
- PUT /api/factories/[id] — Update factory

### Stats & Logs
- GET /api/stats — Aggregated dashboard stats
- GET /api/calls — List call logs

### Webhook (placeholder)
- POST /api/webhook/twilio — Stub for future Twilio integration

## Pages

### Landing Page (/)
- Animated hero with background effects
- Problem statement with severity score
- How it works (3-step bento grid)
- Feature showcase (marquee)
- Stats section (animated counters)
- Testimonials
- CTA section
- Footer

### Auth Pages (/login, /register)
- Clean form with role selection
- Simple email/password authentication
- Role-specific fields during registration

### Factory Dashboard (/dashboard)
- Overview with stats cards
- Post new job form
- Job list with status filters
- Browse technicians by specialty/city

### Technician Dashboard (/technician)
- My assignments list
- Job detail with status updates
- Profile management (availability, specialties)

### Admin Panel (/admin)
- System-wide stats overview
- Live dispatch board (Kanban-style)
- Manage technicians (CRUD)
- Manage factories (CRUD)
- Call logs viewer

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **UI Components:** shadcn/ui + MagicUI
- **Animation:** motion v12
- **Database:** Prisma + SQLite
- **Auth:** Cookie-based session (httpOnly)
- **Styling:** Tailwind CSS v4
- **Icons:** lucide-react
- **Dark Mode:** next-themes

## Validation Criteria

1. `npm run build` — no TypeScript errors
2. `npm run dev` — server starts on port 3000
3. Landing page renders with all animated sections
4. Register as factory owner → redirected to `/dashboard`
5. Register as technician → redirected to `/technician`
6. Login as admin → redirected to `/admin`
7. Post a job → appears in jobs list
8. Assign technician → status changes to "assigned"
9. Technician accepts → status changes to "in_progress"
10. Technician resolves → status changes to "resolved"
11. All pages responsive on mobile (375px+)
12. Dark mode toggle works across all pages
13. All API endpoints return correct data shapes
14. Seed data loads correctly on first run

## Out of Scope (MVP)

- Real Twilio integration (webhook stub only)
- Payment processing
- Real-time notifications (WebSocket)
- Native mobile apps
- Multi-language support
- Image/photo upload for jobs
