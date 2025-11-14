import type { Request, Response } from "express";
import { prisma } from "../models";

export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        skip,
        take: limit,
        orderBy: {
          purchasedAt: "desc",
        },
        include: {
          client: true,
          paymentMethod: true,
        },
      }),
      prisma.purchase.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: purchases,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

export const getPurchaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Purchase ID is required" });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        client: true,
        paymentMethod: true,
      },
    });

    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    res.json(purchase);
  } catch (error) {
    console.error("Error fetching purchase:", error);
    res.status(500).json({ error: "Failed to fetch purchase" });
  }
};

export const createPurchase = async (req: Request, res: Response) => {
  try {
    // Client and paymentMethod are attached by rateLimiter middleware
    const client = (req as any).client;
    const paymentMethod = (req as any).paymentMethod;

    if (!client) {
      return res.status(400).json({
        error: "Client not found",
        message: "Rate limiter middleware did not attach client",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        error: "Payment method not found",
        message: "Rate limiter middleware did not attach payment method",
      });
    }

    const purchase = await prisma.purchase.create({
      data: {
        clientId: client.id,
        paymentMethodId: paymentMethod.id,
      },
      include: {
        client: true,
        paymentMethod: true,
      },
    });

    res.status(201).json(purchase);
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ error: "Failed to create purchase" });
  }
};
