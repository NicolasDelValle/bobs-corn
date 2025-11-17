import React from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/Header';

export const DashboardView: React.FC = () => {
  return (
    <div>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-green-800">
            Este es el Dashboard
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            ¡Bienvenido al panel de administración de Bob's Corn!
          </p>
        </motion.div>
      </div>
    </div>
  );
};