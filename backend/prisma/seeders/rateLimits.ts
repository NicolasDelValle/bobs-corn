import { PrismaClient } from "../../generated/prisma/client";
import { logStep, logSuccess } from "./utils";

export async function seedRateLimits(
  prisma: PrismaClient,
  clients: any[],
  paymentMethods: any[]
) {
  if (!clients.length || !paymentMethods.length) {
    console.log("⚠️  Skipping rate limits - missing dependencies");
    return;
  }

  logStep("Creating rate limit entries");

  const rateLimitEntries = [
    {
      clientId: clients[0]?.id,
      paymentMethodId: paymentMethods[0]?.id,
      windowStart: new Date(Date.now() - 30000), // 30 seconds ago
      requestCount: 1,
    },
    {
      clientId: clients[1]?.id,
      paymentMethodId: paymentMethods[1]?.id,
      windowStart: new Date(Date.now() - 120000), // 2 minutes ago
      requestCount: 1,
    },
  ];

  for (const entry of rateLimitEntries) {
    if (entry.clientId && entry.paymentMethodId) {
      await prisma.rateLimit.create({ data: entry });
    }
  }

  logSuccess(`Created ${rateLimitEntries.length} rate limit entries`);
}
