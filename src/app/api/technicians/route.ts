import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
