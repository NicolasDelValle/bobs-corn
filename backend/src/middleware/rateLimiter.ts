import type { Request, Response, NextFunction } from "express";
import { prisma } from "../models";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

let cachedConfig: RateLimitConfig | null = null;
let lastConfigFetch = 0;
const CONFIG_CACHE_TTL = 60000;

async function getConfig(): Promise<RateLimitConfig> {
  const now = Date.now();

  if (cachedConfig && now - lastConfigFetch < CONFIG_CACHE_TTL) {
    return cachedConfig;
  }

  const [windowConfig, maxRequestsConfig] = await Promise.all([
    prisma.config.findUnique({ where: { key: "rate_limit_window_ms" } }),
    prisma.config.findUnique({ where: { key: "rate_limit_max_requests" } }),
  ]);

  cachedConfig = {
    windowMs: parseInt(windowConfig?.value || "60000"),
    maxRequests: parseInt(maxRequestsConfig?.value || "1"),
  };

  lastConfigFetch = now;
  return cachedConfig;
}

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.headers["x-session-id"] as string;
    const paymentMethodId = req.headers["x-payment-method-id"] as string;

    if (!sessionId) {
      return res.status(400).json({
        error: "Missing session ID",
        message: "Please provide x-session-id header",
      });
    }

    if (!paymentMethodId) {
      return res.status(400).json({
        error: "Missing payment method",
        message: "Please provide x-payment-method-id header",
      });
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    if (!paymentMethod) {
      return res.status(400).json({
        error: "Invalid payment method",
        message: "The provided payment method does not exist",
      });
    }

    let client = await prisma.client.findUnique({
      where: { sessionId },
    });

    if (!client) {
      client = await prisma.client.create({
        data: { sessionId },
      });
    }

    const config = await getConfig();
    const windowStart = new Date(Date.now() - config.windowMs);

    const existingLimit = await prisma.rateLimit.findFirst({
      where: {
        clientId: client.id,
        paymentMethodId: paymentMethodId,
        windowStart: {
          gte: windowStart,
        },
      },
      orderBy: {
        windowStart: "desc",
      },
    });

    if (existingLimit) {
      if (existingLimit.requestCount >= config.maxRequests) {
        const resetTime = new Date(
          existingLimit.windowStart.getTime() + config.windowMs
        );
        const waitSeconds = Math.ceil(
          (resetTime.getTime() - Date.now()) / 1000
        );

        return res.status(429).json({
          error: "Rate limit exceeded",
          message: `Too many requests with this payment method. Please try again in ${waitSeconds} seconds.`,
          retryAfter: waitSeconds,
          limit: config.maxRequests,
          windowMs: config.windowMs,
          resetAt: resetTime.toISOString(),
          paymentMethod: paymentMethod.name,
        });
      }

      await prisma.rateLimit.update({
        where: { id: existingLimit.id },
        data: { requestCount: { increment: 1 } },
      });
    } else {
      await prisma.rateLimit.create({
        data: {
          clientId: client.id,
          paymentMethodId: paymentMethodId,
          windowStart: new Date(),
          requestCount: 1,
        },
      });
    }

    (req as any).client = client;
    (req as any).paymentMethod = paymentMethod;

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to process rate limit",
    });
  }
};
