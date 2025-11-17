import type { Request, Response } from "express";
import { findOrCreatePaymentMethod } from "../services";
import { prisma } from "../lib/db";

export const getAllPaymentMethods = async (req: Request, res: Response) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        lastFourDigits: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(paymentMethods);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ error: "Failed to fetch payment methods" });
  }
};

export const getPaymentMethodById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Payment method ID is required" });
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastFourDigits: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!paymentMethod) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    res.json(paymentMethod);
  } catch (error) {
    console.error("Error fetching payment method:", error);
    res.status(500).json({ error: "Failed to fetch payment method" });
  }
};

export const createPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { name, identifier } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Payment method name is required" });
    }

    if (!identifier) {
      return res.status(400).json({
        error: "Payment method identifier is required",
        message:
          "Please provide the card number, account number, or unique identifier",
      });
    }

    const paymentMethod = await findOrCreatePaymentMethod(name, identifier);

    res.status(201).json({
      id: paymentMethod.id,
      name: paymentMethod.name,
      lastFourDigits: paymentMethod.lastFourDigits,
      createdAt: paymentMethod.createdAt,
      updatedAt: paymentMethod.updatedAt,
    });
  } catch (error) {
    console.error("Error creating payment method:", error);
    res.status(500).json({ error: "Failed to create payment method" });
  }
};
