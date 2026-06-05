import { describe, it, expect } from 'vitest'

const baseURL = process.env.API_BASE_URL || 'http://localhost:3000'

describe('Auth API Routes', () => {
  it('POST /api/auth/register should create a new factory user', async () => {
    const email = `factory${Date.now()}@test.com`
    const res = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'testpass123',
        name: 'Factory Owner',
        role: 'factory',
        factoryName: 'Test Factory',
        city: 'Mumbai',
      }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('user')
    expect(data.user.role).toBe('factory')
  })

  it('POST /api/auth/register should create a new technician user', async () => {
    const email = `tech${Date.now()}@test.com`
    const res = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'testpass123',
        name: 'Test Technician',
        role: 'technician',
        specialty: 'HVAC',
        city: 'Delhi',
      }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('user')
    expect(data.user.role).toBe('technician')
  })

  it('POST /api/auth/register should reject duplicate email', async () => {
    const email = `dup${Date.now()}@test.com`
    await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'testpass123',
        name: 'First User',
        role: 'technician',
        specialty: 'Plumbing',
        city: 'Pune',
      }),
    })
    const res = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: 'testpass456',
        name: 'Second User',
        role: 'factory',
        factoryName: 'Dup Factory',
        city: 'Pune',
      }),
    })
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toContain('already registered')
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
