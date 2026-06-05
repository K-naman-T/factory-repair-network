import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, specialty, city, phone, available, rating } = body

    if (!name || !specialty || !city || !phone) {
      return NextResponse.json(
        { error: 'name, specialty, city, and phone are required' },
        { status: 400 }
      )
    }

    const technician = await prisma.technician.create({
      data: {
        name,
        specialty,
        city,
        phone,
        available: available ?? true,
        rating: rating ?? 4.5,
      },
    })

    return NextResponse.json(technician, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const city = searchParams.get('city')
    const available = searchParams.get('available')

    const where: Record<string, unknown> = {}
    if (specialty) where.specialty = specialty
    if (city) where.city = city
    if (available !== null) where.available = available === 'true'

    const technicians = await prisma.technician.findMany({ where })

    return NextResponse.json(technicians)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
