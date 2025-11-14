import { describe, it, expect } from "vitest";
import { calculateResetTime } from "../../../services/limiter.service";

describe("Limiter Service", () => {
  describe("calculateResetTime", () => {
    it("should calculate correct reset time and positive wait seconds", () => {
      const now = Date.now();
      const windowStart = new Date(now - 30000);
      const windowMs = 60000;

      const { resetTime, waitSeconds } = calculateResetTime(
        windowStart,
        windowMs
      );

      const expectedResetTime = new Date(windowStart.getTime() + windowMs);
      expect(resetTime).toEqual(expectedResetTime);
      expect(waitSeconds).toBeGreaterThan(0);
      expect(waitSeconds).toBeLessThanOrEqual(60);
    });

    it("should return positive wait seconds for future reset", () => {
      const windowStart = new Date(Date.now() - 30000);
      const windowMs = 60000;

      const { waitSeconds } = calculateResetTime(windowStart, windowMs);

      expect(waitSeconds).toBeGreaterThan(0);
      expect(waitSeconds).toBeLessThanOrEqual(60);
    });
  });
});
