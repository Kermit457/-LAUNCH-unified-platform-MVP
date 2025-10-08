// Legacy Prisma setup - not currently used (using Appwrite instead)
// Kept for backward compatibility with old prediction/social API routes

// Mock PrismaClient to prevent build errors
class MockPrismaClient {
  prediction = {
    findMany: async (_args?: any) => [],
    findUnique: async (_args?: any) => null,
    create: async (_args?: any) => null,
    update: async (_args?: any) => null,
  }
  vote = {
    findMany: async (_args?: any) => [],
    create: async (_args?: any) => null,
  }
  socialAction = {
    findMany: async (_args?: any) => [],
    findUnique: async (_args?: any) => null,
    create: async (_args?: any) => null,
    update: async (_args?: any) => null,
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: MockPrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new MockPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
