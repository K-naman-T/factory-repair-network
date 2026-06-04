import { cookies } from 'next/headers'
import crypto from 'crypto'

const SESSION_COOKIE = 'fixforge-session'

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

export async function createSession(userId: number, role: string, name: string) {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify({ userId, role, name })
  const encoded = Buffer.from(sessionData).toString('base64')
  cookieStore.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (!session) return null
  try {
    const decoded = Buffer.from(session.value, 'base64').toString('utf-8')
    return JSON.parse(decoded) as { userId: number; role: string; name: string }
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
