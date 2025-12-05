import { PrismaClient } from "../../generated/prisma/client";
import { logStep, logSuccess } from "./utils";

const configData = [
  {
    key: "rate_limit_window_seconds",
    value: "60",
    description: "Time window for rate limiting in seconds (60 = 1 minute)",
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

export async function seedConfigs(prisma: PrismaClient) {
  logStep("Seeding configurations");

  for (const config of configData) {
    await prisma.config.upsert({
      where: { key: config.key },
      update: { value: config.value, description: config.description },
      create: config,
    });
  }

  logSuccess(`Created ${configData.length} configurations`);
}
