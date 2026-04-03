import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy-initialize Prisma only when actually used at runtime.
// This prevents build-time crashes when no DATABASE_URL is configured.
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    try {
      globalForPrisma.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    } catch {
      // During build or when no DB is configured, return a stub
      console.warn('[db] PrismaClient failed to initialize — running without database')
      return new Proxy({} as PrismaClient, {
        get: (_target, prop) => {
          if (typeof prop === 'string') {
            return new Proxy({}, {
              get: () => async () => {
                throw new Error('Database not configured. Set DATABASE_URL in your environment.')
              },
            })
          }
          return undefined
        },
      })
    }
  }
  return globalForPrisma.prisma
}

export const prisma = getPrismaClient()
