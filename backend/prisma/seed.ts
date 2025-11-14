import { PrismaClient } from "../generated/prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function hashPaymentIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier.trim()).digest("hex");
}

function extractLastFourDigits(identifier: string): string | null {
  const cleaned = identifier.replace(/\D/g, "");
  if (cleaned.length < 4) return null;
  return cleaned.slice(-4);
}

async function main() {
  console.log("Starting seed with test data...\n");

  console.log("Seeding configurations...");

  const configs = [
    {
      key: "rate_limit_window_ms",
      value: "60000",
      description:
        "Time window for rate limiting in milliseconds (60000 = 1 minute)",
    },
    {
      key: "rate_limit_max_requests",
      value: "1",
      description: "Maximum requests allowed per time window",
    },
    {
      key: "session_max_age_hours",
      value: "24",
      description: "Maximum duration of a client session in hours",
    },
  ];

  for (const config of configs) {
    await prisma.config.upsert({
      where: { key: config.key },
      update: { value: config.value, description: config.description },
      create: config,
    });
    console.log(`  ${config.key}`);
  }

  console.log("\nCreating payment methods...");

  const paymentMethods = [
    {
      name: "credit_card",
      identifier: "4532015112830366",
    },
    {
      name: "debit_card",
      identifier: "5425233430109903",
    },
    {
      name: "paypal",
      identifier: "user@example.com",
    },
    {
      name: "cash",
      identifier: "CASH-REGISTER-001",
    },
  ];

  const createdPaymentMethods = [];
  for (const pm of paymentMethods) {
    const identifierHash = hashPaymentIdentifier(pm.identifier);
    const lastFourDigits = extractLastFourDigits(pm.identifier);

    const paymentMethod = await prisma.paymentMethod.upsert({
      where: { identifierHash },
      update: {},
      create: {
        name: pm.name,
        identifierHash,
        lastFourDigits,
      },
    });
    createdPaymentMethods.push(paymentMethod);
    console.log(
      `  ${pm.name} (${lastFourDigits ? `****${lastFourDigits}` : "N/A"})`
    );
  }

  console.log("\nCreating test clients...");

  const testClients = [
    { sessionId: "test-alice-session", name: "Alice" },
    { sessionId: "test-bob-session", name: "Bob" },
    { sessionId: "test-charlie-session", name: "Charlie" },
  ];

  const clients = [];
  for (const clientData of testClients) {
    const client = await prisma.client.upsert({
      where: { sessionId: clientData.sessionId },
      update: {},
      create: { sessionId: clientData.sessionId },
    });
    clients.push(client);
  }

  console.log("\nCreating test purchases...");

  if (!clients[0] || !clients[1] || !clients[2]) {
    throw new Error("Not all test clients were created");
  }

  if (createdPaymentMethods.length === 0) {
    throw new Error("No payment methods were created");
  }

  for (let i = 0; i < 3; i++) {
    const paymentMethod =
      createdPaymentMethods[i % createdPaymentMethods.length];
    if (!paymentMethod) continue;

    await prisma.purchase.create({
      data: {
        clientId: clients[0].id,
        paymentMethodId: paymentMethod.id,
        purchasedAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
      },
    });
  }
  console.log(`Alice: 3 purchases`);

  for (let i = 0; i < 5; i++) {
    const paymentMethod =
      createdPaymentMethods[i % createdPaymentMethods.length];
    if (!paymentMethod) continue;

    await prisma.purchase.create({
      data: {
        clientId: clients[1].id,
        paymentMethodId: paymentMethod.id,
        purchasedAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000),
      },
    });
  }
  console.log(`Bob: 5 purchases`);

  const firstPaymentMethod = createdPaymentMethods[0];
  if (firstPaymentMethod) {
    await prisma.purchase.create({
      data: {
        clientId: clients[2].id,
        paymentMethodId: firstPaymentMethod.id,
      },
    });
    console.log(`Charlie: 1 purchase`);
  }

  console.log("\nCreating rate limit entries...");

  if (firstPaymentMethod) {
    await prisma.rateLimit.create({
      data: {
        clientId: clients[0].id,
        paymentMethodId: firstPaymentMethod.id,
        windowStart: new Date(Date.now() - 30000),
        requestCount: 1,
      },
    });
  }

  const secondPaymentMethod = createdPaymentMethods[1];
  if (secondPaymentMethod) {
    await prisma.rateLimit.create({
      data: {
        clientId: clients[1].id,
        paymentMethodId: secondPaymentMethod.id,
        windowStart: new Date(Date.now() - 120000),
        requestCount: 1,
      },
    });
  }

  console.log("\n" + "=".repeat(50));
  console.log("Seed completed successfully!");
  console.log("=".repeat(50));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding database:");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
