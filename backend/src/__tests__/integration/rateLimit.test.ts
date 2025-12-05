import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../../lib/db";
import { createTestApp, createTestRequest } from "../../test/helpers";

describe("Rate Limit Middleware", () => {
  const app = createTestApp();
  let testProductId: string;

  beforeEach(async () => {
    await prisma.config.upsert({
      where: { key: "rate_limit_max_requests" },
      update: { value: "2" },
      create: {
        key: "rate_limit_max_requests",
        value: "2",
        description: "Max 2 requests for testing",
      },
    });

    await prisma.config.upsert({
      where: { key: "rate_limit_window_seconds" },
      update: { value: "60000" },
      create: {
        key: "rate_limit_window_seconds",
        value: "60000",
        description: "1 minute window",
      },
    });

    // Create a test product
    const testProduct = await prisma.product.create({
      data: {
        name: "Test Rate Limit Product",
        description: "Product for rate limit testing",
        price: 2.5,
        imageUrl: "https://example.com/test.jpg",
        order: 1,
      },
    });
    testProductId = testProduct.id;
  });

  describe("Rate limit by client", () => {
    it("should block same client with different payment methods", async () => {
      const sessionId = "rate-limit-test-client";

      const response1 = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", sessionId)
        .send({
          paymentMethod: { name: "visa", identifier: "4111111111111111" },
          productId: testProductId,
        });

      expect(response1.status).toBe(201);

      const response2 = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", sessionId)
        .send({
          paymentMethod: { name: "visa", identifier: "4111111111111111" },
          productId: testProductId,
        });

      expect(response2.status).toBe(201);

      const response3 = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", sessionId)
        .send({
          paymentMethod: {
            name: "mastercard",
            identifier: "5500000000000004",
          },
          productId: testProductId,
        });

      expect(response3.status).toBe(429);
      expect(response3.body).toHaveProperty("error", "Rate limit exceeded");
      expect(response3.body).toHaveProperty("retryAfter");
    });
  });

  describe("Rate limit by payment method", () => {
    it("should block same payment method from different clients", async () => {
      const paymentMethod = {
        name: "visa",
        identifier: "4111111111111111",
      };

      const response1 = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", "client-1")
        .send({ paymentMethod, productId: testProductId });

      expect(response1.status).toBe(201);

      const response2 = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", "client-2")
        .send({ paymentMethod, productId: testProductId });

      expect(response2.status).toBe(201);

      const response3 = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", "client-3")
        .send({ paymentMethod, productId: testProductId });

      expect(response3.status).toBe(429);
      expect(response3.body).toHaveProperty("error", "Rate limit exceeded");
    });
  });

  describe("Rate limit allows different client and payment method", () => {
    it("should allow requests with different client and payment method", async () => {
      const response1 = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", "client-1")
        .send({
          paymentMethod: { name: "visa", identifier: "4111111111111111" },
          productId: testProductId,
        });

      expect(response1.status).toBe(201);

      const response2 = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", "client-2")
        .send({
          paymentMethod: {
            name: "mastercard",
            identifier: "5500000000000004",
          },
          productId: testProductId,
        });

      expect(response2.status).toBe(201);
    });
  });

  describe("Rate limit response", () => {
    it("should include rate limit details in 429 response", async () => {
      const sessionId = "rate-limit-details-test";
      const paymentMethod = {
        name: "visa",
        identifier: "4111111111111111",
      };

      await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", sessionId)
        .send({ paymentMethod, productId: testProductId });

      await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", sessionId)
        .send({ paymentMethod, productId: testProductId });

      const response = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", sessionId)
        .send({ paymentMethod, productId: testProductId });

      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty("error", "Rate limit exceeded");
      expect(response.body).toHaveProperty("retryAfter");
      expect(response.body).toHaveProperty("limit", 2);
      expect(response.body).toHaveProperty("windowMs", 60000);
      expect(response.body).toHaveProperty("resetAt");
      expect(response.body).toHaveProperty("paymentMethod");
      expect(response.body.paymentMethod).toHaveProperty("name");
      expect(response.body.paymentMethod).toHaveProperty("lastFourDigits");
    });
  });
});
