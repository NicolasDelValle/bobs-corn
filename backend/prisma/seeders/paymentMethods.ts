import { PrismaClient } from "../../generated/prisma/client";
import {
  hashPaymentIdentifier,
  extractLastFourDigits,
  logStep,
  logSuccess,
} from "./utils";

const paymentMethodData = [
  { name: "credit_card", identifier: "4532015112830366" },
  { name: "debit_card", identifier: "5425233430109903" },
  { name: "paypal", identifier: "user@example.com" },
  { name: "cash", identifier: "CASH-REGISTER-001" },
];

export async function seedPaymentMethods(prisma: PrismaClient) {
  logStep("Creating payment methods");

  const createdPaymentMethods = [];

  for (const pm of paymentMethodData) {
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
  }

  logSuccess(`Created ${createdPaymentMethods.length} payment methods`);
  return createdPaymentMethods;
}
