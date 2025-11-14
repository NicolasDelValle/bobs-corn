import { createHash } from "crypto";
import { prisma } from "../lib/db";
import type { PaymentMethod } from "../../generated/prisma/client";

export function hashPaymentIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier.trim()).digest("hex");
}

export function extractLastFourDigits(identifier: string): string | null {
  const cleaned = identifier.replace(/\D/g, "");
  if (cleaned.length < 4) return null;
  return cleaned.slice(-4);
}

export async function findOrCreatePaymentMethod(
  name: string,
  identifier: string
): Promise<PaymentMethod> {
  const identifierHash = hashPaymentIdentifier(identifier);
  const lastFourDigits = extractLastFourDigits(identifier);

  const existing = await prisma.paymentMethod.findUnique({
    where: { identifierHash },
  });

  if (existing) {
    return existing;
  }

  return prisma.paymentMethod.create({
    data: {
      name,
      identifierHash,
      lastFourDigits,
    },
  });
}

export async function findPaymentMethodById(
  paymentMethodId: string
): Promise<PaymentMethod | null> {
  return prisma.paymentMethod.findUnique({
    where: { id: paymentMethodId },
  });
}

export async function findPaymentMethodByHash(
  identifier: string
): Promise<PaymentMethod | null> {
  const identifierHash = hashPaymentIdentifier(identifier);
  return prisma.paymentMethod.findUnique({
    where: { identifierHash },
  });
}
