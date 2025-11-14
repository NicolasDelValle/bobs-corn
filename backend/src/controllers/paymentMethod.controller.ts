import type { Request, Response } from "express";
import { prisma } from "../models";

export const getAllPaymentMethods = async (req: Request, res: Response) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: {
        name: "asc",
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
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Payment method name is required" });
    }

    const existingMethod = await prisma.paymentMethod.findUnique({
      where: { name },
    });

    if (existingMethod) {
      return res.status(409).json({
        error: "Payment method already exists",
        message: `A payment method with name "${name}" already exists`,
      });
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: { name },
    });

    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error("Error creating payment method:", error);
    res.status(500).json({ error: "Failed to create payment method" });
  }
};
