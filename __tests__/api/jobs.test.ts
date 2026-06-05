import { describe, it, expect } from 'vitest'

const baseURL = process.env.API_BASE_URL || 'http://localhost:3000'

describe('Jobs API Routes', () => {
  let createdJobId: number

  it('GET /api/jobs should return all jobs with relations', async () => {
    const res = await fetch(`${baseURL}/api/jobs`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(20)
    const job = data[0]
    expect(job).toHaveProperty('id')
    expect(job).toHaveProperty('factoryId')
    expect(job).toHaveProperty('specialtyNeeded')
    expect(job).toHaveProperty('description')
    expect(job).toHaveProperty('status')
    expect(job).toHaveProperty('factory')
    expect(job.factory).toHaveProperty('name')
    expect(job).toHaveProperty('createdAt')
  })

  it('GET /api/jobs should filter by status', async () => {
    const res = await fetch(`${baseURL}/api/jobs?status=open`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(7)
    for (const job of data) {
      expect(job.status).toBe('open')
    }
  })

  it('GET /api/jobs should filter by specialty', async () => {
    const res = await fetch(`${baseURL}/api/jobs?specialty=HVAC`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(1)
    for (const job of data) {
      expect(job.specialtyNeeded).toBe('HVAC')
    }
  })

  it('GET /api/jobs should filter by factoryId', async () => {
    const res = await fetch(`${baseURL}/api/jobs?factoryId=1`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    for (const job of data) {
      expect(job.factoryId).toBe(1)
    }
  })

  it('GET /api/jobs should filter by technicianId', async () => {
    const res = await fetch(`${baseURL}/api/jobs?technicianId=1`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    for (const job of data) {
      expect(job.technicianId).toBe(1)
    }
  })

  it('GET /api/jobs should sort by createdAt desc', async () => {
    const res = await fetch(`${baseURL}/api/jobs`)
    expect(res.status).toBe(200)
    const data = await res.json()
    for (let i = 1; i < data.length; i++) {
      expect(new Date(data[i - 1].createdAt).getTime())
        .toBeGreaterThanOrEqual(new Date(data[i].createdAt).getTime())
    }
  })

  it('POST /api/jobs should create a new job with auto-assign', async () => {
    const res = await fetch(`${baseURL}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        factoryId: 1,
        specialtyNeeded: 'HVAC',
        description: 'Test HVAC repair job',
      }),
    })
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data).toHaveProperty('id')
    expect(data.factoryId).toBe(1)
    expect(data.specialtyNeeded).toBe('HVAC')
    expect(data.description).toBe('Test HVAC repair job')
    expect(data.status).toBe('assigned')
    expect(data.technicianId).not.toBeNull()
    expect(data.technician).toHaveProperty('name')
    createdJobId = data.id
  })

  it('GET /api/jobs/[id] should return a single job', async () => {
    const res = await fetch(`${baseURL}/api/jobs/1`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('id')
    expect(data.id).toBe(1)
    expect(data).toHaveProperty('factory')
    expect(data).toHaveProperty('technician')
  })

  it('GET /api/jobs/[id] should return 404 for non-existent job', async () => {
    const res = await fetch(`${baseURL}/api/jobs/99999`)
    expect(res.status).toBe(404)
  })

  it('PUT /api/jobs/[id] should update job status', async () => {
    const res = await fetch(`${baseURL}/api/jobs/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'in_progress' }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('in_progress')
  })

  it('PUT /api/jobs/[id] should set resolvedAt when resolved', async () => {
    const res = await fetch(`${baseURL}/api/jobs/${createdJobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved', cost: 500 }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('resolved')
    expect(data.cost).toBe(500)
    expect(data.resolvedAt).not.toBeNull()
  })

  it('PUT /api/jobs/[id] should return 404 for non-existent job', async () => {
    const res = await fetch(`${baseURL}/api/jobs/99999`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved' }),
    })
    expect(res.status).toBe(404)
  })
})
