import type { Request, Response, NextFunction } from "express";
import {
  getRateLimitConfig,
  findOrCreateClient,
  findOrCreatePaymentMethod,
  checkAndIncrementRateLimit,
  calculateResetTime,
} from "../../services";

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sessionId = req.headers["x-session-id"] as string;

    const { paymentMethod: paymentMethodData } = req.body;

    if (!sessionId) {
      res.status(400).json({
        error: "Missing session ID",
        message: "Please provide x-session-id header",
      });
      return;
    }

    if (!paymentMethodData) {
      res.status(400).json({
        error: "Missing payment method",
        message: "Please provide paymentMethod object in request body",
      });
      return;
    }

    const { name: paymentMethodName, identifier: paymentMethodIdentifier } =
      paymentMethodData;

    if (!paymentMethodName) {
      res.status(400).json({
        error: "Missing payment method name",
        message:
          "Please provide paymentMethod.name in body (e.g., 'visa', 'mastercard')",
      });
      return;
    }

    if (!paymentMethodIdentifier) {
      res.status(400).json({
        error: "Missing payment method identifier",
        message:
          "Please provide paymentMethod.identifier in body (card number, account number, etc.)",
      });
      return;
    }

    const paymentMethod = await findOrCreatePaymentMethod(
      paymentMethodName,
      paymentMethodIdentifier
    );

    const client = await findOrCreateClient(sessionId);

    const config = await getRateLimitConfig();

    const rateLimitCheck = await checkAndIncrementRateLimit(
      client.id,
      paymentMethod.id,
      config
    );

    if (rateLimitCheck.exceeded) {
      const { resetTime, waitSeconds } = calculateResetTime(
        rateLimitCheck.limit.windowStart,
        config.windowMs
      );

      res.status(429).json({
        error: "Rate limit exceeded",
        message: `Too many requesrs with this payment method. Please try again in ${waitSeconds} seconds.`,
        retryAfter: waitSeconds,
        limit: config.maxRequests,
        windowMs: config.windowMs,
        resetAt: resetTime.toISOString(),
        paymentMethod: {
          name: paymentMethod.name,
          lastFourDigits: paymentMethod.lastFourDigits,
        },
      });
      return;
    }

    (req as any).client = client;
    (req as any).paymentMethod = paymentMethod;

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to process rate limit",
    });
  }
}
