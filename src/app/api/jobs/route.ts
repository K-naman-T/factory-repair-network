import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const specialty = searchParams.get('specialty')
    const factoryId = searchParams.get('factoryId')
    const technicianId = searchParams.get('technicianId')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (specialty) where.specialtyNeeded = specialty
    if (factoryId) where.factoryId = Number(factoryId)
    if (technicianId) where.technicianId = Number(technicianId)

    const jobs = await prisma.job.findMany({
      where,
      include: { factory: true, technician: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(jobs)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { factoryId, specialtyNeeded, description, urgency, technicianId } = body

    if (!factoryId || !specialtyNeeded || !description) {
      return NextResponse.json(
        { error: 'factoryId, specialtyNeeded, and description are required' },
        { status: 400 }
      )
    }

    let assignedTechnicianId = technicianId

    if (!assignedTechnicianId) {
      const bestTech = await prisma.technician.findFirst({
        where: { specialty: specialtyNeeded, available: true },
        orderBy: { rating: 'desc' },
      })
      if (bestTech) {
        assignedTechnicianId = bestTech.id
      }
    }

    const job = await prisma.job.create({
      data: {
        factoryId,
        specialtyNeeded,
        description,
        urgency: urgency || 'normal',
        status: assignedTechnicianId ? 'assigned' : 'open',
        technicianId: assignedTechnicianId ?? undefined,
      },
      include: { factory: true, technician: true },
    })

    return NextResponse.json(job, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
