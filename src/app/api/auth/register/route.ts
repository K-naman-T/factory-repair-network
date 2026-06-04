import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role, name },
    })

    if (role === 'technician') {
      const { specialty, city, phone } = body
      if (!specialty || !city) {
        await prisma.user.delete({ where: { id: user.id } })
        return NextResponse.json({ error: 'Specialty and city required for technicians' }, { status: 400 })
      }
      await prisma.technician.create({
        data: {
          name,
          email,
          specialty,
          city,
          phone: phone || '',
        },
      })
    } else if (role === 'factory') {
      const { factoryName, address, city, phone } = body
      if (!factoryName || !city) {
        await prisma.user.delete({ where: { id: user.id } })
        return NextResponse.json({ error: 'Factory name and city required for factory owners' }, { status: 400 })
      }
      await prisma.factory.create({
        data: {
          name: factoryName,
          address: address || '',
          city,
          phone: phone || '',
          email,
        },
      })
    }

    await createSession(user.id, user.role, user.name)

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
