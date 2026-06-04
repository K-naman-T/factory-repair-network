import { describe, it, expect, beforeAll } from 'vitest'
import { getPrismaClient } from '@/lib/prisma'

describe('Database Schema', () => {
  let prisma: ReturnType<typeof getPrismaClient>

  beforeAll(() => {
    prisma = getPrismaClient()
  })

  it('should have Factory model with required fields', async () => {
    const factory = await prisma.factory.create({
      data: { name: 'Test Factory', address: '123 Industrial Area', city: 'Test City', phone: '+91-123-4567890' },
    })
    expect(factory).toHaveProperty('id')
    expect(factory.name).toBe('Test Factory')
    await prisma.factory.delete({ where: { id: factory.id } })
  })

  it('should have Technician model with specialty', async () => {
    const tech = await prisma.technician.create({
      data: { name: 'Test Tech', specialty: 'HVAC', city: 'Test City', phone: '+91-123-4567891' },
    })
    expect(tech.specialty).toBe('HVAC')
    expect(tech.available).toBe(true)
    await prisma.technician.delete({ where: { id: tech.id } })
  })

  it('should have Job model with status', async () => {
    const factory = await prisma.factory.create({
      data: { name: 'F', address: 'A', city: 'C', phone: 'P' },
    })
    const job = await prisma.job.create({
      data: { factoryId: factory.id, specialtyNeeded: 'Plumbing', description: 'Leaking pipe' },
    })
    expect(job.status).toBe('open')
    expect(job.urgency).toBe('normal')
    await prisma.job.delete({ where: { id: job.id } })
    await prisma.factory.delete({ where: { id: factory.id } })
  })

  it('should have User model with role', async () => {
    const user = await prisma.user.create({
      data: { email: 'test@test.com', password: 'hashed', role: 'factory', name: 'Test User' },
    })
    expect(user.role).toBe('factory')
    await prisma.user.delete({ where: { id: user.id } })
  })
})
