import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/services/productApiService';

interface ProductCardProps {
  delay?: number;
  product?: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  delay = 0.2,
  product
}) => {
  // Datos por defecto si no se pasa producto
  const defaultProduct = {
    name: "Choclo Fresco",
    description: "Deliciosos choclos frescos de la granja de Bob",
    price: 150,
    imageUrl: "🌽"
  };

  const displayProduct = product || defaultProduct;
  const displayImage = product?.imageUrl.startsWith('http')
    ? product.imageUrl
    : (displayProduct.imageUrl || "🌽");

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
        {displayImage.startsWith('http') ? (
          <img
            src={displayImage}
            alt={displayProduct.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-8xl">{displayImage}</span>
        )}
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {displayProduct.name}
        </h2>
        <p className="text-gray-600 mb-4">
          {displayProduct.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-green-600">
            ${displayProduct.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            USD
          </span>
        </div>
      </div>
    </motion.div>
  );
};