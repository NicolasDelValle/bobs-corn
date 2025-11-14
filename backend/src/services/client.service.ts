import { prisma } from "../models";
import type { Client, PaymentMethod } from "../../generated/prisma/client";

export async function findOrCreateClient(sessionId: string): Promise<Client> {
  const client = await prisma.client.findUnique({
    where: { sessionId },
  });

  if (client) {
    return client;
  }

  return prisma.client.create({
    data: { sessionId },
  });
}

export async function findPaymentMethod(
  paymentMethodId: string
): Promise<PaymentMethod | null> {
  return prisma.paymentMethod.findUnique({
    where: { id: paymentMethodId },
  });
}
