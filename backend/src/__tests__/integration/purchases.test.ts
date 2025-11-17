import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../../lib/db";
import {
  createTestApp,
  createTestRequest,
  testSessionId,
  testPaymentMethod,
} from "../../test/helpers";

describe("Purchase Endpoints", () => {
  const app = createTestApp();
  let testProductId: string;

  beforeEach(async () => {
    await prisma.config.upsert({
      where: { key: "rate_limit_max_requests" },
      update: { value: "10" },
      create: {
        key: "rate_limit_max_requests",
        value: "10",
        description: "Max requests for testing",
      },
    });

    await prisma.config.upsert({
      where: { key: "rate_limit_window_ms" },
      update: { value: "60000" },
      create: {
        key: "rate_limit_window_ms",
        value: "60000",
        description: "Window for testing",
      },
    });

    const testProduct = await prisma.product.create({
      data: {
        name: "Test Product",
        description: "Product for testing",
        price: 2.5,
        imageUrl: "https://example.com/test.jpg",
        order: 1,
      },
    });
    testProductId = testProduct.id;
  });

  describe("POST /api/purchases", () => {
    it("should create a purchase with valid data", async () => {
      const response = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", testSessionId)
        .send({
          paymentMethod: testPaymentMethod,
          productId: testProductId,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("clientId");
      expect(response.body).toHaveProperty("paymentMethodId");
      expect(response.body.paymentMethod).toHaveProperty(
        "name",
        testPaymentMethod.name
      );
    });

    it("should return 400 when x-session-id header is missing", async () => {
      const response = await createTestRequest(app)
        .post("/api/purchases")
        .send({ paymentMethod: testPaymentMethod });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Missing session ID");
    });

    it("should return 400 when paymentMethod is missing in body", async () => {
      const response = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", testSessionId)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Missing payment method");
    });

    it("should return 400 when paymentMethod.name is missing", async () => {
      const response = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", testSessionId)
        .send({
          paymentMethod: { identifier: "4111111111111111" },
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Missing payment method name"
      );
    });

    it("should return 400 when paymentMethod.identifier is missing", async () => {
      const response = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", testSessionId)
        .send({
          paymentMethod: { name: "visa" },
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Missing payment method identifier"
      );
    });
  });

  describe("GET /api/purchases", () => {
    beforeEach(async () => {
      await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", testSessionId)
        .send({
          paymentMethod: testPaymentMethod,
          productId: testProductId,
        });
    });

    it("should return paginated purchases", async () => {
      const response = await createTestRequest(app).get("/api/purchases");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should support pagination parameters", async () => {
      const response = await createTestRequest(app).get(
        "/api/purchases?page=1&limit=5"
      );

      expect(response.status).toBe(200);
      expect(response.body.pagination).toHaveProperty("page", 1);
      expect(response.body.pagination).toHaveProperty("limit", 5);
    });
  });

  describe("GET /api/purchases/:id", () => {
    it("should return a purchase by id", async () => {
      const createResponse = await createTestRequest(app)
        .post("/api/purchases")
        .set("x-session-id", testSessionId)
        .send({
          paymentMethod: testPaymentMethod,
          productId: testProductId,
        });

      const purchaseId = createResponse.body.id;

      const response = await createTestRequest(app).get(
        `/api/purchases/${purchaseId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", purchaseId);
      expect(response.body).toHaveProperty("client");
      expect(response.body).toHaveProperty("paymentMethod");
    });

    it("should return 404 for non-existent purchase", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const response = await createTestRequest(app).get(
        `/api/purchases/${fakeId}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Purchase not found");
    });
  });
});
