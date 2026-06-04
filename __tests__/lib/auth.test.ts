import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/headers', () => {
  const store = new Map<string, { value: string; attrs: Record<string, unknown> }>()
  return {
    cookies: vi.fn(async () => ({
      get: (name: string) => store.get(name) || undefined,
      set: (name: string, value: string, attrs?: Record<string, unknown>) => store.set(name, { value, attrs: attrs || {} }),
      delete: (name: string) => store.delete(name),
    })),
  }
})

describe('Auth helpers', () => {
  beforeEach(() => {
    vi.resetModules()
  })

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

  it('should sign and verify session data with HMAC', async () => {
    const { createSession, getSession, destroySession } = await import('@/lib/auth')
    await createSession(42, 'admin', 'Test Admin')
    const session = await getSession()
    expect(session).not.toBeNull()
    expect(session!.userId).toBe(42)
    expect(session!.role).toBe('admin')
    expect(session!.name).toBe('Test Admin')

    await destroySession()
    const gone = await getSession()
    expect(gone).toBeNull()
  })

  it('should reject tampered session cookies', async () => {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    cookieStore.set('fixforge-session', 'tampered.invalid.sig', {})
    const { getSession } = await import('@/lib/auth')
    const session = await getSession()
    expect(session).toBeNull()
  })
})
