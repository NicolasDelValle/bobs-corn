import { prisma } from "../lib/db";
import type { RateLimitConfig } from "../types/rateLimit.types";

let cachedConfig: RateLimitConfig | null = null;
let lastConfigFetch = 0;
const CONFIG_CACHE_TTL = 60000;

export async function getRateLimitConfig(): Promise<RateLimitConfig> {
  const now = Date.now();

  if (cachedConfig && now - lastConfigFetch < CONFIG_CACHE_TTL) {
    return cachedConfig;
  }

  const [windowConfig, maxRequestsConfig] = await Promise.all([
    prisma.config.findUnique({ where: { key: "rate_limit_window_seconds" } }),
    prisma.config.findUnique({ where: { key: "rate_limit_max_requests" } }),
  ]);

  cachedConfig = {
    windowMs: parseInt(windowConfig?.value || "60000"),
    maxRequests: parseInt(maxRequestsConfig?.value || "1"),
  };

  lastConfigFetch = now;
  return cachedConfig;
}

export function clearConfigCache(): void {
  cachedConfig = null;
  lastConfigFetch = 0;
}
