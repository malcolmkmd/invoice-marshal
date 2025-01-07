// lib/prisma.ts
import { PrismaClient } from '@prisma/client'; // Running `npx prisma generate` fixes module not found error.

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
