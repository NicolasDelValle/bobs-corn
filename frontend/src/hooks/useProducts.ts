import { useState, useEffect, useCallback } from "react";
import {
  ProductApiService,
  type Product,
  type UpdateProductData,
} from "@/services/productApiService";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProduct: (id: string, data: UpdateProductData) => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedProducts = await ProductApiService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(
    async (id: string, data: UpdateProductData) => {
      const updatedProduct = await ProductApiService.updateProduct(id, data);

      setProducts((prev) =>
        prev.map((product) => (product.id === id ? updatedProduct : product))
      );
    },
    []
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    updateProduct,
  };
};
