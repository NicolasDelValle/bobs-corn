import type { Request, Response } from "express";
import { ProductService } from "../services/product.service";

// Schema de validación para actualizar producto
const updateProductSchema = {
  name: (val: any) =>
    typeof val === "string" && val.length > 0 && val.length <= 255,
  description: (val: any) => typeof val === "string" && val.length <= 1000,
  price: (val: any) => typeof val === "number" && val >= 0,
  imageUrl: (val: any) => typeof val === "string" && val.includes("http"),
  isEnabled: (val: any) => typeof val === "boolean",
  order: (val: any) =>
    typeof val === "number" && Number.isInteger(val) && val >= 0,
};

export class ProductController {
  /**
   * GET /api/products
   * Obtener todos los productos habilitados
   */
  static async getAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAllProducts();

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("Error getting products:", error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      });
    }
  }

  /**
   * GET /api/products/:id
   * Obtener un producto por ID
   */
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID de producto requerido",
        });
      }

      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Producto no encontrado",
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error getting product:", error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      });
    }
  }

  /**
   * PUT /api/products/:id
   * Actualizar un producto
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID de producto requerido",
        });
      }

      // Validar datos de entrada
      const validData: any = {};
      const errors: string[] = [];

      for (const [key, value] of Object.entries(req.body)) {
        if (key in updateProductSchema) {
          const validator =
            updateProductSchema[key as keyof typeof updateProductSchema];
          if (validator(value)) {
            validData[key] = value;
          } else {
            errors.push(`Campo ${key} inválido`);
          }
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Datos inválidos",
          details: errors,
        });
      }

      // Verificar si el producto existe
      const existingProduct = await ProductService.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          error: "Producto no encontrado",
        });
      }

      // Actualizar producto
      const updatedProduct = await ProductService.updateProduct(id, validData);

      res.json({
        success: true,
        data: updatedProduct,
        message: "Producto actualizado exitosamente",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({
        success: false,
        error: "Error interno del servidor",
      });
    }
  }
}
