import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import type { Product } from '@/services/productApiService';

interface ProductGridProps {
  products: Product[];
  selectedProduct: string | null;
  onProductSelect: (productId: string) => void;
  loading: boolean;
  error: string | null;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedProduct,
  onProductSelect,
  loading,
  error
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin text-4xl mb-4">🌽</div>
        <p className="text-green-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error cargando productos: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className={`cursor-pointer transition-all duration-200 ${selectedProduct === product.id
              ? 'ring-2 ring-green-500 ring-offset-2'
              : 'hover:scale-105'
            }`}
          onClick={() => onProductSelect(product.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ProductCard
            delay={index * 0.1}
            product={product}
          />
        </motion.div>
      ))}
    </div>
  );
};