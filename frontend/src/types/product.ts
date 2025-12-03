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

export interface ProductFilters {
  isEnabled?: boolean;
  orderBy?: "name" | "price" | "order" | "createdAt";
  orderDirection?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
}
