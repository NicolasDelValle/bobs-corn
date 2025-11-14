export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  exceeded: boolean;
  limit: {
    id: number;
    windowStart: Date;
    requestCount: number;
  };
}

export interface RateLimitError {
  error: string;
  message: string;
  retryAfter?: number;
  limit?: number;
  windowMs?: number;
  resetAt?: string;
  paymentMethod?: string;
}
