import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalFactories,
      totalTechnicians,
      totalJobs,
      openJobs,
      assignedJobs,
      inProgressJobs,
      resolvedJobs,
      jobsBySpecialty,
      recentActivity,
    ] = await Promise.all([
      prisma.factory.count(),
      prisma.technician.count(),
      prisma.job.count(),
      prisma.job.count({ where: { status: 'open' } }),
      prisma.job.count({ where: { status: 'assigned' } }),
      prisma.job.count({ where: { status: 'in_progress' } }),
      prisma.job.count({ where: { status: 'resolved' } }),
      prisma.job.groupBy({
        by: ['specialtyNeeded'],
        _count: true,
      }),
      prisma.job.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { factory: true, technician: true },
      }),
    ])

    const jobsBySpecialtyMap: Record<string, number> = {}
    for (const entry of jobsBySpecialty) {
      jobsBySpecialtyMap[entry.specialtyNeeded] = entry._count
    }

    return NextResponse.json({
      totalFactories,
      totalTechnicians,
      totalJobs,
      openJobs,
      assignedJobs,
      inProgressJobs,
      resolvedJobs,
      jobsBySpecialty: jobsBySpecialtyMap,
      recentActivity,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
