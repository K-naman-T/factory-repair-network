import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const factory = await prisma.factory.findUnique({
      where: { id: Number(id) },
      include: { jobs: { include: { technician: true }, orderBy: { createdAt: 'desc' } } },
    })

    if (!factory) {
      return NextResponse.json({ error: 'Factory not found' }, { status: 404 })
    }

    return NextResponse.json(factory)
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
    const { name, address, city, phone } = body

    const existing = await prisma.factory.findUnique({ where: { id: Number(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Factory not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    if (name !== undefined) data.name = name
    if (address !== undefined) data.address = address
    if (city !== undefined) data.city = city
    if (phone !== undefined) data.phone = phone

    const factory = await prisma.factory.update({
      where: { id: Number(id) },
      data,
    })

    return NextResponse.json(factory)
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

    const existing = await prisma.factory.findUnique({ where: { id: Number(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Factory not found' }, { status: 404 })
    }

    await prisma.job.deleteMany({ where: { factoryId: Number(id) } })
    await prisma.factory.delete({ where: { id: Number(id) } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
