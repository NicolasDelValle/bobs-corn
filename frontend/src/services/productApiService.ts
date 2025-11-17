import { apiGet, apiPut } from "@/lib/api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isEnabled: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isEnabled?: boolean;
  order?: number;
}

export class ProductApiService {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await apiGet<{ success: boolean; data: Product[] }>(
        "/products"
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error("Error obteniendo productos");
      }
    } catch {
      return [
        {
          id: "1",
          name: "Choclo Clásico",
          description:
            "El choclo tradicional de Bob's Corn con mantequilla y sal marinna",
          price: 2.5,
          imageUrl:
            "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
          isEnabled: true,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Choclo BBQ",
          description: "Choclo asado con salsa BBQ ahumada y especias secretas",
          price: 3.0,
          imageUrl:
            "https://images.unsplash.com/photo-1604435738750-bb73cd66f8b3?w=400",
          isEnabled: true,
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Choclo Picante",
          description:
            "Para los valientes: choclo con salsa picante y chile rojo",
          price: 3.2,
          imageUrl:
            "https://images.unsplash.com/photo-1602477189557-1c13b05ecfb0?w=400",
          isEnabled: true,
          order: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Choclo Dulce",
          description: "Versión dulce con mantequilla de maple y canela",
          price: 2.8,
          imageUrl:
            "https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=400",
          isEnabled: true,
          order: 4,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  }

  /**
   * Actualizar un producto
   */
  static async updateProduct(
    id: string,
    data: UpdateProductData
  ): Promise<Product> {
    const response = await apiPut<{ success: boolean; data: Product }>(
      `/products/${id}`,
      data
    );

    if (response.success) {
      return response.data;
    } else {
      throw new Error("Error actualizando producto");
    }
  }
}
