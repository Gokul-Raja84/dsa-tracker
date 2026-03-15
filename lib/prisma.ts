import { PrismaClient } from '@prisma/client'
const g = globalThis as any
export const prisma: PrismaClient = g._prisma ?? (g._prisma = new PrismaClient())
