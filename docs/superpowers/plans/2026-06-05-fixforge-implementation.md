# FixForge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build FixForge — an on-demand marketplace connecting factory owners with qualified industrial repair technicians, with a stunning animated landing page and full CRUD dashboards.

**Architecture:** Next.js 15 App Router with TypeScript, shadcn/ui + MagicUI for components, Prisma + SQLite for database, cookie-based auth. Landing page uses MagicUI animated components (marquee, number-ticker, bento-grid, shimmer-button, border-beam, blur-fade). Dashboards use shadcn components (card, table, dialog, form).

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, MagicUI, Prisma, SQLite, motion v12, lucide-react, next-themes

---

## Task 1: Prisma Schema + Seed + Database Tests

**Files:**
- Create: `prisma/schema.prisma` (modify existing)
- Create: `prisma/seed.ts`
- Create: `lib/prisma.ts`
- Create: `__tests__/lib/prisma.test.ts`

- [ ] **Step 1: Write the failing test for Prisma client singleton**

```typescript
// __tests__/lib/prisma.test.ts
import { describe, it, expect } from 'vitest'

describe('Prisma client singleton', () => {
  it('should return the same instance on multiple calls', async () => {
    const { getPrismaClient } = await import('@/lib/prisma')
    const client1 = getPrismaClient()
    const client2 = getPrismaClient()
    expect(client1).toBe(client2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run __tests__/lib/prisma.test.ts`
Expected: FAIL with "Cannot find module '@/lib/prisma'"

- [ ] **Step 3: Write minimal Prisma client implementation**

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

export const prisma = getPrismaClient()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run __tests__/lib/prisma.test.ts`
Expected: PASS

- [ ] **Step 5: Write failing test for database schema**

```typescript
// __tests__/prisma/schema.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPrismaClient } from '@/lib/prisma'

describe('Database Schema', () => {
  let prisma: ReturnType<typeof getPrismaClient>

  beforeAll(() => {
    prisma = getPrismaClient()
  })

  it('should have Factory model with required fields', async () => {
    const factory = await prisma.factory.create({
      data: {
        name: 'Test Factory',
        address: '123 Industrial Area',
        city: 'Test City',
        phone: '+91-123-4567890',
      },
    })
    expect(factory).toHaveProperty('id')
    expect(factory.name).toBe('Test Factory')
    expect(factory.city).toBe('Test City')
    // Cleanup
    await prisma.factory.delete({ where: { id: factory.id } })
  })

  it('should have Technician model with specialty enum', async () => {
    const tech = await prisma.technician.create({
      data: {
        name: 'Test Tech',
        specialty: 'HVAC',
        city: 'Test City',
        phone: '+91-123-4567891',
      },
    })
    expect(tech.specialty).toBe('HVAC')
    expect(tech.available).toBe(true)
    expect(tech.rating).toBe(4.5)
    await prisma.technician.delete({ where: { id: tech.id } })
  })

  it('should have Job model with status enum', async () => {
    const factory = await prisma.factory.create({
      data: { name: 'F', address: 'A', city: 'C', phone: 'P' },
    })
    const job = await prisma.job.create({
      data: {
        factoryId: factory.id,
        specialtyNeeded: 'Plumbing',
        description: 'Leaking pipe in section B',
      },
    })
    expect(job.status).toBe('open')
    expect(job.urgency).toBe('normal')
    expect(job.cost).toBe(0)
    await prisma.job.delete({ where: { id: job.id } })
    await prisma.factory.delete({ where: { id: factory.id } })
  })

  it('should have User model with role field', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        password: 'hashedpassword',
        role: 'factory',
        name: 'Test User',
      },
    })
    expect(user.role).toBe('factory')
    await prisma.user.delete({ where: { id: user.id } })
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run __tests__/prisma/schema.test.ts`
Expected: FAIL — schema doesn't have these models yet

- [ ] **Step 7: Write Prisma schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Factory {
  id        Int      @id @default(autoincrement())
  name      String
  address   String
  city      String
  phone     String
  email     String?
  createdAt DateTime @default(now())
  jobs      Job[]
}

model Technician {
  id        Int      @id @default(autoincrement())
  name      String
  email     String?  @unique
  specialty String
  city      String
  phone     String
  available Boolean  @default(true)
  rating    Float    @default(4.5)
  createdAt DateTime @default(now())
  jobs      Job[]
}

model Job {
  id              Int       @id @default(autoincrement())
  factoryId       Int
  technicianId    Int?
  specialtyNeeded String
  description     String
  status          String    @default("open")
  urgency         String    @default("normal")
  cost            Float     @default(0)
  createdAt       DateTime  @default(now())
  resolvedAt      DateTime?
  factory         Factory   @relation(fields: [factoryId], references: [id])
  technician      Technician? @relation(fields: [technicianId], references: [id])
}

model CallLog {
  id        Int      @id @default(autoincrement())
  phone     String
  intent    String
  transcript String?
  createdAt DateTime @default(now())
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      String
  name      String
  createdAt DateTime @default(now())
}
```

- [ ] **Step 8: Update .env with correct database URL**

```
DATABASE_URL="file:./dev.db"
```

- [ ] **Step 9: Run Prisma migrate**

Run: `npx prisma migrate dev --name init`
Expected: Migration created, database created

- [ ] **Step 10: Run tests to verify they pass**

Run: `npx vitest run __tests__/prisma/schema.test.ts`
Expected: PASS

- [ ] **Step 11: Write seed script**

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.job.deleteMany()
  await prisma.callLog.deleteMany()
  await prisma.user.deleteMany()
  await prisma.technician.deleteMany()
  await prisma.factory.deleteMany()

  // Seed factories
  const factories = await Promise.all([
    prisma.factory.create({
      data: { name: 'Tata Steel', address: 'Jamshedpur Industrial Area', city: 'Jamshedpur', phone: '+91-657-1000001' },
    }),
    prisma.factory.create({
      data: { name: 'Bhushan Steel', address: 'Dhanbad Sector 7', city: 'Dhanbad', phone: '+91-326-1000002' },
    }),
    prisma.factory.create({
      data: { name: 'JSW', address: 'Ranchi Plant Road', city: 'Ranchi', phone: '+91-651-1000003' },
    }),
    prisma.factory.create({
      data: { name: 'Bokaro Steel Plant', address: 'Bokaro Main Gate', city: 'Bokaro', phone: '+91-6542-100004' },
    }),
    prisma.factory.create({
      data: { name: 'Tata Steel', address: 'Hazaribagh Unit Park', city: 'Hazaribagh', phone: '+91-6546-100005' },
    }),
  ])

  // Seed technicians
  const technicians = await Promise.all([
    prisma.technician.create({ data: { name: 'Aman Singh', specialty: 'HVAC', city: 'Jamshedpur', phone: '+91-9000001001', rating: 4.7 } }),
    prisma.technician.create({ data: { name: 'Nisha Das', specialty: 'HVAC', city: 'Ranchi', phone: '+91-9000001002', rating: 4.5 } }),
    prisma.technician.create({ data: { name: 'Ravi Kumar', specialty: 'Plumbing', city: 'Dhanbad', phone: '+91-9000001003', rating: 4.4 } }),
    prisma.technician.create({ data: { name: 'Meera Jain', specialty: 'Plumbing', city: 'Bokaro', phone: '+91-9000001004', rating: 4.6 } }),
    prisma.technician.create({ data: { name: 'Arjun Patel', specialty: 'Electrical', city: 'Ranchi', phone: '+91-9000001005', rating: 4.8 } }),
    prisma.technician.create({ data: { name: 'Pooja Roy', specialty: 'Electrical', city: 'Hazaribagh', phone: '+91-9000001006', rating: 4.3 } }),
    prisma.technician.create({ data: { name: 'Sahil Ali', specialty: 'Pest', city: 'Dhanbad', phone: '+91-9000001007', rating: 4.2 } }),
    prisma.technician.create({ data: { name: 'Kiran Sen', specialty: 'Pest', city: 'Jamshedpur', phone: '+91-9000001008', rating: 4.1 } }),
    prisma.technician.create({ data: { name: 'Vikram Bose', specialty: 'Industrial', city: 'Bokaro', phone: '+91-9000001009', rating: 4.9 } }),
    prisma.technician.create({ data: { name: 'Anita Verma', specialty: 'Industrial', city: 'Hazaribagh', phone: '+91-9000001010', rating: 4.6 } }),
  ])

  // Seed jobs (20)
  const jobData = [
    { factoryId: factories[0].id, specialtyNeeded: 'HVAC', description: 'AC compressor failure in assembly line unit 3', status: 'open', urgency: 'high' },
    { factoryId: factories[1].id, specialtyNeeded: 'Plumbing', description: 'Major water leak in cooling system pipes', status: 'assigned', urgency: 'critical', technicianId: technicians[2].id },
    { factoryId: factories[2].id, specialtyNeeded: 'Electrical', description: 'Short circuit in main distribution panel', status: 'in_progress', urgency: 'critical', technicianId: technicians[4].id },
    { factoryId: factories[3].id, specialtyNeeded: 'Industrial', description: 'Conveyor belt motor overheating and shutting down', status: 'open', urgency: 'high' },
    { factoryId: factories[4].id, specialtyNeeded: 'Pest', description: 'Termite damage detected in wooden storage area', status: 'resolved', urgency: 'normal', technicianId: technicians[6].id, cost: 15000 },
    { factoryId: factories[0].id, specialtyNeeded: 'Electrical', description: 'Generator not starting, backup power down', status: 'open', urgency: 'high' },
    { factoryId: factories[1].id, specialtyNeeded: 'HVAC', description: 'Ventilation system producing unusual noise', status: 'assigned', urgency: 'normal', technicianId: technicians[0].id },
    { factoryId: factories[2].id, specialtyNeeded: 'Plumbing', description: 'Drainage blockage in worker washroom area', status: 'resolved', urgency: 'low', technicianId: technicians[3].id, cost: 8000 },
    { factoryId: factories[3].id, specialtyNeeded: 'Industrial', description: 'Gearbox failure in stamping machine line 2', status: 'in_progress', urgency: 'critical', technicianId: technicians[8].id },
    { factoryId: factories[4].id, specialtyNeeded: 'Electrical', description: 'Fuse panels tripping repeatedly in section C', status: 'open', urgency: 'normal' },
    { factoryId: factories[0].id, specialtyNeeded: 'Pest', description: 'Cockroach infestation in cafeteria area', status: 'resolved', urgency: 'low', technicianId: technicians[7].id, cost: 5000 },
    { factoryId: factories[1].id, specialtyNeeded: 'Industrial', description: 'Boiler pressure gauge showing abnormal readings', status: 'open', urgency: 'high' },
    { factoryId: factories[2].id, specialtyNeeded: 'HVAC', description: 'Refrigerant leak in cold storage unit', status: 'assigned', urgency: 'high', technicianId: technicians[1].id },
    { factoryId: factories[3].id, specialtyNeeded: 'Plumbing', description: 'Water tank overflow sensor malfunction', status: 'resolved', urgency: 'normal', cost: 12000, technicianId: technicians[2].id },
    { factoryId: factories[4].id, specialtyNeeded: 'Industrial', description: 'Motor vibration excessive in packaging line', status: 'in_progress', urgency: 'high', technicianId: technicians[9].id },
    { factoryId: factories[0].id, specialtyNeeded: 'Plumbing', description: 'Fire sprinkler system pressure drop', status: 'open', urgency: 'critical' },
    { factoryId: factories[1].id, specialtyNeeded: 'Pest', description: 'Rat droppings found near raw material storage', status: 'assigned', urgency: 'high', technicianId: technicians[6].id },
    { factoryId: factories[2].id, specialtyNeeded: 'Electrical', description: 'Emergency lighting system failure in warehouse', status: 'resolved', urgency: 'normal', cost: 9500, technicianId: technicians[5].id },
    { factoryId: factories[3].id, specialtyNeeded: 'HVAC', description: 'Air conditioning units not cooling below 28°C', status: 'open', urgency: 'normal' },
    { factoryId: factories[4].id, specialtyNeeded: 'Industrial', description: 'Hydraulic press cylinder seal replacement needed', status: 'open', urgency: 'high' },
  ]

  for (const job of jobData) {
    await prisma.job.create({ data: job })
  }

  // Seed users
  await prisma.user.create({
    data: { email: 'admin@fixforge.in', password: 'admin123', role: 'admin', name: 'Admin' },
  })
  await prisma.user.create({
    data: { email: 'owner@tatasteel.in', password: 'pass123', role: 'factory', name: 'Factory Owner' },
  })
  await prisma.user.create({
    data: { email: 'aman.singh@fixforge.in', password: 'pass123', role: 'technician', name: 'Aman Singh' },
  })

  // Seed call logs
  await prisma.callLog.createMany({
    data: [
      { phone: '+91-9876543210', intent: 'HVAC', transcript: 'Our AC unit in the main hall is not working' },
      { phone: '+91-9876543211', intent: 'Plumbing', transcript: 'Water pipe burst in the basement' },
      { phone: '+91-9876543212', intent: 'Electrical', transcript: 'Power outage in section B, generator not starting' },
      { phone: '+91-9876543213', intent: 'Industrial', transcript: 'Conveyor belt stopped working' },
      { phone: '+91-9876543214', intent: 'Pest', transcript: 'Termite problem in the wooden crates area' },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

- [ ] **Step 12: Update package.json with seed script**

```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```

- [ ] **Step 13: Run seed**

Run: `npx prisma db seed`
Expected: "Database seeded successfully!"

- [ ] **Step 14: Verify seed data**

Run: `npx prisma studio` (or test queries)
Expected: 5 factories, 10 technicians, 20 jobs, 3 users, 5 call logs

- [ ] **Step 15: Commit**

```bash
git add prisma/ lib/prisma.ts __tests__/ .env
git commit -m "feat: add Prisma schema, seed data, and database tests"
```

---

## Task 2: Auth System + Tests

**Files:**
- Create: `lib/auth.ts`
- Create: `middleware.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/register/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/me/route.ts`
- Create: `app/login/page.tsx`
- Create: `app/register/page.tsx`
- Create: `__tests__/lib/auth.test.ts`
- Create: `__tests__/api/auth.test.ts`

- [ ] **Step 1: Write failing tests for auth helpers**

```typescript
// __tests__/lib/auth.test.ts
import { describe, it, expect } from 'vitest'

describe('Auth helpers', () => {
  it('should hash password correctly', async () => {
    const { hashPassword } = await import('@/lib/auth')
    const hashed = await hashPassword('testpass123')
    expect(hashed).not.toBe('testpass123')
    expect(hashed.length).toBeGreaterThan(20)
  })

  it('should verify password correctly', async () => {
    const { hashPassword, verifyPassword } = await import('@/lib/auth')
    const hashed = await hashPassword('mypassword')
    expect(await verifyPassword('mypassword', hashed)).toBe(true)
    expect(await verifyPassword('wrongpassword', hashed)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run __tests__/lib/auth.test.ts`
Expected: FAIL with "Cannot find module '@/lib/auth'"

- [ ] **Step 3: Implement auth helpers**

```typescript
// lib/auth.ts
import { cookies } from 'next/headers'
import crypto from 'crypto'

const SESSION_COOKIE = 'fixforge-session'

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

export async function createSession(userId: number, role: string, name: string) {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify({ userId, role, name })
  const encoded = Buffer.from(sessionData).toString('base64')
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (!session) return null
  try {
    const decoded = Buffer.from(session.value, 'base64').toString('utf-8')
    return JSON.parse(decoded) as { userId: number; role: string; name: string }
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run __tests__/lib/auth.test.ts`
Expected: PASS

- [ ] **Step 5: Write failing tests for API routes**

```typescript
// __tests__/api/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Auth API Routes', () => {
  const baseURL = 'http://localhost:3000'

  it('POST /api/auth/register should create a new user', async () => {
    const res = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newuser@test.com',
        password: 'testpass123',
        name: 'Test User',
        role: 'factory',
      }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('user')
    expect(data.user.email).toBe('newuser@test.com')
  })

  it('POST /api/auth/login should return session', async () => {
    const res = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fixforge.in', password: 'admin123' }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.user.role).toBe('admin')
  })

  it('POST /api/auth/login should reject wrong password', async () => {
    const res = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fixforge.in', password: 'wrong' }),
    })
    expect(res.status).toBe(401)
  })
})
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `npx vitest run __tests__/api/auth.test.ts`
Expected: FAIL — routes don't exist

- [ ] **Step 7: Implement API routes**

(Implement `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` routes)

- [ ] **Step 8: Run tests to verify they pass**

Run: `npx vitest run __tests__/api/auth.test.ts`
Expected: PASS

- [ ] **Step 9: Implement login and register pages**

(Implement `app/login/page.tsx` and `app/register/page.tsx` with shadcn forms)

- [ ] **Step 10: Implement middleware for route protection**

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('fixforge-session')
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/technician') || pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect logged-in users from auth pages
  if (pathname === '/login' || pathname === '/register') {
    if (session) {
      try {
        const data = JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'))
        if (data.role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
        if (data.role === 'technician') return NextResponse.redirect(new URL('/technician', request.url))
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch {
        // Invalid session, let them login
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/technician/:path*', '/admin/:path*', '/login', '/register'],
}
```

- [ ] **Step 11: Commit**

```bash
git add lib/auth.ts middleware.ts app/api/auth/ app/login/ app/register/ __tests__/
git commit -m "feat: add auth system with login, register, and route protection"
```

---

## Task 3: API Routes (Jobs, Technicians, Factories, Stats) + Tests

**Files:**
- Create: `app/api/jobs/route.ts`
- Create: `app/api/jobs/[id]/route.ts`
- Create: `app/api/technicians/route.ts`
- Create: `app/api/technicians/[id]/route.ts`
- Create: `app/api/factories/route.ts`
- Create: `app/api/factories/[id]/route.ts`
- Create: `app/api/stats/route.ts`
- Create: `app/api/calls/route.ts`
- Create: `__tests__/api/jobs.test.ts`
- Create: `__tests__/api/technicians.test.ts`
- Create: `__tests__/api/factories.test.ts`
- Create: `__tests__/api/stats.test.ts`

- [ ] **Step 1: Write failing tests for Jobs API**

```typescript
// __tests__/api/jobs.test.ts
import { describe, it, expect } from 'vitest'

const baseURL = 'http://localhost:3000'

describe('Jobs API', () => {
  it('GET /api/jobs should return list of jobs', async () => {
    const res = await fetch(`${baseURL}/api/jobs`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('id')
    expect(data[0]).toHaveProperty('factory')
    expect(data[0]).toHaveProperty('technician')
  })

  it('POST /api/jobs should create a new job', async () => {
    const res = await fetch(`${baseURL}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        factoryId: 1,
        specialtyNeeded: 'HVAC',
        description: 'Test job description',
        urgency: 'high',
      }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('id')
    expect(data.status).toBe('open')
  })

  it('GET /api/jobs/1 should return single job', async () => {
    const res = await fetch(`${baseURL}/api/jobs/1`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('id', 1)
    expect(data).toHaveProperty('factory')
  })

  it('PUT /api/jobs/1 should update job status', async () => {
    const res = await fetch(`${baseURL}/api/jobs/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'assigned', technicianId: 1 }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('assigned')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run __tests__/api/jobs.test.ts`
Expected: FAIL — routes don't exist

- [ ] **Step 3: Implement Jobs API routes**

(Implement GET/POST `/api/jobs` and GET/PUT `/api/jobs/[id]` with Prisma queries, including factory and technician relations)

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run __tests__/api/jobs.test.ts`
Expected: PASS

- [ ] **Step 5: Write failing tests for Technicians API**

```typescript
// __tests__/api/technicians.test.ts
import { describe, it, expect } from 'vitest'

const baseURL = 'http://localhost:3000'

describe('Technicians API', () => {
  it('GET /api/technicians should return list', async () => {
    const res = await fetch(`${baseURL}/api/technicians`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(10)
  })

  it('GET /api/technicians?specialty=HVAC should filter', async () => {
    const res = await fetch(`${baseURL}/api/technicians?specialty=HVAC`)
    const data = await res.json()
    expect(data.every((t: any) => t.specialty === 'HVAC')).toBe(true)
  })

  it('PUT /api/technicians/1 should update availability', async () => {
    const res = await fetch(`${baseURL}/api/technicians/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: false }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.available).toBe(false)
    // Restore
    await fetch(`${baseURL}/api/technicians/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: true }),
    })
  })
})
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `npx vitest run __tests__/api/technicians.test.ts`
Expected: FAIL

- [ ] **Step 7: Implement Technicians API routes**

(Implement GET `/api/technicians` with filters and PUT `/api/technicians/[id]`)

- [ ] **Step 8: Run tests to verify they pass**

Run: `npx vitest run __tests__/api/technicians.test.ts`
Expected: PASS

- [ ] **Step 9: Write failing tests for Factories + Stats + Calls APIs**

```typescript
// __tests__/api/factories.test.ts
import { describe, it, expect } from 'vitest'

const baseURL = 'http://localhost:3000'

describe('Factories API', () => {
  it('GET /api/factories should return 5 factories', async () => {
    const res = await fetch(`${baseURL}/api/factories`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBe(5)
  })
})

describe('Stats API', () => {
  it('GET /api/stats should return stats object', async () => {
    const res = await fetch(`${baseURL}/api/stats`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('totalFactories')
    expect(data).toHaveProperty('totalTechnicians')
    expect(data).toHaveProperty('totalJobs')
    expect(data).toHaveProperty('openJobs')
    expect(data).toHaveProperty('jobsBySpecialty')
  })
})

describe('Calls API', () => {
  it('GET /api/calls should return call logs', async () => {
    const res = await fetch(`${baseURL}/api/calls`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 10: Run tests to verify they fail**

Run: `npx vitest run __tests__/api/factories.test.ts`
Expected: FAIL

- [ ] **Step 11: Implement Factories, Stats, and Calls API routes**

(Implement all remaining API routes)

- [ ] **Step 12: Run tests to verify they pass**

Run: `npx vitest run __tests__/api/factories.test.ts`
Expected: PASS

- [ ] **Step 13: Commit**

```bash
git add app/api/jobs/ app/api/technicians/ app/api/factories/ app/api/stats/ app/api/calls/ __tests__/api/
git commit -m "feat: add all API routes with tests"
```

---

## Task 4: Landing Page

**Files:**
- Modify: `app/page.tsx`
- Create: `components/landing/navbar.tsx`
- Create: `components/landing/hero.tsx`
- Create: `components/landing/problem-section.tsx`
- Create: `components/landing/how-it-works.tsx`
- Create: `components/landing/features.tsx`
- Create: `components/landing/stats-section.tsx`
- Create: `components/landing/testimonials.tsx`
- Create: `components/landing/cta-section.tsx`
- Create: `components/landing/footer.tsx`

- [ ] **Step 1: Create navbar component**

```typescript
// components/landing/navbar.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Wrench className="h-6 w-6" />
          FixForge
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How It Works</Link>
          <Link href="#stats" className="text-sm text-muted-foreground hover:text-foreground">Stats</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create hero section with MagicUI components**

(Implement hero with ShimmerButton, animated background, gradient text)

- [ ] **Step 3: Create problem section with severity score**

(Implement problem statement with animated stats)

- [ ] **Step 4: Create how-it-works section with bento grid**

(Implement 3-step bento grid with BorderBeam effects)

- [ ] **Step 5: Create features section with marquee**

(Implement feature cards in MagicUI Marquee)

- [ ] **Step 6: Create stats section with number ticker**

(Implement animated counters)

- [ ] **Step 7: Create testimonials and CTA sections**

(Implement testimonial cards and CTA with ShimmerButton)

- [ ] **Step 8: Create footer**

(Implement simple footer)

- [ ] **Step 9: Assemble landing page**

(Update `app/page.tsx` to compose all sections)

- [ ] **Step 10: Verify landing page renders**

Run: `npm run dev` → open http://localhost:3000
Expected: All sections visible, animations playing

- [ ] **Step 11: Commit**

```bash
git add app/page.tsx components/landing/
git commit -m "feat: add animated landing page with MagicUI components"
```

---

## Task 5: Factory Owner Dashboard

**Files:**
- Create: `app/dashboard/layout.tsx`
- Create: `app/dashboard/page.tsx`
- Create: `app/dashboard/jobs/page.tsx`
- Create: `app/dashboard/jobs/new/page.tsx`
- Create: `app/dashboard/technicians/page.tsx`

- [ ] **Step 1: Create dashboard layout with sidebar**

(Implement responsive sidebar with navigation)

- [ ] **Step 2: Create overview page with stats cards**

(Implement stats cards with data from API)

- [ ] **Step 3: Create jobs list page**

(Implement table with filters and status badges)

- [ ] **Step 4: Create post job form**

(Implement form with specialty and urgency selectors)

- [ ] **Step 5: Create technicians browse page**

(Implement card grid with filters)

- [ ] **Step 6: Verify dashboard renders**

Run: `npm run dev` → login as factory owner → navigate all pages
Expected: All pages load, data displays correctly

- [ ] **Step 7: Commit**

```bash
git add app/dashboard/
git commit -m "feat: add factory owner dashboard with jobs and technicians"
```

---

## Task 6: Technician Dashboard

**Files:**
- Create: `app/technician/layout.tsx`
- Create: `app/technician/page.tsx`
- Create: `app/technician/jobs/[id]/page.tsx`
- Create: `app/technician/profile/page.tsx`

- [ ] **Step 1: Create technician layout**

(Implement sidebar with technician nav items)

- [ ] **Step 2: Create assignments page**

(Implement job cards with accept/decline buttons)

- [ ] **Step 3: Create job detail page**

(Implement full job info with status update)

- [ ] **Step 4: Create profile page**

(Implement availability toggle and profile display)

- [ ] **Step 5: Verify technician dashboard**

Run: `npm run dev` → login as technician → navigate all pages
Expected: All pages load, can accept/update jobs

- [ ] **Step 6: Commit**

```bash
git add app/technician/
git commit -m "feat: add technician dashboard with job management"
```

---

## Task 7: Admin Panel

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/admin/dispatch/page.tsx`
- Create: `app/admin/technicians/page.tsx`
- Create: `app/admin/factories/page.tsx`
- Create: `app/admin/calls/page.tsx`

- [ ] **Step 1: Create admin layout**

(Implement sidebar with admin nav items)

- [ ] **Step 2: Create admin overview with system stats**

(Implement system-wide stats and activity feed)

- [ ] **Step 3: Create dispatch board**

(Implement Kanban-style board with assign functionality)

- [ ] **Step 4: Create technicians management page**

(Implement CRUD table with add/edit dialogs)

- [ ] **Step 5: Create factories management page**

(Implement CRUD table with add/edit dialogs)

- [ ] **Step 6: Create call logs page**

(Implement call log table)

- [ ] **Step 7: Verify admin panel**

Run: `npm run dev` → login as admin → navigate all pages
Expected: All pages load, can manage technicians and factories

- [ ] **Step 8: Commit**

```bash
git add app/admin/
git commit -m "feat: add admin panel with dispatch board and management"
```

---

## Task 8: Polish + Dark Mode + Final Validation

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Various component refinements

- [ ] **Step 1: Add dark mode with next-themes**

(Add ThemeProvider, dark mode toggle, update CSS variables)

- [ ] **Step 2: Add loading skeletons**

(Add skeleton components for data-loading states)

- [ ] **Step 3: Add toast notifications**

(Add Sonner toasts for all user actions)

- [ ] **Step 4: Responsive fine-tuning**

(Test all pages at 375px, 768px, 1024px, 1440px)

- [ ] **Step 5: Run full build**

Run: `npm run build`
Expected: No TypeScript errors, clean build

- [ ] **Step 6: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 7: Final manual validation**

- Landing page renders with all animations ✓
- Register as factory owner → redirected to /dashboard ✓
- Register as technician → redirected to /technician ✓
- Login as admin → redirected to /admin ✓
- Post a job → appears in jobs list ✓
- Assign technician → status changes ✓
- Technician accepts → status changes ✓
- Technician resolves → status changes ✓
- All pages responsive ✓
- Dark mode works ✓

- [ ] **Step 8: Commit and push**

```bash
git add .
git commit -m "feat: add dark mode, loading states, and polish"
git push origin main
```
