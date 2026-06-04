import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPrismaClient } from '@/lib/prisma'

describe('Database Schema', () => {
  let prisma: ReturnType<typeof getPrismaClient>

  beforeAll(() => {
    prisma = getPrismaClient()
  })

  afterAll(() => prisma.$disconnect())

  it('should have Factory model with required fields', async () => {
    const factory = await prisma.factory.create({
      data: { name: 'Test Factory', address: '123 Industrial Area', city: 'Test City', phone: '+91-123-4567890' },
    })
    try {
      expect(factory).toHaveProperty('id')
      expect(factory.name).toBe('Test Factory')
    } finally {
      await prisma.factory.delete({ where: { id: factory.id } })
    }
  })

  it('should have Technician model with specialty', async () => {
    const tech = await prisma.technician.create({
      data: { name: 'Test Tech', specialty: 'HVAC', city: 'Test City', phone: '+91-123-4567891' },
    })
    try {
      expect(tech.specialty).toBe('HVAC')
      expect(tech.available).toBe(true)
    } finally {
      await prisma.technician.delete({ where: { id: tech.id } })
    }
  })

  it('should have Job model with status', async () => {
    const factory = await prisma.factory.create({
      data: { name: 'F', address: 'A', city: 'C', phone: 'P' },
    })
    try {
      const job = await prisma.job.create({
        data: { factoryId: factory.id, specialtyNeeded: 'Plumbing', description: 'Leaking pipe' },
      })
      try {
        expect(job.status).toBe('open')
        expect(job.urgency).toBe('normal')
      } finally {
        await prisma.job.delete({ where: { id: job.id } })
      }
    } finally {
      await prisma.factory.delete({ where: { id: factory.id } })
    }
  })

  it('should have User model with role', async () => {
    const user = await prisma.user.create({
      data: { email: 'test@test.com', password: 'hashed', role: 'factory', name: 'Test User' },
    })
    try {
      expect(user.role).toBe('factory')
    } finally {
      await prisma.user.delete({ where: { id: user.id } })
    }
  })
})
