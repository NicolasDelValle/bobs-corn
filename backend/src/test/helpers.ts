import request from "supertest";
import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "../routes";
import { notFoundHandler, errorHandler } from "../middleware/errorHandler";

export function createTestApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export function createTestRequest(app: Express) {
  return request(app);
}

export const testSessionId = "test-session-123";

export const testPaymentMethod = {
  name: "test_visa",
  identifier: "4111111111111111",
};

export async function createTestPurchase(
  app: Express,
  sessionId: string = testSessionId,
  paymentMethod = testPaymentMethod,
  productId: string = "test-product-id"
) {
  return request(app)
    .post("/api/purchases")
    .set("x-session-id", sessionId)
    .send({
      paymentMethod,
      productId,
    });
}
