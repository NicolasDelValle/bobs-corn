import { config as loadEnv } from "dotenv";
import { PrismaClient } from "../generated/prisma/client";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";

// Load environment variables
loadEnv();

const prisma = new PrismaClient();

function hashPaymentIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier.trim()).digest("hex");
}

function extractLastFourDigits(identifier: string): string | null {
  const cleaned = identifier.replace(/\D/g, "");
  if (cleaned.length < 4) return null;
  return cleaned.slice(-4);
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log("Starting seed with test data...\n");

  console.log("Creating default user...");

  // Create default admin user
  const defaultUser = await prisma.user.upsert({
    where: {
      email: "admin@bobscorn.com",
    },
    update: {},
    create: {
      email: "admin@bobscorn.com",
      password: await hashPassword("admin123"),
      name: "Admin User",
    },
  });

  console.log(`  ✅ Admin user created: ${defaultUser.email}`);
  console.log(`  📧 Login: admin@bobscorn.com`);
  console.log(`  🔑 Password: admin123\n`);

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
    {
      key: "jwt.access_token_minutes",
      value: "60",
      description: "Duración del access token en minutos",
    },
    {
      key: "jwt.refresh_token_days",
      value: "7",
      description: "Duración del refresh token en días",
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

  console.log("\nCreating products...");

  const products = [
    {
      name: "Choclo Clásico",
      description:
        "El choclo tradicional de Bob's Corn con mantequilla y sal marina",
      price: 2.5,
      imageUrl:
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
      order: 1,
    },
    {
      name: "Choclo Ceroso",
      description:
        "Choclo de variedad cerosa, naturalmente dulce y con textura cremosa ideal para acompañar",
      price: 3.0,
      imageUrl:
        "https://st.depositphotos.com/1000503/1364/i/450/depositphotos_13640368-stock-photo-mini-blue-corn.jpg",
      order: 2,
    },
    {
      name: "Choclo Opaco",
      description:
        "Choclo de variedad opaca con textura firme y sabor intenso, perfecto para preparaciones tradicionales",
      price: 3.2,
      imageUrl:
        "https://st3.depositphotos.com/12603566/16592/i/450/depositphotos_165921510-stock-photo-fresh-white-corns-on-wooden.jpg",
      order: 3,
    },
    {
      name: "Baby Choclo",
      description:
        "Choclos tiernos cosechados temprano, de tamaño pequeño y sabor delicado, perfectos para ensaladas y platos gourmet",
      price: 2.8,
      imageUrl:
        "https://st2.depositphotos.com/1000605/6532/i/450/depositphotos_65322329-stock-photo-baby-corn.jpg",
      order: 4,
    },
  ];

  const createdProducts = [];
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });
    createdProducts.push(product);
  }

  console.log(`Created ${products.length} products`);

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
        productId:
          createdProducts[i % createdProducts.length]?.id ||
          createdProducts[0]?.id!,
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
        productId:
          createdProducts[i % createdProducts.length]?.id ||
          createdProducts[0]?.id!,
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
        productId: createdProducts[0]?.id!,
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
