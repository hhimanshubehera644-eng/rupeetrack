import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export async function demoUser() {
  return db.user.upsert({
    where: { email: "bhabani@rupeetrack.local" },
    update: { name: "Bhabani" },
    create: { email: "bhabani@rupeetrack.local", name: "Bhabani" },
  });
}
