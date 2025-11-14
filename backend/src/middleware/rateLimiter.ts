// Re-export from modular structure (backward compatibility)
export { rateLimiter } from "./rateLimit";
export { getRateLimitConfig, clearConfigCache } from "../services";
export type {
  RateLimitConfig,
  RateLimitResult,
  RateLimitError,
} from "../types";
