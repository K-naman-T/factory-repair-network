import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, specialty, city, phone, available, rating } = body

    const existing = await prisma.technician.findUnique({ where: { id: Number(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (specialty !== undefined) data.specialty = specialty
    if (city !== undefined) data.city = city
    if (phone !== undefined) data.phone = phone
    if (available !== undefined) data.available = available
    if (rating !== undefined) data.rating = rating

    const technician = await prisma.technician.update({
      where: { id: Number(id) },
      data,
    })

    return NextResponse.json(technician)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.technician.findUnique({ where: { id: Number(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 })
    }

    // Unassign any jobs assigned to this technician
    await prisma.job.updateMany({
      where: { technicianId: Number(id), status: { not: 'resolved' } },
      data: { technicianId: null, status: 'open' },
    })

    await prisma.technician.delete({ where: { id: Number(id) } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
