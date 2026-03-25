import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
       await prisma.$connect()
       console.log("Database connected")
  } catch (e) {
       console.error("Connection failed: ", e)
  } finally {
       await prisma.$disconnect()
  }
}