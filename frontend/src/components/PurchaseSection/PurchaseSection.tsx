import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '@/config/app';
import type { PaymentMethod } from '@/config/paymentMethods';
import { Accordion } from '@/components/Accordion/Accordion';
import { PaymentForm } from '@/components/PaymentForm/PaymentForm';
import { PurchaseSuccess } from '@/components/PurchaseSuccess/PurchaseSuccess';

interface PurchaseSectionProps {
  isAccordionOpen: boolean;
  onAccordionToggle: () => void;
  canPurchase: boolean;
  isProcessing: boolean;
  isWaiting: boolean;
  waitingTimeLeft: number;
  formatTime: (seconds: number) => string;
  onPurchase: (data: { paymentMethod: PaymentMethod; cardDetails?: unknown }) => Promise<void>;
}

export const PurchaseSection: React.FC<PurchaseSectionProps> = ({
  isAccordionOpen,
  onAccordionToggle,
  canPurchase,
  isProcessing,
  isWaiting,
  waitingTimeLeft,
  formatTime,
  onPurchase
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <Accordion
          isOpen={isAccordionOpen}
          onToggle={onAccordionToggle}
          disabled={!canPurchase || isProcessing}
          trigger={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛒</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {isWaiting ? 'Compra Realizada' : 'Comprar Choclo'}
                  </h3>
                  {isWaiting && (
                    <p className="text-sm text-orange-600">
                      Próxima compra en: {formatTime(waitingTimeLeft)}
                    </p>
                  )}
                  {isProcessing && (
                    <p className="text-sm text-blue-600">
                      Procesando compra...
                    </p>
                  )}
                </div>
              </div>
              <div className="text-lg font-bold text-green-600">
                ${APP_CONFIG.product.price}
              </div>
            </div>
          }
        >
          <PaymentForm
            onSubmit={onPurchase}
            isLoading={isProcessing}
          />
        </Accordion>
      </div>

      {/* Estado de espera */}
      {isWaiting && (
        <PurchaseSuccess
          waitingTimeLeft={waitingTimeLeft}
          formatTime={formatTime}
        />
      )}
    </motion.div>
  );
};