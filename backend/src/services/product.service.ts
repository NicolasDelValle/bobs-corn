import { prisma } from "../lib/db";
import type { ProductModel } from "../../generated/prisma/models";

export class ProductService {
  static async getAllProducts(): Promise<ProductModel[]> {
    const products = await prisma.product.findMany({
      where: {
        isEnabled: true,
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    return products;
  }

  static async getProductById(id: string): Promise<ProductModel | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product;
  }

  static async updateProduct(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      imageUrl?: string;
      isEnabled?: boolean;
      order?: number;
    }
  ): Promise<ProductModel> {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return product;
  }

  static async createProduct(data: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isEnabled?: boolean;
    order?: number;
  }): Promise<ProductModel> {
    const product = await prisma.product.create({
      data,
    });

    return product;
  }
}
