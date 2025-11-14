import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed with test data...\n");

  console.log("📝 Seeding configurations...");

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
    console.log(`  ✅ ${config.key}`);
  }

  console.log("\n💳 Creating payment methods...");

  const paymentMethods = [
    { name: "credit_card" },
    { name: "debit_card" },
    { name: "paypal" },
    { name: "cash" },
  ];

  const createdPaymentMethods = [];
  for (const pm of paymentMethods) {
    const paymentMethod = await prisma.paymentMethod.upsert({
      where: { name: pm.name },
      update: {},
      create: pm,
    });
    createdPaymentMethods.push(paymentMethod);
    console.log(`  ✅ ${pm.name}`);
  }

  console.log("\n👥 Creating test clients...");

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

  console.log("\n🌽 Creating test purchases...");

  for (let i = 0; i < 3; i++) {
    await prisma.purchase.create({
      data: {
        clientId: clients[0].id,
        paymentMethodId:
          createdPaymentMethods[i % createdPaymentMethods.length].id,
        purchasedAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
      },
    });
  }
  console.log(`Alice: 3 purchases`);

  for (let i = 0; i < 5; i++) {
    await prisma.purchase.create({
      data: {
        clientId: clients[1].id,
        paymentMethodId:
          createdPaymentMethods[i % createdPaymentMethods.length].id,
        purchasedAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000),
      },
    });
  }
  console.log(`Bob: 5 purchases`);

  await prisma.purchase.create({
    data: {
      clientId: clients[2].id,
      paymentMethodId: createdPaymentMethods[0].id,
    },
  });
  console.log(`Charlie: 1 purchase`);

  console.log("\n⏱️ Creating rate limit entries...");

  await prisma.rateLimit.create({
    data: {
      clientId: clients[0].id,
      paymentMethodId: createdPaymentMethods[0].id,
      windowStart: new Date(Date.now() - 30000),
      requestCount: 1,
    },
  });

  await prisma.rateLimit.create({
    data: {
      clientId: clients[1].id,
      paymentMethodId: createdPaymentMethods[1].id,
      windowStart: new Date(Date.now() - 120000),
      requestCount: 1,
    },
  });

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Seed completed successfully!");
  console.log("=".repeat(50));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
