import { describe, it, expect } from 'vitest'

const baseURL = 'http://localhost:3000'

describe('Stats API Routes', () => {
  it('GET /api/stats should return aggregated stats', async () => {
    const res = await fetch(`${baseURL}/api/stats`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('totalFactories')
    expect(data).toHaveProperty('totalTechnicians')
    expect(data).toHaveProperty('totalJobs')
    expect(data).toHaveProperty('openJobs')
    expect(data).toHaveProperty('assignedJobs')
    expect(data).toHaveProperty('inProgressJobs')
    expect(data).toHaveProperty('resolvedJobs')
    expect(data).toHaveProperty('jobsBySpecialty')
    expect(data).toHaveProperty('recentActivity')

    expect(data.totalFactories).toBeGreaterThanOrEqual(5)
    expect(data.totalTechnicians).toBeGreaterThanOrEqual(10)
    expect(data.totalJobs).toBeGreaterThanOrEqual(20)

    expect(typeof data.jobsBySpecialty).toBe('object')
    expect(Array.isArray(data.recentActivity)).toBe(true)
  })
})
