import { describe, it, expect } from 'vitest'

const baseURL = process.env.API_BASE_URL || 'http://localhost:3000'

describe('Technicians API Routes', () => {
  it('GET /api/technicians should return all technicians', async () => {
    const res = await fetch(`${baseURL}/api/technicians`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(10)
    const tech = data[0]
    expect(tech).toHaveProperty('id')
    expect(tech).toHaveProperty('name')
    expect(tech).toHaveProperty('specialty')
    expect(tech).toHaveProperty('city')
    expect(tech).toHaveProperty('phone')
    expect(tech).toHaveProperty('available')
    expect(tech).toHaveProperty('rating')
  })

  it('GET /api/technicians should filter by specialty', async () => {
    const res = await fetch(`${baseURL}/api/technicians?specialty=HVAC`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(2)
    for (const tech of data) {
      expect(tech.specialty).toBe('HVAC')
    }
  })

  it('GET /api/technicians should filter by city', async () => {
    const res = await fetch(`${baseURL}/api/technicians?city=Jamshedpur`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(1)
    for (const tech of data) {
      expect(tech.city).toBe('Jamshedpur')
    }
  })

  it('GET /api/technicians should filter by available', async () => {
    const res = await fetch(`${baseURL}/api/technicians?available=true`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    for (const tech of data) {
      expect(tech.available).toBe(true)
    }
  })

  it('POST /api/technicians should create a new technician', async () => {
    const res = await fetch(`${baseURL}/api/technicians`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Technician',
        specialty: 'HVAC',
        city: 'Mumbai',
        phone: '9999999999',
      }),
    })
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data).toHaveProperty('id')
    expect(data.name).toBe('Test Technician')
    expect(data.specialty).toBe('HVAC')
    expect(data.city).toBe('Mumbai')
    expect(data.phone).toBe('9999999999')
    expect(data.available).toBe(true)
    expect(data.rating).toBe(4.5)
  })

  it('POST /api/technicians should return 400 for missing fields', async () => {
    const res = await fetch(`${baseURL}/api/technicians`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Incomplete' }),
    })
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data).toHaveProperty('error')
  })

  it('PUT /api/technicians/[id] should update a technician', async () => {
    const res = await fetch(`${baseURL}/api/technicians/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: false, rating: 4.8 }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.available).toBe(false)
    expect(data.rating).toBe(4.8)

    // Restore
    await fetch(`${baseURL}/api/technicians/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: true, rating: 4.5 }),
    })
  })

  it('PUT /api/technicians/[id] should return 404 for non-existent', async () => {
    const res = await fetch(`${baseURL}/api/technicians/99999`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: false }),
    })
    expect(res.status).toBe(404)
  })
})
