import { beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "../lib/db";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.rateLimit.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.client.deleteMany();
  await prisma.paymentMethod.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
