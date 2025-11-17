import React from 'react';
import { motion } from 'framer-motion';

interface PurchaseSuccessProps {
  waitingTimeLeft: number;
  formatTime: (seconds: number) => string;
}

export const PurchaseSuccess: React.FC<PurchaseSuccessProps> = ({
  waitingTimeLeft,
  formatTime
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-green-100 border border-green-300 rounded-lg p-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-medium text-green-800">
            ¡Compra exitosa!
          </p>
          <p className="text-sm text-green-700">
            Tu choclo está siendo preparado. Podrás hacer otra compra en {formatTime(waitingTimeLeft)}.
          </p>
        </div>
      </div>
    </motion.div>
  );
};