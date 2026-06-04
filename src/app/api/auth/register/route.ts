import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()
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

    await createSession(user.id, user.role, user.name)

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
