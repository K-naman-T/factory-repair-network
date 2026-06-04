import { describe, it, expect } from 'vitest'

describe('Prisma client singleton', () => {
  it('should return the same instance on multiple calls', async () => {
    const { getPrismaClient } = await import('@/lib/prisma')
    const client1 = getPrismaClient()
    const client2 = getPrismaClient()
    expect(client1).toBe(client2)
  })
})
