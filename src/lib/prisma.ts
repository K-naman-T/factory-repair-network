import path from 'path'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL || 'file:./dev.db'
    const dbPath = connectionString.replace(/^file:/, '')
    const resolvedPath = path.resolve(process.cwd(), dbPath)
    const adapter = new PrismaBetterSqlite3({ url: `file:${resolvedPath}` })
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.prisma
}

export const prisma = getPrismaClient()
