import { describe, it, expect } from "vitest";
import {
  hashPaymentIdentifier,
  extractLastFourDigits,
} from "../../../services/paymentMethod.service";

describe("PaymentMethod Service", () => {
  describe("hashPaymentIdentifier", () => {
    it("should generate consistent SHA-256 hash for same input", () => {
      const identifier = "4111111111111111";
      const hash1 = hashPaymentIdentifier(identifier);
      const hash2 = hashPaymentIdentifier(identifier);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    it("should generate different hashes for different inputs", () => {
      const hash1 = hashPaymentIdentifier("4111111111111111");
      const hash2 = hashPaymentIdentifier("5500000000000004");

      expect(hash1).not.toBe(hash2);
    });

    it("should trim whitespace before hashing", () => {
      const hash1 = hashPaymentIdentifier("4111111111111111");
      const hash2 = hashPaymentIdentifier("  4111111111111111  ");

      expect(hash1).toBe(hash2);
    });
  });

  describe("extractLastFourDigits", () => {
    it("should extract last 4 digits from card number", () => {
      const result = extractLastFourDigits("4111111111111111");
      expect(result).toBe("1111");
    });

    it("should extract last 4 digits ignoring non-digits", () => {
      const result = extractLastFourDigits("4111-1111-1111-1111");
      expect(result).toBe("1111");
    });

    it("should return null for strings with less than 4 digits", () => {
      const result = extractLastFourDigits("abc");
      expect(result).toBeNull();
    });

    it("should handle email addresses gracefully", () => {
      const result = extractLastFourDigits("user@example.com");
      expect(result).toBeNull();
    });
  });
});
