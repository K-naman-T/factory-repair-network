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
