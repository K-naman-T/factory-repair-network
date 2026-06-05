import { describe, it, expect } from 'vitest'

const baseURL = process.env.API_BASE_URL || 'http://localhost:3000'

describe('Factories API Routes', () => {
  let createdFactoryId: number

  it('GET /api/factories should return factories with job count', async () => {
    const res = await fetch(`${baseURL}/api/factories`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(5)
    const factory = data[0]
    expect(factory).toHaveProperty('id')
    expect(factory).toHaveProperty('name')
    expect(factory).toHaveProperty('address')
    expect(factory).toHaveProperty('city')
    expect(factory).toHaveProperty('phone')
    expect(factory).toHaveProperty('_count')
    expect(factory._count).toHaveProperty('jobs')
  })

  it('POST /api/factories should create a new factory', async () => {
    const res = await fetch(`${baseURL}/api/factories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Factory',
        address: '123 Test St',
        city: 'Test City',
        phone: '+91-1234567890',
      }),
    })
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data).toHaveProperty('id')
    expect(data.name).toBe('Test Factory')
    expect(data.city).toBe('Test City')
    createdFactoryId = data.id
  })

  it('GET /api/factories/[id] should return a factory with jobs', async () => {
    const res = await fetch(`${baseURL}/api/factories/1`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('jobs')
    expect(Array.isArray(data.jobs)).toBe(true)
  })

  it('GET /api/factories/[id] should return 404 for non-existent', async () => {
    const res = await fetch(`${baseURL}/api/factories/99999`)
    expect(res.status).toBe(404)
  })
})
