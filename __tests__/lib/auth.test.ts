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
