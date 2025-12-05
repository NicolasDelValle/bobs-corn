import { prisma } from "../lib/db";

export class CommonService {
  static async getPurchaseWaitTime(): Promise<number> {
    const config = await prisma.config.findUnique({
      where: { key: "rate_limit_window_seconds" },
    });

    if (!config) {
      await prisma.config.create({
        data: {
          key: "rate_limit_window_seconds",
          value: "60",
          description: "Tiempo de espera en segundos entre compras",
        },
      });
      return 5;
    }

    const seconds = parseInt(config.value, 10) || 60;
    return Math.round(seconds);
  }

  static async setPurchaseWaitTime(seconds: number): Promise<void> {
    await prisma.config.upsert({
      where: { key: "rate_limit_window_seconds" },
      update: { value: seconds.toString() },
      create: {
        key: "rate_limit_window_seconds",
        value: seconds.toString(),
        description: "Tiempo de espera en segundos entre compras",
      },
    });
  }

  static async getPaymentTypes() {
    return prisma.paymentType.findMany({
      where: { isEnabled: true },
      orderBy: { order: "asc" },
    });
  }

  static async createPaymentType(data: {
    name: string;
    displayName: string;
    icon: string;
    order?: number;
  }) {
    return prisma.paymentType.create({
      data: {
        ...data,
        order: data.order ?? 0,
      },
    });
  }

  static async updatePaymentType(
    id: string,
    data: {
      name?: string;
      displayName?: string;
      icon?: string;
      isEnabled?: boolean;
      order?: number;
    }
  ) {
    return prisma.paymentType.update({
      where: { id },
      data,
    });
  }

  static async deletePaymentType(id: string) {
    return prisma.paymentType.delete({
      where: { id },
    });
  }
}
