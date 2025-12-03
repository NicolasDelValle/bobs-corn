import { config as loadEnv } from "dotenv";
import { PrismaClient } from "../generated/prisma/client";

// Import all seeders
import { seedUsers } from "./seeders/users";
import { seedConfigs } from "./seeders/configs";
import { seedPaymentTypes } from "./seeders/paymentTypes";
import { seedPaymentMethods } from "./seeders/paymentMethods";
import { seedClients } from "./seeders/clients";
import { seedProducts } from "./seeders/products";
import { seedPurchases } from "./seeders/purchases";
import { seedRateLimits } from "./seeders/rateLimits";

loadEnv();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Core data
    await seedUsers(prisma);
    await seedConfigs(prisma);
    await seedPaymentTypes(prisma);

    // Business data with dependencies
    const paymentMethods = await seedPaymentMethods(prisma);
    const clients = await seedClients(prisma);
    const products = await seedProducts(prisma);

    // Relational data
    await seedPurchases(prisma, clients, paymentMethods, products);
    await seedRateLimits(prisma, clients, paymentMethods);

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Seed completed successfully!");
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Error during seeding:");
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
