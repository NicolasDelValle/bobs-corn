import { prisma } from "../lib/db";

export async function cleanupOldRateLimits(daysToKeep: number = 7) {
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

  const result = await prisma.rateLimit.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
    },
  });

  return result.count;
}

export async function cleanupOldClients(daysInactive: number = 30) {
  const cutoffDate = new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000);

  const result = await prisma.client.deleteMany({
    where: {
      lastActive: {
        lt: cutoffDate,
      },
      purchases: {
        none: {},
      },
    },
  });

  return result.count;
}
