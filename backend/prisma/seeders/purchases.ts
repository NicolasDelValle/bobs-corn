import { PrismaClient } from "../../generated/prisma/client";
import { logStep, logSuccess } from "./utils";

export async function seedPurchases(
  prisma: PrismaClient,
  clients: any[],
  paymentMethods: any[],
  products: any[]
) {
  if (!clients.length || !paymentMethods.length || !products.length) {
    console.log("⚠️  Skipping purchases - missing dependencies");
    return;
  }

  logStep("Creating test purchases");

  // Helper function to create purchases for a client
  const createPurchasesForClient = async (
    clientIndex: number,
    count: number
  ) => {
    const client = clients[clientIndex];
    if (!client) return;

    for (let i = 0; i < count; i++) {
      const paymentMethod = paymentMethods[i % paymentMethods.length];
      const product = products[i % products.length];

      if (!paymentMethod || !product) continue;

      await prisma.purchase.create({
        data: {
          clientId: client.id,
          paymentMethodId: paymentMethod.id,
          productId: product.id,
          purchasedAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000), // Staggered times
        },
      });
    }
  };

  // Create purchases for each test client
  await createPurchasesForClient(0, 3); // Alice: 3 purchases
  await createPurchasesForClient(1, 5); // Bob: 5 purchases
  await createPurchasesForClient(2, 1); // Charlie: 1 purchase

  logSuccess("Created test purchases for all clients");
}
