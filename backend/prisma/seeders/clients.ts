import { PrismaClient } from "../../generated/prisma/client";
import { logStep, logSuccess } from "./utils";

const clientData = [
  { sessionId: "test-alice-session", name: "Alice" },
  { sessionId: "test-bob-session", name: "Bob" },
  { sessionId: "test-charlie-session", name: "Charlie" },
];

export async function seedClients(prisma: PrismaClient) {
  logStep("Creating test clients");

  const clients = [];

  for (const data of clientData) {
    const client = await prisma.client.upsert({
      where: { sessionId: data.sessionId },
      update: {},
      create: { sessionId: data.sessionId },
    });
    clients.push(client);
  }

  logSuccess(`Created ${clients.length} test clients`);
  return clients;
}
