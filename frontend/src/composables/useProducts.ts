import { ref } from "vue";
import type { Product } from "@/types/product";
import { ProductApiService } from "@/services/productServices";

const products = ref<Array<Product>>([]);
const loading = ref(false);

export function useProducts() {
  const fetchProducts = async () => {
    loading.value = true;
    try {
      const response = await ProductApiService.getAllProducts();
      products.value = response;
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      loading.value = false;
    }
  };

  fetchProducts();

  return {
    products,
    loading,
    fetchProducts,
  };
}
