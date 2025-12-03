import { createHash } from "crypto";
import bcrypt from "bcryptjs";

export function hashPaymentIdentifier(identifier: string): string {
  return createHash("sha256").update(identifier.trim()).digest("hex");
}

export function extractLastFourDigits(identifier: string): string | null {
  const cleaned = identifier.replace(/\D/g, "");
  if (cleaned.length < 4) return null;
  return cleaned.slice(-4);
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export function logStep(step: string) {
  console.log(`\n📋 ${step}...`);
}

export function logSuccess(message: string) {
  console.log(`  ✅ ${message}`);
}
