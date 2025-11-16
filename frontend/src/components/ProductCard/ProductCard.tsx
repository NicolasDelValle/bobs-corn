import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '@/config/app';

interface ProductCardProps {
  delay?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ delay = 0.2 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
        <span className="text-8xl">{APP_CONFIG.product.image}</span>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {APP_CONFIG.product.name}
        </h2>
        <p className="text-gray-600 mb-4">
          {APP_CONFIG.product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-green-600">
            ${APP_CONFIG.product.price}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {APP_CONFIG.product.currency}
          </span>
        </div>
      </div>
    </motion.div>
  );
};