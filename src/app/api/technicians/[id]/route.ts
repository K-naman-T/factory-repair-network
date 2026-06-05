import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { available, rating, phone } = body

    const existing = await prisma.technician.findUnique({ where: { id: Number(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    if (available !== undefined) data.available = available
    if (rating !== undefined) data.rating = rating
    if (phone !== undefined) data.phone = phone

    const technician = await prisma.technician.update({
      where: { id: Number(id) },
      data,
    })

    return NextResponse.json(technician)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
