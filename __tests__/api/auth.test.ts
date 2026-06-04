import { describe, it, expect } from 'vitest'

const baseURL = 'http://localhost:3000'

describe('Auth API Routes', () => {
  it('POST /api/auth/register should create a new user', async () => {
    const res = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `newuser${Date.now()}@test.com`,
        password: 'testpass123',
        name: 'Test User',
        role: 'factory',
      }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('user')
    expect(data.user.email).toContain('@test.com')
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

  it('POST /api/auth/login should reject non-existent user', async () => {
    const res = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@test.com', password: 'pass' }),
    })
    expect(res.status).toBe(401)
  })
})
