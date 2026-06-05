import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const job = await prisma.job.findUnique({
      where: { id: Number(id) },
      include: { factory: true, technician: true },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, technicianId, cost, urgency } = body

    const validStatuses = ['open', 'assigned', 'in_progress', 'resolved']
    const validUrgencies = ['low', 'normal', 'high', 'critical']

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    if (body.urgency && !validUrgencies.includes(body.urgency)) {
      return NextResponse.json(
        { error: `Invalid urgency. Must be one of: ${validUrgencies.join(', ')}` },
        { status: 400 }
      )
    }

    const existing = await prisma.job.findUnique({ where: { id: Number(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    if (status !== undefined) data.status = status
    if (technicianId !== undefined) data.technicianId = technicianId
    if (cost !== undefined) data.cost = cost
    if (urgency !== undefined) data.urgency = urgency
    if (status === 'resolved') {
      data.resolvedAt = new Date()
    }

    const job = await prisma.job.update({
      where: { id: Number(id) },
      data,
      include: { factory: true, technician: true },
    })

    return NextResponse.json(job)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
