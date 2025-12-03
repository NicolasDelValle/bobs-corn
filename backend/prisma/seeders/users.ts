import { PrismaClient } from "../../generated/prisma/client";
import { hashPassword, logStep, logSuccess } from "./utils";

export async function seedUsers(prisma: PrismaClient) {
  logStep("Creating default user");

  const defaultUser = await prisma.user.upsert({
    where: { email: "admin@bobscorn.com" },
    update: {},
    create: {
      email: "admin@bobscorn.com",
      password: await hashPassword("admin123"),
      name: "Bob",
    },
  });

  logSuccess(`Admin user created: ${defaultUser.email}`);
  console.log(`  📧 Login: admin@bobscorn.com`);
  console.log(`  🔑 Password: admin123`);
}
