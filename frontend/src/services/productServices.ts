import { apiGet, apiPut } from "@/lib/api";
import { apiRoutes } from "@/lib/apiRoutes";
import { products } from "@/lib/moockData";

import type { Product, UpdateProductData } from "@/types/product";

export class ProductApiService {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await apiGet<{ success: boolean; data: Product[] }>(
        apiRoutes.products.list
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error("Error obteniendo productos");
      }
    } catch {
      return products;
    }
  }

  static async updateProduct(
    id: string,
    data: UpdateProductData
  ): Promise<Product> {
    const response = await apiPut<{ success: boolean; data: Product }>(
      apiRoutes.products.update(id),
      data
    );

    if (response.success) {
      return response.data;
    } else {
      throw new Error("Error actualizando producto");
    }
  }
}
