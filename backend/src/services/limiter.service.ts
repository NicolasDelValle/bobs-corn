import { prisma } from "../models";
import type {
  RateLimitConfig,
  RateLimitResult,
} from "../common/types/rateLimit.types";

export async function checkAndIncrementRateLimit(
  clientId: string,
  paymentMethodId: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  const result = await prisma.$transaction(
    async (tx) => {
      const existingLimit = await tx.rateLimit.findFirst({
        where: {
          OR: [{ clientId }, { paymentMethodId }],
          windowStart: { gte: windowStart },
        },
        orderBy: { windowStart: "desc" },
      });

      if (existingLimit) {
        if (existingLimit.requestCount >= config.maxRequests) {
          return { exceeded: true, limit: existingLimit };
        }

        const updated = await tx.rateLimit.update({
          where: { id: existingLimit.id },
          data: { requestCount: { increment: 1 } },
        });

        return { exceeded: false, limit: updated };
      }

      const newLimit = await tx.rateLimit.create({
        data: {
          clientId,
          paymentMethodId,
          windowStart: now,
          requestCount: 1,
        },
      });

      return { exceeded: false, limit: newLimit };
    },
    {
      isolationLevel: "Serializable",
      timeout: 5000,
    }
  );

  return result;
}

export function calculateResetTime(
  windowStart: Date,
  windowMs: number
): { resetTime: Date; waitSeconds: number } {
  const resetTime = new Date(windowStart.getTime() + windowMs);
  const waitSeconds = Math.ceil((resetTime.getTime() - Date.now()) / 1000);

  return { resetTime, waitSeconds };
}
