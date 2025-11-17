import { prisma } from "../lib/db";

export class CommonService {
  static async getPurchaseWaitTime(): Promise<number> {
    const config = await prisma.config.findUnique({
      where: { key: "rate_limit_window_ms" },
    });

    if (!config) {
      await prisma.config.create({
        data: {
          key: "rate_limit_window_ms",
          value: "300000",
          description: "Tiempo de espera en milisegundos entre compras",
        },
      });
      return 5;
    }

    const milliseconds = parseInt(config.value, 10) || 300000;
    return Math.round(milliseconds / 60000);
  }

  static async setPurchaseWaitTime(minutes: number): Promise<void> {
    const milliseconds = minutes * 60000;

    await prisma.config.upsert({
      where: { key: "rate_limit_window_ms" },
      update: { value: milliseconds.toString() },
      create: {
        key: "rate_limit_window_ms",
        value: milliseconds.toString(),
        description: "Tiempo de espera en milisegundos entre compras",
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

  static async seedPaymentTypes() {
    const existingCount = await prisma.paymentType.count();
    if (existingCount > 0) return;

    const defaultPaymentTypes = [
      {
        name: "credit_card",
        displayName: "Tarjeta de Crédito",
        icon: "💳",
        order: 1,
      },
      {
        name: "debit_card",
        displayName: "Tarjeta de Débito",
        icon: "🏦",
        order: 2,
      },
      { name: "paypal", displayName: "PayPal", icon: "🅿️", order: 3 },
      { name: "apple_pay", displayName: "Apple Pay", icon: "🍎", order: 4 },
      { name: "google_pay", displayName: "Google Pay", icon: "🟢", order: 5 },
      {
        name: "bank_transfer",
        displayName: "Transferencia Bancaria",
        icon: "🏛️",
        order: 6,
      },
      { name: "crypto", displayName: "Criptomonedas", icon: "₿", order: 7 },
    ];

    for (const paymentType of defaultPaymentTypes) {
      await prisma.paymentType.create({ data: paymentType });
    }
  }
}
