import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const factories = await prisma.factory.findMany({
      include: { _count: { select: { jobs: true } } },
    })

    return NextResponse.json(factories)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, city, phone } = body

    if (!name || !address || !city || !phone) {
      return NextResponse.json(
        { error: 'name, address, city, and phone are required' },
        { status: 400 }
      )
    }

    const factory = await prisma.factory.create({
      data: { name, address, city, phone },
    })

    return NextResponse.json(factory, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
